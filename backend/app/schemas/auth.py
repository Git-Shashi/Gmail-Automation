"""
Authentication Request/Response Schemas

This file defines Pydantic schemas for auth endpoints.
"""

from pydantic import BaseModel, EmailStr
from typing import Optional


class UserProfile(BaseModel):
    """
    User profile information.
    
    Returned after successful authentication.
    """
    id: str
    email: EmailStr
    name: str
    picture: Optional[str] = None


class LoginResponse(BaseModel):
    """
    Response after successful OAuth login.
    
    Contains JWT token and user profile.
    """
    access_token: str
    token_type: str = "bearer"
    user: UserProfile


class TokenData(BaseModel):
    """
    JWT token payload data.
    
    Used for token verification and user identification.
    """
    sub: str  # User ID
    email: EmailStr
    name: str


class AuthorizationUrlResponse(BaseModel):
    """
    Response containing Google OAuth authorization URL.
    
    Frontend redirects user to this URL.
    """
    authorization_url: str
