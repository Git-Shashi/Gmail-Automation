/**
 * ProtectedRoute Component
 * 
 * This component wraps protected pages that require authentication.
 * Uses Shadcn UI components for loading state.
 */

import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '@/services/authService';

export default function ProtectedRoute({ children }) {
  // Check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Render protected content if authenticated
  return children;
}
