/**
 * Navbar Component
 * 
 * Top navigation bar with Shadcn UI components.
 * Features: Logo, navigation links, user dropdown menu
 */

import { Link, useLocation } from 'react-router-dom'
import { Mail, LogOut, User, Settings } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function Navbar() {
  // const location = useLocation()
  // const { user, logout } = useAuth()

  // const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and Brand */}
        {/* <Link to="/dashboard" className="flex items-center gap-2">
          <Mail className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Gmail AI</span>
        </Link> */}

        {/* Navigation Links */}
        {/* <div className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive("/dashboard") ? "text-primary" : "text-muted-foreground"
            )}
          >
            Dashboard
          </Link>
          <Link
            to="/chat"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive("/chat") ? "text-primary" : "text-muted-foreground"
            )}
          >
            Chat
          </Link>
        </div> */}

        {/* User Menu with Shadcn DropdownMenu */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar>
                <AvatarImage src={user?.picture} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
    </nav>
  )
}
