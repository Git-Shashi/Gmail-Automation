import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RefreshCw, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Navbar from '@/components/layout/Navbar'
import EmailList from '@/components/email/EmailList'
import EmailComposer from '@/components/email/EmailComposer'
import EmailSearch from '@/components/email/EmailSearch'
import ChatMessage from '@/components/chat/ChatMessage'
import ChatInput from '@/components/chat/ChatInput'
import ChatSuggestions from '@/components/chat/ChatSuggestions'
import TypingIndicator from '@/components/chat/TypingIndicator'
import { fetchEmails, deleteEmail as deleteEmailAction, searchEmails, selectEmail } from '@/store/slices/emailSlice'
import { sendMessage, addUserMessage } from '@/store/slices/chatSlice'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'

export default function DashboardPage() {
  const dispatch = useDispatch()
  const [showComposer, setShowComposer] = useState(false)
  
  // Redux state
  const { emails, loading, error, selectedEmail } = useSelector((state) => state.email)
  const { messages, loading: chatLoading, conversationId } = useSelector((state) => state.chat)
  const { user } = useSelector((state) => state.auth)

  // Load emails on mount
  useEffect(() => {
    dispatch(fetchEmails(10))
  }, [dispatch])

  const loadEmails = () => {
    dispatch(fetchEmails(10))
  }

  const handleSearch = (query) => {
    if (!query) {
      loadEmails()
      return
    }
    dispatch(searchEmails(query))
  }

  const handleDeleteEmail = async (emailId) => {
    try {
      await dispatch(deleteEmailAction(emailId)).unwrap()
      toast.success('Email deleted')
    } catch (err) {
      toast.error('Failed to delete email')
    }
  }

  const handleSendChatMessage = async (content) => {
    dispatch(addUserMessage(content))
    
    try {
      const response = await dispatch(sendMessage({ 
        message: content, 
        conversationId 
      })).unwrap()
      
      // Refresh emails if the chat performed an action
      if (response.action_performed) {
        loadEmails()
      }
    } catch (err) {
      toast.error('Failed to send message')
    }
  }

  const handleSuggestionClick = (suggestion) => {
    handleSendChatMessage(suggestion)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Navbar />
      
      <div className="container mx-auto p-6 max-w-[1800px]">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 h-[calc(100vh-7rem)]">
          {/* Left Column: Email List */}
          <div className="xl:col-span-3 flex flex-col space-y-3">
            <div className="flex items-center justify-between bg-card/50 backdrop-blur-sm p-4 rounded-xl border shadow-sm">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Inbox</h2>
                <p className="text-xs text-muted-foreground mt-1">{emails?.length || 0} emails</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={loadEmails} variant="outline" size="sm" className="hover:bg-primary/10">
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button onClick={() => setShowComposer(true)} size="sm" className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90">
                  <Plus className="h-4 w-4 mr-2" />
                  Compose
                </Button>
              </div>
            </div>
            
            <EmailSearch onSearch={handleSearch} />
            
            <div className="flex-1 bg-card/30 backdrop-blur-sm rounded-xl border shadow-sm p-4">
              <EmailList
                emails={emails || []}
                loading={loading}
                error={error}
                selectedId={selectedEmail?.id}
                onEmailClick={(id) => {
                  const email = (emails || []).find(e => e?.id === id);
                  if (email) {
                    dispatch(selectEmail(email));
                  }
                }}
                onEmailDelete={handleDeleteEmail}
                onRefresh={loadEmails}
              />
            </div>
          </div>

          {/* Right Column: Chat */}
          <div className="xl:col-span-2 flex flex-col space-y-3 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm rounded-xl border shadow-lg p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-lg">🤖</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">AI Assistant</h2>
                <p className="text-xs text-muted-foreground">Ask me anything about your emails</p>
              </div>
            </div>
            <Separator className="my-2" />
            
            <ScrollArea className="flex-1 pr-3">
              {messages.length === 0 ? (
                <ChatSuggestions onSelectSuggestion={handleSuggestionClick} />
              ) : (
                <div className="space-y-3">
                  {messages.map((msg, idx) => (
                    <ChatMessage
                      key={idx}
                      message={msg}
                      userAvatar={user?.picture}
                    />
                  ))}
                  {chatLoading && <TypingIndicator />}
                </div>
              )}
            </ScrollArea>
            
            <div className="pt-3 border-t">
              <ChatInput
                onSend={handleSendChatMessage}
                disabled={chatLoading}
              />
            </div>
          </div>
        </div>
      </div>

      <EmailComposer
        isOpen={showComposer}
        onClose={() => setShowComposer(false)}
        onSuccess={loadEmails}
      />
    </div>
  )
}
