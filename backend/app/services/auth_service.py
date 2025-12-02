"""
Google OAuth Authentication Service

This file handles Google OAuth 2.0 authentication flow.

Purpose:
- Generate Google OAuth authorization URLs
- Exchange authorization codes for access tokens
- Fetch user profile information from Google
- Create or update users in MongoDB
- Generate JWT tokens for session management
- Handle token refresh when expired

OAuth Scopes Required:
- https://www.googleapis.com/auth/gmail.readonly
- https://www.googleapis.com/auth/gmail.send
- https://www.googleapis.com/auth/gmail.modify
- https://www.googleapis.com/auth/userinfo.email
- https://www.googleapis.com/auth/userinfo.profile
- openid

Flow:
1. User clicks "Login with Google"
2. Frontend gets auth URL from this service
3. User redirects to Google, authorizes app
4. Google redirects back with authorization code
5. This service exchanges code for tokens
6. Fetches user info from Google
7. Stores user and tokens in MongoDB
8. Returns JWT token to frontend

Methods:
- get_authorization_url() -> str
- handle_oauth_callback(code: str) -> dict
- refresh_access_token(refresh_token: str) -> str
- _store_user(user_info: dict, tokens: dict) -> User

Dependencies:
- google-auth-oauthlib for OAuth flow
- google.oauth2.credentials for token management
- googleapiclient.discovery for user info API
"""

from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from typing import Dict, Any
from datetime import datetime
from app.core.config import settings
from app.core.database import get_database
from app.core.security import create_access_token
from app.models.user import User

# OAuth 2.0 scopes required for Gmail access
SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'openid'
]


def get_oauth_flow() -> Flow:
    """
    Create and configure Google OAuth 2.0 Flow.
    
    Returns:
        Configured Flow instance for OAuth
    """
    client_config = {
        "web": {
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "redirect_uris": [settings.REDIRECT_URI]
        }
    }
    
    flow = Flow.from_client_config(
        client_config=client_config,
        scopes=SCOPES,
        redirect_uri=settings.REDIRECT_URI
    )
    
    return flow


def get_authorization_url() -> str:
    """
    Generate Google OAuth authorization URL.
    
    This is called when user clicks "Login with Google".
    
    Returns:
        URL to redirect user to Google's consent screen
        
    Example:
        https://accounts.google.com/o/oauth2/auth?client_id=...&scope=...
    """
    flow = get_oauth_flow()
    
    authorization_url, state = flow.authorization_url(
        access_type='offline',  # Get refresh token
        include_granted_scopes='true',  # Incremental authorization
        prompt='consent'  # Force consent screen to get refresh token
    )
    
    return authorization_url


async def handle_oauth_callback(code: str) -> Dict[str, Any]:
    """
    Handle OAuth callback after user authorizes on Google.
    
    This function:
    1. Exchanges authorization code for access/refresh tokens
    2. Fetches user profile from Google
    3. Stores/updates user in MongoDB
    4. Generates JWT token for frontend
    
    Args:
        code: Authorization code from Google redirect
    
    Returns:
        Dict containing:
        - jwt_token: JWT for frontend authentication
        - user: User object with profile info
        
    Raises:
        Exception: If OAuth flow fails or user fetch fails
    """
    try:
        # Exchange authorization code for tokens
        flow = get_oauth_flow()
        flow.fetch_token(code=code)
        
        credentials = flow.credentials
        
        # Get user info from Google
        user_info_service = build('oauth2', 'v2', credentials=credentials)
        user_info = user_info_service.userinfo().get().execute()
        
        # Store user and tokens in MongoDB
        user = await _store_or_update_user(user_info, credentials)
        
        # Generate JWT token for frontend
        jwt_token = create_access_token(
            data={
                "sub": str(user.id),
                "email": user.email,
                "name": user.name
            }
        )
        
        return {
            "jwt_token": jwt_token,
            "user": {
                "id": str(user.id),
                "email": user.email,
                "name": user.name,
                "picture": user.picture
            }
        }
        
    except Exception as e:
        print(f"❌ OAuth callback error: {e}")
        raise Exception(f"Failed to complete OAuth authentication: {str(e)}")


async def _store_or_update_user(user_info: Dict[str, Any], credentials: Credentials) -> User:
    """
    Store or update user in MongoDB with OAuth tokens.
    
    Args:
        user_info: User profile from Google
        credentials: OAuth credentials with access/refresh tokens
    
    Returns:
        User object from MongoDB
    """
    db = await get_database()
    users_collection = db.users
    
    # Check if user already exists
    existing_user = await users_collection.find_one({"email": user_info["email"]})
    
    user_data = {
        "email": user_info["email"],
        "name": user_info.get("name", ""),
        "picture": user_info.get("picture", ""),
        "google_id": user_info["id"],
        "access_token": credentials.token,
        "refresh_token": credentials.refresh_token,
        "updated_at": datetime.utcnow()
    }
    
    if existing_user:
        # Update existing user with new tokens
        await users_collection.update_one(
            {"email": user_info["email"]},
            {"$set": user_data}
        )
        user_data["_id"] = existing_user["_id"]
        user_data["created_at"] = existing_user["created_at"]
    else:
        # Create new user
        user_data["created_at"] = datetime.utcnow()
        result = await users_collection.insert_one(user_data)
        user_data["_id"] = result.inserted_id
    
    return User(**user_data)


async def get_user_by_id(user_id: str) -> User:
    """
    Get user from MongoDB by ID.
    
    Used by authentication dependency to verify JWT tokens.
    
    Args:
        user_id: MongoDB ObjectId as string
    
    Returns:
        User object
        
    Raises:
        Exception: If user not found
    """
    from bson import ObjectId
    
    db = await get_database()
    users_collection = db.users
    
    user_data = await users_collection.find_one({"_id": ObjectId(user_id)})
    
    if not user_data:
        raise Exception("User not found")
    
    return User(**user_data)


async def refresh_user_token(user_id: str) -> str:
    """
    Refresh user's Google access token using refresh token.
    
    Called when Gmail API returns 401 (token expired).
    
    Args:
        user_id: User's MongoDB ID
    
    Returns:
        New access token
        
    Raises:
        Exception: If refresh fails
    """
    from bson import ObjectId
    from google.auth.transport.requests import Request
    
    db = await get_database()
    users_collection = db.users
    
    # Get user with refresh token
    user_data = await users_collection.find_one({"_id": ObjectId(user_id)})
    
    if not user_data or not user_data.get("refresh_token"):
        raise Exception("No refresh token available")
    
    # Create credentials and refresh
    credentials = Credentials(
        token=user_data["access_token"],
        refresh_token=user_data["refresh_token"],
        token_uri="https://oauth2.googleapis.com/token",
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET
    )
    
    # Refresh the token
    credentials.refresh(Request())
    
    # Update user with new access token
    await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {
            "access_token": credentials.token,
            "updated_at": datetime.utcnow()
        }}
    )
    
    return credentials.token
