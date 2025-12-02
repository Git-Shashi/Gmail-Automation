import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function EmailSearch({ onSearch, placeholder = 'Search emails...' }) {
  const [query, setQuery] = useState('')
  
  const handleSearch = () => {
    if (query.trim()) {
      onSearch?.(query)
    }
  }
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }
  
  const handleClear = () => {
    setQuery('')
    onSearch?.('')
  }
  
  return (
    <div className="relative flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button onClick={handleSearch} disabled={!query.trim()}>
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </div>
  )
}

// Will import Shadcn Input, Popover, Command
// Will import Search, X icons from lucide-react
// Will use debounce from utils
// Will call emailService.searchEmails()
