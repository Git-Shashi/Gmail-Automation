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
import { emailService } from '@/services/emailService'
import { isValidEmail } from '@/lib/utils'

export default function EmailComposer({ isOpen, onClose, onSuccess, defaultTo = '' }) {
  // const [to, setTo] = useState(defaultTo)
  // const [subject, setSubject] = useState('')
  // const [body, setBody] = useState('')
  // const [sending, setSending] = useState(false)
  // const [errors, setErrors] = useState({})

  // Validate form
  // const validate = () => {
  //   const newErrors = {}
  //   if (!to) newErrors.to = 'Recipient is required'
  //   else if (!isValidEmail(to)) newErrors.to = 'Invalid email address'
  //   if (!subject) newErrors.subject = 'Subject is required'
  //   if (!body) newErrors.body = 'Message is required'
  //   setErrors(newErrors)
  //   return Object.keys(newErrors).length === 0
  // }

  // Handle send
  // const handleSend = async () => {
  //   if (!validate()) return
  //   
  //   setSending(true)
  //   try {
  //     await emailService.sendEmail({ to, subject, body })
  //     toast.success('Email sent successfully!')
  //     onSuccess?.()
  //     onClose()
  //     // Reset form
  //     setTo('')
  //     setSubject('')
  //     setBody('')
  //   } catch (error) {
  //     toast.error(error.message || 'Failed to send email')
  //   } finally {
  //     setSending(false)
  //   }
  // }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Compose Email</DialogTitle>
          <DialogDescription>
            Send a new email using your Gmail account
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* To Field */}
          {/* <div className="space-y-2">
            <Label htmlFor="to">To</Label>
            <Input
              id="to"
              type="email"
              placeholder="recipient@example.com"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
            {errors.to && <p className="text-sm text-destructive">{errors.to}</p>}
          </div> */}

          {/* Subject Field */}
          {/* <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
          </div> */}

          {/* Body Field */}
          {/* <div className="space-y-2">
            <Label htmlFor="body">Message</Label>
            <Textarea
              id="body"
              placeholder="Type your message here..."
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            {errors.body && <p className="text-sm text-destructive">{errors.body}</p>}
          </div> */}
        </div>

        <DialogFooter>
          {/* <Button variant="outline" onClick={onClose} disabled={sending}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={sending}>
            {sending ? 'Sending...' : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </>
            )}
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
 * 
 * Features:
 * 
 * 1. Form Fields:
 *    - To: Email address (required, validated)
 *    - Subject: Text input (required)
 *    - Body: Textarea (required)
 *    - All fields controlled components
 * 
 * 2. Validation:
 *    - To: Must be valid email format
 *    - Subject: Minimum 1 character
 *    - Body: Minimum 1 character
 *    - Show error messages below fields
 *    - Disable Send button if invalid
 * 
 * 3. Send Flow:
 *    - Click Send button
 *    - Validate all fields
 *    - Show loading state on button
 *    - Call emailService.sendEmail(to, subject, body)
 *    - On success:
 *      - Show toast: "Email sent!"
 *      - Close dialog
 *      - Clear form
 *      - Trigger refresh in parent
 *    - On error:
 *      - Show error message
 *      - Keep dialog open
 *      - Allow retry
 * 
 * 4. Dialog Behavior:
 *    - Open via isOpen prop
 *    - Close via onClose callback
 *    - Close on Cancel button
 *    - Close on [X] button
 *    - Don't close on outside click if form has data
 *    - Confirm before closing if form dirty
 * 
 * 5. AI Assistance (Future):
 *    - "Generate with AI" button
 *    - Auto-complete suggestions
 *    - Tone adjustment
 * 
 * States:
 * - to: string
 * - subject: string
 * - body: string
 * - sending: boolean
 * - errors: object { to, subject, body }
 * 
 * Props:
 * - isOpen: boolean
 * - onClose: function()
 * - onSuccess: function() (called after successful send)
 * - defaultTo: string (optional, pre-fill recipient)
 * - replyTo: object (optional, for replies)
 * 
 * Validation Rules:
 * - To: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
 * - Subject: length > 0
 * - Body: length > 0
 * 
 * Usage:
 * const [showComposer, setShowComposer] = useState(false)
 * 
 * <EmailComposer
 *   isOpen={showComposer}
 *   onClose={() => setShowComposer(false)}
 *   onSuccess={() => {
 *     refreshEmails()
 *     toast.success("Email sent!")
 *   }}
 * />
 */

// Will import Shadcn Dialog, Input, Textarea, Button
// Will import emailService
// Will handle form state and validation
// Will call send email API
