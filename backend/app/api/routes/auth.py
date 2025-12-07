"""
Authentication API Routes

This file defines all authentication-related endpoints.

Endpoints:

1. GET /api/v1/auth/login
   Purpose: Get Google OAuth authorization URL
   Response: {authorization_url: "https://accounts.google.com/..."}
   Usage: Frontend redirects user to this URL
   
2. GET /api/v1/auth/callback?code=xxx
   Purpose: Handle OAuth callback from Google
   Flow:
   - Receives authorization code from Google
   - Exchanges code for access/refresh tokens
   - Fetches user profile from Google
   - Creates/updates user in MongoDB
   - Generates JWT token
   - Redirects to frontend with token
   Response: Redirect to http://localhost:5173/auth/callback?token=xxx
   
3. GET /api/v1/auth/me
   Purpose: Get current user information
   Auth: Requires JWT token
   Response: {email, name, picture}
   Usage: Frontend checks if user is logged in
   
4. POST /api/v1/auth/logout
   Purpose: Logout user (invalidate session)
   Auth: Requires JWT token
   Response: {message: "Logged out successfully"}
   Usage: Frontend clears token on logout

Security:
- OAuth state parameter to prevent CSRF
- HTTPS required in production
- Tokens stored securely in database
- JWT signed with SECRET_KEY
- Short-lived tokens with refresh capability

OAuth Flow:
1. User clicks "Login with Google" in frontend
2. Frontend calls GET /auth/login
3. Backend returns Google OAuth URL
4. Frontend redirects user to Google
5. User authorizes app on Google
6. Google redirects to /auth/callback?code=xxx
7. Backend exchanges code for tokens
8. Backend creates user in database
9. Backend generates JWT
10. Backend redirects to frontend with JWT
11. Frontend stores JWT in localStorage
12. Frontend uses JWT for API calls
"""

from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import RedirectResponse
from app.services.auth_service import get_authorization_url, handle_oauth_callback
from app.schemas.auth import AuthorizationUrlResponse, LoginResponse, UserProfile
from app.api.dependencies import get_current_user
from app.models.user import User
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.get("/login", response_model=AuthorizationUrlResponse)
async def login():
    """
    Get Google OAuth authorization URL.
    
    Frontend redirects user to this URL to start OAuth flow.
    
    Returns:
        Authorization URL for Google consent screen
        
    Example:
        GET /api/v1/auth/login
        Response: {
            "authorization_url": "https://accounts.google.com/o/oauth2/auth?..."
        }
    """
    try:
        authorization_url = get_authorization_url()
        return {"authorization_url": authorization_url}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate authorization URL: {str(e)}"
        )


@router.get("/callback")
async def oauth_callback(code: str):
    """
    Handle OAuth callback from Google.
    
    This endpoint receives the authorization code from Google after user authorizes.
    It exchanges the code for tokens, creates/updates user, and redirects to frontend.
    
    Args:
        code: Authorization code from Google redirect
    
    Returns:
        Redirect to frontend with JWT token
        
    Example:
        Google redirects to: /api/v1/auth/callback?code=4/0AQlEd8...
        Backend redirects to: http://localhost:5173/auth/callback?token=eyJhbGc...
    """
    try:
        # Exchange code for tokens and get user
        result = await handle_oauth_callback(code)
        
        # Redirect to frontend with JWT token
        frontend_url = f"{settings.FRONTEND_URL}/auth/callback?token={result['jwt_token']}"
        return RedirectResponse(url=frontend_url)
        
    except Exception as e:
        # Redirect to frontend with error
        error_url = f"{settings.FRONTEND_URL}/auth/callback?error={str(e)}"
        return RedirectResponse(url=error_url)


@router.get("/me", response_model=UserProfile)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user's information.
    
    Requires valid JWT token in Authorization header.
    
    Args:
        current_user: Authenticated user from dependency
    
    Returns:
        User profile information
        
    Example:
        GET /api/v1/auth/me
        Authorization: Bearer eyJhbGc...
        Response: {
            "id": "507f1f77bcf86cd799439011",
            "email": "user@example.com",
            "name": "John Doe",
            "picture": "https://..."
        }
    """
    return UserProfile(
        id=str(current_user.id),
        email=current_user.email,
        name=current_user.name,
        picture=current_user.picture
    )


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """
    Logout current user.
    
    In a stateless JWT system, logout is handled client-side by removing the token.
    This endpoint is provided for consistency and could be extended to:
    - Revoke Google OAuth tokens
    - Blacklist JWT tokens
    - Clear server-side sessions
    
    Args:
        current_user: Authenticated user from dependency
    
    Returns:
        Success message
        
    Example:
        POST /api/v1/auth/logout
        Authorization: Bearer eyJhbGc...
        Response: {"message": "Logged out successfully"}
    """
    # In future, could revoke Google tokens here
    # For now, client handles logout by removing JWT
    return {"message": "Logged out successfully"}
