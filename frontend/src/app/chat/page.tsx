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
  loading: () => <div className="w-full h-full animate-pulse bg-neutral-800/50 rounded-none"></div>
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
  // Removed useTheme as app is strictly dark mode

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
    <div className="flex flex-col min-h-full bg-transparent text-white font-sans relative">
      <main className="flex-1 p-8 pb-20 relative z-10">
        <motion.div 
          className="max-w-7xl mx-auto space-y-10"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="relative overflow-hidden rounded-none bg-neutral-900 border border-neutral-800 p-10 flex flex-col justify-end min-h-[280px]">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/4 translate-y-1/4" />
            
            <div className="relative z-10 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">
                Hi, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{displayUsername}</span>
              </h1>
              <div className="flex gap-4">
                <Button className="bg-white text-neutral-950 hover:bg-neutral-200 rounded-none h-11 px-6 font-semibold shadow-lg group">
                  <Zap className="mr-2 h-4 w-4 text-indigo-600" />
                  Quick Action
                </Button>
                <Button variant="outline" className="rounded-none h-11 px-6 border-neutral-700 hover:bg-neutral-800 text-neutral-200 font-medium">
                  View Analytics
                </Button>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Features */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  AI Applications
                </h2>
                <Button variant="link" className="text-indigo-400 p-0 h-auto font-medium">View all</Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {featureCards.map((card, idx) => (
                  <Link href={card.link} key={idx}>
                    <motion.div 
                      variants={itemVariants}
                      whileHover={{ scale: 1.03, y: -5 }}
                      className="group p-5 rounded-none bg-neutral-900 border border-neutral-800 hover:border-indigo-500/50 hover:shadow-[0_8px_30px_rgb(79,70,229,0.12)] transition-all cursor-pointer h-full relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className={`h-10 w-10 rounded-none ${card.color} flex items-center justify-center shadow-lg mb-4 text-white`}>
                        <card.icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-neutral-100 mb-1">{card.title}</h3>
                      <p className="text-xs text-neutral-500 leading-relaxed">{card.desc}</p>
                    </motion.div>
                  </Link>
                ))}
              </div>

              {/* Chart Section */}
              <motion.div variants={itemVariants} className="mt-8 pt-8 border-t border-neutral-800/50">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  Usage Overview
                </h2>
                <div className="h-[300px] w-full bg-neutral-900 border border-neutral-800 rounded-none p-6 shadow-sm">
                  <UsageChart data={usageData} />
                </div>
              </motion.div>
            </div>

            {/* Right Column: Widgets */}
            <div className="space-y-6">
              
              {/* Recent Activity */}
              <motion.div variants={itemVariants} className="bg-neutral-900 border border-neutral-800 rounded-none p-6 shadow-sm">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-neutral-400" /> Recent Activity
                </h2>
                <div className="space-y-5">
                  {[
                    { title: "Analyzed 'Q3_Report.pdf'", time: "2 hours ago", icon: FileText, color: "text-blue-400", bg: "bg-blue-400/10" },
                    { title: "Chat session: React Native", time: "5 hours ago", icon: MessageSquare, color: "text-indigo-400", bg: "bg-indigo-400/10" },
                    { title: "Generated 3 images", time: "Yesterday", icon: ImageIcon, color: "text-fuchsia-400", bg: "bg-fuchsia-400/10" },
                    { title: "Voice notes saved", time: "2 days ago", icon: Mic, color: "text-purple-400", bg: "bg-purple-400/10" },
                  ].map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-4 group cursor-pointer">
                      <div className={`h-10 w-10 rounded-none ${activity.bg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                        <activity.icon className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-200 group-hover:text-white transition-colors">{activity.title}</p>
                        <p className="text-xs text-neutral-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-6 text-xs text-neutral-400 hover:text-white border border-neutral-800 rounded-none">View all history</Button>
              </motion.div>

              {/* Quick Access */}
              <motion.div variants={itemVariants} className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-none p-6 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[40px] pointer-events-none" />
                <h2 className="text-lg font-bold text-white mb-2">Upgrade to Pro</h2>
                <p className="text-sm text-indigo-200 mb-6 max-w-[200px]">Unlock GPT-4, DALL-E 3, and unlimited API usage.</p>
                <Button className="w-full bg-white text-indigo-950 hover:bg-neutral-200 rounded-none font-bold shadow-lg">
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
