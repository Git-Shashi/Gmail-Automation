"""
User Model for MongoDB

This file defines the User data model that will be stored in MongoDB.

Purpose:
- Store user information from Google OAuth
- Store Google OAuth tokens for API access
- Track user metadata and timestamps

Fields:
- _id: MongoDB ObjectId (auto-generated)
- email: User's Gmail address (unique)
- name: User's full name from Google profile
- picture: Profile picture URL from Google
- google_id: Unique Google user ID
- access_token: OAuth access token for Gmail API
- refresh_token: OAuth refresh token for token renewal
- created_at: Account creation timestamp
- updated_at: Last update timestamp

Usage:
- Used by auth_service to create/update users after OAuth
- Used by dependencies to fetch current user
- Stores credentials needed for Gmail API calls
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, EmailStr
from bson import ObjectId


class PyObjectId(ObjectId):
    """Custom ObjectId type for Pydantic models"""
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, handler=None):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")


class User(BaseModel):
    """
    User model representing a Google OAuth authenticated user.
    
    This stores:
    - Google profile information
    - OAuth tokens for Gmail API access
    - User metadata
    """
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    email: EmailStr  # User's Gmail address
    name: str  # Full name from Google
    picture: Optional[str] = None  # Profile picture URL
    google_id: str  # Unique Google user ID
    access_token: str  # OAuth access token for Gmail API
    refresh_token: Optional[str] = None  # For renewing access tokens
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "name": "John Doe",
                "picture": "https://lh3.googleusercontent.com/...",
                "google_id": "1234567890",
                "access_token": "ya29.a0...",
                "refresh_token": "1//0g..."
            }
        }
