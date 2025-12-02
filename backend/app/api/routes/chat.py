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

# Will use APIRouter with prefix /chat
# Will inject AIService and GmailService
# Will store conversations in MongoDB
# Will handle command parsing and execution
