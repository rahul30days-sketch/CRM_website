'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * Scroll-driven "follow one lead" sequence — motion moment #2.
 * Each stage reveals as it enters the viewport; under reduced motion the
 * stages render statically.
 */

const STAGES = [
  {
    time: '09:02',
    channel: 'Facebook Lead Ads',
    title: 'The enquiry arrives',
    body: 'Kavita fills your “Monsoon Offer” lead form. Before she has closed Instagram, the lead is in EZCRM — name, number, product interest, source stamped.',
    artifact: 'Lead #4821 created · source: facebook/monsoon-offer',
    signal: 'info' as const,
  },
  {
    time: '09:02',
    channel: 'Round-robin routing',
    title: 'A rep owns it in seconds',
    body: 'Routing rules assign the lead to Priya — it’s her turn — and her phone buzzes. No manager triage, no “whose lead is this?” on the group.',
    artifact: 'Assigned → Priya S. · notified · first-response timer started',
    signal: 'info' as const,
  },
  {
    time: '09:04',
    channel: 'WhatsApp Business',
    title: 'The conversation starts where customers answer',
    body: 'Priya replies from the shared inbox with an approved template and today’s price list from the media library. The whole thread lives on the lead’s timeline.',
    artifact: 'Template price_list_v3 sent ✓✓ read 09:06',
    signal: 'won' as const,
  },
  {
    time: '11:37',
    channel: 'Quotations',
    title: 'A GST-correct quote in six minutes',
    body: 'Four 5HP units picked from the catalog — HSN codes, tax slabs and bulk discount computed. Version 1 goes out as a branded PDF; every revision stays on record.',
    artifact: 'QT-1094 v1 · ₹2,40,000 · sent for digital signature',
    signal: 'info' as const,
  },
  {
    time: 'Day 3',
    channel: 'Pipeline',
    title: 'Closed — and counted',
    body: 'Kavita signs. The deal card drags to Won, revenue updates on the owner’s dashboard, and the automation enrolls her in the post-sale sequence.',
    artifact: 'Deal won · ₹2,40,000 · pipeline: Distribution',
    signal: 'won' as const,
  },
]

export function LeadJourney() {
  const prefersReduced = useReducedMotion()

  // Enhancement gate. Default OFF so items render fully visible (no opacity
  // animation) — the section is never blank, even in a background tab where
  // requestAnimationFrame is paused (which would otherwise strand the
  // whileInView reveal at opacity 0) or under reduced motion. It turns ON only
  // when the tab is visible and motion is allowed; the key change remounts the
  // items so the scroll reveal actually plays. These items sit below the fold,
  // so the remount happens off-screen with no visible flash.
  const [enhance, setEnhance] = React.useState(false)

  React.useEffect(() => {
    if (prefersReduced || typeof document === 'undefined') return
    if (!document.hidden) {
      setEnhance(true)
      return
    }
    const onVisible = () => {
      if (!document.hidden) {
        setEnhance(true)
        document.removeEventListener('visibilitychange', onVisible)
      }
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [prefersReduced])

  return (
    <ol className="relative space-y-6 border-l border-line pl-6 sm:pl-10">
      {STAGES.map((stage, i) => (
        <motion.li
          key={enhance ? `live-${i}` : `static-${i}`}
          initial={enhance ? { opacity: 0, x: 24 } : false}
          whileInView={enhance ? { opacity: 1, x: 0 } : undefined}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative"
        >
          <span
            className={cn(
              'absolute -left-[1.85rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-console sm:-left-[2.85rem]',
              stage.signal === 'won' ? 'bg-won' : 'bg-info',
            )}
            aria-hidden
          />
          <div className="panel-frame p-5 sm:p-6">
            <p className="kicker mb-2">
              <span className="text-marigold">{stage.time}</span> · {stage.channel}
            </p>
            <h3 className="font-display text-xl font-bold text-bright">{stage.title}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fog">{stage.body}</p>
            <p
              className={cn(
                'mt-4 inline-block rounded-chip border px-3 py-1.5 font-mono text-xs tabular-nums',
                stage.signal === 'won' ? 'border-won/40 text-won' : 'border-line text-fog',
              )}
            >
              {stage.artifact}
            </p>
          </div>
        </motion.li>
      ))}
    </ol>
  )
}
