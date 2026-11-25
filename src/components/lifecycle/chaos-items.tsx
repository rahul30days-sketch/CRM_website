/**
 * The eight artefacts used by <ChaosToControl />. Each item has two faces:
 * the "without EZCRM" mess (a spreadsheet, an unread WhatsApp, a wrong quote…)
 * and the same thing resolved inside one EZCRM workspace. Faces are purely
 * visual; the section renders a screen-reader list from `before` / `after`.
 *
 * Every figure is derived from src/demo/sample-data so it agrees with the
 * rest of the site.
 */

import type { ReactNode } from 'react'
import { AlertTriangle, BellRing, Check, Phone, StickyNote } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatINR, formatINRCompact } from '@/lib/gst'
import {
  DEALS,
  JOURNEY_CUSTOMER,
  JOURNEY_QUOTE,
  JOURNEY_QUOTE_NUMBER,
  PIPELINE_STAGES,
  REPS,
  SAMPLE_ENQUIRIES,
  WHATSAPP_SCRIPT,
  sourceById,
  type SourceId,
} from '@/demo/sample-data'

export interface ChaosItem {
  id: string
  /** Scattered offset, in % of the card's own size, plus rotation (deg). */
  scatter: { x: number; y: number; r: number }
  before: string
  after: string
  chaos: ReactNode
  control: ReactNode
}

const unread = WHATSAPP_SCRIPT.filter((m) => m.from === 'customer').length
const rep = (id: string) => REPS.find((r) => r.id === id) ?? REPS[0]
const priya = rep(JOURNEY_CUSTOMER.repId)
const manager = REPS.find((r) => r.role === 'Sales manager') ?? REPS[REPS.length - 1]
const sellers = REPS.filter((r) => r.role !== 'Sales manager')
const wrongGst = Math.round(JOURNEY_QUOTE.taxable * 0.12)
const negotiation = PIPELINE_STAGES.find((s) => s.id === 'negotiation')

/* ─── Small building blocks ─────────────────────────────────────────────── */

function MessCard({ title, icon, children, className }: { title: string; icon?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex h-full flex-col rounded-chip border border-due/25 bg-white p-3 shadow-soft', className)}>
      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-due">
        {icon}
        {title}
      </p>
      <div className="min-h-0 flex-1 text-xs text-slate">{children}</div>
    </div>
  )
}

function CleanCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex h-full flex-col rounded-chip border border-line bg-white p-3 shadow-press">
      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-brand">
        <span className="grid h-4 w-4 place-items-center rounded-full bg-won text-white">
          <Check className="h-2.5 w-2.5" aria-hidden strokeWidth={3} />
        </span>
        {title}
      </p>
      <div className="min-h-0 flex-1 text-xs text-slate">{children}</div>
    </div>
  )
}

export function SourceChip({ id }: { id: SourceId }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full bg-sky px-2 py-0.5 text-[10px] font-semibold text-brand">
      {sourceById(id).short}
    </span>
  )
}

export function Avatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <span
      className={cn(
        'grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand font-mono text-[10px] font-bold text-white',
        className,
      )}
    >
      {initials}
    </span>
  )
}

/* ─── The eight pairs ───────────────────────────────────────────────────── */

const capturedIds: SourceId[] = ['indiamart', 'justdial', 'whatsapp']

export const CHAOS_ITEMS: ChaosItem[] = [
  {
    id: 'sheet',
    scatter: { x: -14, y: 18, r: -7 },
    before: 'Leads copied by hand into a spreadsheet, with duplicates and blank cells.',
    after: 'Leads captured automatically from IndiaMART, JustDial and WhatsApp, each tagged with its source.',
    chaos: (
      <MessCard title="Leads_final(2).xlsx">
        <table className="w-full table-fixed border-collapse font-mono text-[10px]">
          <tbody>
            {[
              ['Rakesh G.', '98•••', '?'],
              ['Balaji Agro', '', 'IM?'],
              ['Sneha K', 'Pune', 'dup'],
              ['Rakesh', '98•••', 'dup'],
            ].map((row, i) => (
              <tr key={i}>
                {row.map((c, j) => (
                  <td
                    key={j}
                    className={cn(
                      'truncate border border-line px-1 py-0.5',
                      c === 'dup' || c === '?' || c === '' ? 'bg-due/10 text-due' : 'text-ink',
                    )}
                  >
                    {c || '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </MessCard>
    ),
    control: (
      <CleanCard title="Captured leads">
        <ul className="space-y-1.5">
          {capturedIds.map((id) => (
            <li key={id} className="flex items-center justify-between gap-2">
              <span className="truncate font-medium text-ink">{SAMPLE_ENQUIRIES[id].name}</span>
              <SourceChip id={id} />
            </li>
          ))}
        </ul>
      </CleanCard>
    ),
  },
  {
    id: 'enquiry',
    scatter: { x: 22, y: -14, r: 6 },
    before: `An IndiaMART enquiry from ${JOURNEY_CUSTOMER.company} sits unanswered with no owner.`,
    after: `EZCRM assigns the enquiry to ${priya.name} by round-robin.`,
    chaos: (
      <MessCard title="Unanswered" icon={<AlertTriangle className="h-3 w-3" aria-hidden />}>
        <p className="font-semibold text-ink">IndiaMART enquiry</p>
        <p className="mt-0.5 truncate">{JOURNEY_CUSTOMER.company}</p>
        <p className="mt-1 font-mono text-[10px]">Received {JOURNEY_CUSTOMER.receivedAt}</p>
        <p className="mt-2 inline-flex rounded-full bg-due/10 px-2 py-0.5 text-[10px] font-semibold text-due">
          No owner · no reply
        </p>
      </MessCard>
    ),
    control: (
      <CleanCard title="Assigned">
        <p className="truncate font-semibold text-ink">{JOURNEY_CUSTOMER.name}</p>
        <p className="truncate">{JOURNEY_CUSTOMER.company}</p>
        <div className="mt-2 flex items-center gap-2">
          <Avatar initials={priya.initials} />
          <span className="truncate font-medium text-ink">{priya.name}</span>
        </div>
        <p className="mt-1 text-[10px]">Round-robin rule</p>
      </CleanCard>
    ),
  },
  {
    id: 'whatsapp',
    scatter: { x: -18, y: 30, r: -3 },
    before: `${unread} WhatsApp messages from ${JOURNEY_CUSTOMER.name} unread on one person's phone.`,
    after: 'One shared WhatsApp inbox, with the conversation assigned and answered.',
    chaos: (
      <MessCard title="WhatsApp">
        <div className="flex items-start gap-2">
          <span className="min-w-0 flex-1">
            <span className="block truncate font-semibold text-ink">{JOURNEY_CUSTOMER.name}</span>
            <span className="line-clamp-2">{WHATSAPP_SCRIPT[1].text}</span>
          </span>
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-due px-1 font-mono text-[10px] font-bold text-white">
            {unread}
          </span>
        </div>
        <p className="mt-2 font-mono text-[10px]">Last seen {WHATSAPP_SCRIPT[1].time} · not replied</p>
      </MessCard>
    ),
    control: (
      <CleanCard title="Shared inbox">
        <p className="truncate font-semibold text-ink">{JOURNEY_CUSTOMER.name}</p>
        <p className="mt-1 line-clamp-2 rounded-lg bg-sky px-2 py-1 text-ink">{WHATSAPP_SCRIPT[2].text}</p>
        <p className="mt-1.5 flex items-center gap-1.5 text-[10px]">
          <Avatar initials={priya.initials} className="h-4 w-4 text-[8px]" /> Replied {WHATSAPP_SCRIPT[2].time}
        </p>
      </CleanCard>
    ),
  },
  {
    id: 'phones',
    scatter: { x: 14, y: -6, r: 9 },
    before: "Customer chats and numbers live on each salesperson's personal phone.",
    after: `A live manager view for ${manager.name}, with every rep's open pipeline in one place.`,
    chaos: (
      <MessCard title="Personal phones" icon={<Phone className="h-3 w-3" aria-hidden />}>
        <ul className="space-y-1">
          {sellers.map((r) => (
            <li key={r.id} className="truncate rounded-md border border-dashed border-line px-2 py-0.5">
              {r.name.split(' ')[0]}&rsquo;s phone
            </li>
          ))}
        </ul>
        <p className="mt-1.5 text-[10px] text-due">Manager can&rsquo;t see any of it</p>
      </MessCard>
    ),
    control: (
      <CleanCard title={`Manager view · ${manager.name.split(' ')[0]}`}>
        <ul className="space-y-1">
          {sellers.map((r) => {
            const mine = DEALS.filter((d) => d.repId === r.id && d.stage !== 'won' && d.stage !== 'lost')
            return (
              <li key={r.id} className="flex items-center justify-between gap-2">
                <span className="flex min-w-0 items-center gap-1.5">
                  <Avatar initials={r.initials} className="h-4 w-4 text-[8px]" />
                  <span className="truncate text-ink">{r.name.split(' ')[0]}</span>
                </span>
                <span className="font-mono text-[10px] text-ink">
                  {formatINRCompact(mine.reduce((s, d) => s + d.value, 0))}
                </span>
              </li>
            )
          })}
        </ul>
        <p className="mt-1 text-[10px]">Open pipeline, live</p>
      </CleanCard>
    ),
  },
  {
    id: 'followup',
    scatter: { x: 18, y: -30, r: 6 },
    before: `A sticky note to call ${JOURNEY_CUSTOMER.name} back, now overdue.`,
    after: 'A follow-up call scheduled on the lead, with a reminder before it is due.',
    chaos: (
      <MessCard title="Overdue" icon={<StickyNote className="h-3 w-3" aria-hidden />}>
        <p className="font-semibold text-ink">Call Rakesh back re: panels</p>
        <p className="mt-1">Written on a sticky note. Nobody remembers who took it.</p>
      </MessCard>
    ),
    control: (
      <CleanCard title="Follow-up scheduled">
        <p className="font-semibold text-ink">Call {JOURNEY_CUSTOMER.name.split(' ')[0]}: panels &amp; installation</p>
        <p className="mt-1 flex items-center gap-1.5">
          <BellRing className="h-3 w-3 text-brand" aria-hidden /> Reminder on · owner {priya.name.split(' ')[0]}
        </p>
      </CleanCard>
    ),
  },
  {
    id: 'quote',
    scatter: { x: -26, y: 8, r: -5 },
    before: 'A quotation typed by hand with the wrong GST slab and no HSN codes.',
    after: `Quotation ${JOURNEY_QUOTE_NUMBER} with CGST 9% and SGST 9%, totalling ${formatINR(JOURNEY_QUOTE.grandTotal)}.`,
    chaos: (
      <MessCard title="Quote_v3.docx">
        <dl className="space-y-0.5 font-mono text-[10px]">
          <div className="flex justify-between gap-2">
            <dt>Taxable</dt>
            <dd className="text-ink">{formatINR(JOURNEY_QUOTE.taxable)}</dd>
          </div>
          <div className="flex justify-between gap-2 text-due">
            <dt className="line-through">GST @ 12%</dt>
            <dd className="line-through">{formatINR(wrongGst)}</dd>
          </div>
          <div className="flex justify-between gap-2 text-due">
            <dt>Total?</dt>
            <dd className="line-through">{formatINR(JOURNEY_QUOTE.taxable + wrongGst)}</dd>
          </div>
        </dl>
        <p className="mt-1.5 text-[10px] text-due">Wrong slab · HSN missing</p>
      </MessCard>
    ),
    control: (
      <CleanCard title={JOURNEY_QUOTE_NUMBER}>
        <dl className="space-y-0.5 font-mono text-[10px]">
          <div className="flex justify-between gap-2">
            <dt>CGST 9%</dt>
            <dd className="text-ink">{formatINR(JOURNEY_QUOTE.cgst)}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt>SGST 9%</dt>
            <dd className="text-ink">{formatINR(JOURNEY_QUOTE.sgst)}</dd>
          </div>
          <div className="flex justify-between gap-2 border-t border-line pt-0.5 font-bold text-ink">
            <dt>Total</dt>
            <dd>{formatINR(JOURNEY_QUOTE.grandTotal)}</dd>
          </div>
        </dl>
      </CleanCard>
    ),
  },
  {
    id: 'payment',
    scatter: { x: 20, y: -18, r: -8 },
    before: 'A reminder to ask for the advance payment that was never sent.',
    after: `The deal is tracked in the pipeline at ${negotiation?.label ?? 'Negotiation'}, with the payment follow-up as its next step.`,
    chaos: (
      <MessCard title="Forgotten">
        <p className="font-semibold text-ink">Ask Balaji Agro for advance</p>
        <p className="mt-1">In a notebook. Not followed up.</p>
        <p className="mt-1.5 font-mono text-[10px] text-due line-through">{formatINR(JOURNEY_QUOTE.grandTotal)}</p>
      </MessCard>
    ),
    control: (
      <CleanCard title="Deal tracked">
        <p className="truncate font-semibold text-ink">{JOURNEY_CUSTOMER.company}</p>
        <p className="mt-1 flex items-center justify-between gap-2">
          <span className="rounded-full bg-sky px-2 py-0.5 text-[10px] font-semibold text-brand">
            {negotiation?.label} · {negotiation?.probability}%
          </span>
          <span className="font-mono text-[10px] font-bold text-ink">{formatINRCompact(JOURNEY_QUOTE.grandTotal)}</span>
        </p>
        <p className="mt-1.5 text-[10px]">Next: advance payment follow-up</p>
      </CleanCard>
    ),
  },
  {
    id: 'record',
    scatter: { x: -10, y: -34, r: 4 },
    before: 'Three half-records of the same customer in contacts, email and a spreadsheet.',
    after: `One customer record for ${JOURNEY_CUSTOMER.company} holding the lead, chats, quote and deal.`,
    chaos: (
      <MessCard title="3 versions">
        <ul className="space-y-1">
          {['Rakesh · phone contacts', 'R. Gupta · email thread', 'Balaji Agro · sheet'].map((t) => (
            <li key={t} className="truncate rounded-md border border-dashed border-due/30 px-2 py-0.5">
              {t}
            </li>
          ))}
        </ul>
      </MessCard>
    ),
    control: (
      <CleanCard title="Customer record">
        <p className="truncate font-semibold text-ink">{JOURNEY_CUSTOMER.company}</p>
        <p className="truncate">
          {JOURNEY_CUSTOMER.name} · {JOURNEY_CUSTOMER.city}
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {['Lead', 'Chats', 'Quote', 'Deal'].map((t) => (
            <span key={t} className="rounded-full bg-sky px-1.5 py-0.5 text-[10px] font-semibold text-brand">
              {t}
            </span>
          ))}
        </div>
      </CleanCard>
    ),
  },
]
