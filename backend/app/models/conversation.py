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

# Implementation will use nested Pydantic models
# Message model will be defined as sub-model
# Will support conversation context for AI
