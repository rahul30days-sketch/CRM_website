'use client'

/**
 * Section 05 — The lead magnet (integration hub).
 *
 * Left: real EZCRM lead sources orbit the platform with particles flowing in.
 * Right: a live "incoming leads" inbox where each captured lead lands, tagged by
 * source and auto-routed to a rep — the new one slides to the top as its source
 * fires. A supported-sources strip sits up top. SVG + framer-motion; source
 * names are the real supported integrations, the leads are illustrative.
 */

import { useEffect, useState } from 'react'
import { LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { AmbientBackdrop } from '@/components/motion/ambient-backdrop'
import { BrandLogo } from '@/components/brand-logo'

type Source = { id: string; label: string; slug: string; rep: string; lead: { name: string; need: string } }

const SOURCES: Source[] = [
  { id: 'indiamart', label: 'IndiaMART', slug: 'indiamart', rep: 'Priya', lead: { name: 'Rakesh Gupta', need: 'Submersible pumps × 4' } },
  { id: 'justdial', label: 'JustDial', slug: 'justdial', rep: 'Arjun', lead: { name: 'Meena Traders', need: 'Industrial valves' } },
  { id: 'facebook', label: 'Facebook', slug: 'facebook-lead-ads', rep: 'Sana', lead: { name: 'Arjun Nair', need: '2BHK site visit' } },
  { id: 'whatsapp', label: 'WhatsApp', slug: 'meta-whatsapp', rep: 'Vivek', lead: { name: 'Sana Khan', need: 'AMC renewal' } },
  { id: 'google', label: 'Google', slug: 'google', rep: 'Neha', lead: { name: 'Vivek Rao', need: 'Bulk enquiry' } },
  { id: 'website', label: 'Website', slug: 'webhooks', rep: 'Imran', lead: { name: 'Priya Desai', need: 'Demo request' } },
]

const TIMES = ['just now', '16s ago', '48s ago', '1m ago', '2m ago', '3m ago']

const R = 36
const nodes = SOURCES.map((s, i) => {
  const a = (i / SOURCES.length) * Math.PI * 2 - Math.PI / 2
  return { ...s, x: 50 + R * Math.cos(a), y: 50 + R * Math.sin(a) }
})

export function LeadMagnet() {
  const reduce = useReducedMotion()
  const [sel, setSel] = useState(0)
  const [pinned, setPinned] = useState(false)
  const [order, setOrder] = useState<number[]>(SOURCES.map((_, i) => i))

  useEffect(() => {
    if (pinned || reduce) return
    const t = setInterval(() => setSel((s) => (s + 1) % SOURCES.length), 2600)
    return () => clearInterval(t)
  }, [pinned, reduce])

  // newest captured lead jumps to the top of the inbox
  useEffect(() => {
    setOrder((prev) => [sel, ...prev.filter((i) => i !== sel)])
  }, [sel])

  return (
    <section className="relative py-14 lg:py-20">
      <AmbientBackdrop />
      <div className="shell relative">
        <header className="mx-auto max-w-2xl text-center">
          <p className="kicker mb-3">Lead integration hub</p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Every lead. From everywhere.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate">
            Connect your lead sources and every enquiry lands in one place — sourced, routed to a rep and ready to call.
          </p>
        </header>

        {/* supported sources strip */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
          {SOURCES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onMouseEnter={() => { setSel(i); setPinned(true) }}
              onMouseLeave={() => setPinned(false)}
              onFocus={() => { setSel(i); setPinned(true) }}
              onBlur={() => setPinned(false)}
              className={`inline-flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-xs font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                i === sel ? 'border-brand/40 bg-white text-ink shadow-soft' : 'border-line bg-white/70 text-slate hover:text-ink'
              }`}
            >
              <span className="scale-[0.6]"><BrandLogo slug={s.slug} name={s.label} /></span>
              <span className="-ml-2">{s.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
          {/* hub */}
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
              {nodes.map((n, i) => (
                <line
                  key={n.id}
                  x1={n.x}
                  y1={n.y}
                  x2="50"
                  y2="50"
                  stroke={i === sel ? 'rgb(43,92,230)' : 'rgb(226,233,245)'}
                  strokeWidth={i === sel ? 0.5 : 0.3}
                  className="transition-colors duration-300"
                />
              ))}
              {!reduce &&
                nodes.map((n, i) => (
                  <motion.circle
                    key={n.id}
                    r={i === sel ? 1.2 : 0.8}
                    fill={i === sel ? 'rgb(43,92,230)' : 'rgb(91,132,240)'}
                    initial={{ cx: n.x, cy: n.y, opacity: 0 }}
                    animate={{ cx: [n.x, 50], cy: [n.y, 50], opacity: [0, 1, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.35, ease: 'easeIn' }}
                  />
                ))}
            </svg>

            {/* central hub */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-2xl" />
              <div className="grid h-24 w-24 place-items-center rounded-3xl border border-line bg-white shadow-float sm:h-28 sm:w-28">
                <span className="font-display text-xl font-extrabold tracking-tight text-ink">
                  EZ<span className="text-brand">CRM</span>
                </span>
              </div>
            </div>

            {/* source tiles */}
            {nodes.map((n, i) => (
              <button
                key={n.id}
                type="button"
                onMouseEnter={() => { setSel(i); setPinned(true) }}
                onMouseLeave={() => setPinned(false)}
                onFocus={() => { setSel(i); setPinned(true) }}
                onBlur={() => setPinned(false)}
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-chip border px-3 py-1.5 text-xs font-semibold shadow-soft transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                  i === sel ? 'scale-110 border-brand/40 bg-brand text-white' : 'border-line bg-white text-slate hover:border-brand/30 hover:text-ink'
                }`}
              >
                {n.label}
              </button>
            ))}
          </div>

          {/* live incoming inbox */}
          <div className="rounded-[1.5rem] border border-line bg-white shadow-float">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-slate">
                <Zap className="h-3.5 w-3.5 text-brand" aria-hidden /> Incoming leads
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[rgb(var(--c-won))]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[rgb(var(--c-won))] opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[rgb(var(--c-won))]" />
                </span>
                Auto-routed
              </span>
            </div>
            <LayoutGroup>
              <ul className="space-y-2 p-3">
                {order.map((srcIdx, pos) => {
                  const s = SOURCES[srcIdx]
                  const isNew = pos === 0
                  return (
                    <motion.li
                      key={s.id}
                      layout={reduce ? undefined : true}
                      transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                      className={`flex items-center gap-3 rounded-chip border p-2.5 ${
                        isNew ? 'border-brand/30 bg-sky/50' : 'border-line bg-white'
                      }`}
                    >
                      <BrandLogo slug={s.slug} name={s.label} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-ink">{s.lead.name}</p>
                        <p className="truncate font-mono text-[11px] text-slate">
                          {s.lead.need} · → {s.rep}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="inline-block rounded-full bg-[rgb(var(--c-won))]/10 px-2 py-0.5 text-[10px] font-semibold text-[rgb(var(--c-won))]">
                          {s.label}
                        </span>
                        <p className="mt-0.5 font-mono text-[10px] text-slate">{TIMES[pos]}</p>
                      </div>
                    </motion.li>
                  )
                })}
              </ul>
            </LayoutGroup>
          </div>
        </div>
      </div>
    </section>
  )
}
