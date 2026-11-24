'use client'

/**
 * Section 04 — The cinematic lead-to-revenue journey.
 *
 * One realistic enquiry followed through the whole EZCRM lifecycle across 7
 * scroll-pinned stages. Scroll progress drives the active stage; the visual
 * crossfades while a vertical rail tracks position. All DOM/framer-motion
 * (no WebGL). Reduced-motion renders every stage stacked as readable cards.
 *
 * The data (names, amounts) is clearly illustrative sample data.
 */

import { useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'framer-motion'
import { Check, MessageCircle, Inbox, Users, FileText, Columns3, BarChart3 } from 'lucide-react'
import { AmbientBackdrop } from '@/components/motion/ambient-backdrop'

const RAIL = [Inbox, Users, MessageCircle, FileText, Columns3, BarChart3]
// stage index → which rail icon is active
const RAIL_FOR_STAGE = [0, 1, 2, 3, 4, 4, 5]

type Stage = { key: string; kicker: string; title: string; copy: string }

const STAGES: Stage[] = [
  { key: 'capture', kicker: 'Stage 1 · Capture', title: 'Every opportunity starts here.', copy: 'An IndiaMART enquiry lands in EZCRM and becomes a structured lead — source, customer and requirement, captured in seconds.' },
  { key: 'assign', kicker: 'Stage 2 · Assign', title: 'The right lead. The right salesperson.', copy: 'Round-robin assignment routes the lead to an available rep automatically, and the status updates to Assigned.' },
  { key: 'engage', kicker: 'Stage 3 · Engage', title: 'Turn enquiries into conversations.', copy: 'The rep replies on the official WhatsApp API from the lead timeline — history, attachments and reminders all in one thread.' },
  { key: 'quote', kicker: 'Stage 4 · Quote', title: 'From conversation to quotation.', copy: 'A GST-compliant quotation assembles from the catalog — line items, tax and totals — and goes to the customer for approval.' },
  { key: 'negotiate', kicker: 'Stage 5 · Negotiate', title: 'Keep every opportunity moving.', copy: 'The quote becomes a deal card that advances through your pipeline, with follow-ups and reminders keeping it alive.' },
  { key: 'convert', kicker: 'Stage 6 · Convert', title: 'Turn opportunities into revenue.', copy: 'The customer approves, the deal moves to Won, and payment collection kicks off — no opportunity left on the table.' },
  { key: 'analyze', kicker: 'Stage 7 · Analyze', title: 'Every decision backed by data.', copy: 'The won deal flows into the dashboard — revenue, conversion and team performance update live for the whole floor.' },
]

function Chip({ children, tone = 'brand' }: { children: React.ReactNode; tone?: 'brand' | 'won' | 'slate' }) {
  const tones = {
    brand: 'bg-sky text-brand',
    won: 'bg-[rgb(var(--c-won))]/10 text-[rgb(var(--c-won))]',
    slate: 'bg-line/60 text-slate',
  }
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tones[tone]}`}>{children}</span>
}

function LeadCard({ status, tone = 'brand' }: { status: string; tone?: 'brand' | 'won' | 'slate' }) {
  return (
    <div className="w-full max-w-sm rounded-card border border-line bg-white p-4 shadow-float">
      <div className="flex items-center justify-between">
        <Chip>IndiaMART</Chip>
        <Chip tone={tone}>{status}</Chip>
      </div>
      <p className="mt-3 text-base font-bold text-ink">Rakesh Gupta</p>
      <p className="text-sm text-slate">Shri Balaji Agro, Nagpur</p>
      <p className="mt-2 rounded-chip bg-sky/60 px-3 py-2 text-sm text-ink">
        Requirement: 50&nbsp;HP submersible pump &times; 4
      </p>
    </div>
  )
}

function StageVisual({ stageKey }: { stageKey: string }) {
  switch (stageKey) {
    case 'capture':
      return <LeadCard status="New" />
    case 'assign':
      return (
        <div className="flex w-full max-w-sm flex-col items-center gap-3">
          <LeadCard status="Assigned" />
          <div className="flex items-center gap-3 rounded-card border border-line bg-white px-4 py-3 shadow-float">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand font-mono text-sm font-bold text-white">P</span>
            <div className="text-left">
              <p className="text-sm font-semibold text-ink">Priya Sharma</p>
              <p className="font-mono text-[11px] text-slate">Round-robin · Sales</p>
            </div>
          </div>
        </div>
      )
    case 'engage':
      return (
        <div className="w-full max-w-sm rounded-card border border-line bg-[#E6F2EA] p-4 shadow-float">
          <div className="mb-3 flex items-center gap-2 text-[rgb(var(--c-won))]">
            <MessageCircle className="h-4 w-4" aria-hidden />
            <span className="text-xs font-semibold">WhatsApp · Shared inbox</span>
          </div>
          <div className="space-y-2">
            <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-sm text-ink shadow-soft">Is the 50 HP pump available with GST invoice?</div>
            <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-[#D7F0DD] px-3 py-2 text-sm text-ink shadow-soft">Yes sir — sharing a quotation now with GST. 👍</div>
            <div className="flex items-center gap-1 pl-1 text-[11px] text-slate"><span className="flex gap-0.5"><Dot /><Dot /><Dot /></span> typing…</div>
          </div>
        </div>
      )
    case 'quote':
      return (
        <div className="w-full max-w-sm rounded-card border border-line bg-white p-4 shadow-float">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <p className="text-sm font-bold text-ink">Quotation QT-1094</p>
            <Chip>GST 18%</Chip>
          </div>
          <div className="space-y-1.5 py-3 text-sm">
            <Row label="50 HP submersible pump × 4" value="₹1,80,000" />
            <Row label="GST (18%)" value="₹32,400" />
          </div>
          <div className="flex items-center justify-between border-t border-line pt-2">
            <span className="text-sm font-semibold text-slate">Total</span>
            <span className="font-mono text-base font-bold text-ink">₹2,12,400</span>
          </div>
        </div>
      )
    case 'negotiate':
      return (
        <div className="grid w-full max-w-md grid-cols-3 gap-2">
          {['Qualified', 'Negotiation', 'Won'].map((col) => (
            <div key={col} className="rounded-card border border-line bg-sky/40 p-2">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate">{col}</p>
              {col === 'Negotiation' && (
                <div className="rounded-chip border border-brand/30 bg-white p-2 shadow-soft">
                  <p className="text-xs font-bold text-ink">Shri Balaji Agro</p>
                  <p className="font-mono text-[11px] text-brand">₹2,12,400</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )
    case 'convert':
      return (
        <div className="w-full max-w-sm rounded-card border border-line bg-white p-6 text-center shadow-float">
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-[rgb(var(--c-won))] text-white">
            <Check className="h-7 w-7" aria-hidden />
          </div>
          <p className="text-lg font-bold text-ink">Deal Won</p>
          <p className="font-mono text-2xl font-extrabold text-[rgb(var(--c-won))]">₹2,12,400</p>
          <p className="mt-1 text-sm text-slate">Shri Balaji Agro · Distribution</p>
        </div>
      )
    case 'analyze':
      return (
        <div className="grid w-full max-w-md grid-cols-3 gap-3">
          {[
            { label: 'Revenue (MTD)', value: '₹18.4L' },
            { label: 'Deals won', value: '37' },
            { label: 'Conversion', value: '24%' },
          ].map((k, i) => (
            <div key={k.label} className="rounded-card border border-line bg-white p-3 shadow-float">
              <p className="font-mono text-lg font-bold text-ink">{k.value}</p>
              <p className="text-[11px] text-slate">{k.label}</p>
              <div className="mt-2 flex h-10 items-end gap-0.5">
                {[40, 65, 50, 80, 72, 95].map((h, j) => (
                  <span key={j} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: i === 1 ? 'rgb(var(--c-won))' : 'rgb(var(--c-brand))', opacity: 0.35 + j * 0.1 }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    default:
      return null
  }
}

function Dot() {
  return <span className="inline-block h-1 w-1 rounded-full bg-slate" />
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate">{label}</span>
      <span className="font-mono text-ink">{value}</span>
    </div>
  )
}

export function LeadJourneyCinematic() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = Math.min(STAGES.length - 1, Math.max(0, Math.floor(v * STAGES.length)))
    setActive(idx)
  })

  if (reduce) {
    return (
      <section className="shell py-14 lg:py-20">
        <header className="mx-auto max-w-2xl text-center">
          <p className="kicker mb-3">The journey</p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">One enquiry, from first touch to revenue.</h2>
        </header>
        <div className="mx-auto mt-10 max-w-2xl space-y-6">
          {STAGES.map((s) => (
            <div key={s.key} className="rounded-card border border-line bg-white p-5 shadow-soft">
              <p className="kicker mb-1">{s.kicker}</p>
              <h3 className="text-lg font-bold text-ink">{s.title}</h3>
              <p className="mt-1 text-sm text-slate">{s.copy}</p>
              <div className="mt-4 flex justify-center"><StageVisual stageKey={s.key} /></div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} className="relative" style={{ height: `${STAGES.length * 58}vh` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <AmbientBackdrop />
        <div className="shell grid w-full items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
          {/* Narrative: active copy + full labelled stage index */}
          <div className="flex flex-col gap-8">
            <div className="min-h-[10rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={STAGES[active].key}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="kicker mb-2">{STAGES[active].kicker}</p>
                  <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]">
                    {STAGES[active].title}
                  </h2>
                  <p className="mt-3 max-w-md text-base text-slate">{STAGES[active].copy}</p>
                </motion.div>
              </AnimatePresence>

              {/* progress track for the current stage */}
              <div className="mt-6 h-1 w-full max-w-md overflow-hidden rounded-full bg-line">
                <motion.div
                  className="h-full rounded-full bg-brand"
                  animate={{ width: `${((active + 1) / STAGES.length) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                />
              </div>
            </div>

            <ol className="hidden flex-col gap-3 border-l border-line pl-5 sm:flex">
              {STAGES.map((s, i) => {
                const label = s.kicker.split('·')[1]?.trim() ?? s.kicker
                const isActive = i === active
                return (
                  <li key={s.key} className="relative">
                    <motion.span
                      aria-hidden
                      animate={{
                        backgroundColor: i <= active ? 'rgb(43,92,230)' : 'rgb(226,233,245)',
                        scale: isActive ? 1.6 : 1,
                      }}
                      className="absolute -left-[1.55rem] top-1.5 h-2 w-2 rounded-full"
                    />
                    <span
                      className={
                        'text-sm font-semibold transition-colors ' +
                        (isActive ? 'text-ink' : i < active ? 'text-slate' : 'text-slate/40')
                      }
                    >
                      {label}
                    </span>
                  </li>
                )
              })}
            </ol>
          </div>

          {/* Stage visual inside a persistent product "app window" */}
          <div className="relative">
            <div className="overflow-hidden rounded-[1.5rem] border border-line bg-white/80 shadow-float backdrop-blur-xl">
              {/* window chrome */}
              <div className="flex items-center gap-2 border-b border-line px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[rgb(var(--c-due))]/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#F5B301]/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-[rgb(var(--c-won))]/70" />
                <span className="ml-2 font-mono text-[11px] uppercase tracking-widest text-slate">
                  EZCRM · Lead workspace
                </span>
                <span className="ml-auto font-mono text-[11px] font-semibold text-brand">
                  {String(active + 1).padStart(2, '0')} / {String(STAGES.length).padStart(2, '0')}
                </span>
              </div>
              <div className="flex">
                {/* nav rail */}
                <div className="hidden w-14 shrink-0 flex-col items-center gap-2 border-r border-line py-5 sm:flex" aria-hidden>
                  {RAIL.map((Icon, i) => {
                    const on = RAIL_FOR_STAGE[active] === i
                    return (
                      <motion.span
                        key={i}
                        animate={{
                          backgroundColor: on ? 'rgb(43,92,230)' : 'rgba(0,0,0,0)',
                          color: on ? 'rgb(255,255,255)' : 'rgb(84,96,122)',
                        }}
                        className="grid h-9 w-9 place-items-center rounded-xl"
                      >
                        <Icon className="h-4 w-4" />
                      </motion.span>
                    )
                  })}
                </div>
                {/* main content */}
                <div className="relative flex min-h-[20rem] flex-1 items-center justify-center p-6">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute right-4 top-1 select-none font-display text-[8rem] font-black leading-none text-brand/[0.05]"
                  >
                    {String(active + 1).padStart(2, '0')}
                  </span>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={STAGES[active].key}
                      initial={{ opacity: 0, scale: 0.94, y: 14 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, y: -10 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="relative z-10 flex w-full justify-center"
                    >
                      <StageVisual stageKey={STAGES[active].key} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
