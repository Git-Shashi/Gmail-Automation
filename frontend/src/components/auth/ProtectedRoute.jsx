/**
 * ProtectedRoute Component
 * 
 * This component wraps protected pages that require authentication.
 * Uses Shadcn UI components for loading state.
 */

import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProtectedRoute({ children }) {
  // Get authentication state from context
  // const { isAuthenticated, isLoading } = useAuth()

  // Show loading skeleton while checking authentication
  // if (isLoading) {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       <div className="space-y-4 w-full max-w-md px-4">
  //         <Skeleton className="h-12 w-full" />
  //         <Skeleton className="h-64 w-full" />
  //         <Skeleton className="h-32 w-full" />
  //       </div>
  //     </div>
  //   )
  // }

  // Redirect to login if not authenticated
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />
  // }

  // Render protected content if authenticated
  // return children
}
