"use client"

import { useState } from "react"
import { BarChart as BarChartIcon, Sparkles, TrendingUp, Users, Clock, Database, ArrowUpRight, ArrowDownRight } from "lucide-react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"

// Reuse the existing chart component
const UsageChart = dynamic(() => import("@/components/UsageChart"), {
  ssr: false,
  loading: () => <div className="w-full h-full animate-pulse bg-muted rounded-2xl"></div>
})

const dummyData = [
  { name: 'Mon', queries: 120, storage: 45 },
  { name: 'Tue', queries: 210, storage: 52 },
  { name: 'Wed', queries: 180, storage: 60 },
  { name: 'Thu', queries: 290, storage: 68 },
  { name: 'Fri', queries: 240, storage: 75 },
  { name: 'Sat', queries: 110, storage: 78 },
  { name: 'Sun', queries: 140, storage: 82 },
]

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("7d")

  return (
    <div className="flex flex-col min-h-full bg-transparent text-foreground font-sans relative">

      <main className="flex-1 p-8 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center shadow-[0_4px_16px_-6px_rgba(236,72,153,0.3)]">
                <BarChartIcon className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
                  Advanced Analytics <Sparkles className="h-5 w-5 text-pink-500" />
                </h1>
                <p className="text-muted-foreground text-sm mt-1">Deep dive into your AI usage, token consumption, and workspace metrics.</p>
              </div>
            </div>

            <div className="flex p-1 bg-card border border-border rounded-xl shadow-sm">
              {["24h", "7d", "30d", "1y"].map(t => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${timeframe === t ? 'bg-pink-500/10 text-pink-700 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Total Queries", value: "1,290", change: "+12.5%", isUp: true, icon: TrendingUp },
              { label: "Active Sessions", value: "34", change: "+4.2%", isUp: true, icon: Users },
              { label: "Avg. Response Time", value: "1.2s", change: "-0.4s", isUp: true, icon: Clock }, // faster is better, so down is good, we'll mark as green
              { label: "Storage Used", value: "8.4 GB", change: "+1.2 GB", isUp: false, icon: Database },
            ].map((metric, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity text-primary">
                  <metric.icon className="h-32 w-32" />
                </div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                  <div className="h-8 w-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
                    <metric.icon className="h-4 w-4 text-pink-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-2 relative z-10">{metric.value}</h3>
                <div className={`flex items-center text-sm font-medium relative z-10 ${metric.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {metric.isUp ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                  {metric.change} from last period
                </div>
              </div>
            ))}
          </div>

          {/* Main Chart Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-foreground mb-6">Usage Over Time</h2>
              <div className="h-[400px] w-full">
                <UsageChart data={dummyData} />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-foreground mb-6">Top Features</h2>
                <div className="space-y-4">
                  {[
                    { name: "AI Chat", usage: 45, color: "bg-indigo-500" },
                    { name: "Doc Analyzer", usage: 25, color: "bg-blue-500" },
                    { name: "Image Studio", usage: 15, color: "bg-fuchsia-500" },
                    { name: "Voice Assistant", usage: 10, color: "bg-purple-500" },
                    { name: "Other", usage: 5, color: "bg-neutral-400" },
                  ].map((feat, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-foreground">{feat.name}</span>
                        <span className="text-muted-foreground">{feat.usage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className={`${feat.color} h-2 rounded-full`} style={{ width: `${feat.usage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-secondary border border-pink-500/20 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-foreground mb-2">Token Usage Alert</h2>
                <p className="text-sm text-muted-foreground mb-4">You have consumed 85% of your monthly GPT-4 token limit.</p>
                <Button className="w-full bg-pink-600 hover:bg-pink-500 text-white rounded-lg font-semibold shadow-sm shadow-pink-500/20">
                  Increase Limit
                </Button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
