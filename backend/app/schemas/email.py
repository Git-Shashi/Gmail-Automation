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

from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime


class EmailResponse(BaseModel):
    """Email data response"""
    id: str
    thread_id: Optional[str] = None
    subject: str
    sender_name: str
    sender_email: str
    from_field: str = Field(alias="from")
    to: Optional[str] = None
    date: Optional[str] = None
    snippet: str
    body: str
    labels: List[str] = []
    summary: Optional[str] = None  # AI-generated summary
    
    class Config:
        populate_by_name = True


class SendEmailRequest(BaseModel):
    """Request to send an email"""
    to: EmailStr
    subject: str = Field(..., min_length=1)
    body: str = Field(..., min_length=1)
    in_reply_to: Optional[str] = None  # For threading


class SendEmailResponse(BaseModel):
    """Response after sending email"""
    id: str
    thread_id: Optional[str] = None
    status: str
    message: str


class DeleteEmailRequest(BaseModel):
    """Request to delete email(s)"""
    email_id: Optional[str] = None
    search_query: Optional[str] = None


class SearchEmailRequest(BaseModel):
    """Request to search emails"""
    query: str = Field(..., min_length=1)
    max_results: int = Field(default=10, ge=1, le=50)


class EmailListResponse(BaseModel):
    """List of emails with metadata"""
    emails: List[EmailResponse]
    total: int
    message: Optional[str] = None
