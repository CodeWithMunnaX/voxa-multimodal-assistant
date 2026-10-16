"use client"

import { useState, useEffect } from "react"
import { motion, Variants } from "framer-motion"
import Link from "next/link"
import { 
  Bell, Search, Sun, Moon, MessageSquare, Mic, 
  GraduationCap, FileText, Image as ImageIcon, 
  BarChart, Clock, Zap, ArrowRight, Activity
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import dynamic from "next/dynamic"
import { useAuthStore } from "@/store/authStore"


const UsageChart = dynamic(() => import("@/components/UsageChart"), {
  ssr: false,
  loading: () => <div className="w-full h-full animate-pulse bg-muted rounded-none"></div>
})
import { api } from "@/lib/api"
import { SidebarTrigger } from "@/components/ui/sidebar"

const featureCards = [
  { title: "AI Chat", desc: "Interact with advanced AI models", icon: MessageSquare, color: "bg-indigo-500", link: "/chat/ai-chat" },
  { title: "Voice Assistant", desc: "Speak directly to your AI", icon: Mic, color: "bg-purple-500", link: "/chat/voice" },
  { title: "Image Studio", desc: "Generate & store visual assets", icon: ImageIcon, color: "bg-fuchsia-500", link: "/chat/images" },
  { title: "Doc Analyzer", desc: "Extract insights from PDFs", icon: FileText, color: "bg-blue-500", link: "/chat/docs" },
  { title: "AI Tutor", desc: "Personalized learning sessions", icon: GraduationCap, color: "bg-green-500", link: "/chat/tutor" },
]

function timeAgo(iso: string): string {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000))
  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`
  const days = Math.round(hours / 24)
  return days === 1 ? "Yesterday" : `${days} days ago`
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const displayUsername = user?.name || user?.email?.split('@')[0] || "Guest"
  const [usageData, setUsageData] = useState([
    { name: 'Mon', queries: 0, storage: 0 },
    { name: 'Tue', queries: 0, storage: 0 },
    { name: 'Wed', queries: 0, storage: 0 },
    { name: 'Thu', queries: 0, storage: 0 },
    { name: 'Fri', queries: 0, storage: 0 },
    { name: 'Sat', queries: 0, storage: 0 },
    { name: 'Sun', queries: 0, storage: 0 },
  ])
  const [activity, setActivity] = useState<{ title: string; date: string; kind: "chat" | "doc" }[]>([])

  useEffect(() => {
    // Recent activity from the user's latest chats and analyzed documents
    const fetchActivity = async () => {
      try {
        const [chats, docs]: any[] = await Promise.all([
          api.get("/chats").catch(() => []),
          api.get("/documents").catch(() => []),
        ])
        const items = [
          ...(Array.isArray(chats) ? chats : []).map((c: any) => ({ title: `Chat: ${c.title || "Untitled"}`, date: c.created_at, kind: "chat" as const })),
          ...(Array.isArray(docs) ? docs : []).map((d: any) => ({ title: `Analyzed '${d.filename}'`, date: d.created_at, kind: "doc" as const })),
        ]
          .filter((i) => i.date)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 4)
        setActivity(items)
      } catch (error) {
        console.error("Failed to fetch recent activity", error)
      }
    }
    fetchActivity()
  }, [])

  useEffect(() => {
    // Fetch dynamic usage data
    const fetchUsage = async () => {
      try {
        const res: any = await api.get("/analytics/usage")
        if (res && res.length > 0) {
          setUsageData(res)
        }
      } catch (error) {
        console.error("Failed to fetch usage data", error)
      }
    }
    
    fetchUsage()
  }, [])

  return (
    <div className="flex flex-col min-h-full bg-transparent text-foreground font-sans relative">
      <main className="flex-1 p-8 pb-20 relative z-10">
        <motion.div 
          className="max-w-7xl mx-auto space-y-10"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="relative overflow-hidden rounded-none bg-card border border-border shadow-[0_4px_24px_-8px_rgba(124,92,255,0.15)] p-10 flex flex-col justify-end min-h-[280px]">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#7C5CFF]/15 rounded-full blur-[100px] pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#4F8CFF]/15 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/4 translate-y-1/4" />
            
            <div className="relative z-10 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">
                Hi, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFF] to-[#4F8CFF]">{displayUsername}</span>
              </h1>
              <div className="flex gap-4">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-11 px-6 font-semibold shadow-sm group">
                  <Zap className="mr-2 h-4 w-4 text-primary-foreground" />
                  Quick Action
                </Button>
                <Button variant="outline" className="rounded-none h-11 px-6 border-border bg-card hover:bg-muted text-foreground font-medium">
                  View Analytics
                </Button>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Features */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  AI Applications
                </h2>
                <Button variant="link" className="text-primary p-0 h-auto font-medium">View all</Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {featureCards.map((card, idx) => (
                  <Link href={card.link} key={idx}>
                    <motion.div 
                      variants={itemVariants}
                      whileHover={{ scale: 1.03, y: -5 }}
                      className="group p-5 rounded-none bg-card border border-border shadow-sm hover:border-primary/40 hover:shadow-[0_4px_24px_-8px_rgba(124,92,255,0.25)] transition-all cursor-pointer h-full relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-secondary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className={`relative h-10 w-10 rounded-none ${card.color} flex items-center justify-center shadow-lg mb-4 text-white`}>
                        <card.icon className="h-5 w-5" />
                      </div>
                      <h3 className="relative font-semibold text-foreground mb-1">{card.title}</h3>
                      <p className="relative text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
                    </motion.div>
                  </Link>
                ))}
              </div>

              {/* Chart Section */}
              <motion.div variants={itemVariants} className="mt-8 pt-8 border-t border-border">
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  Usage Overview
                </h2>
                <div className="h-[300px] w-full bg-card border border-border rounded-none p-6 shadow-sm">
                  <UsageChart data={usageData} />
                </div>
              </motion.div>
            </div>

            {/* Right Column: Widgets */}
            <div className="space-y-6">
              
              {/* Recent Activity */}
              <motion.div variants={itemVariants} className="bg-card border border-border rounded-none p-6 shadow-sm">
                <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" /> Recent Activity
                </h2>
                <div className="space-y-5">
                  {activity.length === 0 && (
                    <p className="text-sm text-muted-foreground">No activity yet. Start a chat or upload a document.</p>
                  )}
                  {activity.map((item) => ({
                    title: item.title,
                    time: timeAgo(item.date),
                    icon: item.kind === "doc" ? FileText : MessageSquare,
                    color: item.kind === "doc" ? "text-blue-600" : "text-indigo-600",
                    bg: item.kind === "doc" ? "bg-blue-500/10" : "bg-indigo-500/10",
                  })).map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-4 group cursor-pointer">
                      <div className={`h-10 w-10 rounded-none ${activity.bg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                        <activity.icon className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{activity.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/chat/history">
                  <Button variant="ghost" className="w-full mt-6 text-xs text-muted-foreground hover:text-foreground hover:bg-muted border border-border rounded-none">View all history</Button>
                </Link>
              </motion.div>

              {/* Quick Access */}
              <motion.div variants={itemVariants} className="bg-gradient-to-br from-[#7C5CFF] to-[#4F8CFF] border border-primary/30 rounded-none p-6 relative overflow-hidden shadow-[0_4px_24px_-8px_rgba(124,92,255,0.35)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-[40px] pointer-events-none" />
                <h2 className="text-lg font-bold text-white mb-2">Upgrade to Pro</h2>
                <p className="text-sm text-white/85 mb-6 max-w-[200px]">Unlock GPT-4, DALL-E 3, and unlimited API usage.</p>
                <Button className="w-full bg-white text-[#4c2fd6] hover:bg-white/90 rounded-none font-bold shadow-sm">
                  Upgrade Now
                </Button>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

function SparklesIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  )
}
