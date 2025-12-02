"""
Email Request/Response Schemas

This file defines Pydantic schemas for email endpoints.

Purpose:
- Validate email send requests
- Structure email list responses
- Define search and filter parameters

Schemas:
1. EmailResponse:
   - id: Gmail message ID
   - threadId: Gmail thread ID
   - subject: Email subject line
   - from: Sender email address
   - to: Recipient (optional)
   - date: Sent/received date
   - snippet: Preview text
   - body: Full email body
   - labels: Gmail labels

2. SendEmailRequest:
   - to: Recipient email (validated)
   - subject: Email subject
   - body: Email body text

3. EmailListResponse:
   - emails: Array of EmailResponse
   - total: Total count
   - has_more: Pagination flag

4. SearchEmailRequest:
   - query: Gmail search query
   - max_results: Limit (default 10)

Usage:
- Validates user input for sending emails
- Structures Gmail API responses consistently
- Enables email search with filters
"""

# Will use EmailStr for email validation
# Will include examples in Field() for docs
# Will handle optional fields properly
