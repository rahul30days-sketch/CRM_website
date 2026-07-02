'use client'

import React from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer
} from 'recharts'

const leadData = [
  { month: 'Jan', leads: 150 },
  { month: 'Feb', leads: 220 },
  { month: 'Mar', leads: 180 },
  { month: 'Apr', leads: 390 },
  { month: 'May', leads: 310 },
  { month: 'Jun', leads: 480 },
]

const dealData = [
  { stage: 'New', value: 120 },
  { stage: 'Qual', value: 170 },
  { stage: 'Quote', value: 80 },
  { stage: 'Won', value: 240 },
]

export function HeroVisuals() {
  return (
    <>
      {/* Left Visual: Lead Growth (Area Chart) */}
      <div 
        className="absolute left-[3%] top-[20%] w-[220px] h-[130px] opacity-[0.22] pointer-events-none hidden xl:block select-none"
        aria-hidden="true"
      >
        <p className="font-mono text-[9px] uppercase tracking-widest text-slate mb-1">Lead Capture rate</p>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={leadData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(var(--c-brand))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="rgb(var(--c-brand))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="leads" 
              stroke="rgb(var(--c-brand))" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorLeads)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Right Visual: Sales Pipeline (Bar Chart) */}
      <div 
        className="absolute right-[3%] top-[20%] w-[220px] h-[130px] opacity-[0.22] pointer-events-none hidden xl:block select-none"
        aria-hidden="true"
      >
        <p className="font-mono text-[9px] uppercase tracking-widest text-slate mb-1 text-right">Deals distribution</p>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dealData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <Bar 
              dataKey="value" 
              fill="rgb(var(--c-brand-hi))" 
              radius={[3, 3, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}
