/**
 * EmailComposer Component
 * 
 * Email compose dialog using Shadcn Dialog, Input, Textarea
 */

import { useState } from 'react'
import { Send } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { sendEmail } from '@/services/emailService'
import { isValidEmail, cn } from '@/lib/utils'
import { useDispatch } from 'react-redux'
import { sendEmail as sendEmailAction } from '@/store/slices/emailSlice'
import { useTheme } from '@/contexts/ThemeContext'

export default function EmailComposer({ isOpen, onClose, onSuccess, defaultTo = '' }) {
  const dispatch = useDispatch()
  const { config } = useTheme()
  const [to, setTo] = useState(defaultTo)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [errors, setErrors] = useState({})

  // Validate form
  const validate = () => {
    const newErrors = {}
    if (!to) newErrors.to = 'Recipient is required'
    else if (!isValidEmail(to)) newErrors.to = 'Invalid email address'
    if (!subject) newErrors.subject = 'Subject is required'
    if (!body) newErrors.body = 'Message is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle send
  const handleSend = async () => {
    if (!validate()) return
    
    setSending(true)
    try {
      await dispatch(sendEmailAction({ to, subject, body })).unwrap()
      toast.success('Email sent successfully!')
      onSuccess?.()
      onClose()
      // Reset form
      setTo('')
      setSubject('')
      setBody('')
    } catch (error) {
      toast.error(error.response?.data?.detail || error.message || 'Failed to send email')
    } finally {
      setSending(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("sm:max-w-[600px]", config.modal, config.text)}>
        <DialogHeader>
          <DialogTitle>Compose Email</DialogTitle>
          <DialogDescription>
            Send a new email using your Gmail account
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* To Field */}
          <div className="space-y-2">
            <Label htmlFor="to">To</Label>
            <Input
              id="to"
              type="email"
              placeholder="recipient@example.com"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
            {errors.to && <p className="text-sm text-destructive">{errors.to}</p>}
          </div>

          {/* Subject Field */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
          </div>

          {/* Body Field */}
          <div className="space-y-2">
            <Label htmlFor="body">Message</Label>
            <Textarea
              id="body"
              placeholder="Type your message here..."
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            {errors.body && <p className="text-sm text-destructive">{errors.body}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={sending}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={sending}>
            {sending ? 'Sending...' : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
