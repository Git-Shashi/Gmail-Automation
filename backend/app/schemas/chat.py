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

# Will include detailed field descriptions
# Will validate action types with Enum
# Will structure complex responses clearly
