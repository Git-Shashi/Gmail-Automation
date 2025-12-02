"""
Security and Authentication Utilities

This file handles JWT token operations and security functions.

Purpose:
- Create JWT tokens after user authentication
- Verify and decode JWT tokens from requests
- Handle token expiration
- Secure password hashing (if needed)

JWT Token Structure:
{
  "sub": "user_id",  # Subject: User's MongoDB ID
  "email": "user@example.com",
  "exp": 1234567890,  # Expiration timestamp
  "iat": 1234567890   # Issued at timestamp
}

Functions:
1. create_access_token(data: dict, expires_delta: timedelta = None) -> str:
   - Creates JWT with user data
   - Signs with SECRET_KEY
   - Sets expiration time (default 7 days)
   - Returns encoded JWT string
   
   Usage:
   token = create_access_token({"sub": user_id, "email": email})
   
2. verify_token(token: str) -> dict:
   - Decodes JWT token
   - Verifies signature
   - Checks expiration
   - Returns payload dict
   - Raises HTTPException if invalid
   
   Usage:
   try:
       payload = verify_token(token)
       user_id = payload["sub"]
   except HTTPException:
       # Token invalid or expired
   
3. hash_password(password: str) -> str:
   (Optional for future - if local accounts added)
   - Hashes password with bcrypt
   - Returns hashed string
   
4. verify_password(plain: str, hashed: str) -> bool:
   (Optional for future)
   - Compares plain text with hash
   - Returns True if match

Token Lifecycle:
1. User authenticates via Google OAuth
2. Backend creates JWT with user_id
3. Frontend stores JWT in localStorage
4. Frontend sends JWT in Authorization header
5. Backend verifies JWT on each request
6. Token expires after 7 days
7. User must re-authenticate

Security Best Practices:
- Use strong SECRET_KEY (32+ random characters)
- Never log or expose tokens
- Use HTTPS in production
- Implement token refresh mechanism
- Set reasonable expiration times
"""

from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status
from app.core.config import settings

# Password hashing context (for future use if needed)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token for authenticated users.
    
    This is called after successful Google OAuth to create our own JWT token
    that the frontend will use for subsequent API calls.
    
    Args:
        data: Dictionary with user info (must include 'sub' for user_id and 'email')
        expires_delta: Optional custom expiration time
    
    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()
    
    # Set expiration time (default: 7 days = 10080 minutes)
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Add expiration and issued time to payload
    to_encode.update({
        "exp": expire,
        "iat": datetime.now(timezone.utc)
    })
    
    # Encode JWT with secret key (HS256 algorithm)
    encoded_jwt = jwt.encode(
        to_encode, 
        settings.SECRET_KEY, 
        algorithm=settings.ALGORITHM
    )
    
    return encoded_jwt


def verify_token(token: str) -> Dict[str, Any]:
    """
    Verify and decode a JWT token from Authorization header.
    
    This is used by the get_current_user dependency to validate tokens
    on protected routes.
    
    Args:
        token: JWT token string (without "Bearer " prefix)
    
    Returns:
        Decoded payload dictionary containing {'sub': user_id, 'email': email, ...}
        
    Raises:
        HTTPException 401: If token is invalid, expired, or malformed
    """
    try:
        # Decode and verify JWT signature
        payload = jwt.decode(
            token, 
            settings.SECRET_KEY, 
            algorithms=[settings.ALGORITHM]
        )
        
        # Ensure user_id ('sub') exists in payload
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token: missing user ID"
            )
        
        return payload
        
    except JWTError as e:
        # Token expired, invalid signature, or malformed
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"}
        )


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.
    (Not used in current OAuth-only implementation, but available for future)
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash.
    (Not used in current OAuth-only implementation, but available for future)
    """
    return pwd_context.verify(plain_password, hashed_password)
