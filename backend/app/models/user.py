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

# Implementation will use Pydantic BaseModel
# Will handle ObjectId conversion for MongoDB compatibility
# Will include JSON serialization configuration
