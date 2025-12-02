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

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from email.mime.text import MIMEText
import base64
from typing import List, Dict, Any, Optional
from datetime import datetime
import html


class GmailService:
    """Gmail API service for email operations"""
    
    def __init__(self, access_token: str):
        """
        Initialize Gmail service with user's access token.
        
        Args:
            access_token: OAuth2 access token for Gmail API
        """
        credentials = Credentials(token=access_token)
        self.service = build('gmail', 'v1', credentials=credentials)
    
    async def get_recent_emails(self, max_results: int = 5) -> List[Dict[str, Any]]:
        """
        Fetch recent emails from user's inbox.
        
        Args:
            max_results: Number of emails to fetch (default 5)
        
        Returns:
            List of parsed email dictionaries
        """
        try:
            # List messages
            results = self.service.users().messages().list(
                userId='me',
                maxResults=max_results,
                labelIds=['INBOX']
            ).execute()
            
            messages = results.get('messages', [])
            
            if not messages:
                return []
            
            # Fetch full details for each message
            emails = []
            for msg in messages:
                email_data = await self.get_email_by_id(msg['id'])
                if email_data:
                    emails.append(email_data)
            
            return emails
            
        except Exception as e:
            print(f"Error fetching emails: {e}")
            raise Exception(f"Failed to fetch emails: {str(e)}")
    
    async def get_email_by_id(self, email_id: str) -> Optional[Dict[str, Any]]:
        """
        Get full email details by ID.
        
        Args:
            email_id: Gmail message ID
        
        Returns:
            Parsed email dictionary or None
        """
        try:
            message = self.service.users().messages().get(
                userId='me',
                id=email_id,
                format='full'
            ).execute()
            
            return self._parse_email(message)
            
        except Exception as e:
            print(f"Error getting email {email_id}: {e}")
            return None
    
    async def send_email(self, to: str, subject: str, body: str, 
                        in_reply_to: Optional[str] = None,
                        references: Optional[str] = None) -> Dict[str, Any]:
        """
        Send email via Gmail API.
        
        Args:
            to: Recipient email address
            subject: Email subject
            body: Email body (plain text)
            in_reply_to: Message-ID for threading (optional)
            references: References header for threading (optional)
        
        Returns:
            Sent message details
        """
        try:
            message = MIMEText(body)
            message['to'] = to
            message['subject'] = subject
            
            if in_reply_to:
                message['In-Reply-To'] = in_reply_to
            if references:
                message['References'] = references
            
            # Encode message
            raw_message = base64.urlsafe_b64encode(
                message.as_bytes()
            ).decode('utf-8')
            
            # Send message
            sent_message = self.service.users().messages().send(
                userId='me',
                body={'raw': raw_message}
            ).execute()
            
            return {
                "id": sent_message['id'],
                "thread_id": sent_message.get('threadId'),
                "status": "sent"
            }
            
        except Exception as e:
            print(f"Error sending email: {e}")
            raise Exception(f"Failed to send email: {str(e)}")
    
    async def delete_email(self, email_id: str) -> bool:
        """
        Delete (trash) email by ID.
        
        Args:
            email_id: Gmail message ID
        
        Returns:
            True if successful, False otherwise
        """
        try:
            self.service.users().messages().trash(
                userId='me',
                id=email_id
            ).execute()
            
            return True
            
        except Exception as e:
            print(f"Error deleting email {email_id}: {e}")
            return False
    
    async def search_emails(self, query: str, max_results: int = 10) -> List[Dict[str, Any]]:
        """
        Search emails using Gmail query syntax.
        
        Args:
            query: Gmail search query (e.g., "from:example@gmail.com subject:invoice")
            max_results: Maximum number of results
        
        Returns:
            List of matching emails
        """
        try:
            results = self.service.users().messages().list(
                userId='me',
                q=query,
                maxResults=max_results
            ).execute()
            
            messages = results.get('messages', [])
            
            emails = []
            for msg in messages:
                email_data = await self.get_email_by_id(msg['id'])
                if email_data:
                    emails.append(email_data)
            
            return emails
            
        except Exception as e:
            print(f"Error searching emails: {e}")
            raise Exception(f"Failed to search emails: {str(e)}")
    
    def _parse_email(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """
        Parse Gmail API message format to simplified structure.
        
        Args:
            message: Raw Gmail API message
        
        Returns:
            Parsed email dictionary
        """
        headers = message['payload']['headers']
        
        # Extract headers
        subject = self._get_header(headers, 'Subject')
        from_email = self._get_header(headers, 'From')
        to_email = self._get_header(headers, 'To')
        date = self._get_header(headers, 'Date')
        message_id = self._get_header(headers, 'Message-ID')
        
        # Parse sender name and email
        sender_name, sender_email = self._parse_email_address(from_email)
        
        # Extract body
        body = self._get_email_body(message['payload'])
        
        # Get snippet (preview)
        snippet = message.get('snippet', '')
        
        return {
            "id": message['id'],
            "thread_id": message.get('threadId'),
            "message_id": message_id,
            "subject": subject or "(No Subject)",
            "from": from_email,
            "sender_name": sender_name,
            "sender_email": sender_email,
            "to": to_email,
            "date": date,
            "snippet": snippet,
            "body": body,
            "labels": message.get('labelIds', [])
        }
    
    def _get_header(self, headers: List[Dict], name: str) -> Optional[str]:
        """Extract header value by name"""
        for header in headers:
            if header['name'].lower() == name.lower():
                return header['value']
        return None
    
    def _parse_email_address(self, email_string: str) -> tuple:
        """
        Parse 'Name <email@example.com>' format.
        
        Returns:
            (name, email) tuple
        """
        if not email_string:
            return ("Unknown", "unknown@example.com")
        
        if '<' in email_string and '>' in email_string:
            name = email_string.split('<')[0].strip().strip('"')
            email = email_string.split('<')[1].split('>')[0].strip()
            return (name or email, email)
        else:
            return (email_string, email_string)
    
    def _get_email_body(self, payload: Dict) -> str:
        """
        Extract email body from payload (handles multipart MIME).
        
        Args:
            payload: Gmail message payload
        
        Returns:
            Email body as plain text
        """
        body = ""
        
        if 'body' in payload and 'data' in payload['body']:
            body = base64.urlsafe_b64decode(
                payload['body']['data']
            ).decode('utf-8', errors='ignore')
            return body
        
        if 'parts' in payload:
            for part in payload['parts']:
                if part['mimeType'] == 'text/plain':
                    if 'data' in part['body']:
                        body = base64.urlsafe_b64decode(
                            part['body']['data']
                        ).decode('utf-8', errors='ignore')
                        return body
                elif part['mimeType'] == 'text/html':
                    if 'data' in part['body']:
                        html_body = base64.urlsafe_b64decode(
                            part['body']['data']
                        ).decode('utf-8', errors='ignore')
                        # Strip HTML tags for plain text
                        body = html.unescape(
                            html_body.replace('<br>', '\n')
                                    .replace('</p>', '\n')
                                    .replace('</', '\n</')
                        )
                        # Remove remaining tags
                        import re
                        body = re.sub('<[^<]+?>', '', body)
                        return body.strip()
                elif 'parts' in part:
                    # Recursive for nested parts
                    body = self._get_email_body(part)
                    if body:
                        return body
        
        return body or "(No content)"
