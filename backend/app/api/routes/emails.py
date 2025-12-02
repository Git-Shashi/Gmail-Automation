"""
Email Management API Routes

This file defines all email-related endpoints.

Endpoints:

1. GET /api/v1/emails/recent?count=10
   Purpose: Fetch recent emails from inbox
   Auth: Required
   Params:
   - count (optional): Number of emails (default 10, max 50)
   Response: {emails: [...], total: 10}
   
2. GET /api/v1/emails/{email_id}
   Purpose: Get full email details by ID
   Auth: Required
   Response: Full email object with body
   
3. POST /api/v1/emails/send
   Purpose: Send a new email
   Auth: Required
   Body: {to, subject, body}
   Response: {id, status: "sent", message}
   Validation:
   - Valid email address
   - Subject and body not empty
   - Recipient not blocked
   
4. DELETE /api/v1/emails/{email_id}
   Purpose: Delete/trash an email
   Auth: Required
   Response: {success: true, message}
   
5. GET /api/v1/emails/search?query=from:example@email.com&max=10
   Purpose: Search emails using Gmail syntax
   Auth: Required
   Params:
   - query: Gmail search query
   - max (optional): Max results (default 10)
   Response: {emails: [...], query, total}
   
   Search Examples:
   - from:john@example.com
   - subject:"project update"
   - after:2024/12/01
   - has:attachment
   - is:unread
   
6. GET /api/v1/emails/categories
   Purpose: Get AI-categorized emails
   Auth: Required
   Response: {
     important: [...],
     social: [...],
     promotions: [...],
     updates: [...],
     spam: [...]
   }
   Uses: AI service to categorize
   
7. GET /api/v1/emails/digest
   Purpose: Generate daily email digest
   Auth: Required
   Response: {
     summary: "You have 15 new emails...",
     important: [...],
     stats: {total, unread, important}
   }
   Uses: AI service to summarize

Error Handling:
- 400: Invalid email format
- 403: Insufficient Gmail permissions
- 404: Email not found
- 429: Gmail API rate limit exceeded
- 500: Gmail API error

Rate Limiting:
- Implement per-user rate limiting
- Respect Gmail API quotas
- Cache frequently accessed emails
"""

# Will use APIRouter with prefix /emails
# Will inject GmailService via dependencies
# Will inject AIService for categorization
# Will validate all inputs with Pydantic
