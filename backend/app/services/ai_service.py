"""
Google Gemini AI Service

This file handles all AI operations using Google Gemini API.

Purpose:
- Parse natural language commands from users
- Generate email responses and drafts
- Categorize emails automatically
- Generate daily email digests
- Provide smart email management suggestions

AI Capabilities:
1. Natural Language Understanding:
   - Parse user intent from text
   - Extract parameters (email addresses, counts, etc.)
   - Determine action type (read, send, delete, search)
   - Return structured command data

2. Email Response Generation:
   - Analyze email content and context
   - Generate professional replies
   - Match tone and formality
   - Include relevant details

3. Email Categorization:
   - Classify: Important, Social, Promotions, Updates, Spam
   - Learn from email content and sender
   - Prioritize urgent emails
   - Group similar emails

4. Email Summarization:
   - Generate daily digest summaries
   - Highlight action items
   - Summarize long email threads
   - Extract key information

Example Commands to Parse:
- "Show me my last 5 emails" -> action: read, params: {count: 5}
- "Delete emails from john@example.com" -> action: search+delete
- "Send email to jane about meeting" -> action: send
- "Find emails about project deadline" -> action: search
- "Summarize today's emails" -> action: summarize

Methods:
- generate_email_response(email_content: dict) -> str
- parse_natural_language_command(text: str) -> dict
  Returns: {action, parameters, confidence}
- categorize_emails(emails: List[dict]) -> dict
  Returns: {important: [], social: [], ...}
- generate_daily_digest(emails: List[dict]) -> str
- suggest_reply(email: dict) -> str
- extract_action_items(email: dict) -> List[str]

Prompt Engineering:
- Use clear, specific prompts
- Provide examples for few-shot learning
- Request structured JSON responses
- Include context about email domain
- Handle ambiguous queries gracefully

Error Handling:
- Handle API rate limits
- Fallback responses for low confidence
- Validate AI-generated content
- Sanitize output before sending
"""

import google.generativeai as genai
from typing import List, Dict, Any, Optional
import json
import re
from app.core.config import settings

# Configure Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)


class AIService:
    """Google Gemini AI service for email intelligence"""
    
    def __init__(self):
        """Initialize Gemini model"""
        self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
    
    async def parse_command(self, user_input: str, conversation_context: List[Dict] = None) -> Dict[str, Any]:
        """
        Parse natural language command to extract intent and parameters.
        
        Args:
            user_input: User's natural language command
            conversation_context: Previous conversation messages for context
        
        Returns:
            {
                "action": "read" | "send" | "delete" | "search" | "summarize" | "chat",
                "parameters": {...},
                "confidence": 0.0-1.0,
                "response_text": "clarifying question or acknowledgment"
            }
        """
        prompt = f"""You are an email assistant AI. Parse the user's command and extract the intent and parameters.

User command: "{user_input}"

Available actions:
- "read": Fetch and show emails (params: count, filter)
- "send": Send an email (params: to, subject, body)
- "delete": Delete emails (params: email_id or search_criteria)
- "search": Search for specific emails (params: query)
- "summarize": Generate summary or digest
- "chat": General conversation (no email action)

Return a JSON object with:
{{
  "action": "read|send|delete|search|summarize|chat",
  "parameters": {{}},
  "confidence": 0.0-1.0,
  "response_text": "brief acknowledgment or clarifying question"
}}

Examples:
- "Show me my last 5 emails" → {{"action": "read", "parameters": {{"count": 5}}, "confidence": 0.95}}
- "Delete the email from john" → {{"action": "delete", "parameters": {{"from": "john"}}, "confidence": 0.8}}
- "Send email to jane@example.com about meeting" → {{"action": "send", "parameters": {{"to": "jane@example.com", "subject": "meeting"}}, "confidence": 0.7}}

Return ONLY valid JSON, no additional text."""

        try:
            response = self.model.generate_content(prompt)
            result_text = response.text.strip()
            
            # Extract JSON from response
            json_match = re.search(r'\{.*\}', result_text, re.DOTALL)
            if json_match:
                parsed = json.loads(json_match.group())
                return parsed
            
            # Fallback
            return {
                "action": "chat",
                "parameters": {},
                "confidence": 0.3,
                "response_text": "I'm not sure what you want me to do. Could you rephrase?"
            }
            
        except Exception as e:
            print(f"Error parsing command: {e}")
            return {
                "action": "chat",
                "parameters": {},
                "confidence": 0.0,
                "response_text": "Sorry, I couldn't understand that. Try: 'show me my last 5 emails' or 'send email to someone@example.com'"
            }
    
    async def generate_email_summary(self, email: Dict[str, Any]) -> str:
        """
        Generate AI summary of an email.
        
        Args:
            email: Email dictionary with subject, body, sender
        
        Returns:
            Brief summary (2-3 sentences)
        """
        prompt = f"""Summarize this email in 2-3 sentences. Be concise and capture the main points.

From: {email.get('from', 'Unknown')}
Subject: {email.get('subject', 'No subject')}
Body: {email.get('body', '')[:1000]}

Summary:"""

        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            print(f"Error generating summary: {e}")
            return f"Email from {email.get('sender_name', 'Unknown')} about {email.get('subject', 'various topics')}"
    
    async def generate_reply(self, email: Dict[str, Any], user_instructions: Optional[str] = None) -> str:
        """
        Generate AI reply to an email.
        
        Args:
            email: Original email dictionary
            user_instructions: Optional user guidance (e.g., "be brief", "decline politely")
        
        Returns:
            Suggested reply text
        """
        instructions = user_instructions or "Generate a professional and helpful reply."
        
        prompt = f"""Generate a professional email reply.

Original email:
From: {email.get('from', 'Unknown')}
Subject: {email.get('subject', 'No subject')}
Body: {email.get('body', '')[:1000]}

Instructions: {instructions}

Write a clear, professional reply. Be concise but helpful. Don't include subject line or formatting, just the body text.

Reply:"""

        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            print(f"Error generating reply: {e}")
            return "Thank you for your email. I'll get back to you soon."
    
    async def categorize_emails(self, emails: List[Dict[str, Any]]) -> Dict[str, List[Dict]]:
        """
        Categorize emails into groups.
        
        Args:
            emails: List of email dictionaries
        
        Returns:
            {
                "urgent": [...],
                "work": [...],
                "personal": [...],
                "promotions": [...],
                "other": [...]
            }
        """
        if not emails:
            return {"urgent": [], "work": [], "personal": [], "promotions": [], "other": []}
        
        # Simple rule-based categorization + AI for edge cases
        categories = {
            "urgent": [],
            "work": [],
            "personal": [],
            "promotions": [],
            "other": []
        }
        
        for email in emails:
            subject = email.get('subject', '').lower()
            body = email.get('body', '').lower()
            sender = email.get('sender_email', '').lower()
            
            # Rule-based categorization
            if any(word in subject for word in ['urgent', 'asap', 'important', 'critical']):
                categories["urgent"].append(email)
            elif any(word in subject for word in ['unsubscribe', 'promo', 'sale', 'offer', 'deal']):
                categories["promotions"].append(email)
            elif any(domain in sender for domain in ['noreply', 'notification', 'no-reply']):
                categories["promotions"].append(email)
            elif any(word in subject for word in ['project', 'meeting', 'deadline', 'report', 'task']):
                categories["work"].append(email)
            else:
                categories["personal"].append(email)
        
        return categories
    
    async def generate_digest(self, emails: List[Dict[str, Any]]) -> str:
        """
        Generate daily digest summary of emails.
        
        Args:
            emails: List of email dictionaries
        
        Returns:
            Formatted digest text
        """
        if not emails:
            return "No emails to summarize."
        
        # Prepare email summaries
        email_summaries = []
        for i, email in enumerate(emails[:10], 1):  # Limit to 10 for token limits
            email_summaries.append(
                f"{i}. From: {email.get('sender_name', 'Unknown')} | Subject: {email.get('subject', 'No subject')}"
            )
        
        prompt = f"""Create a brief daily email digest. Summarize the key emails and suggest any important actions.

Emails received ({len(emails)} total):
{chr(10).join(email_summaries)}

Provide:
1. A brief overview (2-3 sentences)
2. Top 3 emails that need attention
3. Suggested actions

Keep it concise and actionable.

Digest:"""

        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            print(f"Error generating digest: {e}")
            return f"You have {len(emails)} emails. The most recent are from: " + \
                   ", ".join([e.get('sender_name', 'Unknown') for e in emails[:3]])
    
    async def chat_response(self, user_message: str, conversation_history: List[Dict] = None) -> str:
        """
        Generate conversational response (non-command chat).
        
        Args:
            user_message: User's message
            conversation_history: Previous messages for context
        
        Returns:
            AI response
        """
        context = ""
        if conversation_history:
            for msg in conversation_history[-5:]:  # Last 5 messages for context
                role = msg.get('role', 'user')
                content = msg.get('content', '')
                context += f"{role}: {content}\n"
        
        prompt = f"""You are a helpful email assistant. Have a natural conversation with the user.

{context}
user: {user_message}

Respond naturally and helpfully. If they seem to want email help, gently guide them with examples like:
- "Show me my last 5 emails"
- "Delete emails from someone@example.com"
- "Send an email to..."

assistant:"""

        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            print(f"Error in chat response: {e}")
            return "I'm here to help with your emails! Try asking me to show your recent emails or send a message."
