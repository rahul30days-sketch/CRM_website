'use client'

/**
 * Miniature product previews for the feature bento — one per module.
 *
 * Each preview is a pure function of `step` (a counter the card advances while
 * it is on screen) so it shows a state changing: a lead arriving, a deal moving
 * a column, a total recalculating. With `still` set (reduced motion) every
 * preview renders its most informative final state with no transitions.
 *
 * Previews are decorative duplicates of what the card's text already says, so
 * the card hides them from assistive tech (aria-hidden on the wrapper). All
 * names and figures come from src/demo/sample-data.ts; the section shows the
 * SampleBadge once for the whole grid.
 */

import { AnimatePresence, motion } from 'framer-motion'
import {
  Check,
  CheckCheck,
  FileText,
  Image as ImageIcon,
  LayoutTemplate,
  MessageSquareText,
  Paperclip,
  Bell,
  Bot,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { EASE } from '@/lib/motion'
import { computeQuote, formatINR, formatINRCompact } from '@/lib/gst'
import {
  DEALS,
  DEMO_LEADS,
  DEMO_TODAY,
  JOURNEY_CUSTOMER,
  JOURNEY_QUOTE_LINES,
  JOURNEY_QUOTE_NUMBER,
  REPS,
  SAMPLE_ENQUIRIES,
  SELLER,
  SOURCES,
  WHATSAPP_SCRIPT,
  WORKFLOWS,
  dailySeries,
  filterLeads,
  groupBy,
  repById,
  sourceById,
  summarize,
  type SourceId,
} from '@/demo/sample-data'

export interface PreviewProps {
  step: number
  still: boolean
}

const tr = (still: boolean, duration = 0.45) => (still ? { duration: 0 } : { duration, ease: EASE })
const mod = (n: number, m: number) => ((n % m) + m) % m
const SELLERS = REPS.filter((r) => r.id !== 'vikram')
const initialsOf = (name: string) =>
  name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)

function Avatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <span
      className={cn(
        'grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sky font-mono text-[9px] font-semibold text-brand',
        className,
      )}
    >
      {initials}
    </span>
  )
}

/* ─── Dashboard ─────────────────────────────────────────────────────────── */

const MONTH = summarize(filterLeads(DEMO_LEADS, { period: 'month' }))
const SERIES = dailySeries(DEMO_LEADS, 14)
const SERIES_MAX = Math.max(...SERIES.map((d) => d.leads), 1)
const BY_SOURCE = groupBy(filterLeads(DEMO_LEADS, { period: 'month' }), (l) => l.source)
  .sort((a, b) => b.leads - a.leads)
  .slice(0, 4)
const SOURCE_MAX = Math.max(...BY_SOURCE.map((s) => s.leads), 1)
const SPARK_W = 280
const SPARK_H = 64
const sparkX = (i: number) => (i / (SERIES.length - 1)) * SPARK_W
const sparkY = (v: number) => SPARK_H - 6 - (v / SERIES_MAX) * (SPARK_H - 14)
const SPARK_PATH = SERIES.map((d, i) => `${i ? 'L' : 'M'}${sparkX(i).toFixed(1)},${sparkY(d.leads).toFixed(1)}`).join(' ')
const SPARK_AREA = `${SPARK_PATH} L${SPARK_W},${SPARK_H} L0,${SPARK_H} Z`

export function DashboardPreview({ step, still }: PreviewProps) {
  const i = still ? SERIES.length - 1 : mod(step, SERIES.length)
  const day = SERIES[i]
  const src = still ? 0 : mod(step, BY_SOURCE.length)
  const kpis = [
    { label: 'Revenue · month', value: formatINRCompact(MONTH.revenue) },
    { label: 'Open leads', value: String(MONTH.open) },
    { label: 'Conversion', value: `${MONTH.conversion}%` },
  ]
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-chip border border-line bg-sky px-2.5 py-2">
            <p className="truncate text-[10px] text-slate">{k.label}</p>
            <p className="mt-0.5 font-mono text-base font-semibold text-ink sm:text-lg">{k.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-chip border border-line bg-sky p-3">
        <div className="flex items-baseline justify-between text-[10px]">
          <span className="text-slate">New leads · last 14 days</span>
          <span className="font-mono text-ink">
            {day.leads} · {day.daysAgo === 0 ? 'today' : `${day.daysAgo}d ago`}
          </span>
        </div>
        <svg viewBox={`0 0 ${SPARK_W} ${SPARK_H}`} className="mt-2 h-16 w-full" preserveAspectRatio="none">
          <path d={SPARK_AREA} className="fill-cyan/10" />
          <path d={SPARK_PATH} className="fill-none stroke-brand" strokeWidth={1.75} vectorEffect="non-scaling-stroke" />
          <motion.g initial={false} animate={{ x: sparkX(i), y: sparkY(day.leads) }} transition={tr(still, 0.6)}>
            <line x1={0} x2={0} y1={-SPARK_H} y2={SPARK_H} className="stroke-white/20" strokeWidth={1} vectorEffect="non-scaling-stroke" />
            <circle r={3.5} className="fill-cyan" />
          </motion.g>
        </svg>
      </div>
      <div className="hidden space-y-1.5 sm:block">
        {BY_SOURCE.map((s, idx) => (
          <div key={s.key} className="flex items-center gap-2 text-[10px]">
            <span className="w-16 shrink-0 truncate text-slate">{sourceById(s.key as SourceId).short}</span>
            <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/10">
              <motion.span
                className="absolute inset-0 origin-left rounded-full bg-brand-hi"
                style={{ scaleX: s.leads / SOURCE_MAX }}
                initial={false}
                animate={{ opacity: idx === src ? 1 : 0.55 }}
                transition={tr(still)}
              />
            </span>
            <span className="w-7 text-right font-mono text-ink">{s.leads}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Leads ─────────────────────────────────────────────────────────────── */

const ENQUIRIES = (Object.keys(SAMPLE_ENQUIRIES) as SourceId[]).map((id) => ({ id, ...SAMPLE_ENQUIRIES[id] }))

export function LeadsPreview({ step, still }: PreviewProps) {
  const head = still ? 2 : step + 2
  const rows = [0, 1, 2].map((k) => {
    const abs = head - k
    return { abs, lead: ENQUIRIES[mod(abs, ENQUIRIES.length)], rep: SELLERS[mod(abs, SELLERS.length)] }
  })
  return (
    <ul className="space-y-1.5">
      <AnimatePresence initial={false} mode="popLayout">
        {rows.map(({ abs, lead, rep }, k) => (
          <motion.li
            key={abs}
            layout={!still}
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={tr(still)}
            className="flex items-center gap-2 rounded-chip border border-line bg-white px-2.5 py-1.5"
          >
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5">
                <span className="truncate text-[11px] font-semibold text-ink">{lead.name}</span>
                {k === 0 ? <span className="rounded-full bg-won/10 px-1.5 text-[9px] font-semibold text-won">New</span> : null}
              </span>
              <span className="block truncate text-[10px] text-slate">
                {sourceById(lead.id).short} · {lead.city}
              </span>
            </span>
            <span className="flex items-center gap-1 text-[10px] text-slate">
              <span className="hidden sm:inline">→</span>
              <Avatar initials={rep.initials} />
            </span>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  )
}

/* ─── Deals pipeline ────────────────────────────────────────────────────── */

const PIPE_COLS = [
  { id: 'qualified', label: 'Qualified' },
  { id: 'proposal', label: 'Proposal' },
  { id: 'negotiation', label: 'Negotiation' },
] as const
const MOVER = DEALS.find((d) => d.id === 'deal-verma') ?? DEALS[0]
const PIPE_FIXED = DEALS.filter((d) => d.id !== MOVER.id && PIPE_COLS.some((c) => c.id === d.stage)).slice(0, 3)

export function PipelinePreview({ step, still, uid }: PreviewProps & { uid: string }) {
  const moverCol = still ? 2 : mod(step, PIPE_COLS.length)
  return (
    <div className="grid h-full grid-cols-3 gap-1.5">
      {PIPE_COLS.map((col, ci) => {
        const deals = PIPE_FIXED.filter((d) => d.stage === col.id)
        const all = ci === moverCol ? [MOVER, ...deals] : deals
        const total = all.reduce((s, d) => s + d.value, 0)
        return (
          <div key={col.id} className="flex min-w-0 flex-col gap-1 rounded-chip bg-mist p-1.5">
            <div className="flex items-baseline justify-between gap-1 px-0.5">
              <span className="truncate text-[9px] font-semibold uppercase tracking-wide text-slate">{col.label}</span>
              <span className="font-mono text-[9px] text-ink">{formatINRCompact(total)}</span>
            </div>
            {all.map((d) => (
              <motion.div
                key={d.id}
                layoutId={`${uid}-${d.id}`}
                layout={!still}
                transition={tr(still, 0.55)}
                className={cn(
                  'rounded-[8px] border bg-white px-1.5 py-1',
                  d.id === MOVER.id ? 'border-brand/50 shadow-soft' : 'border-line',
                )}
              >
                <p className="truncate text-[10px] font-semibold text-ink">{d.company}</p>
                <p className="font-mono text-[9px] text-slate">{formatINRCompact(d.value)}</p>
              </motion.div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

/* ─── Contacts & segments ───────────────────────────────────────────────── */

const SEGMENTS = [
  { label: 'All contacts', count: DEMO_LEADS.length },
  { label: 'IndiaMART', count: DEMO_LEADS.filter((l) => l.source === 'indiamart').length },
  { label: 'Customers', count: DEMO_LEADS.filter((l) => l.status === 'won').length },
  { label: 'Maharashtra', count: DEMO_LEADS.filter((l) => l.state === 'MH').length },
]
const CONTACT_FACES = DEALS.slice(0, 5).map((d) => initialsOf(d.contact))

export function ContactsPreview({ step, still }: PreviewProps) {
  const active = still ? 1 : mod(step, SEGMENTS.length)
  const seg = SEGMENTS[active]
  return (
    <div className="flex h-full flex-col justify-between gap-3">
      <div className="flex flex-wrap gap-1.5">
        {SEGMENTS.map((s, i) => (
          <span
            key={s.label}
            className={cn(
              'rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-colors duration-base',
              i === active ? 'border-brand bg-brand text-white' : 'border-line bg-white text-slate',
            )}
          >
            {s.label}
          </span>
        ))}
      </div>
      <div className="flex items-end justify-between gap-2">
        <div>
          <AnimatePresence initial={false} mode="popLayout">
            <motion.p
              key={seg.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={tr(still)}
              className="font-mono text-2xl font-semibold text-ink"
            >
              {seg.count}
            </motion.p>
          </AnimatePresence>
          <p className="text-[10px] text-slate">in segment</p>
        </div>
        <div className="flex -space-x-1.5">
          {CONTACT_FACES.map((f, i) => (
            <Avatar key={i} initials={f} className="border-2 border-white" />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Ticketing ─────────────────────────────────────────────────────────── */

const TICKET_STATES = ['Open', 'In progress', 'Resolved'] as const

export function TicketingPreview({ step, still, uid }: PreviewProps & { uid: string }) {
  const s = still ? 2 : mod(step, TICKET_STATES.length)
  const owner = repById('neha')
  return (
    <div className="flex h-full flex-col justify-between gap-3">
      <div className="rounded-chip border border-line bg-white p-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] text-slate">AMC · Desai Textiles</span>
          <span
            className={cn(
              'rounded-full px-1.5 py-0.5 text-[9px] font-semibold',
              s === 2 ? 'bg-won/10 text-won' : 'bg-sky text-brand',
            )}
          >
            {s === 2 ? 'Within SLA' : 'SLA timer running'}
          </span>
        </div>
        <p className="mt-1 truncate text-[11px] font-semibold text-ink">Machine 7 not starting after service</p>
        <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-slate">
          <Avatar initials={owner.initials} className="h-5 w-5" /> {owner.name}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-1 rounded-full bg-mist p-1">
        {TICKET_STATES.map((label, i) => (
          <span key={label} className="relative grid place-items-center py-1 text-[10px] font-semibold">
            {i === s ? (
              <motion.span
                layoutId={`${uid}-ticket`}
                layout={!still}
                transition={tr(still, 0.5)}
                className={cn('absolute inset-0 rounded-full', s === 2 ? 'bg-won' : 'bg-brand')}
              />
            ) : null}
            <span className={cn('relative', i === s ? 'text-white' : 'text-slate')}>{label}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ─── Email campaigns ───────────────────────────────────────────────────── */

const EMAIL_LEVELS = ['Delivered', 'Opened', 'Clicked'] as const
const EMAIL_ROWS = [
  { name: SAMPLE_ENQUIRIES.justdial.name, target: 2 },
  { name: SAMPLE_ENQUIRIES.google.name, target: 1 },
  { name: SAMPLE_ENQUIRIES.website.name, target: 2 },
  { name: 'Sanjay Verma', target: 0 },
]

export function EmailPreview({ step, still }: PreviewProps) {
  const phase = still ? 2 : mod(step, 4)
  const levels = EMAIL_ROWS.map((r) => Math.min(r.target, phase))
  const tally = EMAIL_LEVELS.map((_, li) => levels.filter((l) => l >= li).length)
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="grid grid-cols-3 gap-1.5">
        {EMAIL_LEVELS.map((l, i) => (
          <div key={l} className="rounded-chip bg-mist px-2 py-1.5">
            <p className="text-[9px] text-slate">{l}</p>
            <p className="font-mono text-sm font-semibold text-ink">{tally[i]}</p>
          </div>
        ))}
      </div>
      <ul className="space-y-1">
        {EMAIL_ROWS.map((r, i) => (
          <li key={r.name} className="flex items-center justify-between gap-2 text-[10px]">
            <span className="truncate text-ink">{r.name}</span>
            <motion.span
              key={levels[i]}
              initial={still ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={tr(still, 0.3)}
              className={cn(
                'rounded-full px-1.5 py-0.5 font-semibold',
                levels[i] === 2 ? 'bg-won/10 text-won' : levels[i] === 1 ? 'bg-sky text-brand' : 'bg-mist text-slate',
              )}
            >
              {EMAIL_LEVELS[levels[i]]}
            </motion.span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ─── SMS campaigns ─────────────────────────────────────────────────────── */

const SMS_TO = [SAMPLE_ENQUIRIES.indiamart.name, SAMPLE_ENQUIRIES.whatsapp.name, SAMPLE_ENQUIRIES.facebook.name]

export function SmsPreview({ step, still }: PreviewProps) {
  const phase = still ? 6 : mod(step, 7)
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="rounded-chip border border-line bg-white p-2">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[9px] text-slate">Header · SMPUMP</span>
          <span className="rounded-full bg-won/10 px-1.5 py-0.5 text-[9px] font-semibold text-won">DLT template</span>
        </div>
        <p className="mt-1 text-[10px] leading-snug text-ink">
          Dear <span className="rounded bg-sky px-0.5 font-mono text-brand">{'{#var#}'}</span>, your order is dispatched.
          – {SELLER.name.split(' ')[0]} Pumps
        </p>
      </div>
      <ul className="space-y-1">
        {SMS_TO.map((name, i) => {
          const state = phase >= i * 2 + 2 ? 2 : phase >= i * 2 + 1 ? 1 : 0
          return (
            <li key={name} className="flex items-center justify-between text-[10px]">
              <span className="truncate text-ink">{name}</span>
              <span className={cn('flex items-center gap-1', state === 2 ? 'text-won' : 'text-slate')}>
                {state === 2 ? <CheckCheck className="h-3.5 w-3.5" /> : state === 1 ? <Check className="h-3.5 w-3.5" /> : null}
                {state === 2 ? 'Delivered' : state === 1 ? 'Sent' : 'Queued'}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* ─── WhatsApp ──────────────────────────────────────────────────────────── */

const WA = WHATSAPP_SCRIPT.filter((m) => m.from !== 'system').slice(0, 5)

export function WhatsAppPreview({ step, still }: PreviewProps) {
  const count = still ? WA.length : 1 + mod(step, WA.length)
  const rep = repById(JOURNEY_CUSTOMER.repId)
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-chip border border-line bg-mist">
      <div className="flex items-center gap-2 border-b border-line bg-white px-3 py-2">
        <Avatar initials={initialsOf(JOURNEY_CUSTOMER.name)} className="bg-won/10 text-won" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-semibold text-ink">{JOURNEY_CUSTOMER.name}</p>
          <p className="truncate text-[10px] text-slate">IndiaMART lead · assigned to {rep.name}</p>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-end gap-1.5 overflow-hidden p-2.5">
        <AnimatePresence initial={false}>
          {WA.slice(0, count).map((m) => (
            <motion.div
              key={m.id}
              layout={!still}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={tr(still, 0.4)}
              className={cn(
                'max-w-[85%] shrink-0 rounded-xl px-2.5 py-1.5 text-[11px] leading-snug text-ink',
                m.from === 'agent' ? 'ml-auto rounded-tr-sm bg-won/15' : 'rounded-tl-sm bg-white',
              )}
            >
              {m.template ? (
                <span className="mb-0.5 block text-[9px] font-semibold uppercase tracking-wide text-won">Approved template</span>
              ) : null}
              <span className="line-clamp-3">{m.text}</span>
              {m.attachment ? (
                <span className="mt-1 flex items-center gap-1.5 rounded-[8px] bg-white/80 px-2 py-1 text-[10px] text-slate">
                  <Paperclip className="h-3 w-3 shrink-0" />
                  <span className="truncate">{m.attachment.title}</span>
                </span>
              ) : null}
              <span className="mt-0.5 block text-right font-mono text-[9px] text-slate">{m.time}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ─── Lead integrations ─────────────────────────────────────────────────── */

export function IntegrationsPreview({ step, still }: PreviewProps) {
  const i = still ? 0 : mod(step, SOURCES.length)
  const src = SOURCES[i]
  const lead = SAMPLE_ENQUIRIES[src.id]
  return (
    <div className="flex h-full flex-col gap-2.5">
      <div className="flex flex-wrap gap-1.5">
        {SOURCES.map((s, si) => (
          <span
            key={s.id}
            className={cn(
              'rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-colors duration-base',
              si === i ? 'border-brand bg-brand text-white' : 'border-line bg-white text-slate',
            )}
          >
            {s.short}
          </span>
        ))}
      </div>
      <div className="relative h-1 overflow-hidden rounded-full bg-mist">
        <motion.span
          key={step}
          className="absolute inset-0 origin-left rounded-full bg-brand"
          initial={still ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={tr(still, 0.9)}
        />
      </div>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={src.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={tr(still)}
          className="rounded-chip border border-line bg-white px-2.5 py-1.5"
        >
          <p className="truncate text-[11px] font-semibold text-ink">
            {lead.name} <span className="font-normal text-slate">· {lead.city}</span>
          </p>
          <p className="truncate text-[10px] text-slate">Source stamped: {src.name}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ─── Quotations ────────────────────────────────────────────────────────── */

const QUOTE_QTY = [2, 3, 4]
const QUOTES = QUOTE_QTY.map((q) =>
  computeQuote(
    JOURNEY_QUOTE_LINES.map((l) => (l.id === 'install' ? l : { ...l, qty: q })),
    { sellerState: SELLER.state, placeOfSupply: JOURNEY_CUSTOMER.state },
  ),
)

export function QuotationsPreview({ step, still }: PreviewProps) {
  const v = still ? QUOTE_QTY.length - 1 : mod(step, QUOTE_QTY.length)
  const q = QUOTES[v]
  return (
    <div className="flex h-full flex-col rounded-chip border border-line bg-white p-2.5 text-[10px]">
      <div className="flex items-center justify-between">
        {/* A draft being edited — not QT-2026-0418, which is the final ₹2,11,338 quote elsewhere. */}
        <span className="font-mono text-slate">Draft quote</span>
        <span className="rounded-full bg-sky px-1.5 font-mono font-semibold text-brand">edit {v + 1}</span>
      </div>
      <div className="mt-1.5 flex justify-between gap-2">
        <span className="truncate text-slate">Pump 7.5 HP × {QUOTE_QTY[v]}</span>
        <span className="font-mono text-ink">{formatINR(q.lines[0].taxable)}</span>
      </div>
      <div className="flex justify-between gap-2">
        <span className="text-slate">CGST + SGST</span>
        <span className="font-mono text-ink">{formatINR(q.taxTotal)}</span>
      </div>
      <div className="mt-auto flex items-baseline justify-between border-t border-line pt-1.5">
        <span className="font-semibold text-ink">Total</span>
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={q.grandTotal}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={tr(still)}
            className="font-mono text-sm font-semibold text-ink"
          >
            {formatINR(q.grandTotal)}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ─── Automations ───────────────────────────────────────────────────────── */

const FLOW = WORKFLOWS[0]

export function AutomationsPreview({ step, still }: PreviewProps) {
  const a = still ? FLOW.nodes.length - 1 : mod(step, FLOW.nodes.length)
  return (
    <ol className="relative space-y-1">
      <span aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-line" />
      {FLOW.nodes.map((n, i) => {
        const done = still || i <= a
        return (
          <li key={n.id} className="relative flex items-center gap-2 text-[10px]">
            <span className="relative grid h-[15px] w-[15px] shrink-0 place-items-center">
              {i === a && !still ? (
                <motion.span
                  key={step}
                  className="absolute inset-0 rounded-full bg-brand/30"
                  initial={{ scale: 0.6, opacity: 1 }}
                  animate={{ scale: 1.9, opacity: 0 }}
                  transition={{ duration: 1.1, ease: EASE }}
                />
              ) : null}
              <span
                className={cn(
                  'relative h-2.5 w-2.5 rounded-full border-2 transition-colors duration-base',
                  done ? 'border-brand bg-brand' : 'border-line bg-white',
                )}
              />
            </span>
            <span className={cn('truncate', i === a ? 'font-semibold text-ink' : 'text-slate')}>{n.title}</span>
            {n.kind === 'trigger' ? (
              <span className="rounded-full bg-sky px-1.5 text-[9px] font-semibold text-brand">Trigger</span>
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}

/* ─── AI chatbot ────────────────────────────────────────────────────────── */

const BOT_LEAD = SAMPLE_ENQUIRIES.google
const BOT_SCRIPT: { from: 'visitor' | 'bot' | 'system'; text: string }[] = [
  { from: 'visitor', text: 'Do you supply booster pumps for hotels?' },
  { from: 'bot', text: 'Yes. Which city is the property in, and how many rooms?' },
  { from: 'visitor', text: `${BOT_LEAD.city}, 40 rooms.` },
  { from: 'bot', text: 'Thanks. Share your number and our team will call you.' },
  { from: 'system', text: `Lead created · ${BOT_LEAD.name} · assigned to ${repById('arjun').name}` },
]

export function ChatbotPreview({ step, still }: PreviewProps) {
  const count = still ? BOT_SCRIPT.length : 1 + mod(step, BOT_SCRIPT.length)
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-chip border border-line bg-white">
      <div className="flex items-center gap-1.5 border-b border-line bg-sky/60 px-2.5 py-1.5 text-[10px] font-semibold text-ink">
        <Bot className="h-3.5 w-3.5 text-brand" /> Website chat
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-end gap-1 overflow-hidden p-2">
        <AnimatePresence initial={false}>
          {BOT_SCRIPT.slice(0, count).map((m, i) => (
            <motion.p
              key={i}
              layout={!still}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={tr(still, 0.35)}
              className={cn(
                'shrink-0 rounded-lg px-2 py-1 text-[10px] leading-snug',
                m.from === 'visitor' && 'ml-auto max-w-[80%] bg-brand text-white',
                m.from === 'bot' && 'max-w-[85%] bg-mist text-ink',
                m.from === 'system' && 'mx-auto bg-won/10 text-center font-semibold text-won',
              )}
            >
              {m.text}
            </motion.p>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ─── Calendar ──────────────────────────────────────────────────────────── */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const TODAY_LABEL = (() => {
  const [y, m, d] = DEMO_TODAY.split('-').map(Number)
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay()
  return `${WEEKDAYS[wd]}, ${d} ${MONTHS[m - 1]}`
})()
const AGENDA = [
  { time: '10:30', kind: 'Call', who: SAMPLE_ENQUIRIES.indiamart.name, rep: 'priya' },
  { time: '12:00', kind: 'Site visit', who: SAMPLE_ENQUIRIES.facebook.company, rep: 'neha' },
  { time: '17:30', kind: 'Follow-up', who: SAMPLE_ENQUIRIES.website.name, rep: 'neha' },
]

export function CalendarPreview({ step, still }: PreviewProps) {
  const a = still ? 0 : mod(step, AGENDA.length)
  const item = AGENDA[a]
  return (
    <div className="flex h-full flex-col gap-1.5">
      <div className="flex items-center justify-between text-[10px]">
        <span className="font-semibold text-ink">{TODAY_LABEL}</span>
        <span className="text-slate">{AGENDA.length} activities</span>
      </div>
      <ul className="space-y-1">
        {AGENDA.map((e, i) => (
          <li
            key={e.time}
            className={cn(
              'flex items-center gap-2 rounded-[8px] border-l-2 px-2 py-0.5 text-[10px] transition-colors duration-base',
              i === a ? 'border-brand bg-sky' : 'border-line bg-white',
            )}
          >
            <span className="font-mono text-slate">{e.time}</span>
            <span className="truncate text-ink">
              {e.kind} · {e.who}
            </span>
          </li>
        ))}
      </ul>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.p
          key={a}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={tr(still)}
          className="mt-auto flex items-center gap-1.5 rounded-chip bg-ink px-2 py-1 text-[10px] text-white"
        >
          <Bell className="h-3 w-3 shrink-0" />
          <span className="truncate">
            Reminder for {repById(item.rep).name.split(' ')[0]}: {item.kind.toLowerCase()} at {item.time}
          </span>
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

/* ─── Media library ─────────────────────────────────────────────────────── */

const catalogue = WHATSAPP_SCRIPT.find((m) => m.attachment?.kind === 'catalogue')?.attachment?.title ?? 'Catalogue.pdf'
const FILES = [
  { name: catalogue, kind: 'PDF' },
  { name: `${JOURNEY_QUOTE_NUMBER}.pdf`, kind: 'PDF' },
  { name: 'Site photo.jpg', kind: 'JPG' },
  { name: 'Welcome template', kind: 'TPL' },
  { name: 'Install guide.pdf', kind: 'PDF' },
  { name: 'Panel wiring.png', kind: 'PNG' },
]

export function MediaPreview({ step, still }: PreviewProps) {
  const a = still ? 0 : mod(step, FILES.length)
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="grid grid-cols-3 gap-1.5">
        {FILES.map((f, i) => {
          const Icon = f.kind === 'TPL' ? LayoutTemplate : f.kind === 'PDF' ? FileText : ImageIcon
          return (
            <div
              key={f.name}
              className={cn(
                'flex aspect-[4/3] flex-col justify-between rounded-[8px] border p-1.5 transition-colors duration-base',
                i === a ? 'border-brand bg-sky' : 'border-line bg-mist',
              )}
            >
              <Icon className={cn('h-3.5 w-3.5', i === a ? 'text-brand' : 'text-slate')} />
              <span className="font-mono text-[8px] font-semibold text-slate">{f.kind}</span>
            </div>
          )
        })}
      </div>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.p
          key={a}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={tr(still)}
          className="flex items-center gap-1.5 truncate text-[10px] text-ink"
        >
          <Paperclip className="h-3 w-3 shrink-0 text-brand" />
          <span className="truncate">{FILES[a].name}</span>
          <span className="shrink-0 text-slate">→ chat</span>
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

/* ─── Fallback for modules without a bespoke preview ────────────────────── */

export function GenericPreview({ step, still }: PreviewProps) {
  const a = still ? 0 : mod(step, 3)
  return (
    <div className="space-y-1.5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'flex items-center gap-2 rounded-chip border px-2.5 py-2 transition-colors duration-base',
            i === a ? 'border-brand/40 bg-sky' : 'border-line bg-white',
          )}
        >
          <MessageSquareText className={cn('h-3.5 w-3.5', i === a ? 'text-brand' : 'text-slate')} />
          <span className="h-1.5 flex-1 rounded-full bg-line" />
          <span className="h-1.5 w-8 rounded-full bg-line" />
        </div>
      ))}
    </div>
  )
}
