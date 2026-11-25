'use client'

/**
 * Conversation module: a simulated WhatsApp thread per lead. The Balaji Agro
 * thread replays the shared WHATSAPP_SCRIPT; new leads open with the approved
 * template greeting. Visitor replies queue a canned customer answer that
 * arrives after a short delay (the provider owns the timer).
 *
 * Accessibility: the thread is a role="log" live region, so new messages are
 * announced; the composer is a labelled form; nothing is sent anywhere.
 */

import * as React from 'react'
import { FileText, Lock, Send, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { QUICK_REPLIES, WHATSAPP_SCRIPT } from '@/demo/sample-data'
import { Avatar, Hint, LeadPicker, ModuleHeader, brandBtn, fieldClass, smallBtn } from './ui'
import { firstName, quoteFor, usePlayground, useSelection } from './store'

const CATALOGUE = WHATSAPP_SCRIPT.find((m) => m.attachment?.kind === 'catalogue')?.attachment

export function ConversationModule() {
  const { state, dispatch } = usePlayground()
  const { lead, deal } = useSelection()
  const [draft, setDraft] = React.useState('')
  const [error, setError] = React.useState('')
  const scroller = React.useRef<HTMLDivElement>(null)
  const messages = lead ? (state.chats[lead.id] ?? []) : []
  const waiting = lead ? state.pendingReplies.includes(lead.id) : false

  React.useEffect(() => {
    const el = scroller.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages.length, waiting, lead?.id])

  if (!lead) return null

  const send = (text: string, attachment?: (typeof messages)[number]['attachment']) =>
    dispatch({ type: 'SEND_MESSAGE', leadId: lead.id, text, attachment })

  const quick = (q: string) => {
    if (q === 'Send quotation' && deal) {
      dispatch({ type: 'SEND_QUOTE', dealId: deal.id })
      return
    }
    if (q === 'Share catalogue') return send('Sure. Here is our range with specs.', CATALOGUE)
    if (q === 'Ask for site location') return send(`Could you share the site location in ${lead.city}?`)
    if (q === 'Book a call') return send('Can we book a short call today to go over the details?')
    send(q)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const t = draft.trim()
    if (!t) {
      setError('Type a message first.')
      return
    }
    setError('')
    send(t.slice(0, 500))
    setDraft('')
  }

  const quoteStatus = deal ? quoteFor(state, deal.id).status : 'draft'

  return (
    <div>
      <ModuleHeader
        title="Conversation"
        description="A shared WhatsApp inbox per lead, so the whole team sees the thread. Here it is simulated: no message is sent."
      />

      <div className="grid gap-4 lg:grid-cols-[15rem_1fr]">
        {/* Thread list on wide screens; a select on small ones. */}
        <div className="lg:hidden">
          <LeadPicker id="pg-chat-lead" label="Conversation with" />
        </div>
        <nav aria-label="Conversations" className="hidden min-w-0 lg:block">
          <ul className="max-h-[32rem] space-y-1 overflow-y-auto pr-1" tabIndex={0} aria-label="Threads">
            {state.leads.map((l) => {
              const last = (state.chats[l.id] ?? []).at(-1)
              const active = l.id === lead.id
              return (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => dispatch({ type: 'SELECT_LEAD', leadId: l.id })}
                    aria-current={active ? 'true' : undefined}
                    className={cn(
                      'w-full rounded-chip px-3 py-2 text-left transition-colors duration-fast hover:bg-sky/60',
                      active && 'bg-sky',
                    )}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-ink">{l.name}</span>
                      <span className="shrink-0 font-mono text-[0.6875rem] text-slate">{last?.time}</span>
                    </span>
                    <span className="block truncate text-xs text-slate">{last?.text ?? l.company}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <section aria-label={`WhatsApp thread with ${lead.name}`} className="min-w-0 overflow-hidden rounded-chip border border-line bg-white shadow-press">
          <header className="flex items-center gap-3 border-b border-line bg-sky/50 px-4 py-2.5">
            <span aria-hidden className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-won/10 text-sm font-bold text-won">
              {lead.name
                .split(/\s+/)
                .map((p) => p[0])
                .slice(0, 2)
                .join('')}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{lead.name}</p>
              <p className="truncate text-xs text-slate">
                {lead.company} · {lead.city}
              </p>
            </div>
            <span className="hidden items-center gap-1.5 text-xs text-slate sm:inline-flex">
              <Avatar repId={lead.repId} size="sm" />
              {lead.repId ? 'Owner' : 'No owner yet'}
            </span>
          </header>

          <p className="flex items-center justify-center gap-1.5 border-b border-line bg-white px-3 py-1.5 text-center text-[0.6875rem] font-semibold text-slate">
            <Lock className="h-3 w-3" aria-hidden />
            Simulated. No message is sent to anyone.
          </p>

          <div
            key={lead.id}
            ref={scroller}
            role="log"
            aria-live="polite"
            aria-label="Messages"
            tabIndex={0}
            className="h-[22rem] space-y-2 overflow-y-auto bg-mist/50 px-3 py-4 sm:px-4"
          >
            {messages.map((m) =>
              m.from === 'system' ? (
                <p key={m.id} className="mx-auto max-w-sm rounded-full bg-white px-3 py-1 text-center text-[0.6875rem] text-slate shadow-press">
                  {m.text}
                </p>
              ) : (
                <div key={m.id} className={cn('flex', m.from === 'agent' ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-press sm:max-w-[70%]',
                      m.from === 'agent' ? 'rounded-br-md bg-won/10 text-ink' : 'rounded-bl-md bg-white text-ink',
                    )}
                  >
                    <span className="sr-only">{m.from === 'agent' ? 'You: ' : `${firstName(lead.name)}: `}</span>
                    {m.template ? (
                      <span className="mb-1 flex items-center gap-1 text-[0.625rem] font-bold uppercase tracking-wide text-won">
                        <ShieldCheck className="h-3 w-3" aria-hidden />
                        Approved template
                      </span>
                    ) : null}
                    <p className="break-words">{m.text}</p>
                    {m.attachment ? (
                      <span className="mt-2 flex items-center gap-2 rounded-chip border border-line bg-white px-2.5 py-2">
                        <FileText className="h-4 w-4 shrink-0 text-brand" aria-hidden />
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-semibold text-ink">{m.attachment.title}</span>
                          <span className="block truncate text-[0.6875rem] text-slate">{m.attachment.meta}</span>
                        </span>
                      </span>
                    ) : null}
                    <span className="mt-1 block text-right font-mono text-[0.625rem] text-slate">{m.time}</span>
                  </div>
                </div>
              ),
            )}
            {waiting ? (
              <p className="text-xs italic text-slate">{firstName(lead.name)} is typing…</p>
            ) : null}
          </div>

          <div className="border-t border-line p-3">
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Quick replies">
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => quick(q)}
                  disabled={q === 'Send quotation' && quoteStatus === 'accepted'}
                  className={cn(smallBtn, 'h-9 rounded-full px-3 text-xs')}
                >
                  {q}
                </button>
              ))}
            </div>
            <form onSubmit={submit} className="mt-2.5 flex gap-2" noValidate>
              <label htmlFor="pg-chat-input" className="sr-only">
                Message to {lead.name}
              </label>
              <input
                id="pg-chat-input"
                className={cn(fieldClass, 'flex-1')}
                value={draft}
                maxLength={500}
                onChange={(e) => {
                  setDraft(e.target.value)
                  if (error) setError('')
                }}
                placeholder="Type a reply"
                autoComplete="off"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? 'pg-chat-err' : undefined}
              />
              <button type="submit" className={cn(brandBtn, 'shrink-0 px-3')}>
                <Send className="h-4 w-4" aria-hidden />
                <span className="sr-only sm:not-sr-only">Send</span>
              </button>
            </form>
            {error ? (
              <p id="pg-chat-err" className="mt-1 text-xs font-medium text-due">
                {error}
              </p>
            ) : null}
          </div>
        </section>
      </div>
      <Hint className="mt-4">“Send quotation” shares this lead’s current GST quotation as a PDF card. Edit it first in Quotation.</Hint>
    </div>
  )
}
