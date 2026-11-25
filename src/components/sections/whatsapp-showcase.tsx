'use client'

/**
 * Section 06 — WhatsApp: one conversation, two synchronized views.
 *
 * Left, EZCRM's shared team inbox (conversation list, the thread with Rakesh
 * Gupta, customer profile, quick replies, the approved template marker).
 * Right, the customer's phone showing the same thread, mirrored, in step.
 * Messages from WHATSAPP_SCRIPT arrive one by one (typing indicator, then
 * the message), including the catalogue and quotation attachments and the
 * team-only assignment note. "Manager view" shows that Vikram, the sales
 * manager, sees the same thread.
 *
 * Intro copy (kicker, heading, body, points) comes from the CMS.
 *
 * Controls: DemoControls (previous / play-pause / next / replay, step list,
 * live-region announcement). Autoplay starts once, when the section first
 * comes on screen, and runs only while useActiveMotion is true; pause or any
 * step choice stops it. Below lg, a two-button switch flips between the
 * inbox and the phone (both stay in the HTML).
 *
 * SSR / no JS / reduced motion: the whole conversation is rendered and
 * shown; under reduced motion autoplay never starts and nothing animates.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useReducedMotion } from 'framer-motion'
import { Check, Eye, Info } from 'lucide-react'
import { DemoControls, SampleBadge, SectionHeader } from '@/components/demo/kit'
import { buttonVariants } from '@/components/ui/button'
import { useActiveMotion } from '@/hooks/use-active-motion'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/utils'
import { WHATSAPP_SCRIPT } from '@/demo/sample-data'
import { TeamInbox } from '@/components/whatsapp/team-inbox'
import { PhoneView } from '@/components/whatsapp/phone-view'

const STEP_LABELS: Record<string, string> = {
  m1: 'Template sent',
  m2: 'Customer replies',
  m3: 'Catalogue shared',
  m4: 'Installation asked',
  m5: 'Quotation sent',
  m6: 'Assigned',
  m7: 'Approved',
}
const STEPS = WHATSAPP_SCRIPT.map((m) => ({ id: m.id, label: STEP_LABELS[m.id] ?? m.id }))
const LAST = WHATSAPP_SCRIPT.length - 1

const TERMS = ['WhatsApp Business Platform (official API)', 'Approved message templates', 'Customer opt-in']

export function WhatsAppShowcase({
  kicker,
  heading,
  body,
  points,
}: {
  kicker: string
  heading: string
  body: string
  points: string[]
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const active = useActiveMotion(sectionRef)
  const prefersReduced = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const reduce = mounted && !!prefersReduced

  // Full conversation by default: that is what SSR and reduced motion show.
  const [index, setIndex] = useState(LAST)
  const [playing, setPlaying] = useState(false)
  const [typingIndex, setTypingIndex] = useState(-1)
  const [managerView, setManagerView] = useState(false)
  const [draft, setDraft] = useState<string | null>(null)
  const [view, setView] = useState<'inbox' | 'phone'>('inbox')
  const interacted = useRef(false)
  const autoStarted = useRef(false)
  const completed = useRef(false)

  // Start the demo once, the first time it is genuinely on screen.
  useEffect(() => {
    if (!active || autoStarted.current || interacted.current) return
    autoStarted.current = true
    setIndex(0)
    setPlaying(true)
  }, [active])

  // Playback: typing indicator, then the next message.
  useEffect(() => {
    if (!playing || !active) return
    if (index >= LAST) {
      setPlaying(false)
      if (!completed.current) {
        completed.current = true
        track('demo_completed', { demo: 'whatsapp' })
      }
      return
    }
    const next = WHATSAPP_SCRIPT[index + 1]
    const isSystem = next.from === 'system'
    const t1 = isSystem ? undefined : setTimeout(() => setTypingIndex(index + 1), 900)
    const t2 = setTimeout(
      () => {
        setTypingIndex(-1)
        setIndex(index + 1)
      },
      isSystem ? 1400 : 2400,
    )
    return () => {
      if (t1) clearTimeout(t1)
      clearTimeout(t2)
      setTypingIndex(-1)
    }
  }, [playing, active, index])

  const goTo = useCallback((i: number) => {
    interacted.current = true
    setPlaying(false)
    setIndex(i)
  }, [])

  const togglePlay = useCallback(() => {
    interacted.current = true
    if (!playing && index >= LAST) setIndex(0)
    setPlaying(!playing)
  }, [playing, index])

  const replay = useCallback(() => {
    interacted.current = true
    setIndex(0)
    setPlaying(!reduce)
  }, [reduce])

  return (
    <section ref={sectionRef} aria-labelledby="whatsapp-title" className="shell py-16 lg:py-24">
      {/* Intro (CMS copy) */}
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
        <SectionHeader
          id="whatsapp-title"
          align="left"
          kicker={kicker}
          title={heading}
          lede={body}
          className="lg:col-span-7"
        />
        <div className="min-w-0 lg:col-span-5">
          <ul className="space-y-2.5">
            {points.map((p) => (
              <li key={p} className="flex gap-3 text-sm text-slate">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-won" aria-hidden />
                <span className="min-w-0">{p}</span>
              </li>
            ))}
          </ul>
          <ul aria-label="Terminology" className="mt-5 flex flex-wrap gap-2">
            {TERMS.map((t) => (
              <li key={t} className="rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-ink">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 lg:mt-12">
        <DemoControls
          label="WhatsApp conversation steps"
          steps={STEPS}
          index={index}
          onIndex={goTo}
          playing={playing}
          onTogglePlay={reduce ? undefined : togglePlay}
          onReplay={replay}
        />
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setManagerView((v) => !v)}
            aria-pressed={managerView}
            className={cn(
              'inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-xs font-semibold transition-colors duration-fast',
              managerView ? 'border-brand bg-brand text-white' : 'border-line bg-white text-ink hover:border-brand/50',
            )}
          >
            <Eye className="h-3.5 w-3.5" aria-hidden />
            Manager view
          </button>
          <SampleBadge />
        </div>
      </div>

      {/* Below lg: switch between the two views */}
      <div role="group" aria-label="Choose a view" className="mt-6 grid grid-cols-2 gap-1 rounded-full border border-line bg-white p-1 lg:hidden">
        {(
          [
            ['inbox', 'Team inbox'],
            ['phone', "Customer's phone"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setView(id)}
            aria-pressed={view === id}
            className={cn(
              'min-h-10 rounded-full px-3 text-xs font-semibold transition-colors duration-fast',
              view === id ? 'bg-ink text-white' : 'text-slate hover:text-ink',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid min-w-0 items-start gap-8 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className={cn('min-w-0', view === 'phone' && 'max-lg:hidden')}>
          <TeamInbox
            index={index}
            typingIndex={typingIndex}
            managerView={managerView}
            draft={draft}
            onQuickReply={(q) => setDraft((d) => (d === q ? null : q))}
          />
          {managerView ? (
            <p className="mt-3 text-xs text-slate">
              Vikram Singh (sales manager) sees the same thread and history as Priya Sharma.
            </p>
          ) : null}
        </div>
        <div className={cn('min-w-0', view === 'inbox' && 'max-lg:hidden')}>
          <PhoneView index={index} typingIndex={typingIndex} />
          <p className="mt-3 text-center text-xs text-slate">
            The customer&apos;s phone, in sync. Team-only notes stay in EZCRM.
          </p>
        </div>
      </div>

      {/* Responsible note + CTA */}
      <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex max-w-2xl gap-2.5 text-xs leading-relaxed text-slate">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
          <span>
            Uses the official WhatsApp Business Platform. Template messages need Meta approval and customer
            opt-in; accounts must follow WhatsApp Business policies. This demo is simulated; nothing is sent.
          </span>
        </p>
        <Link
          href="/features/whatsapp"
          onClick={() => track('demo_cta_clicked', { from: 'whatsapp' })}
          className={cn(buttonVariants({ variant: 'secondary' }), 'shrink-0 self-start sm:self-auto')}
        >
          See the WhatsApp module
        </Link>
      </div>
    </section>
  )
}
