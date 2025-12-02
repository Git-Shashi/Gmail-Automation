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

# Will use Flow.from_client_config() for OAuth
# Will handle token expiration gracefully
# Will store tokens securely in MongoDB
# Will generate JWT for frontend auth
