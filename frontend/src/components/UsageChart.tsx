"use client"
import React from 'react'
import { 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Area, AreaChart 
} from 'recharts'

export default function UsageChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7C5CFF" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#7C5CFF" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e6e3f0" vertical={false} />
        <XAxis dataKey="name" stroke="#6b6880" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
        <YAxis stroke="#6b6880" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e6e3f0', borderRadius: '12px', color: '#1e1b2e', boxShadow: '0 4px 16px -6px rgba(124,92,255,0.25)' }}
          itemStyle={{ color: '#5b3fe0' }}
        />
        <Area type="monotone" dataKey="queries" stroke="#7C5CFF" strokeWidth={3} fillOpacity={1} fill="url(#colorQueries)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
