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
  // const { name, email: senderEmail } = parseEmailAddress(email.from)
  
  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all hover:shadow-md",
        isSelected && "border-primary bg-primary/5",
        email.isUnread && "bg-background"
      )}
      onClick={onClick}
    >
      {/* Header: Avatar, Sender, Time, Delete */}
      {/* <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3 flex-1">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className={cn(
              "text-sm truncate",
              email.isUnread && "font-semibold"
            )}>
              {name}
            </p>
            <p className="text-xs text-muted-foreground truncate">{senderEmail}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatEmailDate(email.date)}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(email.id)
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div> */}

      {/* Subject with Category Badge */}
      {/* <div className="flex items-center gap-2 mb-1">
        <h3 className={cn(
          "flex-1 text-sm truncate",
          email.isUnread ? "font-bold" : "font-medium"
        )}>
          {email.subject}
        </h3>
        {email.category && (
          <Badge variant="outline" className={getCategoryColor(email.category)}>
            {email.category}
          </Badge>
        )}
        {email.hasAttachment && (
          <Paperclip className="h-3 w-3 text-muted-foreground" />
        )}
      </div> */}

      {/* Email Snippet */}
      {/* <p className="text-sm text-muted-foreground line-clamp-2">
        {email.snippet}
      </p> */}
    </Card>
  )
}
