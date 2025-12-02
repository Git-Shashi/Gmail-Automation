/**
 * EmailList Component
 * 
 * Displays list of emails with loading/empty states using Shadcn UI
 */

import { Mail, RefreshCw } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import EmailCard from './EmailCard'

export default function EmailList({ 
  emails = [], 
  loading, 
  error, 
  selectedId,
  onEmailClick, 
  onEmailDelete, 
  onRefresh 
}) {
  // Loading State - Skeleton loaders
  // if (loading) {
  //   return (
  //     <div className="space-y-4">
  //       {[...Array(5)].map((_, i) => (
  //         <div key={i} className="border rounded-lg p-4 space-y-3">
  //           <div className="flex items-center justify-between">
  //             <div className="flex items-center gap-3 flex-1">
  //               <Skeleton className="h-10 w-10 rounded-full" />
  //               <div className="space-y-2 flex-1">
  //                 <Skeleton className="h-4 w-32" />
  //                 <Skeleton className="h-3 w-48" />
  //               </div>
  //             </div>
  //             <Skeleton className="h-4 w-16" />
  //           </div>
  //           <Skeleton className="h-4 w-full" />
  //           <Skeleton className="h-3 w-3/4" />
  //         </div>
  //       ))}
  //     </div>
  //   )
  // }

  // Error State
  // if (error) {
  //   return (
  //     <Alert variant="destructive">
  //       <AlertDescription className="flex items-center justify-between">
  //         <span>{error}</span>
  //         <Button variant="outline" size="sm" onClick={onRefresh}>
  //           <RefreshCw className="h-4 w-4 mr-2" />
  //           Retry
  //         </Button>
  //       </AlertDescription>
  //     </Alert>
  //   )
  // }

  // Empty State
  // if (emails.length === 0) {
  //   return (
  //     <div className="flex flex-col items-center justify-center py-12 text-center">
  //       <Mail className="h-12 w-12 text-muted-foreground mb-4" />
  //       <h3 className="text-lg font-semibold mb-2">No emails found</h3>
  //       <p className="text-sm text-muted-foreground mb-4">
  //         Your inbox is empty or no emails match your filters
  //       </p>
  //       <Button variant="outline" onClick={onRefresh}>
  //         <RefreshCw className="h-4 w-4 mr-2" />
  //         Refresh
  //       </Button>
  //     </div>
  //   )
  // }

  // Email List
  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-3">
        {/* {emails.map((email) => (
          <EmailCard
            key={email.id}
            email={email}
            isSelected={selectedId === email.id}
            onClick={() => onEmailClick(email.id)}
            onDelete={onEmailDelete}
          />
        ))} */}
      </div>
    </ScrollArea>
  )
}
