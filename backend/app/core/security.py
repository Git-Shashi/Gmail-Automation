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

# Will use python-jose for JWT
# Will use passlib for password hashing
# Will handle all JWT exceptions properly
# Will integrate with FastAPI security
