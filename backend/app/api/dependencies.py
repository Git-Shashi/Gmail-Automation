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

# Will use HTTPBearer for token extraction
# Will verify JWT using jose library
# Will implement token refresh logic
# Will cache service instances per request
