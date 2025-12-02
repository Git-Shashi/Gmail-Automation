"""
Authentication Request/Response Schemas

This file defines Pydantic schemas for auth endpoints.

Purpose:
- Validate OAuth callback responses
- Structure JWT token responses
- Define user info response format

Schemas:
1. TokenResponse:
   - access_token: JWT token string
   - token_type: "bearer"
   - user: UserInfo object

2. UserResponse:
   - email: User's email
   - name: User's full name
   - picture: Profile picture URL

3. AuthURLResponse:
   - authorization_url: Google OAuth URL

Usage:
- Used in auth routes for response validation
- Ensures consistent API response format
- Client knows exactly what to expect
"""

# Will extend Pydantic BaseModel
# Will use Field() for validation and examples
# Will include JSON schema examples for API docs
