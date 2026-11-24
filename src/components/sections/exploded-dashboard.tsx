'use client'

/**
 * Section 08 — Exploding dashboard.
 *
 * One substantial dashboard panel (window chrome + dense widget grid) that
 * tilts into a 3D view as it scrolls; the widgets lift to different depths —
 * the "exploded" layers — then settle back flat. Dense and product-like, not
 * scattered. framer-motion scroll-linking + CSS 3D. Reduced-motion shows the
 * flat, labelled dashboard. Numbers are illustrative sample data.
 */

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { AmbientBackdrop } from '@/components/motion/ambient-backdrop'

function Bars({ tone = 'brand' }: { tone?: 'brand' | 'won' }) {
  return (
    <div className="flex h-12 items-end gap-1">
      {[45, 70, 55, 85, 62, 95].map((h, i) => (
        <span key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: tone === 'won' ? 'rgb(var(--c-won))' : 'rgb(var(--c-brand))', opacity: 0.35 + i * 0.1 }} />
      ))}
    </div>
  )
}

type Widget = { key: string; title: string; value: string; depth: number; body: React.ReactNode }

const WIDGETS: Widget[] = [
  {
    key: 'kpi',
    title: 'Revenue & KPIs',
    value: 'Know the month at a glance',
    depth: 46,
    body: (
      <div>
        <p className="font-mono text-2xl font-extrabold text-ink">₹18.4L</p>
        <p className="text-[11px] text-slate">Revenue · month to date</p>
        <div className="mt-2"><Bars /></div>
      </div>
    ),
  },
  {
    key: 'funnel',
    title: 'Sales funnel',
    value: 'See where deals stall',
    depth: 20,
    body: (
      <div className="space-y-1.5">
        {[['New', 100], ['Qualified', 72], ['Proposal', 48], ['Won', 24]].map(([l, v]) => (
          <div key={l as string} className="flex items-center gap-2">
            <span className="w-14 shrink-0 text-[10px] text-slate">{l}</span>
            <span className="h-2 flex-1 rounded-full bg-line"><span className="block h-full rounded-full bg-brand" style={{ width: `${v}%` }} /></span>
          </div>
        ))}
      </div>
    ),
  },
  {
    key: 'sources',
    title: 'Lead source analytics',
    value: 'Know which channel pays',
    depth: 58,
    body: (
      <div className="space-y-1.5">
        {[['IndiaMART', 42], ['WhatsApp', 31], ['Facebook', 27]].map(([l, v]) => (
          <div key={l as string} className="flex items-center gap-2">
            <span className="w-16 shrink-0 text-[10px] text-slate">{l}</span>
            <span className="h-1.5 flex-1 rounded-full bg-line"><span className="block h-full rounded-full bg-brand" style={{ width: `${v}%` }} /></span>
            <span className="font-mono text-[10px] text-slate">{v}%</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    key: 'team',
    title: 'Team performance',
    value: 'Spot who needs a nudge',
    depth: 16,
    body: (
      <div className="space-y-1.5 text-[11px]">
        {[['Priya', '12 won'], ['Arjun', '9 won'], ['Sana', '7 won']].map(([n, v]) => (
          <div key={n as string} className="flex items-center justify-between">
            <span className="text-ink">{n}</span>
            <span className="font-mono text-[rgb(var(--c-won))]">{v}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    key: 'activity',
    title: 'Activity timeline',
    value: 'Every touch, on record',
    depth: 34,
    body: (
      <ul className="space-y-1 text-[11px] text-slate">
        <li>• Quote QT-1094 accepted</li>
        <li>• Follow-up with Vertex set</li>
        <li>• Broadcast delivered 2,847/3k</li>
      </ul>
    ),
  },
  {
    key: 'region',
    title: 'Regional split',
    value: 'Where demand is hot',
    depth: 26,
    body: (
      <div className="space-y-1.5 text-[11px]">
        {[['Mumbai', '₹41.8L'], ['Bengaluru', '₹38.1L'], ['Delhi NCR', '₹34.2L']].map(([n, v]) => (
          <div key={n as string} className="flex items-center justify-between">
            <span className="text-ink">{n}</span>
            <span className="font-mono text-brand">{v}</span>
          </div>
        ))}
      </div>
    ),
  },
]

function Widget({ w, progress, reduce }: { w: Widget; progress: MotionValue<number>; reduce: boolean }) {
  const y = useTransform(progress, [0, 0.5, 1], [0, -w.depth, -w.depth * 0.12])
  const scale = useTransform(progress, [0, 0.5, 1], [1, 1.03, 1])
  const shadowK = useTransform(progress, [0, 0.5, 1], [0.05, 0.2, 0.07])
  const boxShadow = useTransform(shadowK, (v) => `0 ${Math.round(v * 120)}px ${Math.round(v * 150)}px -48px rgba(15,26,51,${(v + 0.1).toFixed(2)})`)
  const labelOpacity = useTransform(progress, [0.25, 0.5, 0.9], [0, 1, 1])

  return (
    <div className="relative">
      <motion.div
        style={reduce ? undefined : { y, scale, boxShadow }}
        className="h-full rounded-card border border-line bg-white p-4"
      >
        <p className="mb-2 text-xs font-bold text-ink">{w.title}</p>
        {w.body}
      </motion.div>
      <motion.p
        style={reduce ? undefined : { opacity: labelOpacity }}
        className="mt-2 text-center text-[11px] font-semibold text-brand"
      >
        {w.value}
      </motion.p>
    </div>
  )
}

export function ExplodedDashboard() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [6, 13, 4])

  return (
    <section ref={ref} className="relative bg-sky/40" style={{ height: reduce ? 'auto' : '185vh' }}>
      <div className={reduce ? 'shell py-20' : 'sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden'}>
        {!reduce && <AmbientBackdrop />}
        <div className="shell text-center">
          <p className="kicker mb-3">Dashboard</p>
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Don&rsquo;t just see your numbers. See your business moving.
          </h2>
        </div>

        <div className="mt-10 w-full max-w-4xl px-4" style={{ perspective: 1400 }}>
          <motion.div
            style={reduce ? undefined : { rotateX }}
            className="rounded-[1.75rem] border border-line bg-white/70 p-4 shadow-float backdrop-blur-xl sm:p-6"
          >
            {/* window chrome */}
            <div className="mb-4 flex items-center gap-2 border-b border-line pb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[rgb(var(--c-due))]/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#F5B301]/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-[rgb(var(--c-won))]/70" />
              <span className="ml-2 font-mono text-[11px] uppercase tracking-widest text-slate">EZCRM · Live dashboard</span>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {WIDGETS.map((w) => (
                <Widget key={w.key} w={w} progress={scrollYProgress} reduce={!!reduce} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
