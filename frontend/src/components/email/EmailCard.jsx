/**
 * EmailCard Component
 * 
 * Single email preview card using Shadcn UI Card, Avatar, Badge
 */

import { Trash2, Paperclip } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn, parseEmailAddress, formatEmailDate, getCategoryColor, getInitials } from '@/lib/utils'

export default function EmailCard({ email, isSelected, onClick, onDelete }) {
  // Parse sender email
  const { name, email: senderEmail } = parseEmailAddress(email.from)
  
  return (
    <Card
      className={cn(
        "p-3 cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99]",
        isSelected && "border-primary bg-gradient-to-r from-primary/10 to-primary/5 shadow-sm",
        email.isUnread && "bg-background border-l-4 border-l-primary"
      )}
      onClick={onClick}
    >
      {/* Header: Avatar, Sender, Time, Delete */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="text-xs">{getInitials(name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className={cn(
              "text-sm truncate",
              email.isUnread && "font-semibold"
            )}>
              {name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="text-xs text-muted-foreground">
            {formatEmailDate(email.date)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(email.id)
            }}
          >
            <Trash2 className="h-3 w-3 text-destructive" />
          </Button>
        </div>
      </div>

      {/* Subject with badges */}
      <div className="flex items-center gap-2 mb-1">
        <h3 className={cn(
          "flex-1 text-sm truncate",
          email.isUnread ? "font-bold" : "font-medium"
        )}>
          {email.subject || '(No Subject)'}
        </h3>
        {email.hasAttachment && (
          <Paperclip className="h-3 w-3 text-muted-foreground flex-shrink-0" />
        )}
      </div>

      {/* Email Snippet */}
      <p className="text-xs text-muted-foreground line-clamp-1 mb-1">
        {email.snippet || 'No preview available'}
      </p>
      
      {/* Badges Row */}
      <div className="flex items-center gap-1 flex-wrap">
        {email.category && (
          <Badge variant="outline" className={cn("text-xs py-0 h-5", getCategoryColor(email.category))}>
            {email.category}
          </Badge>
        )}
        {email.ai_summary && (
          <Badge className="text-xs py-0 h-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none">
            🤖 AI
          </Badge>
        )}
      </div>
    </Card>
  )
}
