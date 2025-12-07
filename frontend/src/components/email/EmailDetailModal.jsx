/**
 * EmailDetailModal Component
 * 
 * Full email detail view in a modal dialog (80% width)
 */

import { X, Reply, Forward, Trash2, Download, Paperclip } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { parseEmailAddress, formatEmailDate, getCategoryColor, getInitials, cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'

export default function EmailDetailModal({ email, isOpen, onClose, onDelete }) {
  const { config } = useTheme()
  if (!email) return null

  const { name, email: senderEmail } = parseEmailAddress(email.from)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("max-w-[80vw] max-h-[90vh] p-0 gap-0", config.modal, config.text)}>
        {/* Header */}
        <DialogHeader className={cn("px-6 py-4 border-b", config.header, config.border)}>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <DialogTitle className="text-2xl font-bold mb-2">
                {email.subject || '(No Subject)'}
              </DialogTitle>
              <div className="flex items-center gap-3 flex-wrap">
                {email.category && (
                  <Badge variant="outline" className={getCategoryColor(email.category)}>
                    {email.category}
                  </Badge>
                )}
                {email.isUnread && (
                  <Badge variant="default">Unread</Badge>
                )}
                {email.hasAttachment && (
                  <Badge variant="secondary" className="gap-1">
                    <Paperclip className="h-3 w-3" />
                    Attachment
                  </Badge>
                )}
                {email.ai_summary && (
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none">
                    🤖 AI Summary
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className={cn("flex-1 p-6 max-h-[calc(90vh-200px)]", config.modalContent)}>
          {/* Sender Info */}
          <div className="mb-6">
            <div className="flex items-start gap-3 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="text-lg bg-gradient-to-br from-primary to-primary/60 text-white">
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-lg">{name}</h3>
                  <span className="text-sm text-muted-foreground">
                    {formatEmailDate(email.date, true)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{senderEmail}</p>
                {email.to && (
                  <p className="text-xs text-muted-foreground mt-1">
                    To: {email.to}
                  </p>
                )}
              </div>
            </div>
            <Separator />
          </div>

          {/* AI Summary */}
          {email.ai_summary && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🤖</span>
                <h4 className="font-semibold text-sm">AI Summary</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {email.ai_summary}
              </p>
            </div>
          )}

          {/* Email Body */}
          <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
            {email.body ? (
              <div className="text-sm leading-relaxed">
                {/* Check if body contains HTML tags */}
                {email.body.includes('<') && email.body.includes('>') ? (
                  <div dangerouslySetInnerHTML={{ __html: email.body }} />
                ) : (
                  <div className="whitespace-pre-wrap">{email.body}</div>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                {email.snippet || 'No content available'}
              </div>
            )}
          </div>

          {/* Attachments */}
          {email.attachments && email.attachments.length > 0 && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Attachments ({email.attachments.length})
              </h4>
              <div className="space-y-2">
                {email.attachments.map((attachment, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-background rounded border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Paperclip className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm truncate">{attachment.filename || 'Unnamed file'}</span>
                      <span className="text-xs text-muted-foreground">
                        {attachment.size ? `(${(attachment.size / 1024).toFixed(1)} KB)` : ''}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Footer Actions */}
        <div className={cn("px-6 py-4 border-t flex items-center justify-between", config.footer, config.border)}>
          <div className="flex gap-2">
            <Button variant="default" size="sm" className="gap-2">
              <Reply className="h-4 w-4" />
              Reply
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Forward className="h-4 w-4" />
              Forward
            </Button>
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="gap-2"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(email.id)
              onClose()
            }}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
