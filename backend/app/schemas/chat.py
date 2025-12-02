"""
Chat/AI Request/Response Schemas

This file defines Pydantic schemas for AI chat endpoints.

Purpose:
- Validate chat message requests
- Structure AI response format
- Define command parsing results

Schemas:
1. ChatRequest:
   - message: User's natural language query
   - conversation_id: Optional, for context

2. ChatResponse:
   - response: AI's text response
   - action: Action taken (read/send/delete/search)
   - emails: Email data if applicable
   - confidence: AI confidence score (0-1)
   - metadata: Additional info

3. CommandParseResult:
   - action: Identified action type
   - parameters: Extracted parameters
   - confidence: Parse confidence

4. GenerateReplyRequest:
   - email_id: Email to reply to
   
5. GenerateReplyResponse:
   - suggested_reply: AI-generated reply text
   - to: Recipient email
   - subject: Reply subject

Usage:
- Validates chat input from frontend
- Structures AI responses with metadata
- Shows what action AI performed
- Provides suggested email replies
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from enum import Enum


class ActionType(str, Enum):
    """Types of actions the AI can perform"""
    READ = "read"
    SEND = "send"
    DELETE = "delete"
    SEARCH = "search"
    SUMMARIZE = "summarize"
    CHAT = "chat"


class ChatRequest(BaseModel):
    """User chat message request"""
    message: str = Field(..., min_length=1, max_length=1000)
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    """AI chat response"""
    response: str
    action: Optional[ActionType] = None
    data: Optional[Dict[str, Any]] = None  # Email data, search results, etc.
    confidence: Optional[float] = None
    metadata: Optional[Dict[str, Any]] = None


class GenerateReplyRequest(BaseModel):
    """Request to generate AI reply"""
    email_id: str
    instructions: Optional[str] = None  # e.g., "be brief", "decline politely"


class GenerateReplyResponse(BaseModel):
    """AI-generated email reply"""
    suggested_reply: str
    to: str
    subject: str
    email_id: str  # Original email ID


class GenerateSummaryRequest(BaseModel):
    """Request to summarize emails"""
    email_ids: Optional[List[str]] = None  # Specific emails
    count: Optional[int] = Field(default=10, ge=1, le=50)  # Or recent N emails


class DigestResponse(BaseModel):
    """Daily digest response"""
    digest: str
    email_count: int
    categories: Optional[Dict[str, int]] = None  # Category counts
