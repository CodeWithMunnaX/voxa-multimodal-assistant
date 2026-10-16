"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { Search, Bell, CheckCheck, Trash2, Loader2, Sparkles, CheckCircle2 } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"

interface NotificationItem {
  id: string
  title: string
  message: string | null
  is_read: boolean
  created_at: string
}

export function TopNav() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchNotifications()
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchNotifications = async () => {
    try {
      setIsLoading(true)
      const res = await api.get<NotificationItem[]>("/notifications")
      if (Array.isArray(res)) {
        setNotifications(res)
      }
    } catch (e) {
      // Silently handle
    } finally {
      setIsLoading(false)
    }
  }

  const markAllRead = async () => {
    try {
      await api.put("/notifications/read-all", {})
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    } catch (e) {
      // Ignore
    }
  }

  const clearAll = async () => {
    try {
      await api.delete("/notifications")
      setNotifications([])
    } catch (e) {
      // Ignore
    }
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <header className="flex h-14 items-center gap-4 border-b dark:border-neutral-800/80 border-neutral-200/80 dark:bg-neutral-950/80 bg-white/80 backdrop-blur-md px-6 shrink-0 z-30 sticky top-0 transition-colors duration-300">
      <div className="flex items-center gap-2 lg:hidden">
        <SidebarTrigger />
      </div>
      
      <div className="w-full flex-1">
        <div className="relative max-w-md hidden md:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 dark:text-neutral-500 text-muted-foreground" />
          <div className="flex h-9 w-full items-center rounded-none border dark:border-neutral-800 border-neutral-200 dark:bg-neutral-900/60 bg-neutral-100/60 px-9 py-2 text-xs dark:text-neutral-400 text-neutral-600 cursor-pointer group dark:hover:border-neutral-700 hover:border-neutral-300 transition-colors">
            Search commands or files...
            <kbd className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 border dark:border-neutral-800 border-neutral-200 dark:bg-neutral-950 bg-white px-1.5 font-mono text-[10px] dark:text-neutral-400 text-neutral-600 sm:flex">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 relative" ref={popoverRef}>
        
        {/* Notification Bell Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 rounded-none hover:bg-muted transition-colors text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center font-mono">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Notification Popover Menu */}
        {isOpen && (
          <div className="absolute right-0 top-12 w-80 sm:w-96 bg-card border border-border shadow-[0_8px_32px_-8px_rgba(124,92,255,0.2)] rounded-none overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/60">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-bold text-foreground">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-secondary text-primary px-2 py-0.5 border border-primary/30 font-mono">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1">
                    <CheckCheck className="w-3 h-3" /> Read all
                  </button>
                )}
                {notifications.length > 0 && (
                  <button onClick={clearAll} className="text-[11px] text-muted-foreground hover:text-red-600 flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-border">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground text-xs">
                  <Loader2 className="w-5 h-5 animate-spin mb-2 text-primary" />
                  <span>Loading alerts...</span>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-xs">
                  <CheckCircle2 className="w-8 h-8 mb-2 text-emerald-500/70" />
                  <span className="text-foreground font-medium mb-0.5">All caught up!</span>
                  <span>No new notifications</span>
                </div>
              ) : (
                notifications.map((item) => (
                  <div 
                    key={item.id} 
                    className={`p-3.5 hover:bg-muted transition-colors text-xs space-y-1 ${!item.is_read ? 'bg-secondary/60 border-l-2 border-primary' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground truncate">{item.title}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {item.message && (
                      <p className="text-muted-foreground text-[11px] leading-relaxed">{item.message}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </header>
  )
}

