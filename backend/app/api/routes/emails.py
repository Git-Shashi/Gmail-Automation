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

from fastapi import APIRouter, HTTPException, status, Depends, Query
from app.schemas.email import (
    EmailResponse, EmailListResponse, SendEmailRequest, 
    SendEmailResponse, DeleteEmailRequest, SearchEmailRequest
)
from app.services.gmail_service import GmailService
from app.services.ai_service import AIService
from app.api.dependencies import get_current_user
from app.models.user import User
from typing import List, Optional

router = APIRouter(prefix="/emails", tags=["Emails"])


@router.get("/recent", response_model=EmailListResponse)
async def get_recent_emails(
    count: int = Query(default=5, ge=1, le=50),
    with_summaries: bool = Query(default=False, description="Generate AI summaries (may hit rate limits)"),
    current_user: User = Depends(get_current_user)
):
    """Fetch recent emails from inbox with optional AI summaries"""
    try:
        gmail_service = GmailService(current_user.access_token)
        emails = await gmail_service.get_recent_emails(max_results=count)
        
        # Only generate summaries if explicitly requested
        if with_summaries:
            ai_service = AIService()
            for email in emails:
                try:
                    summary = await ai_service.generate_email_summary(email)
                    email['summary'] = summary
                except Exception as e:
                    # Fallback to snippet on any error (rate limit, etc.)
                    email['summary'] = email.get('snippet', '')[:150]
        else:
            # Use email snippet as summary to avoid AI calls
            for email in emails:
                email['summary'] = email.get('snippet', '')[:150]
        
        return EmailListResponse(
            emails=[EmailResponse(**email) for email in emails],
            total=len(emails),
            message=f"Fetched {len(emails)} recent emails"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch emails: {str(e)}"
        )


@router.post("/send", response_model=SendEmailResponse)
async def send_email(
    request: SendEmailRequest,
    current_user: User = Depends(get_current_user)
):
    """Send an email via Gmail"""
    try:
        gmail_service = GmailService(current_user.access_token)
        
        result = await gmail_service.send_email(
            to=request.to,
            subject=request.subject,
            body=request.body,
            in_reply_to=request.in_reply_to
        )
        
        return SendEmailResponse(
            id=result['id'],
            thread_id=result.get('thread_id'),
            status="sent",
            message=f"Email sent successfully to {request.to}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send email: {str(e)}"
        )


@router.delete("/{email_id}")
async def delete_email(
    email_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete/trash an email"""
    try:
        gmail_service = GmailService(current_user.access_token)
        success = await gmail_service.delete_email(email_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Email {email_id} not found"
            )
        
        return {"success": True, "message": f"Email deleted"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete email: {str(e)}"
        )


@router.get("/search/query", response_model=EmailListResponse)
async def search_emails(
    query: str = Query(..., min_length=1),
    max_results: int = Query(default=10, ge=1, le=50),
    with_summaries: bool = Query(default=False, description="Generate AI summaries (may hit rate limits)"),
    current_user: User = Depends(get_current_user)
):
    """Search emails using Gmail query syntax"""
    try:
        gmail_service = GmailService(current_user.access_token)
        emails = await gmail_service.search_emails(query, max_results)
        
        # Only generate summaries if explicitly requested
        if with_summaries:
            ai_service = AIService()
            for email in emails:
                try:
                    email['summary'] = await ai_service.generate_email_summary(email)
                except Exception as e:
                    email['summary'] = email.get('snippet', '')[:150]
        else:
            for email in emails:
                email['summary'] = email.get('snippet', '')[:150]
        
        return EmailListResponse(
            emails=[EmailResponse(**email) for email in emails],
            total=len(emails),
            message=f"Found {len(emails)} emails"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Search failed: {str(e)}"
        )
