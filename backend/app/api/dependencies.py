"""
FastAPI Dependencies

This file defines reusable dependencies for route handlers.

Purpose:
- Extract and verify JWT tokens from requests
- Get current authenticated user from database
- Initialize Gmail service with user's token
- Handle token refresh if expired
- Provide database connection to routes

Dependencies:
1. get_current_user():
   - Extracts JWT from Authorization header
   - Verifies token signature
   - Decodes user_id from token
   - Fetches user from MongoDB
   - Returns user object or raises 401

2. get_gmail_service(user = Depends(get_current_user)):
   - Gets authenticated user
   - Checks if token is expired
   - Refreshes token if needed
   - Initializes GmailService with token
   - Returns ready-to-use service instance

3. get_database():
   - Returns MongoDB database instance
   - Used for direct database queries

Usage in Routes:
@router.get("/emails")
async def get_emails(
    gmail: GmailService = Depends(get_gmail_service)
):
    # gmail is ready to use
    emails = await gmail.get_recent_emails()
    return emails

Flow:
Request -> Extract JWT -> Verify -> Get User -> Check Token -> 
Refresh if needed -> Initialize Service -> Execute Route

Error Handling:
- 401 Unauthorized: Invalid/missing token
- 401 Unauthorized: User not found
- 403 Forbidden: Token expired and refresh failed
- 500 Internal: Database connection error
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import verify_token
from app.services.auth_service import get_user_by_id
from app.models.user import User

# Bearer token security scheme
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> User:
    """
    Authentication dependency for protected routes.
    
    Extracts and validates JWT token from Authorization header.
    Returns authenticated user object.
    
    Usage:
        @app.get("/protected")
        async def protected_route(user: User = Depends(get_current_user)):
            return {"message": f"Hello {user.name}"}
    
    Args:
        credentials: Bearer token from Authorization header
    
    Returns:
        User object from MongoDB
        
    Raises:
        HTTPException 401: If token is invalid or user not found
    """
    token = credentials.credentials
    
    try:
        # Verify JWT token and extract payload
        payload = verify_token(token)
        user_id: str = payload.get("sub")
        
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Fetch user from database
        user = await get_user_by_id(user_id)
        return user
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
