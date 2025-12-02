"""
Conversation Model for MongoDB

This file defines the chat conversation history model.

Purpose:
- Store chat conversations between user and AI
- Track actions performed by AI (emails sent, deleted, etc.)
- Enable context-aware responses in follow-up queries

Fields:
- _id: MongoDB ObjectId
- user_id: Reference to User document
- messages: Array of message objects
  - role: 'user' or 'assistant'
  - content: Message text
  - timestamp: When message was sent
  - action: Action performed (if any)
  - metadata: Additional info (email IDs, etc.)
- created_at: Conversation start time
- updated_at: Last message time

Usage:
- Chat route stores each user query and AI response
- Provides context for multi-turn conversations
- Tracks what actions were performed
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from bson import ObjectId


class PyObjectId(ObjectId):
    """Custom ObjectId type for Pydantic models"""
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, handler=None):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")


class Message(BaseModel):
    """
    Single message in a conversation.
    
    Represents either:
    - User query/command
    - AI assistant response
    - System notification
    """
    role: str  # 'user', 'assistant', or 'system'
    content: str  # Message text
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    action: Optional[str] = None  # Action performed: 'read', 'send', 'delete', 'categorize'
    metadata: Optional[Dict[str, Any]] = None  # Email IDs, counts, etc.
    
    class Config:
        json_schema_extra = {
            "example": {
                "role": "user",
                "content": "Show me my last 5 emails",
                "timestamp": "2024-12-02T10:30:00",
                "action": "read",
                "metadata": {"email_count": 5}
            }
        }


class Conversation(BaseModel):
    """
    Conversation history between user and AI chatbot.
    
    Stores:
    - Complete message thread
    - Actions performed during conversation
    - Context for follow-up queries
    
    Example flow:
    User: "Show my emails"
    Assistant: [displays 5 emails with IDs]
    User: "Delete the first one"
    Assistant: [uses context to know which email]
    """
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    user_id: str  # Reference to User._id (stored as string)
    messages: List[Message] = []  # Ordered list of messages
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        json_schema_extra = {
            "example": {
                "user_id": "507f1f77bcf86cd799439011",
                "messages": [
                    {
                        "role": "user",
                        "content": "Show me my last 5 emails",
                        "action": "read"
                    },
                    {
                        "role": "assistant",
                        "content": "Here are your 5 most recent emails:",
                        "metadata": {"email_ids": ["msg1", "msg2"]}
                    }
                ]
            }
        }
