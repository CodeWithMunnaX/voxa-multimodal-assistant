"use client"

import { useState, useEffect } from "react"
import { 
  MessageSquare, FileText, StickyNote, Mic, Search, Loader2, 
  ChevronRight, Bot, FolderOpen, Sparkles, ExternalLink, Calendar
} from "lucide-react"
import { api } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

function formatRelativeTime(dateString: string) {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  } catch (e) {
    return "Recently";
  }
}

export interface UnifiedHistoryItem {
  id: string
  title: string
  category: "AI Chat" | "Voice Assistant" | "Doc Analyzer" | "AI Notes"
  created_at: string
  detail?: string
  raw?: any
}

export default function HistoryPage() {
  const [items, setItems] = useState<UnifiedHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetchAllHistory()
  }, [])

  const fetchAllHistory = async () => {
    try {
      setIsLoading(true)
      const unifiedList: UnifiedHistoryItem[] = []

      // 1. Fetch AI Chats
      try {
        const chatsRes = await api.get<any[]>("/chats")
        const chats = Array.isArray(chatsRes) ? chatsRes : (chatsRes as any)?.data || []
        chats.forEach((chat: any) => {
          const isVoice = chat.title?.toLowerCase().includes("voice") || chat.title?.toLowerCase().includes("interview")
          unifiedList.push({
            id: `chat-${chat.id}`,
            title: chat.title || "AI Chat Session",
            category: isVoice ? "Voice Assistant" : "AI Chat",
            created_at: chat.created_at || new Date().toISOString(),
            detail: chat.messages ? `${chat.messages.length} messages exchanged` : undefined,
            raw: chat
          })
        })
      } catch (e) {}

      // 2. Fetch Uploaded Documents & Image Storage
      try {
        const docsRes = await api.get<any[]>("/documents")
        const docs = Array.isArray(docsRes) ? docsRes : (docsRes as any)?.data || []
        docs.forEach((doc: any) => {
          const isImage = doc.file_type?.includes("image") || doc.cloudinary_url
          unifiedList.push({
            id: `doc-${doc.id}`,
            title: doc.filename || "Uploaded File",
            category: isImage ? "Doc Analyzer" : "Doc Analyzer",
            created_at: doc.created_at || new Date().toISOString(),
            detail: doc.cloudinary_url ? "Stored in Cloudinary Storage" : `${(doc.file_size ? (doc.file_size / 1024).toFixed(0) : 0)} KB`,
            raw: doc
          })
        })
      } catch (e) {}

      // 3. Fetch Generated Notes & Mindmaps
      try {
        const notesRes = await api.get<any[]>("/notes")
        const notes = Array.isArray(notesRes) ? notesRes : (notesRes as any)?.data || []
        notes.forEach((note: any) => {
          unifiedList.push({
            id: `note-${note.id}`,
            title: note.title || "Generated Note",
            category: "AI Notes",
            created_at: note.created_at || new Date().toISOString(),
            detail: "Generated AI Note / Mindmap",
            raw: note
          })
        })
      } catch (e) {}

      // Sort by newest first
      unifiedList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      setItems(unifiedList)

    } catch (error) {
      toast.error("Failed to fetch full history")
    } finally {
      setIsLoading(false)
    }
  }

  const categories = ["All", "AI Chat", "Voice Assistant", "Doc Analyzer", "AI Notes"]

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.detail && item.detail.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const getItemCategoryBadge = (cat: string) => {
    switch (cat) {
      case "AI Chat":
        return <div className="p-2 bg-secondary text-primary border border-primary/20 flex items-center justify-center"><MessageSquare className="w-4 h-4" /></div>
      case "Voice Assistant":
        return <div className="p-2 bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center"><Mic className="w-4 h-4" /></div>
      case "Doc Analyzer":
        return <div className="p-2 bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center"><FileText className="w-4 h-4" /></div>
      case "AI Notes":
        return <div className="p-2 bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center"><StickyNote className="w-4 h-4" /></div>
      default:
        return <div className="p-2 bg-muted text-muted-foreground flex items-center justify-center"><Sparkles className="w-4 h-4" /></div>
    }
  }

  return (
    <div className="flex flex-col min-h-full bg-transparent text-foreground font-sans relative">
      <main className="flex-1 p-8 pb-20 relative z-10">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                Activity History
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Centralized history of all your AI questions, voice queries, documents, and notes.
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search history across all tools..."
                className="w-full bg-white border-input text-foreground placeholder:text-muted-foreground pl-10 rounded-none focus-visible:ring-primary/30 shadow-sm text-xs h-10"
              />
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border">
            {categories.map((cat) => {
              const count = cat === "All" ? items.length : items.filter(i => i.category === cat).length
              const isActive = selectedCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-semibold rounded-none border transition-all flex items-center gap-2 whitespace-nowrap ${
                    isActive 
                      ? 'bg-primary border-primary text-primary-foreground shadow-[0_4px_24px_-8px_rgba(124,92,255,0.45)]' 
                      : 'bg-white border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`px-1.5 py-0.5 text-[10px] font-mono ${isActive ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Main Unified History Area */}
          <div className="bg-card border border-border rounded-none p-6 shadow-[0_4px_24px_-8px_rgba(124,92,255,0.15)] min-h-[450px] flex flex-col">
            
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground py-16">
                <Loader2 className="h-8 w-8 animate-spin mb-3 text-primary" />
                <span className="text-xs">Loading complete activity history...</span>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                <div className="h-16 w-16 rounded-none bg-secondary border border-border flex items-center justify-center mb-4">
                  <FolderOpen className="h-8 w-8 text-primary/70" />
                </div>
                <h2 className="text-lg font-bold text-foreground mb-1">No activity records found</h2>
                <p className="text-muted-foreground text-xs max-w-sm">
                  {searchQuery ? `No items matched "${searchQuery}".` : `No activity recorded under ${selectedCategory}.`}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground font-mono mb-2 px-1">
                  <span>Showing {filteredItems.length} records</span>
                  <span>Click item to inspect details</span>
                </div>

                <div className="grid gap-3">
                  {filteredItems.map((item) => {
                    const isExpanded = expandedId === item.id;

                    return (
                      <div 
                        key={item.id}
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className={`group flex flex-col p-4 bg-white hover:bg-muted/60 border transition-all cursor-pointer rounded-none ${
                          isExpanded 
                            ? 'border-primary/50 ring-1 ring-primary/20 shadow-sm' 
                            : 'border-border hover:border-primary/30'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3.5 overflow-hidden">
                            {getItemCategoryBadge(item.category)}
                            <div className="overflow-hidden">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-sm text-foreground truncate">{item.title}</h4>
                                <span className="text-[10px] px-2 py-0.5 border border-border bg-muted text-muted-foreground font-mono">
                                  {item.category}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-muted-foreground" />
                                  {formatRelativeTime(item.created_at)}
                                </span>
                                {item.detail && (
                                  <>
                                    <span>•</span>
                                    <span className="text-muted-foreground truncate">{item.detail}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-end sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs font-semibold text-primary flex items-center gap-1">
                              {isExpanded ? "Hide" : "View"}
                              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                            </span>
                          </div>
                        </div>

                        {/* Expanded Content View */}
                        {isExpanded && item.raw && (
                          <div className="mt-4 pt-4 border-t border-border text-xs space-y-3 cursor-default" onClick={(e) => e.stopPropagation()}>
                            
                            {/* Chat Messages */}
                            {item.raw.messages && Array.isArray(item.raw.messages) && (
                              <div className="max-h-[350px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                                {item.raw.messages.length === 0 ? (
                                  <p className="text-muted-foreground italic">No message details stored for this session.</p>
                                ) : (
                                  item.raw.messages.map((msg: any, idx: number) => {
                                    if (msg.content?.includes("INSTRUCTION:") || msg.content?.includes("DOCUMENT CONTEXT:")) return null
                                    return (
                                      <div key={idx} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                                        <div className={`w-6 h-6 rounded-none flex items-center justify-center shrink-0 text-[10px] font-bold ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"}`}>
                                          {msg.role === "user" ? "U" : <Bot className="w-3.5 h-3.5" />}
                                        </div>
                                        <div className={`p-3 rounded-none max-w-[85%] whitespace-pre-wrap ${msg.role === "user" ? "bg-secondary border border-primary/20 text-foreground" : "bg-muted border border-border text-foreground"}`}>
                                          {msg.content}
                                        </div>
                                      </div>
                                    )
                                  })
                                )}
                              </div>
                            )}

                            {/* Cloudinary Document URL */}
                            {item.raw.cloudinary_url && (
                              <div className="p-3 bg-muted border border-border flex items-center justify-between">
                                <span className="text-foreground truncate max-w-md">Cloudinary Asset: {item.raw.cloudinary_url}</span>
                                <a 
                                  href={item.raw.cloudinary_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium flex items-center gap-1.5 transition-colors"
                                >
                                  Open Link <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            )}

                            {/* HTML Content for Notes */}
                            {item.raw.content && (
                              <div className="p-4 bg-white border border-border text-foreground max-h-[300px] overflow-y-auto prose max-w-none text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: item.raw.content }} />
                            )}

                          </div>
                        )}

                      </div>
                    )
                  })}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  )
}
