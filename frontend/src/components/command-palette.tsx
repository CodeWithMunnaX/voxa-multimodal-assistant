"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import { Search, Settings, MessageSquare, LayoutDashboard, FileText, User } from "lucide-react"

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-[50%] top-[20%] z-50 grid w-full max-w-lg translate-x-[-50%] gap-4 border bg-background shadow-lg duration-200 sm:rounded-xl overflow-hidden glass-card">
        <Command className="w-full flex flex-col overflow-hidden" label="Command Menu">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input 
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0 focus:ring-0" 
              placeholder="Type a command or search..." 
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">No results found.</Command.Empty>
            
            <Command.Group heading="Suggestions" className="px-2 text-xs font-medium text-muted-foreground py-2">
              <Command.Item onSelect={() => runCommand(() => router.push("/chat"))} className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground hover:bg-accent hover:text-accent-foreground text-foreground">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => router.push("/chat/ai-chat"))} className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground hover:bg-accent hover:text-accent-foreground text-foreground">
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>New AI Chat</span>
              </Command.Item>
            </Command.Group>
            
            <Command.Separator className="h-px bg-border my-1" />
            
            <Command.Group heading="Settings" className="px-2 text-xs font-medium text-muted-foreground py-2">
              <Command.Item onSelect={() => runCommand(() => router.push("/chat/settings"))} className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground hover:bg-accent hover:text-accent-foreground text-foreground">
                <User className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => router.push("/chat/settings"))} className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground hover:bg-accent hover:text-accent-foreground text-foreground">
                <Settings className="mr-2 h-4 w-4" />
                <span>Preferences</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  )
}
