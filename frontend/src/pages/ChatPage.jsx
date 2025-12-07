import { useState } from 'react'
import { toast } from 'sonner'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ChatMessage from '@/components/chat/ChatMessage'
import ChatInput from '@/components/chat/ChatInput'
import ChatSuggestions from '@/components/chat/ChatSuggestions'
import TypingIndicator from '@/components/chat/TypingIndicator'
import { sendMessage } from '@/services/chatService'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const user = JSON.parse(localStorage.getItem('gmail_user') || '{}')

  const handleSendMessage = async (content) => {
    const userMessage = {
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    }
    setMessages([...messages, userMessage])
    setLoading(true)

    try {
      const response = await sendMessage(content)
      const assistantMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      toast.error('Failed to send message')
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request.',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto p-4 max-w-4xl pb-8">
        <div className="flex flex-col h-full border rounded-lg bg-card">
          <div className="p-4 border-b flex-shrink-0">
            <h1 className="text-2xl font-bold">Chat with AI Assistant</h1>
            <p className="text-sm text-muted-foreground">
              Ask questions about your emails or give commands
            </p>
          </div>
          
          <ScrollArea className="flex-1 p-4 overflow-y-auto">
            {messages.length === 0 ? (
              <ChatSuggestions onSelectSuggestion={handleSuggestionClick} />
            ) : (
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <ChatMessage
                    key={idx}
                    message={msg}
                    userAvatar={user.picture}
                  />
                ))}
                {loading && <TypingIndicator />}
              </div>
            )}
          </ScrollArea>
          
          <div className="p-4 border-t flex-shrink-0">
            <ChatInput
              onSend={handleSendMessage}
              disabled={loading}
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
