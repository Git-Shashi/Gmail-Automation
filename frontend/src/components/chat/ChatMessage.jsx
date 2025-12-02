/**
 * ChatMessage Component
 * 
 * Individual message bubble in chat interface.
 * 
 * Purpose:
 * - Display single message in chat
 * - Differentiate user vs AI messages
 * - Show timestamp
 * - Render rich content (emails, actions)
 * 
 * Layout:
 * 
 * User Message (Right-aligned):
 * ┌──────────────────────────────────────┐
 * │                  ┌────────────────┐  │
 * │                  │ Show my emails │  │
 * │                  │ 10:30 AM       │  │
 * │                  └────────────────┘  │
 * └──────────────────────────────────────┘
 * 
 * AI Message (Left-aligned):
 * ┌──────────────────────────────────────┐
 * │  ┌──────────────────────────────┐    │
 * │  │ 🤖 Here are your 5 emails:   │    │
 * │  │ ┌──────────────────────────┐ │    │
 * │  │ │ [Email Card 1]           │ │    │
 * │  │ │ [Email Card 2]           │ │    │
 * │  │ └──────────────────────────┘ │    │
 * │  │ 10:30 AM                     │    │
 * │  └──────────────────────────────┘    │
 * └──────────────────────────────────────┘
 * 
 * Message Types:
 * 
 * 1. Text Message:
 *    - Simple text content
 *    - Markdown support (optional)
 *    - Links auto-detected
 * 
 * 2. Email Result Message:
 *    - AI response with email data
 *    - Embedded email preview cards
 *    - Click to view full email
 * 
 * 3. Action Confirmation:
 *    - "Deleted 3 emails from newsletter@example.com"
 *    - Success icon
 *    - Green highlight
 * 
 * 4. Error Message:
 *    - "Failed to send email: Invalid recipient"
 *    - Error icon
 *    - Red highlight
 * 
 * 5. System Message:
 *    - "Conversation started"
 *    - Center-aligned
 *    - Gray text
 * 
 * Styling:
 * 
 * User Messages:
 * - Background: Blue (bg-blue-500)
 * - Text: White
 * - Alignment: Right
 * - Rounded corners: left more curved
 * 
 * AI Messages:
 * - Background: Gray (bg-gray-100)
 * - Text: Black
 * - Alignment: Left
 * - Rounded corners: right more curved
 * - Avatar icon (robot/AI)
 * 
 * Message Data Structure:
 * {
 *   id: "msg_123",
 *   role: "user" | "assistant" | "system",
 *   content: "Show my emails",
 *   timestamp: "2024-12-02T10:30:00Z",
 *   data: { ... }, // Optional: email data, action results
 *   action: "search" | "send" | "delete", // Optional
 *   status: "success" | "error" // For actions
 * }
 * 
 * Features:
 * 
 * 1. Timestamps:
 *    - Format: "10:30 AM" or "2h ago"
 *    - Show below message
 *    - Gray, small text
 * 
 * 2. Avatar:
 *    - User: User's Google profile picture
 *    - AI: Robot icon or logo
 *    - Show next to message
 * 
 * 3. Rich Content:
 *    - If message.data contains emails:
 *      - Render mini EmailCard components
 *      - Allow interaction (delete, reply)
 *    - If message includes links:
 *      - Make them clickable
 * 
 * 4. Status Indicators:
 *    - Success: Green checkmark
 *    - Error: Red X icon
 *    - Loading: Spinner (for pending actions)
 * 
 * 5. Copy Button:
 *    - Hover to show "Copy" button
 *    - Copy message text to clipboard
 *    - Show "Copied!" feedback
 * 
 * Props:
 * - message: Message object
 * - userAvatar: string (user's profile pic URL)
 * - isLatest: boolean (for animations)
 * 
 * Usage:
 * <ChatMessage
 *   message={messageData}
 *   userAvatar={user.picture}
 *   isLatest={index === messages.length - 1}
 * />
 */

// Will import Avatar, Badge from Shadcn
// Will import Bot, User, Check, X icons
// Will conditionally render based on message.role
// Will display email cards if message.data present
