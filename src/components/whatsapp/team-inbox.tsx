'use client'

/**
 * Desktop half of the WhatsApp demo: EZCRM's shared team inbox.
 *
 * Three panes inside an AppWindow: conversation list (md+), the active
 * thread with Rakesh Gupta, and the customer profile (xl+; a compact strip
 * replaces it on narrower screens). The deal stage in the profile moves as
 * the conversation plays. Quick replies are real buttons that only fill the
 * local composer ("Simulated, nothing is sent"). "Manager view" shows the
 * same thread as Vikram, the sales manager, would see it.
 */

import { Eye } from 'lucide-react'
import { AppWindow } from '@/components/demo/kit'
import { cn } from '@/lib/utils'
import { formatINR } from '@/lib/gst'
import {
  JOURNEY_CUSTOMER,
  JOURNEY_QUOTE,
  PIPELINE_STAGES,
  QUICK_REPLIES,
  SAMPLE_ENQUIRIES,
  WHATSAPP_SCRIPT,
  repById,
  sourceById,
  type SourceId,
} from '@/demo/sample-data'
import { MessageSlot, SystemSlot } from './chat-parts'

const OTHER_THREADS: SourceId[] = ['justdial', 'whatsapp', 'google']

const rep = repById(JOURNEY_CUSTOMER.repId)
const manager = repById('vikram')

export function stageAt(index: number) {
  const id = index >= 6 ? 'won' : index >= 4 ? 'proposal' : index >= 1 ? 'qualified' : 'new'
  return PIPELINE_STAGES.find((s) => s.id === id) ?? PIPELINE_STAGES[0]
}

function Profile({ index, compact }: { index: number; compact?: boolean }) {
  const stage = stageAt(index)
  const rows: [string, React.ReactNode][] = [
    ['Company', JOURNEY_CUSTOMER.company],
    ['City', JOURNEY_CUSTOMER.city],
    ['Source', sourceById(JOURNEY_CUSTOMER.source).name],
    ['Deal value', <span key="v" className="font-mono">{formatINR(JOURNEY_QUOTE.grandTotal)}</span>],
    ['Assigned to', rep.name],
    [
      'Stage',
      <span
        key="s"
        className={cn(
          'inline-flex rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold transition-colors duration-base',
          stage.id === 'won' ? 'bg-won/10 text-won' : 'bg-brand/10 text-brand',
        )}
      >
        {stage.label}
      </span>,
    ],
  ]
  if (compact) {
    return (
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-b border-line bg-sky/40 px-4 py-3 sm:grid-cols-3">
        {rows.map(([k, v]) => (
          <div key={k} className="min-w-0">
            <dt className="text-[0.625rem] uppercase tracking-wide text-slate">{k}</dt>
            <dd className="truncate text-xs font-semibold text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    )
  }
  return (
    <aside aria-label="Customer profile" className="min-w-0 border-l border-line px-4 py-4">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-won/10 font-mono text-sm font-bold text-won"
        >
          RG
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{JOURNEY_CUSTOMER.name}</p>
          <p className="truncate font-mono text-[0.6875rem] text-slate">{JOURNEY_CUSTOMER.phone}</p>
        </div>
      </div>
      <dl className="mt-4 space-y-2.5">
        {rows.map(([k, v]) => (
          <div key={k} className="min-w-0">
            <dt className="text-[0.625rem] uppercase tracking-wide text-slate">{k}</dt>
            <dd className="text-xs font-semibold text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 rounded-chip bg-sky px-3 py-2 text-[0.6875rem] leading-snug text-slate">
        Requirement: {JOURNEY_CUSTOMER.requirement}
      </p>
    </aside>
  )
}

export function TeamInbox({
  index,
  typingIndex,
  managerView,
  draft,
  onQuickReply,
}: {
  index: number
  typingIndex: number
  managerView: boolean
  draft: string | null
  onQuickReply: (text: string) => void
}) {
  const seen = WHATSAPP_SCRIPT.slice(0, index + 1).filter((m) => m.from !== 'system')
  const latest = seen[seen.length - 1]
  const viewer = managerView ? manager : rep

  return (
    <AppWindow
      title="Team inbox"
      right={
        <span
          className={cn(
            'inline-flex min-w-0 max-w-[10rem] items-center gap-1.5 rounded-full sm:max-w-none px-2.5 py-0.5 text-[0.6875rem] font-semibold',
            managerView ? 'bg-brand text-white' : 'bg-white text-ink ring-1 ring-line',
          )}
        >
          {managerView ? <Eye className="h-3 w-3 shrink-0" aria-hidden /> : null}
          <span className="truncate">
            {viewer.name}
            <span className="hidden sm:inline"> · {viewer.role}</span>
          </span>
        </span>
      }
    >
      <div className="grid min-w-0 md:grid-cols-[12.5rem_minmax(0,1fr)] xl:grid-cols-[12.5rem_minmax(0,1fr)_13.5rem]">
        {/* Conversation list */}
        <nav aria-label="Conversations" className="hidden min-w-0 border-r border-line md:block">
          <p className="px-4 pb-2 pt-3 text-[0.625rem] font-semibold uppercase tracking-wide text-slate">
            Open conversations
          </p>
          <ul>
            <li className="border-l-2 border-brand bg-sky/60 px-4 py-2.5">
              <p className="truncate text-sm font-semibold text-ink">{JOURNEY_CUSTOMER.name}</p>
              <p className="truncate text-xs text-slate">{latest?.attachment?.title ?? latest?.text}</p>
              <p className="mt-0.5 text-[0.625rem] text-slate">IndiaMART · {rep.name}</p>
            </li>
            {OTHER_THREADS.map((id) => {
              const e = SAMPLE_ENQUIRIES[id]
              return (
                <li key={id} className="border-l-2 border-transparent px-4 py-2.5">
                  <p className="truncate text-sm font-medium text-ink">{e.name}</p>
                  <p className="truncate text-xs text-slate">{e.requirement}</p>
                  <p className="mt-0.5 text-[0.625rem] text-slate">{sourceById(id).short}</p>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Active thread */}
        <div className="flex min-w-0 flex-col">
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2.5">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{JOURNEY_CUSTOMER.name}</p>
              <p className="truncate text-[0.6875rem] text-slate">
                {JOURNEY_CUSTOMER.company} · assigned to {rep.name}
              </p>
            </div>
            {managerView ? (
              <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[0.6875rem] font-semibold text-brand">
                Manager view · same thread
              </span>
            ) : null}
          </div>
          <div className="xl:hidden">
            <Profile index={index} compact />
          </div>
          <ol aria-label={`Conversation with ${JOURNEY_CUSTOMER.name}, team view`} className="min-w-0 flex-1 space-y-2.5 bg-sky/30 px-3 py-4 sm:px-4">
            {WHATSAPP_SCRIPT.map((m, i) =>
              m.from === 'system' ? (
                <SystemSlot key={m.id} msg={m} shown={i <= index} />
              ) : (
                <MessageSlot
                  key={m.id}
                  msg={m}
                  side={m.from === 'agent' ? 'out' : 'in'}
                  shown={i <= index}
                  typing={i === typingIndex}
                  typingLabel={m.from === 'agent' ? `${rep.name} is typing` : `${JOURNEY_CUSTOMER.name} is typing`}
                  templateBadge
                  author={m.from === 'agent' ? rep.name : undefined}
                />
              ),
            )}
          </ol>
          {/* Composer */}
          <div className="border-t border-line px-3 py-3 sm:px-4">
            <div role="group" aria-label="Quick replies" className="flex flex-wrap gap-1.5">
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => onQuickReply(q)}
                  aria-pressed={draft === q}
                  className={cn(
                    'min-h-10 rounded-full border px-3 text-xs font-semibold transition-colors duration-fast',
                    draft === q ? 'border-brand bg-brand/10 text-brand' : 'border-line bg-white text-ink hover:border-brand/50',
                  )}
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="mt-2.5 flex min-w-0 items-center gap-2 rounded-chip border border-line bg-white px-3 py-2">
              <p className={cn('min-w-0 flex-1 truncate text-sm', draft ? 'text-ink' : 'text-slate')}>
                {draft ? `${draft}…` : `Reply as ${viewer.name}`}
              </p>
              <span className="shrink-0 text-[0.6875rem] text-slate">Simulated, nothing is sent</span>
            </div>
          </div>
        </div>

        <div className="hidden xl:block">
          <Profile index={index} />
        </div>
      </div>
    </AppWindow>
  )
}
