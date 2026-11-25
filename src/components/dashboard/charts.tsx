'use client'

/**
 * Hand-built dashboard charts (SVG + CSS bars, no chart library).
 *
 * Each chart is a <section> with an h3, a visible one-sentence summary and a
 * visually hidden data table, so screen-reader users get the same numbers.
 * Bars animate via scaleX (transform only) and the trend line morphs its
 * path when a filter changes; reduced motion snaps to the final state. The
 * server render shows the real values (initial={false}), so nothing depends
 * on JavaScript to be readable.
 */

import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Inbox } from 'lucide-react'
import { PERIOD_LABEL, REPS, SOURCES, type DemoPeriod } from '@/demo/sample-data'
import { EASE } from '@/lib/motion'
import { cn } from '@/lib/utils'
import {
  money,
  pct,
  relativeDay,
  stateName,
  type Dashboard,
  type DashboardFilter,
  type TrendPoint,
} from './data'

const focusRing = 'focus-visible:outline-cyan'

function useTransition(duration = 0.6) {
  const reduce = useReducedMotion()
  return reduce ? { duration: 0 } : { duration, ease: EASE }
}

/* ─── Frame ────────────────────────────────────────────────────────────── */

export function Panel({
  title,
  summary,
  table,
  action,
  children,
  className,
}: {
  title: string
  summary: string
  table: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('flex min-w-0 flex-col rounded-chip border border-night-line bg-night/60 p-4', className)}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-display text-sm font-bold text-white">{title}</h3>
        {action}
      </div>
      <p className="mt-1 text-xs leading-relaxed text-white/70">{summary}</p>
      <div className="mt-4 flex-1">{children}</div>
      <div className="sr-only">{table}</div>
    </section>
  )
}

function Bar({
  value,
  className,
  origin = 'left',
}: {
  /** 0–1 */
  value: number
  className?: string
  origin?: 'left' | 'center'
}) {
  const transition = useTransition()
  return (
    <motion.div
      aria-hidden
      initial={false}
      animate={{ scaleX: Math.max(0, Math.min(1, value)) }}
      transition={transition}
      style={{ originX: origin === 'left' ? 0 : 0.5 }}
      className={cn('h-full w-full rounded-full', className)}
    />
  )
}

/* ─── Trend ────────────────────────────────────────────────────────────── */

const W = 600
const H = 200
const TOP = 12

/** Monotone cubic path (no overshoot below zero), same command count for n points. */
function monotone(pts: { x: number; y: number }[]) {
  const n = pts.length
  if (n === 0) return ''
  if (n === 1) return `M${pts[0].x},${pts[0].y}L${pts[0].x},${pts[0].y}`
  const m: number[] = []
  for (let i = 0; i < n - 1; i++) m.push((pts[i + 1].y - pts[i].y) / (pts[i + 1].x - pts[i].x))
  const t: number[] = [m[0]]
  for (let i = 1; i < n - 1; i++) {
    const a = m[i - 1]
    const b = m[i]
    t.push(a * b <= 0 ? 0 : (Math.sign(a) * Math.min(Math.abs(a), Math.abs(b), Math.abs((a + b) / 2))))
  }
  t.push(m[n - 2])
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`
  for (let i = 0; i < n - 1; i++) {
    const h = (pts[i + 1].x - pts[i].x) / 3
    d += `C${(pts[i].x + h).toFixed(1)},${(pts[i].y + t[i] * h).toFixed(1)} ${(pts[i + 1].x - h).toFixed(1)},${(
      pts[i + 1].y -
      t[i + 1] * h
    ).toFixed(1)} ${pts[i + 1].x.toFixed(1)},${pts[i + 1].y.toFixed(1)}`
  }
  return d
}

/** Round an axis maximum up to 1, 2 or 5 × a power of ten. */
function niceMax(v: number) {
  if (v <= 0) return 1
  const p = Math.pow(10, Math.floor(Math.log10(v)))
  const f = v / p
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p
}

type Metric = 'revenue' | 'leads'

export function TrendChart({
  trend,
  period,
  morph,
}: {
  trend: Dashboard['trend']
  period: DemoPeriod
  /** False until the visitor first changes a filter (no draw-in on load). */
  morph: boolean
}) {
  const [metric, setMetric] = useState<Metric>('revenue')
  const [hover, setHover] = useState<number | null>(null)
  const transition = useTransition(0.7)
  const reduce = useReducedMotion()
  const { points } = trend
  const n = points.length
  const vals = points.map((p) => p[metric])
  const max = niceMax(Math.max(...vals, 0))
  const fmt = (v: number) => (metric === 'revenue' ? money(v) : String(v))
  const xy = points.map((p, i) => ({
    x: n === 1 ? W / 2 : (i / (n - 1)) * W,
    y: H - (p[metric] / max) * (H - TOP),
  }))
  const line = monotone(xy)
  const area = `${line}L${W},${H}L0,${H}Z`
  const totalLeads = points.filter((p) => p.inPeriod).reduce((s, p) => s + p.leads, 0)
  const totalRev = points.filter((p) => p.inPeriod).reduce((s, p) => s + p.revenue, 0)
  const peak = points.reduce((best, p, i) => (p[metric] > points[best][metric] ? i : best), 0)
  const allZero = vals.every((v) => v === 0)
  const unit = trend.bucket === 'week' ? 'week' : 'day'

  const summary = allZero
    ? `No ${metric === 'revenue' ? 'won revenue' : 'leads'} ${trend.windowLabel}.`
    : `${totalLeads} leads and ${money(totalRev)} won revenue ${period === 'today' ? 'today' : PERIOD_LABEL[period].toLowerCase()}. Highest ${unit} for ${metric}: ${points[peak].longLabel} (${fmt(points[peak][metric])}).`

  // About five evenly spaced x labels.
  const step = Math.max(1, Math.ceil(n / 5))
  const xLabels = points.map((p, i) => ({ i, label: p.label })).filter(({ i }) => i % step === 0 || i === n - 1)
  const hp = hover == null ? null : points[hover]
  const hx = hover == null ? 0 : (xy[hover].x / W) * 100
  const drawKey = `${period}-${metric}`

  return (
    <Panel
      title={`Revenue & leads trend${period === 'today' ? ' · last 7 days' : ''}`}
      summary={summary}
      action={
        <div role="group" aria-label="Trend metric" className="flex rounded-[0.5rem] border border-night-line p-0.5">
          {(['revenue', 'leads'] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={metric === m}
              onClick={() => setMetric(m)}
              className={cn(
                'min-h-8 rounded-[0.375rem] px-2.5 text-xs font-semibold transition-colors duration-fast',
                focusRing,
                metric === m ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white',
              )}
            >
              {m === 'revenue' ? 'Revenue' : 'Leads'}
            </button>
          ))}
        </div>
      }
      table={
        <table>
          <caption>
            Leads and won revenue per {unit}, {trend.windowLabel}
          </caption>
          <thead>
            <tr>
              <th scope="col">{unit === 'week' ? 'Week' : 'Day'}</th>
              <th scope="col">Leads</th>
              <th scope="col">Won revenue</th>
            </tr>
          </thead>
          <tbody>
            {points.map((p) => (
              <tr key={p.longLabel}>
                <th scope="row">{p.longLabel}</th>
                <td>{p.leads}</td>
                <td>{money(p.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    >
      <div className="flex gap-2">
        <div aria-hidden className="flex h-40 w-11 shrink-0 flex-col justify-between pb-0 text-right font-mono text-[0.625rem] tabular-nums text-white/70 sm:h-48">
          <span>{fmt(max)}</span>
          <span>{fmt(max / 2)}</span>
          <span>0</span>
        </div>
        <div className="relative min-w-0 flex-1">
          <div aria-hidden className="pointer-events-none absolute inset-0 flex flex-col justify-between">
            <span className="h-px bg-night-line" />
            <span className="h-px bg-night-line" />
            <span className="h-px bg-white/20" />
          </div>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="relative block h-40 w-full overflow-visible sm:h-48"
            aria-hidden
            onPointerLeave={() => setHover(null)}
          >
            <defs>
              <linearGradient id="dash-trend-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            {period === 'today' ? (
              <rect x={W - W / 12} y={0} width={W / 12} height={H} className="fill-white/5" />
            ) : null}
            <g className={metric === 'revenue' ? 'text-brand-hi' : 'text-cyan'}>
              <motion.path
                key={`a-${drawKey}`}
                initial={morph && !reduce ? { opacity: 0, d: area } : false}
                animate={{ opacity: 1, d: area }}
                transition={transition}
                fill="url(#dash-trend-fill)"
              />
              <motion.path
                key={`l-${drawKey}`}
                initial={morph && !reduce ? { opacity: 0, d: line } : false}
                animate={{ opacity: 1, d: line }}
                transition={transition}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </g>
            {points.map((_, i) => (
              <rect
                key={i}
                x={n === 1 ? 0 : xy[i].x - W / (n - 1) / 2}
                y={0}
                width={n === 1 ? W : W / (n - 1)}
                height={H}
                fill="transparent"
                onPointerEnter={() => setHover(i)}
              />
            ))}
          </svg>
          {hp ? (
            <>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 w-px bg-white/30"
                style={{ left: `${hx}%` }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-night bg-white"
                style={{ left: `${hx}%`, top: `${(xy[hover!].y / H) * 100}%` }}
              />
              <div
                aria-hidden
                className={cn(
                  'pointer-events-none absolute top-0 z-10 whitespace-nowrap rounded-chip border border-night-line bg-night px-2.5 py-1.5 text-[0.6875rem] text-white shadow-float',
                  hx < 20 ? '' : hx > 80 ? '-translate-x-full' : '-translate-x-1/2',
                )}
                style={{ left: `${hx}%` }}
              >
                <p className="font-semibold">{hp.longLabel}</p>
                <p className="font-mono tabular-nums text-white/80">
                  {hp.leads} leads · {money(hp.revenue)}
                </p>
              </div>
            </>
          ) : null}
          <div aria-hidden className="relative mt-2 h-4 font-mono text-[0.625rem] text-white/70">
            {xLabels.map(({ i, label }) => {
              const left = n === 1 ? 50 : (i / (n - 1)) * 100
              return (
                <span
                  key={i}
                  className={cn(
                    'absolute top-0 whitespace-nowrap',
                    left === 0 ? '' : left === 100 ? '-translate-x-full' : '-translate-x-1/2',
                    // Drop crowded middle labels on very narrow screens.
                    i !== 0 && i !== n - 1 && 'hidden sm:inline',
                  )}
                  style={{ left: `${left}%` }}
                >
                  {label}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </Panel>
  )
}

/* ─── Funnel ───────────────────────────────────────────────────────────── */

export function FunnelChart({ funnel }: { funnel: Dashboard['funnel'] }) {
  const max = Math.max(1, ...funnel.map((s) => s.count))
  const open = funnel.filter((s) => s.id !== 'won')
  const won = funnel.find((s) => s.id === 'won')!
  const summary = `${open.reduce((s, x) => s + x.count, 0)} open: ${open
    .map((s) => `${s.label} ${s.count}`)
    .join(', ')}. ${won.count} won.`

  return (
    <Panel
      title="Sales funnel"
      summary={summary}
      table={
        <table>
          <caption>Leads by pipeline stage</caption>
          <thead>
            <tr>
              <th scope="col">Stage</th>
              <th scope="col">Leads</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            {funnel.map((s) => (
              <tr key={s.id}>
                <th scope="row">{s.label}</th>
                <td>{s.count}</td>
                <td>{money(s.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    >
      <ol className="space-y-2.5" aria-hidden>
        {funnel.map((s) => (
          <li key={s.id}>
            <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
              <span className="text-white/80">
                {s.label}
                {s.id !== 'won' ? <span className="ml-1.5 font-mono text-[0.625rem] text-white/70">{s.probability}%</span> : null}
              </span>
              <span className="font-mono tabular-nums text-white">
                {s.count} <span className="text-white/70">· {money(s.value)}</span>
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-white/5">
              <Bar value={s.count / max} origin="center" className={s.id === 'won' ? 'bg-won' : 'bg-brand-hi'} />
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  )
}

/* ─── Source performance ──────────────────────────────────────────────── */

export function SourceChart({ sources, selected }: { sources: Dashboard['sources']; selected: DashboardFilter['source'] }) {
  const max = Math.max(1, ...sources.map((s) => s.leads))
  const top = sources.reduce((a, b) => (b.leads > a.leads ? b : a))
  const decided = sources.filter((s) => s.decided > 0)
  const best = decided.length ? decided.reduce((a, b) => (b.conversion > a.conversion ? b : a)) : null
  const summary = top.leads
    ? `Most leads: ${top.fullName} (${top.leads}).${best ? ` Best conversion: ${best.fullName} at ${pct(best.conversion)}.` : ' No leads decided yet.'}${selected ? ' Selected source highlighted.' : ''}`
    : 'No leads from any source for these filters.'

  return (
    <Panel
      title="Lead source performance"
      summary={summary}
      table={
        <table>
          <caption>Leads and conversion by source</caption>
          <thead>
            <tr>
              <th scope="col">Source</th>
              <th scope="col">Leads</th>
              <th scope="col">Won</th>
              <th scope="col">Conversion (won ÷ decided)</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((s) => (
              <tr key={s.id}>
                <th scope="row">{s.fullName}</th>
                <td>{s.leads}</td>
                <td>{s.won}</td>
                <td>{s.decided ? pct(s.conversion) : 'none decided'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    >
      <div aria-hidden>
        <div className="mb-2 grid grid-cols-[4.5rem_1fr_3rem] gap-2 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-white/70">
          <span>Source</span>
          <span>Leads</span>
          <span className="text-right">Conv.</span>
        </div>
        <ul className="space-y-2">
          {sources.map((s) => {
            const dim = selected && selected !== s.id
            return (
              <li
                key={s.id}
                className={cn('grid grid-cols-[4.5rem_1fr_3rem] items-center gap-2 text-xs transition-opacity duration-base', dim && 'opacity-45')}
              >
                <span className="truncate text-white/80">{s.name}</span>
                <span className="flex items-center gap-2">
                  <span className="h-2 flex-1 rounded-full bg-white/5">
                    <Bar value={s.leads / max} className={selected === s.id ? 'bg-cyan' : 'bg-brand-hi'} />
                  </span>
                  <span className="w-7 text-right font-mono tabular-nums text-white">{s.leads}</span>
                </span>
                <span className="text-right font-mono tabular-nums text-white">{s.decided ? pct(s.conversion) : '—'}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </Panel>
  )
}

/* ─── Salesperson performance ─────────────────────────────────────────── */

export function RepChart({ reps, selected }: { reps: Dashboard['reps']; selected: string }) {
  const max = Math.max(1, ...reps.map((r) => r.revenue))
  const top = reps.reduce((a, b) => (b.revenue > a.revenue ? b : a))
  const summary = top.revenue
    ? `Highest won revenue: ${top.name} (${money(top.revenue)}, ${top.won} deal${top.won === 1 ? '' : 's'}).${selected ? ' Selected salesperson highlighted.' : ''}`
    : 'No deals won by anyone for these filters yet.'

  return (
    <Panel
      title="Salesperson performance"
      summary={summary}
      table={
        <table>
          <caption>Won revenue by salesperson</caption>
          <thead>
            <tr>
              <th scope="col">Salesperson</th>
              <th scope="col">Won revenue</th>
              <th scope="col">Deals won</th>
              <th scope="col">Leads</th>
            </tr>
          </thead>
          <tbody>
            {reps.map((r) => (
              <tr key={r.id}>
                <th scope="row">{r.name}</th>
                <td>{money(r.revenue)}</td>
                <td>{r.won}</td>
                <td>{r.leads}</td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    >
      <ul className="space-y-3.5" aria-hidden>
        {reps.map((r) => {
          const dim = selected && selected !== r.id
          return (
            <li key={r.id} className={cn('flex items-center gap-3 transition-opacity duration-base', dim && 'opacity-45')}>
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-[0.625rem] font-semibold',
                  selected === r.id ? 'bg-cyan text-night' : 'bg-white/10 text-white',
                )}
              >
                {r.initials}
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
                  <span className="truncate text-white/80">{r.name}</span>
                  <span className="shrink-0 font-mono tabular-nums text-white">{money(r.revenue)}</span>
                </div>
                <div className="h-2 rounded-full bg-white/5">
                  <Bar value={r.revenue / max} className={selected === r.id ? 'bg-cyan' : 'bg-won'} />
                </div>
                <p className="mt-1 font-mono text-[0.625rem] tabular-nums text-white/70">
                  {r.won} won · {r.leads} leads · {r.decided ? pct(r.conversion) : '—'} conv.
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </Panel>
  )
}

/* ─── Recent activity ─────────────────────────────────────────────────── */

const STAGE_LABEL: Record<string, string> = {
  new: 'New lead',
  qualified: 'Qualified',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
}

export function RecentActivity({ recent, total }: { recent: Dashboard['recent']; total: number }) {
  const reduce = useReducedMotion()
  return (
    <Panel
      title="Recent activity"
      summary={`Latest ${recent.length} of ${total} lead${total === 1 ? '' : 's'} in view, newest first.`}
      table={null}
    >
      <ul className="divide-y divide-night-line">
        <AnimatePresence initial={false} mode="popLayout">
          {recent.map((l) => {
            const src = SOURCES.find((s) => s.id === l.source)
            const rep = REPS.find((r) => r.id === l.repId)
            return (
              <motion.li
                key={l.id}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="flex items-start gap-2.5 py-2.5 first:pt-0 last:pb-0"
              >
                <span
                  aria-hidden
                  className={cn(
                    'mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full',
                    l.status === 'won' ? 'bg-won' : l.status === 'lost' ? 'bg-white/30' : 'bg-brand-hi',
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-baseline gap-x-2 text-xs text-white">
                    <span className="font-semibold">
                      {l.status === 'won' ? 'Deal won' : l.status === 'lost' ? 'Marked lost' : STAGE_LABEL[l.stage]}
                    </span>
                    <span className="font-mono tabular-nums text-white/80">{money(l.value)}</span>
                  </p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[0.6875rem] text-white/70">
                    <span className="rounded-full border border-night-line px-1.5 py-px font-medium text-white/80">{src?.short}</span>
                    <span>{rep?.name}</span>
                    <span aria-hidden>·</span>
                    <span>{stateName(l.state)}</span>
                  </p>
                </div>
                <span className="shrink-0 font-mono text-[0.625rem] text-white/70">
                  <span className="sr-only">{l.id}, </span>
                  {relativeDay(l.daysAgo)}
                </span>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </ul>
    </Panel>
  )
}

/* ─── Empty state ─────────────────────────────────────────────────────── */

export function EmptyState({
  description,
  onWiden,
  onReset,
}: {
  description: string
  onWiden?: () => void
  onReset: () => void
}) {
  return (
    <div className="flex flex-col items-center rounded-chip border border-dashed border-night-line bg-night/40 px-6 py-12 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5">
        <Inbox className="h-5 w-5 text-white/70" aria-hidden />
      </span>
      <h3 className="mt-4 font-display text-base font-bold text-white">No leads match {description}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-white/70">
        Nothing came in for this combination. Widen the period or clear a filter to see the charts again.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {onWiden ? (
          <button
            type="button"
            onClick={onWiden}
            className={cn('min-h-10 rounded-chip bg-white px-4 text-sm font-semibold text-night hover:bg-white/90', focusRing)}
          >
            Show this quarter
          </button>
        ) : null}
        <button
          type="button"
          onClick={onReset}
          className={cn('min-h-10 rounded-chip border border-night-line px-4 text-sm font-semibold text-white hover:bg-white/10', focusRing)}
        >
          Clear filters
        </button>
      </div>
    </div>
  )
}
