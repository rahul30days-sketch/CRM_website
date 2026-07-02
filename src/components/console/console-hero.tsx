'use client'

import * as React from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCountUp } from './use-count-up'
import { cn, formatINRCompact } from '@/lib/utils'

/**
 * The signature element: a live-feeling EZCRM dashboard as the hero — glass
 * floating on the powder-blue gradient. Real components with a boot sequence
 * (KPIs count up, pipeline staggers in, donut draws), then it settles.
 *
 * `play` gates all motion and defaults OFF, so the resting state is fully
 * visible with final numbers — never blank, even before hydration, under
 * reduced motion, or in a background tab where rAF is paused.
 */

type Deal = { id: string; name: string; value: number }
type Columns = Record<'new' | 'qualified' | 'quote' | 'won', Deal[]>

const INITIAL_COLUMNS: Columns = {
  new: [
    { id: 'd1', name: 'Kavita M. · IndiaMART', value: 180000 },
    { id: 'd2', name: 'Ashoka Traders · FB', value: 95000 },
    { id: 'd3', name: 'R. Iyer · Website', value: 240000 },
  ],
  qualified: [
    { id: 'd4', name: 'Patel Agencies', value: 320000 },
    { id: 'd5', name: 'Sunrise Motors', value: 150000 },
  ],
  quote: [
    { id: 'd6', name: 'Sharma Traders', value: 425000 },
    { id: 'd7', name: 'GreenLeaf Exports', value: 410000 },
  ],
  won: [{ id: 'd8', name: 'Mehta & Sons', value: 175000 }],
}

const SCRIPT: { id: string; from: keyof Columns; to: keyof Columns; at: number }[] = [
  { id: 'd6', from: 'quote', to: 'won', at: 2600 },
  { id: 'd4', from: 'qualified', to: 'quote', at: 5200 },
  { id: 'd1', from: 'new', to: 'qualified', at: 7800 },
]

const COLUMN_META: { key: keyof Columns; label: string; accent?: string }[] = [
  { key: 'new', label: 'New enquiry' },
  { key: 'qualified', label: 'Qualified' },
  { key: 'quote', label: 'Quote sent' },
  { key: 'won', label: 'Won', accent: 'text-won' },
]

const SOURCES = [
  { label: 'IndiaMART', pct: 34, className: 'text-brand', stroke: 'rgb(var(--c-brand))' },
  { label: 'Facebook', pct: 27, className: 'text-[rgb(var(--c-brand-hi))]', stroke: 'rgb(var(--c-brand-hi))' },
  { label: 'JustDial', pct: 18, className: 'text-won', stroke: 'rgb(var(--c-won))' },
  { label: 'Website', pct: 12, className: 'text-slate', stroke: 'rgb(var(--c-slate))' },
  { label: 'Walk-in', pct: 9, className: 'text-due', stroke: 'rgb(var(--c-due))' },
]

const CHAT_STEPS = 4

function KpiTile({
  label,
  value,
  format,
  sub,
  animate,
  tone = 'text-ink',
}: {
  label: string
  value: number
  format: (n: number) => string
  sub?: string
  animate: boolean
  tone?: string
}) {
  const current = useCountUp(value, animate)
  return (
    <div className="rounded-chip border border-line bg-white p-3 shadow-sm">
      <p className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-slate">{label}</p>
      <p className={cn('mt-1 font-mono text-xl font-semibold tabular-nums sm:text-2xl', tone)}>
        {format(current)}
      </p>
      {sub ? <p className="mt-0.5 text-[0.6875rem] text-slate">{sub}</p> : null}
    </div>
  )
}

function DealCard({ deal, won }: { deal: Deal; won: boolean }) {
  return (
    <motion.li
      layout
      layoutId={deal.id}
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      className={cn(
        'rounded-chip border bg-white px-2.5 py-2 shadow-sm',
        won ? 'border-won/40 bg-won/5' : 'border-line',
      )}
    >
      <p className="truncate text-[0.6875rem] font-medium text-ink">{deal.name}</p>
      <p className={cn('font-mono text-xs font-semibold tabular-nums', won ? 'text-won' : 'text-slate')}>
        {formatINRCompact(deal.value)}
      </p>
    </motion.li>
  )
}

function SourceDonut() {
  const radius = 34
  const circumference = 2 * Math.PI * radius
  let offset = 0
  return (
    <div className="flex items-center gap-4">
      <svg
        viewBox="0 0 96 96"
        className="h-24 w-24 shrink-0"
        role="img"
        aria-label="Lead sources: IndiaMART 34%, Facebook 27%, JustDial 18%, Website 12%, Walk-in 9%"
      >
        <circle cx="48" cy="48" r={radius} fill="none" stroke="rgb(var(--c-line))" strokeWidth="10" />
        {SOURCES.map((s) => {
          const length = (s.pct / 100) * circumference
          const el = (
            <circle
              key={s.label}
              cx="48"
              cy="48"
              r={radius}
              fill="none"
              stroke={s.stroke}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 48 48)"
            />
          )
          offset += length
          return el
        })}
      </svg>
      <ul className="space-y-1">
        {SOURCES.map((s) => (
          <li key={s.label} className="flex items-center gap-2 text-[0.6875rem]">
            <span className={cn('font-mono font-semibold tabular-nums', s.className)}>
              {String(s.pct).padStart(2, '0')}%
            </span>
            <span className="text-slate">{s.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function WhatsAppPane({ step }: { step: number }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line pb-2">
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-slate">
          WhatsApp inbox · <span className="text-won">connected</span>
        </p>
        {step >= 4 ? (
          <span className="rounded-full border border-brand/30 bg-brand/5 px-2 py-0.5 font-mono text-[0.5625rem] uppercase text-brand">
            → Priya · round-robin
          </span>
        ) : null}
      </div>
      <div className="mt-3 space-y-2 text-[0.75rem] leading-snug">
        <AnimatePresence>
          {step >= 1 ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-[85%] rounded-2xl rounded-tl-sm border border-line bg-sky px-3 py-2"
            >
              <p className="text-ink">Hi, price for 5HP submersible? Need 4 units for a site in Nashik.</p>
              <p className="mt-1 text-right font-mono text-[0.5625rem] text-slate">Kavita M. · 09:02</p>
            </motion.div>
          ) : null}
          {step === 2 ? (
            <motion.div
              key="typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-1 rounded-2xl border border-line bg-sky px-3 py-2"
              aria-label="Agent is typing"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate [animation-delay:300ms]" />
            </motion.div>
          ) : null}
          {step >= 3 ? (
            <motion.div
              key="reply"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm border border-won/30 bg-won/10 px-3 py-2"
            >
              <p className="text-ink">
                Namaste Kavita ji! Sharing today’s price list for 5HP units — bulk rate applies on 4+.
                📎 pricelist-jul.pdf
              </p>
              <p className="mt-1 text-right font-mono text-[0.5625rem] text-slate">
                Template · price_list_v3 · 09:04 ✓✓
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}

export function ConsoleHero() {
  const prefersReduced = useReducedMotion()
  const [play, setPlay] = React.useState(false)

  React.useEffect(() => {
    if (prefersReduced || typeof document === 'undefined') return
    if (!document.hidden) {
      setPlay(true)
      return
    }
    const onVisible = () => {
      if (!document.hidden) {
        setPlay(true)
        document.removeEventListener('visibilitychange', onVisible)
      }
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [prefersReduced])

  const [columns, setColumns] = React.useState<Columns>(INITIAL_COLUMNS)
  const [chatStep, setChatStep] = React.useState(CHAT_STEPS)
  const [wonPulse, setWonPulse] = React.useState(true)

  React.useEffect(() => {
    if (!play) return
    setColumns(INITIAL_COLUMNS)
    setChatStep(0)
    setWonPulse(false)
    const timers: ReturnType<typeof setTimeout>[] = []
    for (const move of SCRIPT) {
      timers.push(
        setTimeout(() => {
          setColumns((cols) => applyMove(cols, move))
          if (move.to === 'won') setWonPulse(true)
        }, move.at),
      )
    }
    ;[1200, 2400, 3600, 4600].forEach((at, i) => {
      timers.push(setTimeout(() => setChatStep(i + 1), at))
    })
    return () => timers.forEach(clearTimeout)
  }, [play])

  const boot = play
    ? {
        hidden: { opacity: 0, y: 14 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
      }
    : { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }

  return (
    <motion.section
      aria-label="Product preview: the EZCRM dashboard with live pipeline, KPIs and WhatsApp inbox"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: play ? 0.12 : 0 } } }}
      className="glass overflow-hidden !shadow-float"
    >
      {/* Title bar */}
      <motion.div
        variants={boot}
        className="flex items-center justify-between border-b border-line bg-white/60 px-4 py-2.5"
      >
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-won opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-won" />
          </span>
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-slate">
            EZCRM · Command view
          </p>
        </div>
        <p className="font-mono text-[0.6875rem] uppercase tracking-wider text-slate">Tue · 09:04 IST</p>
      </motion.div>

      <div className="space-y-3 p-3 sm:p-4">
        {/* KPI row */}
        <motion.div variants={boot} className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          <KpiTile
            label="Revenue · this month"
            value={1840000}
            format={formatINRCompact}
            sub="↑ 12% vs June"
            animate={play}
            tone="text-brand"
          />
          <KpiTile label="Active leads" value={214} format={String} sub="31 new this week" animate={play} />
          <KpiTile
            label="Pipeline value"
            value={4620000}
            format={formatINRCompact}
            sub="across 38 open deals"
            animate={play}
          />
          <KpiTile
            label="Follow-ups due"
            value={12}
            format={String}
            sub="3 overdue"
            animate={play}
            tone="text-due"
          />
        </motion.div>

        {/* Pipeline board */}
        <motion.div variants={boot} className="rounded-chip border border-line bg-white/70 p-3">
          <p className="mb-2 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-slate">
            Pipeline · Distribution · drag deals between stages
          </p>
          <div className="grid grid-cols-4 gap-2">
            {COLUMN_META.map((col) => (
              <div key={col.key} className="min-w-0">
                <p
                  className={cn(
                    'mb-1.5 flex items-baseline justify-between font-mono text-[0.5625rem] uppercase tracking-wider',
                    col.accent ?? 'text-slate',
                  )}
                >
                  <span className="truncate">{col.label}</span>
                  <span className="tabular-nums">{columns[col.key].length}</span>
                </p>
                <ul
                  className={cn(
                    'min-h-24 space-y-1.5 rounded-chip p-1',
                    col.key === 'won' && wonPulse ? 'bg-won/10' : 'bg-sky',
                  )}
                >
                  {columns[col.key].map((deal) => (
                    <DealCard key={deal.id} deal={deal} won={col.key === 'won'} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Inbox + sources */}
        <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr]">
          <motion.div variants={boot} className="rounded-chip border border-line bg-white/70 p-3">
            <WhatsAppPane step={chatStep} />
          </motion.div>
          <motion.div variants={boot} className="rounded-chip border border-line bg-white/70 p-3">
            <p className="mb-3 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-slate">
              Lead sources · last 30 days
            </p>
            <SourceDonut />
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

function applyMove(cols: Columns, move: { id: string; from: keyof Columns; to: keyof Columns }): Columns {
  const card = cols[move.from].find((d) => d.id === move.id)
  if (!card) return cols
  return {
    ...cols,
    [move.from]: cols[move.from].filter((d) => d.id !== move.id),
    [move.to]: [card, ...cols[move.to]],
  }
}
