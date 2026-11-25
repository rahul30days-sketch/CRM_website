'use client'

/**
 * The seven inner panels of the lifecycle AppWindow, one per stage. Each panel
 * plays a short in-panel sequence (fields populate, a status flips, a deal
 * card moves) when `play` is true. When `play` is false (reduced motion,
 * off-screen, no JS) the panel shows its final, fully informative state.
 *
 * All figures come from src/demo/sample-data; the parent renders SampleBadge.
 */

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { LayoutGroup, animate, motion, useMotionValue, useTransform } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  CalendarClock,
  Check,
  CheckCircle2,
  FileText,
  LifeBuoy,
  MessageCircle,
  Repeat2,
  Send,
  Wrench,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { EASE } from '@/lib/motion'
import { formatINR, formatINRCompact } from '@/lib/gst'
import {
  DEALS,
  JOURNEY_CUSTOMER,
  JOURNEY_QUOTE,
  JOURNEY_QUOTE_LINES,
  JOURNEY_QUOTE_NUMBER,
  PIPELINE_STAGES,
  REPS,
  SELLER,
  WHATSAPP_SCRIPT,
  sourceById,
} from '@/demo/sample-data'
import { Avatar } from '@/components/lifecycle/chaos-items'

export interface PanelProps {
  play: boolean
}

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

/**
 * Steps a panel through `count` phases, `stepMs` apart, while `play` is true.
 * Returns `count` (the final state) whenever playback is not allowed.
 */
function usePhases(count: number, play: boolean, stepMs = 520) {
  const [phase, setPhase] = useState(play ? 0 : count)
  const done = useRef(false)
  useIsoLayoutEffect(() => {
    if (!play) {
      setPhase(count)
      return
    }
    if (done.current) return
    setPhase(0)
    const timers = Array.from({ length: count }, (_, i) =>
      window.setTimeout(() => {
        setPhase(i + 1)
        if (i === count - 1) done.current = true
      }, stepMs * (i + 1)),
    )
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [play, count, stepMs])
  return phase
}

/** Fades/lifts its children in once `show` is true. */
function Show({ show, children, className, as = 'div' }: { show: boolean; children: ReactNode; className?: string; as?: 'div' | 'li' | 'tr' }) {
  const Tag = motion[as] as typeof motion.div
  return (
    <Tag
      initial={false}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 6 }}
      transition={{ duration: 0.35, ease: EASE }}
      className={className}
    >
      {children}
    </Tag>
  )
}

function Chip({ children, tone = 'brand', className }: { children: ReactNode; tone?: 'brand' | 'won' | 'due' | 'muted'; className?: string }) {
  const tones = {
    brand: 'bg-sky text-brand',
    won: 'bg-won/10 text-won',
    due: 'bg-due/10 text-due',
    muted: 'bg-mist text-slate',
  }
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold', tones[tone], className)}>
      {children}
    </span>
  )
}

const rep = REPS.find((r) => r.id === JOURNEY_CUSTOMER.repId) ?? REPS[0]
const manager = REPS.find((r) => r.role === 'Sales manager') ?? REPS[REPS.length - 1]
const source = sourceById(JOURNEY_CUSTOMER.source)
const approval = WHATSAPP_SCRIPT[WHATSAPP_SCRIPT.length - 1]

/* ─── 1 · Capture ───────────────────────────────────────────────────────── */

const LEAD_FIELDS: [string, string][] = [
  ['Contact', JOURNEY_CUSTOMER.name],
  ['Company', JOURNEY_CUSTOMER.company],
  ['City', `${JOURNEY_CUSTOMER.city}, ${JOURNEY_CUSTOMER.state}`],
  ['Phone', JOURNEY_CUSTOMER.phone],
  ['Requirement', JOURNEY_CUSTOMER.requirement],
  ['Received', `Today, ${JOURNEY_CUSTOMER.receivedAt}`],
]

export function CapturePanel({ play }: PanelProps) {
  const phase = usePhases(LEAD_FIELDS.length + 1, play, 380)
  return (
    <div className="grid h-full gap-3 p-4 sm:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] sm:gap-4 sm:p-5">
      <div className="rounded-chip border border-dashed border-line bg-mist p-3">
        <p className="flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-wide text-slate">
          {source.name} buy-lead
          <span className="font-mono font-medium normal-case">{JOURNEY_CUSTOMER.receivedAt}</span>
        </p>
        <p className="mt-2 text-xs leading-relaxed text-ink">
          &ldquo;{JOURNEY_CUSTOMER.requirement}. Contact {JOURNEY_CUSTOMER.name}, {JOURNEY_CUSTOMER.company},{' '}
          {JOURNEY_CUSTOMER.city}.&rdquo;
        </p>
        <p className="mt-3 hidden items-center gap-1.5 text-[11px] font-semibold text-brand sm:flex">
          Read into a lead <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </p>
      </div>

      <div className="rounded-chip border border-line bg-white p-3 shadow-soft">
        <div className="flex items-center justify-between gap-2 border-b border-line pb-2">
          <p className="text-sm font-bold text-ink">New lead</p>
          <div className="flex gap-1.5">
            <Chip>{source.short}</Chip>
            <Show show={phase >= LEAD_FIELDS.length + 1}>
              <Chip tone="won">Status: New</Chip>
            </Show>
          </div>
        </div>
        <dl className="mt-2 divide-y divide-line/70">
          {LEAD_FIELDS.map(([k, v], i) => (
            <div key={k} className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-2 py-1.5 text-xs">
              <dt className="text-slate">{k}</dt>
              <Show show={phase >= i + 1}>
                <dd className={cn('text-ink', k === 'Phone' || k === 'Received' ? 'font-mono' : 'font-medium')}>{v}</dd>
              </Show>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}

/* ─── 2 · Assign ────────────────────────────────────────────────────────── */

export function AssignPanel({ play }: PanelProps) {
  const sellers = REPS.filter((r) => r.role !== 'Sales manager')
  const phase = usePhases(3, play, 650)
  return (
    <div className="flex h-full flex-col gap-3 p-4 sm:p-5">
      <div className="rounded-chip border border-line bg-white p-3 shadow-soft">
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate">
          <Repeat2 className="h-3.5 w-3.5 text-brand" aria-hidden /> Rule: {source.short} leads · round-robin
        </p>
        <ul className="mt-3 grid grid-cols-3 gap-2">
          {sellers.map((r) => {
            const picked = r.id === rep.id && phase >= 1
            return (
              <li
                key={r.id}
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-chip border p-2 text-center transition-colors duration-base',
                  picked ? 'border-brand bg-sky' : 'border-line bg-white',
                )}
              >
                <Avatar initials={r.initials} className={cn('h-8 w-8 text-xs', !picked && 'bg-slate')} />
                <span className="text-[11px] font-semibold leading-tight text-ink">{r.name}</span>
                <span className={cn('text-[10px]', picked ? 'font-semibold text-brand' : 'text-slate')}>
                  {picked ? 'Next in turn' : 'In rotation'}
                </span>
              </li>
            )
          })}
        </ul>
      </div>

      <Show show={phase >= 2} className="rounded-chip border border-line bg-white p-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="min-w-0">
            <span className="block font-semibold text-ink">{JOURNEY_CUSTOMER.name}</span>
            <span className="block truncate text-slate">{JOURNEY_CUSTOMER.company}</span>
          </span>
          <span className="flex items-center gap-2">
            <Chip tone="won">Assigned</Chip>
            <Avatar initials={rep.initials} />
            <span className="font-medium text-ink">{rep.name}</span>
          </span>
        </div>
      </Show>

      <Show show={phase >= 3} className="mt-auto">
        <div className="flex items-start gap-3 rounded-chip bg-ink p-3 text-white shadow-float">
          <BellRing className="mt-0.5 h-4 w-4 shrink-0 text-cyan" aria-hidden />
          <div className="min-w-0 text-xs">
            <p className="font-semibold">New lead assigned to you</p>
            <p className="text-white/75">
              {JOURNEY_CUSTOMER.name} · {JOURNEY_CUSTOMER.company}
            </p>
            <p className="mt-1 flex items-center gap-1 font-mono text-[10px] text-white/75">
              <Check className="h-3 w-3" aria-hidden /> Delivered to {rep.name.split(' ')[0]} · simulated
            </p>
          </div>
        </div>
      </Show>
    </div>
  )
}

/* ─── 3 · Engage ────────────────────────────────────────────────────────── */

const CHAT = WHATSAPP_SCRIPT.filter((m) => ['m1', 'm2', 'm3', 'm4'].includes(m.id))

export function EngagePanel({ play }: PanelProps) {
  const phase = usePhases(CHAT.length, play, 600)
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-won/10 text-won">
            <MessageCircle className="h-4 w-4" aria-hidden />
          </span>
          <span className="min-w-0 text-xs">
            <span className="block truncate font-semibold text-ink">{JOURNEY_CUSTOMER.name}</span>
            <span className="block truncate text-slate">Shared inbox · WhatsApp</span>
          </span>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 text-[11px] text-slate">
          <Avatar initials={rep.initials} className="h-5 w-5 text-[9px]" />
          <span className="hidden sm:inline">{rep.name}</span>
        </span>
      </div>
      <ol className="flex flex-1 flex-col gap-2 overflow-hidden bg-mist/60 p-3 sm:p-4">
        {CHAT.map((m, i) => (
          <Show
            key={m.id}
            as="li"
            show={phase >= i + 1}
            className={cn(
              'max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-snug shadow-press',
              m.from === 'agent' ? 'ml-auto rounded-tr-sm bg-white text-ink' : 'rounded-tl-sm bg-won/10 text-ink',
            )}
          >
            {m.template ? <span className="mb-1 block text-[10px] font-semibold text-brand">Approved template</span> : null}
            {m.text}
            {m.attachment ? (
              <span className="mt-1.5 flex items-center gap-2 rounded-lg border border-line bg-mist px-2 py-1.5">
                <FileText className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden />
                <span className="min-w-0">
                  <span className="block truncate font-medium">{m.attachment.title}</span>
                  <span className="block text-[10px] text-slate">{m.attachment.meta}</span>
                </span>
              </span>
            ) : null}
            <span className="mt-0.5 block text-right font-mono text-[10px] text-slate">{m.time}</span>
          </Show>
        ))}
      </ol>
      <div className="flex items-center justify-between gap-2 border-t border-line px-4 py-2 text-[11px] text-slate">
        <span className="truncate">Visible to {manager.name} (manager)</span>
        <span className="shrink-0">Simulated, nothing is sent</span>
      </div>
    </div>
  )
}

/* ─── 4 · Follow up ─────────────────────────────────────────────────────── */

const TIMELINE: { time: string; text: string }[] = [
  { time: JOURNEY_CUSTOMER.receivedAt.replace(' AM', ''), text: `Lead captured from ${source.name}` },
  { time: WHATSAPP_SCRIPT[0].time, text: `Assigned to ${rep.name} · WhatsApp template sent` },
  { time: WHATSAPP_SCRIPT[2].time, text: 'Catalogue shared on WhatsApp' },
  { time: WHATSAPP_SCRIPT[3].time, text: 'Customer asked about panels and installation' },
]

export function FollowUpPanel({ play }: PanelProps) {
  const phase = usePhases(3, play, 800)
  const states = [
    { label: 'Scheduled', icon: CalendarClock },
    { label: 'Reminder sent', icon: BellRing },
    { label: 'Completed', icon: CheckCircle2 },
  ]
  return (
    <div className="grid h-full gap-3 p-4 sm:grid-cols-2 sm:gap-4 sm:p-5">
      <div className="rounded-chip border border-line bg-white p-3 shadow-soft">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate">Follow-up</p>
        <p className="mt-1 text-sm font-semibold text-ink">
          Call {JOURNEY_CUSTOMER.name.split(' ')[0]}: panels &amp; Nagpur installation
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate">
          <Avatar initials={rep.initials} className="h-5 w-5 text-[9px]" /> {rep.name}
        </p>
        <ol className="mt-3 space-y-2">
          {states.map((s, i) => {
            const on = phase >= i + 1
            const Icon = s.icon
            return (
              <li key={s.label} className="flex items-center gap-2 text-xs">
                <span
                  className={cn(
                    'grid h-6 w-6 place-items-center rounded-full border transition-colors duration-base',
                    on ? (i === 2 ? 'border-won bg-won text-white' : 'border-brand bg-brand text-white') : 'border-line bg-white text-slate',
                  )}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                </span>
                <span className={cn(on ? 'font-semibold text-ink' : 'text-slate')}>{s.label}</span>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="rounded-chip border border-line bg-white p-3">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate">Activity timeline</p>
        <ol className="relative mt-2 space-y-2 border-l border-line pl-3">
          {TIMELINE.map((t) => (
            <li key={t.text} className="text-xs">
              <span className="absolute -left-[3px] mt-1.5 h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
              <span className="font-mono text-[10px] text-slate">{t.time}</span>
              <p className="text-ink">{t.text}</p>
            </li>
          ))}
          <Show as="li" show={phase >= 3} className="text-xs">
            <span className="absolute -left-[3px] mt-1.5 h-1.5 w-1.5 rounded-full bg-won" aria-hidden />
            <span className="font-mono text-[10px] text-slate">Follow-up</span>
            <p className="font-semibold text-won">Call completed · quotation requested</p>
          </Show>
        </ol>
      </div>
    </div>
  )
}

/* ─── 5 · Quote ─────────────────────────────────────────────────────────── */

export function QuotePanel({ play }: PanelProps) {
  const phase = usePhases(JOURNEY_QUOTE_LINES.length + 2, play, 450)
  const linesShown = phase
  const totalsShown = phase >= JOURNEY_QUOTE_LINES.length + 1
  const approved = phase >= JOURNEY_QUOTE_LINES.length + 2
  const half = JOURNEY_QUOTE_LINES[0].gstRate / 2
  return (
    <div className="flex h-full flex-col p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-2">
        <div>
          <p className="text-sm font-bold text-ink">Quotation {JOURNEY_QUOTE_NUMBER}</p>
          <p className="text-[11px] text-slate">
            {SELLER.state} → {JOURNEY_CUSTOMER.state} · intra-state
          </p>
        </div>
        {approved ? (
          <Chip tone="won">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden /> Approved digitally · {approval.time}
          </Chip>
        ) : (
          <Chip>
            <Send className="h-3 w-3" aria-hidden /> Sent · awaiting approval
          </Chip>
        )}
      </div>

      <table className="mt-2 w-full table-fixed text-xs">
        <thead>
          <tr className="text-left text-[10px] uppercase tracking-wide text-slate">
            <th className="w-[46%] py-1 font-semibold sm:w-[40%]">Item</th>
            <th className="hidden py-1 font-semibold sm:table-cell">Qty × rate</th>
            <th className="py-1 font-semibold">Disc.</th>
            <th className="py-1 text-right font-semibold">Taxable</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line/70">
          {JOURNEY_QUOTE_LINES.map((l, i) => {
            const r = JOURNEY_QUOTE.lines[i]
            return (
              <Show as="tr" key={l.id} show={linesShown >= i + 1}>
                <td className="py-1.5 pr-2 align-top">
                  <span className="block font-medium leading-snug text-ink">{l.name}</span>
                  <span className="font-mono text-[10px] text-slate">
                    {l.codeType} {l.code} · GST {l.gstRate}%
                  </span>
                </td>
                <td className="hidden py-1.5 align-top font-mono text-ink sm:table-cell">
                  {l.qty} × {formatINR(l.unitPrice)}
                </td>
                <td className="py-1.5 align-top font-mono text-ink">{l.discountPct ? `${l.discountPct}%` : '—'}</td>
                <td className="py-1.5 text-right align-top font-mono text-ink">{formatINR(r.taxable)}</td>
              </Show>
            )
          })}
        </tbody>
      </table>

      <Show show={totalsShown} className="ml-auto mt-auto w-full max-w-[17rem] pt-2">
        <dl className="space-y-0.5 font-mono text-xs">
          {(
            [
              ['Gross', formatINR(JOURNEY_QUOTE.gross)],
              ['Discount', `− ${formatINR(JOURNEY_QUOTE.discount)}`],
              ['Taxable value', formatINR(JOURNEY_QUOTE.taxable)],
              [`CGST ${half}%`, formatINR(JOURNEY_QUOTE.cgst)],
              [`SGST ${half}%`, formatINR(JOURNEY_QUOTE.sgst)],
              ...(JOURNEY_QUOTE.roundOff ? [['Round off', formatINR(JOURNEY_QUOTE.roundOff, { paise: true })]] : []),
            ] as [string, string][]
          ).map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3 text-slate">
              <dt>{k}</dt>
              <dd className="text-ink">{v}</dd>
            </div>
          ))}
          <div className="flex justify-between gap-3 border-t border-line pt-1 text-sm font-bold text-ink">
            <dt>Grand total</dt>
            <dd>{formatINR(JOURNEY_QUOTE.grandTotal)}</dd>
          </div>
        </dl>
      </Show>
    </div>
  )
}

/* ─── 6 · Convert ───────────────────────────────────────────────────────── */

const COLUMNS = PIPELINE_STAGES.filter((s) => s.id === 'proposal' || s.id === 'negotiation' || s.id === 'won')
const JOURNEY_DEAL = DEALS.find((d) => d.id === 'deal-balaji') ?? DEALS[0]
const WON_BEFORE = DEALS.filter((d) => d.stage === 'won').reduce((s, d) => s + d.value, 0)
const WON_AFTER = WON_BEFORE + JOURNEY_QUOTE.grandTotal

export function ConvertPanel({ play }: PanelProps) {
  const phase = usePhases(2, play, 900)
  const won = phase >= 1
  const revenue = useMotionValue(play ? WON_BEFORE : WON_AFTER)
  const revenueText = useTransform(revenue, (v) => formatINR(Math.round(v)))

  useEffect(() => {
    if (!play) {
      revenue.jump(WON_AFTER)
      return
    }
    if (phase < 2) {
      revenue.jump(WON_BEFORE)
      return
    }
    const controls = animate(revenue, WON_AFTER, { duration: 0.9, ease: EASE })
    return () => controls.stop()
  }, [phase, play, revenue])

  return (
    <div className="flex h-full flex-col gap-3 p-4 sm:p-5">
      <LayoutGroup id="lifecycle-convert">
        <div className="grid flex-1 grid-cols-3 gap-2">
          {COLUMNS.map((col) => {
            const others = DEALS.filter((d) => d.stage === col.id && d.id !== JOURNEY_DEAL.id)
            const hereNow = (col.id === 'negotiation' && !won) || (col.id === 'won' && won)
            return (
              <div key={col.id} className={cn('flex min-w-0 flex-col gap-1.5 rounded-chip p-1.5 sm:p-2', col.id === 'won' ? 'bg-won/10' : 'bg-mist')}>
                <p className="flex items-center justify-between gap-1 px-0.5 text-[10px] font-bold uppercase tracking-wide text-slate">
                  <span className="truncate">{col.label}</span>
                  <span className="font-mono font-medium">{col.probability}%</span>
                </p>
                {hereNow ? (
                  <motion.div
                    layoutId="journey-deal"
                    transition={{ duration: 0.6, ease: EASE }}
                    className={cn(
                      'rounded-lg border bg-white p-2 shadow-soft',
                      won ? 'border-won ring-1 ring-won' : 'border-brand ring-1 ring-brand',
                    )}
                  >
                    <p className="truncate text-[11px] font-semibold text-ink">{JOURNEY_DEAL.company}</p>
                    <p className="font-mono text-[10px] text-ink">{formatINRCompact(JOURNEY_DEAL.value)}</p>
                  </motion.div>
                ) : null}
                {others.map((d) => (
                  <div key={d.id} className="rounded-lg border border-line bg-white p-2">
                    <p className="truncate text-[11px] font-medium text-ink">{d.company}</p>
                    <p className="font-mono text-[10px] text-slate">{formatINRCompact(d.value)}</p>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </LayoutGroup>

      <div className="flex flex-wrap items-end justify-between gap-3 rounded-chip bg-ink p-3 text-white">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-white/75">Won revenue · this period</p>
          <motion.p aria-hidden className="font-mono text-xl font-bold sm:text-2xl">
            {revenueText}
          </motion.p>
          <p className="sr-only">
            Won revenue rises from {formatINR(WON_BEFORE)} to {formatINR(WON_AFTER)}.
          </p>
        </div>
        <Show show={phase >= 2}>
          <Chip tone="won" className="bg-won text-white">
            + {formatINR(JOURNEY_QUOTE.grandTotal)} · {JOURNEY_QUOTE_NUMBER}
          </Chip>
        </Show>
      </div>
    </div>
  )
}

/* ─── 7 · Support ───────────────────────────────────────────────────────── */

const HISTORY: { label: string; meta: string }[] = [
  { label: `Lead from ${source.name}`, meta: JOURNEY_CUSTOMER.receivedAt },
  { label: `${WHATSAPP_SCRIPT.filter((m) => m.from !== 'system').length} WhatsApp messages`, meta: 'Shared inbox' },
  { label: 'Follow-up call completed', meta: rep.name },
  { label: `Quotation ${JOURNEY_QUOTE_NUMBER} approved`, meta: formatINR(JOURNEY_QUOTE.grandTotal) },
  { label: 'Deal won', meta: formatINR(JOURNEY_QUOTE.grandTotal) },
]

export function SupportPanel({ play }: PanelProps) {
  const phase = usePhases(2, play, 700)
  const install = JOURNEY_QUOTE_LINES.find((l) => l.codeType === 'SAC')
  return (
    <div className="grid h-full gap-3 p-4 sm:grid-cols-2 sm:gap-4 sm:p-5">
      <div className="rounded-chip border border-line bg-white p-3 shadow-soft">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate">Customer</p>
        <p className="mt-1 text-sm font-bold text-ink">{JOURNEY_CUSTOMER.company}</p>
        <p className="text-xs text-slate">
          {JOURNEY_CUSTOMER.name} · {JOURNEY_CUSTOMER.city}, {JOURNEY_CUSTOMER.state}
        </p>
        <ol className="mt-3 space-y-1.5">
          {HISTORY.map((h) => (
            <li key={h.label} className="flex items-center justify-between gap-2 text-xs">
              <span className="flex min-w-0 items-center gap-1.5 text-ink">
                <Check className="h-3.5 w-3.5 shrink-0 text-won" aria-hidden />
                <span className="truncate">{h.label}</span>
              </span>
              <span className="shrink-0 font-mono text-[10px] text-slate">{h.meta}</span>
            </li>
          ))}
        </ol>
      </div>

      <Show show={phase >= 1} className="rounded-chip border border-brand/30 bg-sky/50 p-3">
        <p className="flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-wide text-brand">
          <span className="flex items-center gap-1.5">
            <LifeBuoy className="h-3.5 w-3.5" aria-hidden /> Support ticket
          </span>
          <span className="font-mono font-medium normal-case">Linked to {JOURNEY_QUOTE_NUMBER}</span>
        </p>
        <p className="mt-2 flex items-start gap-2 text-sm font-semibold text-ink">
          <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
          {install?.name ?? 'Installation'} · {JOURNEY_CUSTOMER.city}
        </p>
        <dl className="mt-2 space-y-1 text-xs">
          <div className="flex justify-between gap-2">
            <dt className="text-slate">Scope</dt>
            <dd className="text-right text-ink">{JOURNEY_QUOTE_LINES[0].qty} pumps with control panels</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate">{install?.codeType ?? 'SAC'}</dt>
            <dd className="font-mono text-ink">{install?.code}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate">Status</dt>
            <dd>
              <Chip tone={phase >= 2 ? 'won' : 'brand'}>{phase >= 2 ? 'Scheduled' : 'Open'}</Chip>
            </dd>
          </div>
        </dl>
        <p className="mt-2 text-[11px] text-slate">Account owner {rep.name} stays on the record.</p>
      </Show>
    </div>
  )
}

export const PANELS = [CapturePanel, AssignPanel, EngagePanel, FollowUpPanel, QuotePanel, ConvertPanel, SupportPanel]
