'use client'

/**
 * Mobile half of the WhatsApp demo: the customer's phone, showing the SAME
 * conversation the team sees, mirrored (the customer's messages are the
 * outgoing ones here). Internal events, such as the assignment note, are
 * team-only and do not appear on the customer's phone. Drawn entirely in
 * code with neutral styling; no third-party logos.
 */

import { ChevronLeft } from 'lucide-react'
import { SELLER, WHATSAPP_SCRIPT } from '@/demo/sample-data'
import { MessageSlot } from './chat-parts'

export function PhoneView({ index, typingIndex }: { index: number; typingIndex: number }) {
  return (
    <div className="mx-auto w-full max-w-[20rem] rounded-[2.25rem] border border-line bg-ink p-2 shadow-float">
      <div className="overflow-hidden rounded-[1.75rem] bg-white">
        {/* status bar + notch */}
        <div className="relative flex h-7 items-center justify-between px-5 font-mono text-[0.625rem] text-ink">
          <span>{WHATSAPP_SCRIPT[Math.max(0, index)].time}</span>
          <span aria-hidden className="absolute left-1/2 top-1.5 h-4 w-20 -translate-x-1/2 rounded-full bg-ink" />
          <span aria-hidden>5G</span>
        </div>
        {/* chat header */}
        <div className="flex items-center gap-2 border-b border-line px-3 py-2">
          <ChevronLeft className="h-4 w-4 shrink-0 text-slate" aria-hidden />
          <span
            aria-hidden
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-won/10 font-mono text-[0.625rem] font-bold text-won"
          >
            SP
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{SELLER.name}</p>
            <p className="truncate text-[0.625rem] text-slate">Business account</p>
          </div>
        </div>
        <ol
          aria-label="Conversation, customer's phone view"
          className="space-y-2 bg-sky/40 px-2.5 py-3"
        >
          {WHATSAPP_SCRIPT.map((m, i) =>
            m.from === 'system' ? null : (
              <MessageSlot
                key={m.id}
                msg={m}
                side={m.from === 'customer' ? 'out' : 'in'}
                shown={i <= index}
                typing={i === typingIndex}
                typingLabel={m.from === 'customer' ? 'You are typing' : `${SELLER.name} is typing`}
                compact
              />
            ),
          )}
        </ol>
        <div className="flex items-center gap-2 border-t border-line px-3 py-2.5">
          <span className="min-w-0 flex-1 truncate rounded-full border border-line px-3 py-1.5 text-xs text-slate">
            Message
          </span>
        </div>
      </div>
    </div>
  )
}
