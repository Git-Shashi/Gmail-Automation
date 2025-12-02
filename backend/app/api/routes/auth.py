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

# Will use APIRouter with prefix /auth
# Will import auth_service for OAuth logic
# Will use dependencies for auth checking
# Will handle redirects properly
