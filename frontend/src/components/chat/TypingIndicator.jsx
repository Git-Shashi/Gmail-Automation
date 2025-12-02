/**
 * TypingIndicator Component
 * 
 * Shows "AI is typing..." animation while waiting for response.
 * 
 * Purpose:
 * - Indicate AI is processing
 * - Provide visual feedback
 * - Reduce perceived wait time
 * - Improve user experience
 * 
 * Layout:
 * ┌──────────────────────┐
 * │ 🤖 AI is thinking... │
 * │    ● ● ●             │
 * └──────────────────────┘
 * 
 * Visual Styles:
 * 
 * 1. Animated Dots:
 *    ● ● ● (bounce animation)
 *    Each dot animates with delay
 *    Creates wave effect
 * 
 * 2. Pulsing Text:
 *    "AI is typing..."
 *    Fade in/out animation
 * 
 * 3. Loading Spinner:
 *    Rotating circle
 *    Next to text
 * 
 * Features:
 * 
 * 1. Dot Animation:
 *    - Three dots
 *    - Bounce up and down
 *    - Staggered animation (0s, 0.2s, 0.4s delay)
 *    - Infinite loop
 *    - Smooth easing
 * 
 * 2. Position:
 *    - Left-aligned (like AI messages)
 *    - Gray background bubble
 *    - Avatar: Robot icon
 *    - Appears at bottom of messages
 * 
 * 3. Animation Timing:
 *    - Start immediately when shown
 *    - Smooth entrance (fade in)
 *    - Duration: 0.6s per cycle
 *    - Continuous loop
 * 
 * 4. Variants:
 *    
 *    Simple:
 *    "●●●"
 *    
 *    With Text:
 *    "AI is typing ●●●"
 *    
 *    With Avatar:
 *    [🤖] "●●●"
 *    
 *    With Progress:
 *    "AI is thinking... 🧠"
 * 
 * CSS Animation:
 * @keyframes bounce {
 *   0%, 80%, 100% { transform: translateY(0); }
 *   40% { transform: translateY(-10px); }
 * }
 * 
 * Tailwind Animation:
 * - animate-bounce (built-in)
 * - Custom delays with animation-delay
 * 
 * Accessibility:
 * - aria-live="polite"
 * - Screen reader: "AI is typing"
 * - Role: "status"
 * 
 * When to Show:
 * - After user sends message
 * - Before AI response arrives
 * - During API call
 * - Hide when response ready
 * 
 * Props:
 * - show: boolean (control visibility)
 * - text: string (default: "AI is typing...")
 * - variant: 'dots' | 'spinner' | 'pulse'
 * 
 * Usage:
 * {isSending && <TypingIndicator />}
 * 
 * // Or with condition:
 * <TypingIndicator show={isSending} />
 * 
 * // In chat messages list:
 * <div className="messages">
 *   {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
 *   {isSending && <TypingIndicator />}
 * </div>
 */

import { Bot } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-4">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className="bg-blue-500">
          <Bot className="h-4 w-4 text-white" />
        </AvatarFallback>
      </Avatar>
      
      <div className="bg-gray-100 rounded-lg px-4 py-2">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}
