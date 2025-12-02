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

// Will create animated dots with CSS
// Will use Tailwind animate utilities
// Will show/hide based on prop
// Will style similar to AI message bubble
