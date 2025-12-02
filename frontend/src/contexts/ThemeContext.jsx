/**
 * ThemeContext - Manages theme state (white, charcoal, night)
 */

import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const THEMES = {
  WHITE: 'white',
  CHARCOAL: 'charcoal',
  NIGHT: 'night'
}

export const THEME_CONFIGS = {
  [THEMES.WHITE]: {
    name: 'White',
    bg: 'bg-white',
    text: 'text-gray-900',
    modal: 'bg-gray-100',
    modalContent: 'bg-white',
    header: 'bg-gray-50',
    footer: 'bg-gray-100',
    border: 'border-gray-300'
  },
  [THEMES.CHARCOAL]: {
    name: 'Charcoal Grey',
    bg: 'bg-gray-700',
    text: 'text-gray-100',
    modal: 'bg-gray-600',
    modalContent: 'bg-gray-700',
    header: 'bg-gray-800',
    footer: 'bg-gray-600',
    border: 'border-gray-500'
  },
  [THEMES.NIGHT]: {
    name: 'Night Mode',
    bg: 'bg-gray-900',
    text: 'text-gray-100',
    modal: 'bg-gray-800',
    modalContent: 'bg-gray-900',
    header: 'bg-black',
    footer: 'bg-gray-800',
    border: 'border-gray-700'
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('gmail-theme')
    return saved || THEMES.WHITE
  })

  useEffect(() => {
    localStorage.setItem('gmail-theme', theme)
  }, [theme])

  const value = {
    theme,
    setTheme,
    config: THEME_CONFIGS[theme]
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
