'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

const THEME_KEY = 'collabpm-theme'
const COMPACT_KEY = 'collabpm-compact'
const ACCENT_KEY = 'collabpm-accent'

type ThemeContextValue = {
  darkMode: boolean
  compactMode: boolean
  selectedAccent: string
  setDarkMode: (value: boolean) => void
  setCompactMode: (value: boolean) => void
  setSelectedAccent: (value: string) => void
  loaded: boolean
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem(THEME_KEY) === 'dark'
  })
  const [compactMode, setCompactMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem(COMPACT_KEY) === 'true'
  })
  const [selectedAccent, setSelectedAccent] = useState<string>(() => {
    if (typeof window === 'undefined') return '#2563eb'
    return window.localStorage.getItem(ACCENT_KEY) ?? '#2563eb'
  })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    document.documentElement.classList.toggle('dark', darkMode)
    window.localStorage.setItem(THEME_KEY, darkMode ? 'dark' : 'light')
  }, [darkMode, loaded])

  useEffect(() => {
    if (!loaded) return
    document.documentElement.dataset.compact = compactMode ? 'true' : 'false'
    window.localStorage.setItem(COMPACT_KEY, compactMode ? 'true' : 'false')
  }, [compactMode, loaded])

  useEffect(() => {
    if (!loaded) return
    document.documentElement.style.setProperty('--accent', selectedAccent)
    window.localStorage.setItem(ACCENT_KEY, selectedAccent)
  }, [selectedAccent, loaded])

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        compactMode,
        selectedAccent,
        setDarkMode,
        setCompactMode,
        setSelectedAccent,
        loaded,
      }}
    >
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
