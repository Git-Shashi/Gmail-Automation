/**
 * Application Constants
 * 
 * This file contains all constant values used throughout the application.
 * Centralized constants make it easy to update values and maintain consistency.
 */

/**
 * API Configuration
 * Base URL for backend API endpoints
 * Will use environment variable in production
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const API_V1_URL = `${API_BASE_URL}/api/v1`;

/**
 * Local Storage Keys
 * Keys used to store data in browser's localStorage
 * - AUTH_TOKEN: JWT token for authentication
 * - USER_DATA: Cached user profile information
 * - THEME: User's theme preference (light/dark)
 * - LAST_SYNC: Timestamp of last email sync
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'gmail_auth_token',
  USER_DATA: 'gmail_user',
  THEME: 'gmail_theme',
  LAST_SYNC: 'gmail_last_sync'
}

/**
 * Email Categories
 * Categories for email classification by AI
 * Each category has: value, label, icon emoji
 * - Important: High priority emails
 * - Social: Social media, friends
 * - Promotions: Marketing, deals
 * - Updates: Newsletters, notifications
 * - Spam: Junk emails
 * - Others: Uncategorized
 */
// export const EMAIL_CATEGORIES = [ ... ]

/**
 * Gmail Search Operators
 * Search syntax helpers for Gmail API
 * Examples: from:, to:, subject:, has:attachment, is:unread
 * Used in search functionality and AI command parsing
 */
// export const SEARCH_OPERATORS = [ ... ]

/**
 * Chat Message Types
 * Types of messages in chat interface
 * - USER: Messages from user
 * - ASSISTANT: Messages from AI
 * - SYSTEM: System notifications
 * - ERROR: Error messages
 */
// export const MESSAGE_TYPES = { ... }

/**
 * Chat Command Examples
 * Suggested commands shown to user
 * Examples:
 * - "Show me my last 10 emails"
 * - "Send email to john@example.com"
 * - "Delete spam emails"
 * - "Categorize my recent emails"
 */
// export const CHAT_EXAMPLES = [ ... ]

/**
 * Email Actions
 * Possible actions on emails
 * READ, SEND, DELETE, SEARCH, CATEGORIZE, SUMMARIZE, REPLY, FORWARD
 */
// export const EMAIL_ACTIONS = { ... }

/**
 * Navigation Routes
 * All application routes
 * HOME, LOGIN, DASHBOARD, CHAT, SETTINGS, AUTH_CALLBACK
 */
// export const ROUTES = { ... }

/**
 * Pagination Configuration
 * Default page sizes for lists
 * - DEFAULT_PAGE_SIZE: 10
 * - MAX_PAGE_SIZE: 50
 * - EMAIL_LOAD_COUNT: 20
 */
// export const PAGINATION = { ... }

/**
 * Toast Messages
 * Pre-defined success/error messages
 * LOGIN_SUCCESS, EMAIL_SENT, EMAIL_DELETED, etc.
 */
// export const TOAST_MESSAGES = { ... }

/**
 * HTTP Status Codes
 * Common HTTP status codes
 * 200, 201, 400, 401, 404, 500
 */
// export const HTTP_STATUS = { ... }
