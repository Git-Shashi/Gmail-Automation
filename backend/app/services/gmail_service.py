ls
"""
Gmail API Integration Service

This file handles all Gmail API interactions.

Purpose:
- Fetch emails from user's inbox
- Send emails via Gmail API
- Delete emails
- Search emails with Gmail query syntax
- Parse email content (plain text and HTML)
- Handle email attachments (future)

Gmail API Operations:
1. List Messages: Fetch email list with pagination
2. Get Message: Fetch full email details by ID
3. Send Message: Send email using MIME format
4. Delete Message: Move email to trash
5. Search: Use Gmail search operators

Email Parsing:
- Extract headers (From, To, Subject, Date)
- Decode base64 encoded content
- Handle multipart MIME messages
- Extract plain text from HTML emails
- Parse email threads

Methods:
- __init__(access_token: str) - Initialize with user's token
- get_recent_emails(max_results: int = 10) -> List[dict]
- get_email_by_id(email_id: str) -> dict
- send_email(to: str, subject: str, body: str) -> dict
- delete_email(email_id: str) -> bool
- search_emails(query: str, max_results: int = 10) -> List[dict]
- _parse_email(message: dict) -> dict
- _create_mime_message(to, subject, body) -> MIMEText

Gmail Search Syntax Examples:
- "from:example@email.com" - Emails from sender
- "subject:invoice" - Subject contains invoice
- "after:2024/12/01" - Emails after date
- "has:attachment" - Emails with attachments
- "is:unread" - Unread emails only

Error Handling:
- Handle quota exceeded errors
- Handle invalid token (trigger refresh)
- Handle network timeouts
- Return user-friendly error messages
"""

# Will use googleapiclient.discovery.build()
# Will handle MIME message creation
# Will decode base64 email content
# Will parse complex email structures
