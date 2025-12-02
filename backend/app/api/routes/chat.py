"""
AI Chat/Assistant API Routes

This file defines all AI chat endpoints.

Endpoints:

1. POST /api/v1/chat/message
   Purpose: Send message to AI assistant
   Auth: Required
   Body: {
     message: "Show me my last 5 emails",
     conversation_id: "optional-for-context"
   }
   
   Response: {
     response: "Here are your last 5 emails...",
     action: "read",
     data: {emails: [...]},
     confidence: 0.95,
     conversation_id: "uuid"
   }
   
   Flow:
   1. Parse natural language command using AI
   2. Extract action and parameters
   3. Execute action (get emails, send, delete, etc.)
   4. Format results using AI
   5. Store conversation in database
   6. Return response with data
   
   Supported Commands:
   - "Show me my emails" -> Fetch recent
   - "Delete emails from [sender]" -> Search + Delete
   - "Send email to [recipient]" -> Compose + Send
   - "Find emails about [topic]" -> Search
   - "Summarize my inbox" -> AI digest
   - "Reply to [email]" -> Generate reply
   
2. GET /api/v1/chat/history
   Purpose: Get conversation history
   Auth: Required
   Response: {conversations: [...]}
   Shows past interactions and actions
   
3. POST /api/v1/chat/generate-reply
   Purpose: Generate AI reply for specific email
   Auth: Required
   Body: {email_id: "xxx"}
   Response: {
     suggested_reply: "Thank you for...",
     to: "sender@example.com",
     subject: "Re: Original Subject"
   }
   
   Uses:
   - Analyze email content
   - Generate contextual reply
   - Match tone and formality
   - User can edit before sending
   
4. GET /api/v1/chat/suggestions
   Purpose: Get suggested actions based on inbox
   Auth: Required
   Response: {
     suggestions: [
       "You have 5 unread emails from john@example.com",
       "Email from boss marked urgent",
       "3 promotional emails can be deleted"
     ]
   }

Command Processing:
1. User sends: "Show my last 5 emails"
2. AI Service parses: {action: "read", params: {count: 5}}
3. Route executes: gmail.get_recent_emails(5)
4. AI formats: "Here are your 5 most recent emails..."
5. Return: response + email data + conversation_id

Context Awareness:
- Store conversation history per user
- Pass previous messages to AI for context
- Handle follow-up questions
- Example:
  User: "Show my emails"
  AI: [shows emails]
  User: "Delete the first one"
  AI: [knows which email from context]

Error Handling:
- Low confidence: Ask for clarification
- Invalid command: Suggest alternatives
- Action failed: Explain error to user
- API errors: User-friendly messages
"""

from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.chat import (
    ChatRequest, ChatResponse, GenerateReplyRequest, 
    GenerateReplyResponse, DigestResponse, ActionType
)
from app.schemas.email import EmailResponse
from app.services.ai_service import AIService
from app.services.gmail_service import GmailService
from app.api.dependencies import get_current_user
from app.models.user import User
from app.models.conversation import Conversation, Message
from app.core.database import get_database
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/message", response_model=ChatResponse)
async def chat_message(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db = Depends(get_database)
):
    """
    Send message to AI assistant.
    
    Handles natural language commands to read, send, delete emails.
    """
    try:
        ai_service = AIService()
        gmail_service = GmailService(current_user.access_token)
        
        # Get conversation history for context
        conversations_collection = db.conversations
        conversation = None
        
        if request.conversation_id:
            conversation = await conversations_collection.find_one({
                "_id": ObjectId(request.conversation_id),
                "user_id": str(current_user.id)
            })
        
        history = []
        if conversation:
            history = conversation.get('messages', [])
        
        # Fetch recent emails for context-aware AI
        recent_emails = await gmail_service.get_recent_emails(max_results=10)
        
        # Parse command with email context
        parsed = await ai_service.parse_command(request.message, history, recent_emails)
        action = parsed.get('action', 'chat')
        params = parsed.get('parameters', {})
        
        response_text = ""
        data = None
        
        # Execute action based on parsed command
        if action == ActionType.READ:
            count = params.get('count', 5)
            emails = await gmail_service.get_recent_emails(max_results=count)
            
            # Generate summaries
            for email in emails:
                email['summary'] = await ai_service.generate_email_summary(email)
            
            data = {"emails": [dict(e) for e in emails]}
            response_text = f"Here are your {len(emails)} most recent emails:"
        
        elif action == ActionType.SEARCH:
            query = params.get('query', params.get('from', ''))
            if not query:
                response_text = "Please specify what to search for. Example: 'find emails from john@example.com'"
            else:
                emails = await gmail_service.search_emails(query, max_results=10)
                for email in emails:
                    email['summary'] = await ai_service.generate_email_summary(email)
                
                data = {"emails": [dict(e) for e in emails]}
                response_text = f"Found {len(emails)} emails matching your search."
        
        elif action == ActionType.DELETE:
            email_id = params.get('email_id')
            if not email_id:
                response_text = "Please specify which email to delete. Try: 'delete email ID abc123' or 'delete the first email'"
            else:
                success = await gmail_service.delete_email(email_id)
                if success:
                    response_text = f"Email deleted successfully."
                else:
                    response_text = f"Couldn't delete that email. It may not exist."
        
        elif action == ActionType.SEND:
            to = params.get('to')
            subject = params.get('subject', 'Message from Gmail Assistant')
            body = params.get('body', '')
            
            if not to:
                response_text = "Please specify the recipient email address."
            elif not body:
                response_text = "Please tell me what you'd like to say in the email."
            else:
                result = await gmail_service.send_email(to, subject, body)
                response_text = f"Email sent successfully to {to}!"
                data = {"email_id": result['id']}
        
        elif action == ActionType.SUMMARIZE:
            count = params.get('count', 10)
            emails = await gmail_service.get_recent_emails(max_results=count)
            digest = await ai_service.generate_digest(emails)
            response_text = digest
            data = {"email_count": len(emails)}
        
        else:  # CHAT
            response_text = await ai_service.chat_response(request.message, history, recent_emails)
        
        # Store conversation
        message = Message(
            role="user",
            content=request.message,
            timestamp=datetime.utcnow(),
            action=action if action != ActionType.CHAT else None
        )
        
        ai_message = Message(
            role="assistant",
            content=response_text,
            timestamp=datetime.utcnow()
        )
        
        if conversation:
            await conversations_collection.update_one(
                {"_id": ObjectId(request.conversation_id)},
                {
                    "$push": {"messages": {"$each": [message.dict(), ai_message.dict()]}},
                    "$set": {"updated_at": datetime.utcnow()}
                }
            )
        else:
            new_conversation = Conversation(
                user_id=str(current_user.id),
                messages=[message, ai_message]
            )
            result = await conversations_collection.insert_one(new_conversation.dict())
            request.conversation_id = str(result.inserted_id)
        
        return ChatResponse(
            response=response_text,
            action=action if action != ActionType.CHAT else None,
            data=data,
            confidence=parsed.get('confidence'),
            metadata={"conversation_id": request.conversation_id}
        )
        
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat failed: {str(e)}"
        )


@router.post("/generate-reply", response_model=GenerateReplyResponse)
async def generate_reply(
    request: GenerateReplyRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate AI reply for a specific email"""
    try:
        ai_service = AIService()
        gmail_service = GmailService(current_user.access_token)
        
        # Get original email
        email = await gmail_service.get_email_by_id(request.email_id)
        
        if not email:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Email not found"
            )
        
        # Generate reply
        reply_body = await ai_service.generate_reply(email, request.instructions)
        
        return GenerateReplyResponse(
            suggested_reply=reply_body,
            to=email['sender_email'],
            subject=f"Re: {email['subject']}",
            email_id=request.email_id
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate reply: {str(e)}"
        )


@router.get("/digest", response_model=DigestResponse)
async def get_daily_digest(
    count: int = 20,
    current_user: User = Depends(get_current_user)
):
    """Get AI-generated daily email digest"""
    try:
        ai_service = AIService()
        gmail_service = GmailService(current_user.access_token)
        
        emails = await gmail_service.get_recent_emails(max_results=count)
        
        digest_text = await ai_service.generate_digest(emails)
        categories = await ai_service.categorize_emails(emails)
        
        category_counts = {cat: len(emails_list) for cat, emails_list in categories.items()}
        
        return DigestResponse(
            digest=digest_text,
            email_count=len(emails),
            categories=category_counts
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate digest: {str(e)}"
        )
