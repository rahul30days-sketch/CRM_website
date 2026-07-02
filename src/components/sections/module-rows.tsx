'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import type { ModuleContent } from '@/content/modules'
import { cn, formatINRCompact } from '@/lib/utils'

/**
 * Modules as alternating full-width rows — a real mini product panel on one
 * side, copy on the other, direction flipping row to row. Shows the product
 * working instead of describing it with an icon. Rows rise + fade on scroll
 * (motion moment #2); visible by default so nothing is stranded invisible in
 * a background tab or under reduced motion.
 */

const FEATURED = ['leads', 'lead-integrations', 'quotations', 'dashboard'] as const

const PANELS: Record<string, React.ReactNode> = {
  leads: <LeadsPanel />,
  'lead-integrations': <IntegrationsPanel />,
  quotations: <QuotationPanel />,
  dashboard: <DashboardPanel />,
}

export function ModuleRows({ modules }: { modules: ModuleContent[] }) {
  const prefersReduced = useReducedMotion()
  const [enhance, setEnhance] = React.useState(false)

  React.useEffect(() => {
    if (prefersReduced || typeof document === 'undefined') return
    if (!document.hidden) {
      setEnhance(true)
      return
    }
    const onVisible = () => {
      if (!document.hidden) {
        setEnhance(true)
        document.removeEventListener('visibilitychange', onVisible)
      }
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [prefersReduced])

  const rows = FEATURED.map((slug) => modules.find((m) => m.slug === slug)).filter(
    (m): m is ModuleContent => Boolean(m),
  )

  return (
    <div className="space-y-24 lg:space-y-32">
      {rows.map((module, i) => {
        const flip = i % 2 === 1
        return (
          <motion.div
            key={module.slug}
            initial={enhance ? { opacity: 0, y: 40 } : false}
            whileInView={enhance ? { opacity: 1, y: 0 } : undefined}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
          >
            {/* Panel */}
            <div className={cn('relative', flip && 'lg:order-2')}>
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-mist/60 to-transparent blur-2xl" />
              {PANELS[module.slug]}
            </div>

            {/* Copy */}
            <div className={cn(flip && 'lg:order-1')}>
              <p className="kicker mb-3">{moduleKicker(module.slug)}</p>
              <h3 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                {module.tagline}
              </h3>
              <p className="mt-4 text-lg leading-relaxed text-slate">{module.shortDescription}</p>
              <ul className="mt-6 space-y-2.5">
                {module.capabilities.slice(0, 3).map((cap) => (
                  <li key={cap} className="flex gap-3 text-sm text-slate">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                    {cap}
                  </li>
                ))}
              </ul>
              <Link
                href={`/features/${module.slug}`}
                className="mt-6 inline-flex items-center gap-1.5 font-semibold text-brand hover:gap-2.5 transition-all"
              >
                Explore {module.title}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

function moduleKicker(slug: string): string {
  return (
    {
      leads: 'Capture & route',
      'lead-integrations': 'Never miss a paid lead',
      quotations: 'Close faster',
      dashboard: 'See everything',
    }[slug] ?? 'Module'
  )
}

/* ── Mini product panels ─────────────────────────────────────────────── */

function PanelShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass overflow-hidden p-0">
      <div className="flex items-center gap-2 border-b border-line bg-white/60 px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-won" />
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-slate">{title}</p>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

function LeadsPanel() {
  const rows = [
    { name: 'Kavita Mehta', src: 'IndiaMART', to: 'Priya', tone: 'text-brand' },
    { name: 'Rohan Iyer', src: 'Website', to: 'Amit', tone: 'text-won' },
    { name: 'Ashoka Traders', src: 'Facebook', to: 'Priya', tone: 'text-[rgb(var(--c-brand-hi))]' },
    { name: 'Sunrise Motors', src: 'JustDial', to: 'Neha', tone: 'text-slate' },
  ]
  return (
    <PanelShell title="Leads · round-robin queue">
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.name} className="flex items-center justify-between rounded-chip border border-line bg-white px-3 py-2.5 shadow-sm">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">{r.name}</p>
              <p className={cn('font-mono text-[0.625rem] uppercase tracking-wider', r.tone)}>{r.src}</p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-sky px-2.5 py-1 text-[0.6875rem] font-medium text-slate">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[0.5625rem] font-bold text-white">
                {r.to[0]}
              </span>
              {r.to}
            </span>
          </div>
        ))}
      </div>
    </PanelShell>
  )
}

function IntegrationsPanel() {
  const sources = [
    { name: 'IndiaMART', count: 47, tone: 'bg-brand' },
    { name: 'Facebook Lead Ads', count: 32, tone: 'bg-[rgb(var(--c-brand-hi))]' },
    { name: 'JustDial', count: 18, tone: 'bg-won' },
    { name: 'Website forms', count: 12, tone: 'bg-slate' },
  ]
  const max = 47
  return (
    <PanelShell title="Lead sources · this week">
      <div className="space-y-3">
        {sources.map((s) => (
          <div key={s.name}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-ink">{s.name}</span>
              <span className="font-mono font-semibold tabular-nums text-slate">{s.count}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-sky">
              <div className={cn('h-full rounded-full', s.tone)} style={{ width: `${(s.count / max) * 100}%` }} />
            </div>
          </div>
        ))}
        <p className="pt-1 text-center font-mono text-[0.625rem] uppercase tracking-wider text-slate">
          109 enquiries · auto-routed in seconds
        </p>
      </div>
    </PanelShell>
  )
}

function QuotationPanel() {
  const items = [
    { hsn: '8413', desc: '5HP Submersible Pump', qty: 4, rate: 92000 },
    { hsn: '8413', desc: 'Control Panel — 3φ', qty: 4, rate: 14500 },
  ]
  const subtotal = items.reduce((s, i) => s + i.qty * i.rate, 0)
  const gst = Math.round(subtotal * 0.18)
  return (
    <PanelShell title="Quotation · QT-1094 v3">
      <div className="space-y-2 text-sm">
        {items.map((it) => (
          <div key={it.desc} className="flex items-center justify-between border-b border-line pb-2">
            <div>
              <p className="font-medium text-ink">{it.desc}</p>
              <p className="font-mono text-[0.625rem] uppercase tracking-wider text-slate">
                HSN {it.hsn} · {it.qty} × {formatINRCompact(it.rate)}
              </p>
            </div>
            <span className="font-mono tabular-nums text-ink">{formatINRCompact(it.qty * it.rate)}</span>
          </div>
        ))}
        <div className="flex justify-between pt-1 text-slate">
          <span>GST @ 18%</span>
          <span className="font-mono tabular-nums">{formatINRCompact(gst)}</span>
        </div>
        <div className="flex items-center justify-between rounded-chip bg-sky px-3 py-2">
          <span className="font-semibold text-ink">Total</span>
          <span className="font-mono text-lg font-bold tabular-nums text-brand">
            {formatINRCompact(subtotal + gst)}
          </span>
        </div>
        <p className="text-center font-mono text-[0.625rem] uppercase tracking-wider text-won">
          ✓ Digitally signed · 09 Jul
        </p>
      </div>
    </PanelShell>
  )
}

function DashboardPanel() {
  const kpis = [
    { label: 'Revenue', value: '₹18.4L', tone: 'text-brand' },
    { label: 'Open deals', value: '38', tone: 'text-ink' },
    { label: 'Won this mo.', value: '₹6.2L', tone: 'text-won' },
  ]
  const bars = [40, 55, 48, 70, 62, 85, 78]
  return (
    <PanelShell title="Dashboard · command view">
      <div className="mb-3 grid grid-cols-3 gap-2">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-chip border border-line bg-white px-2.5 py-2 text-center shadow-sm">
            <p className={cn('font-mono text-base font-bold tabular-nums', k.tone)}>{k.value}</p>
            <p className="mt-0.5 text-[0.625rem] text-slate">{k.label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-chip border border-line bg-white p-3">
        <p className="mb-2 font-mono text-[0.5625rem] uppercase tracking-wider text-slate">Revenue trend · 7 mo</p>
        <div className="flex h-20 items-end gap-1.5">
          {bars.map((h, i) => (
            <div
              key={i}
              className={cn('flex-1 rounded-t-sm', i === bars.length - 1 ? 'bg-brand' : 'bg-brand/30')}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </PanelShell>
  )
}
