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

import { Mail, Search, Trash2, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'

const SUGGESTIONS = [
  { id: 1, text: 'What emails do I have today?', icon: Mail, color: 'text-blue-600' },
  { id: 2, text: 'Who sent me the most emails?', icon: Search, color: 'text-green-600' },
  { id: 3, text: 'Are there any important emails?', icon: Sparkles, color: 'text-purple-600' },
  { id: 4, text: 'Tell me about my recent emails', icon: Sparkles, color: 'text-orange-600' },
]

export default function ChatSuggestions({ onSelectSuggestion }) {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <div className="text-4xl mb-2">👋</div>
        <h3 className="text-xl font-bold">Hi! I'm your AI Email Assistant</h3>
        <p className="text-sm text-muted-foreground">I have access to your recent emails. Ask me anything!</p>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {SUGGESTIONS.map((suggestion) => {
          const Icon = suggestion.icon
          return (
            <Card
              key={suggestion.id}
              className="p-4 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] hover:border-primary bg-gradient-to-r from-card to-card/50"
              onClick={() => onSelectSuggestion(suggestion.text)}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Icon className={`h-5 w-5 ${suggestion.color}`} />
                </div>
                <p className="text-sm font-medium flex-1">{suggestion.text}</p>
                <span className="text-xs text-muted-foreground">→</span>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
