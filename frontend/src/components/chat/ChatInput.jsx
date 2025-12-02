/**
 * ChatInput Component
 * 
 * Text input field for sending chat messages.
 * 
 * Purpose:
 * - Provide input for user messages
 * - Handle message submission
 * - Show sending state
 * - Provide keyboard shortcuts
 * 
 * Layout:
 * ┌────────────────────────────────────────────┐
 * │ [Type a message...]              [Send →] │
 * └────────────────────────────────────────────┘
 * 
 * With Multi-line:
 * ┌────────────────────────────────────────────┐
 * │ Type a command or question...              │
 * │ ┌────────────────────────────────────────┐ │
 * │ │ Show my emails from john@example.com   │ │
 * │ │                                        │ │
 * │ └────────────────────────────────────────┘ │
 * │ Press Enter to send • Shift+Enter new line│
 * │                              [Send →]     │
 * └────────────────────────────────────────────┘
 * 
 * Features:
 * 
 * 1. Text Input:
 *    - Textarea (auto-resize)
 *    - Placeholder: "Type a command or question..."
 *    - Max height with scroll
 *    - Auto-focus on mount
 * 
 * 2. Send Button:
 *    - Icon: Send arrow / Paper plane
 *    - Disabled when input empty
 *    - Disabled while sending
 *    - Show loading spinner when sending
 * 
 * 3. Keyboard Shortcuts:
 *    - Enter: Send message
 *    - Shift+Enter: New line
 *    - Escape: Clear input
 *    - Cmd/Ctrl+K: Focus input
 * 
 * 4. Auto-resize:
 *    - Start with 1 row
 *    - Expand as user types
 *    - Max 5 rows, then scroll
 *    - Shrink back when cleared
 * 
 * 5. Character Count (Optional):
 *    - Show "0/2000" below input
 *    - Warn when approaching limit
 *    - Prevent input over limit
 * 
 * 6. Suggestions (Optional):
 *    - Show example commands below
 *    - Click to auto-fill
 *    - "Try: 'Show my emails'"
 * 
 * 7. Voice Input (Future):
 *    - Microphone button
 *    - Speech-to-text
 *    - Animated while recording
 * 
 * Send Flow:
 * 1. User types message
 * 2. User presses Enter (or clicks Send)
 * 3. Validate message (not empty)
 * 4. Disable input and button
 * 5. Call onSend(message)
 * 6. Clear input
 * 7. Re-enable input
 * 8. Focus back to input
 * 
 * States:
 * - message: string (input value)
 * - sending: boolean
 * - rows: number (for auto-resize)
 * 
 * Props:
 * - onSend: function(message)
 * - disabled: boolean (from parent)
 * - placeholder: string
 * - maxLength: number
 * 
 * Validation:
 * - Trim whitespace
 * - Don't send empty messages
 * - Don't send while already sending
 * 
 * Accessibility:
 * - Label for screen readers
 * - ARIA attributes
 * - Keyboard navigation
 * 
 * Usage:
 * <ChatInput
 *   onSend={(msg) => sendMessage(msg)}
 *   disabled={isSending}
 *   placeholder="Ask something..."
 * />
 */

// Will import Textarea, Button from Shadcn
// Will import Send icon from lucide-react
// Will handle Enter key press
// Will auto-resize textarea
