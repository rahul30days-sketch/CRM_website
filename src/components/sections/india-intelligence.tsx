'use client'

/**
 * Section 09 — Across cities. Across teams. One command center.
 *
 * A stylised city-network visualisation of EZCRM's reach across India. This is
 * deliberately a node network (approximate relative positions), NOT a precise
 * geographic boundary map — so it is honest rather than a decorative, wrong
 * map. A national-totals strip, the interactive map, and a top-regions board
 * fill the section. Hover/focus a city for illustrative sample metrics.
 */

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { AmbientBackdrop } from '@/components/motion/ambient-backdrop'

type City = { id: string; name: string; x: number; y: number; leads: number; deals: number; revenue: string; rev: number; conv: string }

const CITIES: City[] = [
  { id: 'delhi', name: 'Delhi NCR', x: 48, y: 13, leads: 1840, deals: 212, revenue: '₹34.2L', rev: 34.2, conv: '26%' },
  { id: 'lucknow', name: 'Lucknow', x: 62, y: 23, leads: 520, deals: 58, revenue: '₹8.6L', rev: 8.6, conv: '21%' },
  { id: 'jaipur', name: 'Jaipur', x: 34, y: 24, leads: 640, deals: 74, revenue: '₹11.1L', rev: 11.1, conv: '23%' },
  { id: 'ahmedabad', name: 'Ahmedabad', x: 22, y: 41, leads: 980, deals: 131, revenue: '₹19.4L', rev: 19.4, conv: '28%' },
  { id: 'kolkata', name: 'Kolkata', x: 78, y: 44, leads: 760, deals: 88, revenue: '₹13.0L', rev: 13.0, conv: '22%' },
  { id: 'mumbai', name: 'Mumbai', x: 24, y: 59, leads: 2120, deals: 268, revenue: '₹41.8L', rev: 41.8, conv: '27%' },
  { id: 'pune', name: 'Pune', x: 33, y: 63, leads: 1180, deals: 152, revenue: '₹22.3L', rev: 22.3, conv: '29%' },
  { id: 'hyderabad', name: 'Hyderabad', x: 51, y: 69, leads: 1340, deals: 171, revenue: '₹25.6L', rev: 25.6, conv: '26%' },
  { id: 'bengaluru', name: 'Bengaluru', x: 44, y: 84, leads: 1760, deals: 238, revenue: '₹38.1L', rev: 38.1, conv: '30%' },
  { id: 'chennai', name: 'Chennai', x: 57, y: 90, leads: 1090, deals: 139, revenue: '₹20.9L', rev: 20.9, conv: '25%' },
]

const LINKS: [number, number][] = [
  [0, 1], [0, 2], [2, 3], [3, 5], [5, 6], [6, 7], [7, 8], [8, 9], [1, 4], [4, 7], [0, 7],
]

const TOTALS = [
  { value: '10', label: 'cities live' },
  { value: '12,230', label: 'leads captured' },
  { value: '1,531', label: 'deals won' },
  { value: '₹2.35Cr', label: 'revenue tracked' },
]

const TOP = [...CITIES].sort((a, b) => b.rev - a.rev).slice(0, 5)
const maxRev = TOP[0].rev

export function IndiaIntelligence() {
  const reduce = useReducedMotion()
  const [sel, setSel] = useState(5)
  const [pinned, setPinned] = useState(false)

  useEffect(() => {
    if (pinned || reduce) return
    const t = setInterval(() => setSel((s) => (s + 1) % CITIES.length), 2400)
    return () => clearInterval(t)
  }, [pinned, reduce])

  const active = CITIES[sel]

  return (
    <section className="relative mesh-deep py-14 lg:py-20">
      <AmbientBackdrop />
      <div className="shell relative">
        <header className="mx-auto max-w-2xl text-center">
          <p className="kicker mb-3">Geographic intelligence</p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Across cities. Across teams. One command center.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate">
            See how leads, deals and revenue flow across your regions — so you know where to push next.
          </p>
        </header>

        {/* national totals strip — closes the gap and sets context */}
        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
          {TOTALS.map((t) => (
            <div key={t.label} className="rounded-card border border-line bg-white/70 px-4 py-3 text-center backdrop-blur">
              <p className="font-mono text-xl font-extrabold text-ink">{t.value}</p>
              <p className="text-[11px] text-slate">{t.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          {/* interactive city network */}
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
              {LINKS.map(([a, b], i) => (
                <line
                  key={i}
                  x1={CITIES[a].x}
                  y1={CITIES[a].y}
                  x2={CITIES[b].x}
                  y2={CITIES[b].y}
                  stroke="rgb(43,92,230)"
                  strokeOpacity={0.18}
                  strokeWidth={0.3}
                />
              ))}
              {CITIES.map((c, i) => (
                <g key={c.id}>
                  {!reduce && (
                    <motion.circle
                      cx={c.x}
                      cy={c.y}
                      r={1.6}
                      fill="rgb(43,92,230)"
                      initial={{ opacity: 0.4, scale: 1 }}
                      animate={{ opacity: [0.4, 0, 0.4], scale: [1, 2.8, 1] }}
                      transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.2 }}
                      style={{ transformOrigin: `${c.x}px ${c.y}px` }}
                    />
                  )}
                  <circle cx={c.x} cy={c.y} r={i === sel ? 1.7 : 1} fill={i === sel ? 'rgb(16,138,74)' : 'rgb(43,92,230)'} />
                </g>
              ))}
            </svg>

            {CITIES.map((c, i) => (
              <button
                key={c.id}
                type="button"
                onMouseEnter={() => { setSel(i); setPinned(true) }}
                onMouseLeave={() => setPinned(false)}
                onFocus={() => { setSel(i); setPinned(true) }}
                onBlur={() => setPinned(false)}
                style={{ left: `${c.x}%`, top: `${c.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                  i === sel ? 'z-10 scale-110 bg-ink text-white shadow-float' : 'bg-white/85 text-slate shadow-soft hover:text-ink'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* selected-city metrics + top regions board */}
          <div className="space-y-4">
            <motion.div
              key={active.id}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-card border border-line bg-white p-6 shadow-float"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-ink">{active.name}</h3>
                <span className="rounded-full bg-sky px-2.5 py-0.5 text-[11px] font-semibold text-brand">Sample data</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {[
                  { label: 'Leads', value: active.leads.toLocaleString('en-IN') },
                  { label: 'Deals won', value: String(active.deals) },
                  { label: 'Revenue', value: active.revenue },
                  { label: 'Conversion', value: active.conv },
                ].map((m) => (
                  <div key={m.label}>
                    <p className="font-mono text-xl font-extrabold text-ink">{m.value}</p>
                    <p className="text-xs text-slate">{m.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="rounded-card border border-line bg-white/70 p-5 shadow-soft backdrop-blur">
              <p className="kicker mb-3">Top regions by revenue</p>
              <ul className="space-y-2.5">
                {TOP.map((c) => (
                  <li key={c.id} className="flex items-center gap-3">
                    <span className="w-20 shrink-0 text-xs font-semibold text-ink">{c.name}</span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-line">
                      <span
                        className={`block h-full rounded-full ${c.id === active.id ? 'bg-[rgb(var(--c-won))]' : 'bg-brand'}`}
                        style={{ width: `${(c.rev / maxRev) * 100}%` }}
                      />
                    </span>
                    <span className="w-14 shrink-0 text-right font-mono text-xs text-slate">{c.revenue}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
