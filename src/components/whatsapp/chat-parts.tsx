'use client'

/**
 * Building blocks shared by the team inbox and the customer's phone view of
 * the same WhatsApp conversation.
 *
 * Every message of the script is always rendered (server HTML, no-JS and
 * reduced motion get the whole conversation). Messages not yet reached in
 * the demo keep their slot but are hidden with `invisible` + opacity, so the
 * thread never jumps in height as it plays. The typing indicator overlays the
 * next message's slot. Transitions are CSS opacity/transform and switch off
 * under prefers-reduced-motion.
 */

import { motion } from 'framer-motion'
import { CheckCheck, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/demo/sample-data'

export type Side = 'in' | 'out'

export function TypingDots({ side, label }: { side: Side; label: string }) {
  return (
    <div
      className={cn(
        'absolute top-0 flex items-center gap-1 rounded-2xl border px-3 py-2.5',
        side === 'out' ? 'right-0 rounded-tr-sm border-won/30 bg-won/10' : 'left-0 rounded-tl-sm border-line bg-white',
      )}
    >
      <span className="sr-only">{label}</span>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          aria-hidden
          className="h-1.5 w-1.5 rounded-full bg-slate"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  )
}

function Attachment({ a }: { a: NonNullable<ChatMessage['attachment']> }) {
  return (
    <div className="mb-1.5 flex min-w-0 items-center gap-2.5 rounded-chip border border-line bg-white px-2.5 py-2">
      <span
        aria-hidden
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
          a.kind === 'quotation' ? 'bg-brand/10 text-brand' : 'bg-due/10 text-due',
        )}
      >
        <FileText className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xs font-semibold text-ink">{a.title}</span>
        <span className="block truncate text-[0.6875rem] text-slate">
          {a.kind === 'catalogue' ? 'Catalogue' : 'Quotation'} · {a.meta}
        </span>
      </span>
    </div>
  )
}

export function MessageSlot({
  msg,
  side,
  shown,
  typing,
  typingLabel,
  templateBadge,
  author,
  compact,
}: {
  msg: ChatMessage
  side: Side
  shown: boolean
  typing: boolean
  typingLabel: string
  /** Show the "Approved template" marker (team inbox only). */
  templateBadge?: boolean
  /** Small author line for outgoing team messages. */
  author?: string
  compact?: boolean
}) {
  return (
    <li className={cn('relative flex min-w-0', side === 'out' ? 'justify-end' : 'justify-start')}>
      <div
        aria-hidden={!shown || undefined}
        className={cn(
          'min-w-0 max-w-[85%] rounded-2xl border px-3 py-2 transition duration-base ease-out motion-reduce:transition-none',
          side === 'out' ? 'rounded-tr-sm border-won/30 bg-won/10' : 'rounded-tl-sm border-line bg-white',
          shown ? 'translate-y-0 opacity-100' : 'invisible translate-y-1 opacity-0',
        )}
      >
        {templateBadge && msg.template ? (
          <p className="mb-1 inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-won ring-1 ring-won/30">
            Approved template
          </p>
        ) : null}
        {msg.attachment ? <Attachment a={msg.attachment} /> : null}
        <p className={cn('break-words text-ink', compact ? 'text-[0.8125rem] leading-snug' : 'text-sm')}>
          {msg.text}
        </p>
        <p className="mt-1 flex items-center justify-end gap-1 text-right font-mono text-[0.625rem] text-slate">
          {author ? <span className="truncate font-sans">{author} ·</span> : null}
          <span>{msg.time}</span>
          {side === 'out' ? <CheckCheck className="h-3 w-3 text-brand" aria-hidden /> : null}
        </p>
      </div>
      {typing ? <TypingDots side={side} label={typingLabel} /> : null}
    </li>
  )
}

export function SystemSlot({ msg, shown }: { msg: ChatMessage; shown: boolean }) {
  return (
    <li className="flex justify-center">
      <p
        aria-hidden={!shown || undefined}
        className={cn(
          'max-w-[92%] rounded-full border border-line bg-sky px-3 py-1 text-center text-[0.6875rem] font-medium text-slate transition duration-base ease-out motion-reduce:transition-none',
          shown ? 'opacity-100' : 'invisible opacity-0',
        )}
      >
        {msg.text}
      </p>
    </li>
  )
}
