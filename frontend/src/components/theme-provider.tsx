"use client"

import React, { createContext, useContext, useEffect } from "react"

type Theme = "dark" | "light" | "system"

interface ThemeProviderContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = createContext<ThemeProviderContextType>({
  theme: "light",
  setTheme: () => null,
})

/**
 * Voxa ships a single light theme. The provider keeps the same API so existing
 * callers (e.g. the settings page) keep working, but always applies "light".
 */
export function ThemeProvider({
  children,
  storageKey = "voxa-theme",
}: {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  attribute?: string
  enableSystem?: boolean
}) {
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove("dark")
    root.classList.add("light")
    // Clear a previously saved dark preference
    localStorage.removeItem(storageKey)
  }, [storageKey])

  return (
    <ThemeProviderContext.Provider value={{ theme: "light", setTheme: () => null }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeProviderContext)
