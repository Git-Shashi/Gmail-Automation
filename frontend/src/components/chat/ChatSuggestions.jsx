/**
 * ChatSuggestions Component
 * 
 * Shows suggested commands/questions before user starts chatting.
 * 
 * Purpose:
 * - Display example commands
 * - Help users understand capabilities
 * - Quick-start chat with one click
 * - Improve user onboarding
 * 
 * Layout:
 * ┌─────────────────────────────────────────────┐
 * │ 👋 Hi! I can help you with:                │
 * │                                             │
 * │ ┌─────────────────────────────────────────┐ │
 * │ │ 📧 Show me my last 10 emails            │ │
 * │ └─────────────────────────────────────────┘ │
 * │ ┌─────────────────────────────────────────┐ │
 * │ │ 🔍 Find emails from john@example.com    │ │
 * │ └─────────────────────────────────────────┘ │
 * │ ┌─────────────────────────────────────────┐ │
 * │ │ 🗑️  Delete spam emails                  │ │
 * │ └─────────────────────────────────────────┘ │
 * │ ┌─────────────────────────────────────────┐ │
 * │ │ 📊 Summarize today's emails             │ │
 * │ └─────────────────────────────────────────┘ │
 * └─────────────────────────────────────────────┘
 * 
 * When to Show:
 * - Display when conversation is empty
 * - Hide after first message sent
 * - Optionally show in sidebar always
 * 
 * Features:
 * 
 * 1. Suggestion Cards/Chips:
 *    - Each suggestion as clickable card
 *    - Icon representing action type
 *    - Hover effect
 *    - Click to auto-send
 * 
 * 2. Categorized Suggestions:
 *    
 *    View Emails:
 *    - "Show me my last 10 emails"
 *    - "What are my unread emails?"
 *    - "Show emails with attachments"
 *    
 *    Search:
 *    - "Find emails from [sender]"
 *    - "Search for emails about [topic]"
 *    - "Show emails from last week"
 *    
 *    Actions:
 *    - "Delete spam emails"
 *    - "Send email to [recipient]"
 *    - "Mark all as read"
 *    
 *    Insights:
 *    - "Summarize today's emails"
 *    - "Categorize my recent emails"
 *    - "Generate a daily digest"
 * 
 * 3. Dynamic Suggestions:
 *    - Based on time of day:
 *      - Morning: "Good morning! Check your overnight emails"
 *      - Evening: "Review today's email summary"
 *    - Based on inbox state:
 *      - Many unread: "You have 50 unread emails"
 *      - No emails: "Your inbox is empty! 🎉"
 * 
 * 4. Visual Design:
 *    - Cards with icons
 *    - Subtle border
 *    - Hover: light background
 *    - Click: slight scale animation
 * 
 * 5. Click Behavior:
 *    - Click suggestion
 *    - Auto-fill chat input
 *    - Or: immediately send command
 *    - Hide suggestions
 *    - Show typing indicator
 * 
 * Suggestion Data:
 * [
 *   {
 *     id: 1,
 *     text: "Show me my last 10 emails",
 *     icon: "Mail",
 *     category: "view"
 *   },
 *   {
 *     id: 2,
 *     text: "Delete spam emails",
 *     icon: "Trash",
 *     category: "action"
 *   }
 * ]
 * 
 * Props:
 * - suggestions: Array of suggestion objects
 * - onSuggestionClick: function(suggestionText)
 * - show: boolean (control visibility)
 * 
 * States:
 * - None (stateless component)
 * 
 * Usage:
 * {messages.length === 0 && (
 *   <ChatSuggestions
 *     suggestions={CHAT_EXAMPLES}
 *     onSuggestionClick={(text) => {
 *       sendMessage(text)
 *     }}
 *   />
 * )}
 */

// Will import Card, Button from Shadcn
// Will import icons (Mail, Search, Trash) from lucide-react
// Will render grid of suggestion cards
// Will handle click to send suggestion
