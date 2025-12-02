import { Bot, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn, formatChatTime } from '@/lib/utils'

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
 * - message: Message object with { role, content, timestamp }
 * - userAvatar: string (user's profile pic URL)
 */

export default function ChatMessage({ message, userAvatar }) {
  const isUser = message.role === 'user'
  const isAssistant = message.role === 'assistant'
  
  return (
    <div className={cn(
      "flex gap-3 mb-4",
      isUser && "flex-row-reverse"
    )}>
      {/* Avatar */}
      <Avatar className="h-8 w-8 flex-shrink-0">
        {isUser ? (
          <>
            <AvatarImage src={userAvatar} />
            <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
          </>
        ) : (
          <AvatarFallback className="bg-blue-500">
            <Bot className="h-4 w-4 text-white" />
          </AvatarFallback>
        )}
      </Avatar>
      
      {/* Message Content */}
      <div className={cn(
        "flex flex-col",
        isUser ? "items-end" : "items-start",
        "max-w-[80%]"
      )}>
        <div className={cn(
          "rounded-lg px-4 py-2 break-words",
          isUser ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
        )}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        {message.timestamp && (
          <span className="text-xs text-muted-foreground mt-1">
            {formatChatTime(message.timestamp)}
          </span>
        )}
      </div>
    </div>
  )
}
