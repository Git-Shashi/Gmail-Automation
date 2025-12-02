/**
 * ThemeSwitcher Component
 * Dropdown to switch between White, Charcoal Grey, and Night Mode
 */

import { Palette } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useTheme, THEMES } from '@/contexts/ThemeContext'

export default function ThemeSwitcher() {
  const { theme, setTheme, config } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">{config.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => setTheme(THEMES.WHITE)}
          className={theme === THEMES.WHITE ? 'bg-primary/10' : ''}
        >
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-white border-2 border-gray-300"></div>
            <span>White</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme(THEMES.CHARCOAL)}
          className={theme === THEMES.CHARCOAL ? 'bg-primary/10' : ''}
        >
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-gray-700 border-2 border-gray-500"></div>
            <span>Charcoal Grey</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme(THEMES.NIGHT)}
          className={theme === THEMES.NIGHT ? 'bg-primary/10' : ''}
        >
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-gray-900 border-2 border-gray-700"></div>
            <span>Night Mode</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
