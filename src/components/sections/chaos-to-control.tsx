'use client'

/**
 * Section 03 — From sales chaos to complete control.
 *
 * A before → after comparison: the daily scramble (leads in spreadsheets,
 * unread WhatsApps, missed enquiries, overdue follow-ups) on the left, each one
 * resolved inside one EZCRM workspace on the right, with the brand core
 * bridging them. Clean reveal-on-scroll — no pinned stage. Reduced-motion just
 * shows the content. Items are illustrative.
 */

import {
  FileSpreadsheet, MessageSquareWarning, PhoneMissed, Clock, FileText, Receipt,
  X, Check, ArrowRight, ArrowDown,
} from 'lucide-react'
import { Reveal, StaggerGroup, staggerItem } from '@/components/motion/reveal'
import { motion, useReducedMotion } from 'framer-motion'

type Pair = { icon: typeof FileSpreadsheet; pain: string; fix: string }

const PAIRS: Pair[] = [
  { icon: FileSpreadsheet, pain: 'Leads buried in Sheet3(final)(2).xlsx', fix: 'Auto-captured and assigned to a rep' },
  { icon: MessageSquareWarning, pain: '7 WhatsApp enquiries unread since morning', fix: 'Answered from one shared inbox' },
  { icon: PhoneMissed, pain: 'IndiaMART enquiry called back 2 hours late', fix: 'Routed and called within 3 minutes' },
  { icon: Clock, pain: 'Follow-up with Kavita overdue by 2 days', fix: 'Reminder set — and done on time' },
  { icon: FileText, pain: 'Paper quote, wrong HSN and old price', fix: 'GST-correct quote sent for e-approval' },
  { icon: Receipt, pain: '₹2.1L payment uncollected, forgotten', fix: 'Tracked against the deal until paid' },
]

export function ChaosToControl() {
  const reduce = useReducedMotion()

  return (
    <section className="shell py-14 lg:py-20">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="kicker mb-3">Chaos → control</p>
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
          Your sales shouldn&rsquo;t be scattered. Your opportunities shouldn&rsquo;t be missed.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate">
          The same day, run two ways. On the left, the scramble. On the right, one EZCRM workspace.
        </p>
      </Reveal>

      <div className="mt-12 grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr]">
        {/* BEFORE — the scramble */}
        <Reveal className="h-full">
          <div className="h-full rounded-[1.5rem] border border-[rgb(var(--c-due))]/25 bg-[rgb(var(--c-due))]/[0.04] p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[rgb(var(--c-due))]/15 text-[rgb(var(--c-due))]">
                <X className="h-4 w-4" aria-hidden />
              </span>
              <p className="text-sm font-bold uppercase tracking-wide text-[rgb(var(--c-due))]">Without a CRM</p>
            </div>
            <ul className="space-y-2.5">
              {PAIRS.map((p) => {
                const Icon = p.icon
                return (
                  <li key={p.pain} className="flex items-start gap-3 rounded-chip border border-line bg-white/70 p-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[rgb(var(--c-due))]/10 text-[rgb(var(--c-due))]">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="pt-0.5 text-sm text-slate line-through decoration-[rgb(var(--c-due))]/40">
                      {p.pain}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </Reveal>

        {/* bridge */}
        <div className="flex items-center justify-center">
          <motion.div
            initial={reduce ? false : { scale: 0.7, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.15 }}
            className="relative grid h-16 w-16 place-items-center rounded-2xl border border-brand/20 bg-white shadow-float"
          >
            <span className="font-display text-sm font-extrabold tracking-tight text-ink">
              EZ<span className="text-brand">CRM</span>
            </span>
            <span className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-brand lg:block">
              <ArrowRight className="h-6 w-6" aria-hidden />
            </span>
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-brand lg:hidden">
              <ArrowDown className="h-6 w-6" aria-hidden />
            </span>
          </motion.div>
        </div>

        {/* AFTER — one workspace */}
        <div className="h-full">
          <div className="h-full overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-float">
            <div className="flex items-center gap-2 border-b border-line px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[rgb(var(--c-due))]/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#F5B301]/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-[rgb(var(--c-won))]/60" />
              <span className="ml-2 font-mono text-[11px] uppercase tracking-widest text-slate">
                EZCRM · One workspace
              </span>
            </div>
            <StaggerGroup className="space-y-2.5 p-5 sm:p-6">
              {PAIRS.map((p) => (
                <motion.div
                  key={p.fix}
                  variants={reduce ? undefined : staggerItem}
                  className="flex items-start gap-3 rounded-chip border border-line bg-sky/40 p-3"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[rgb(var(--c-won))] text-white">
                    <Check className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="pt-0.5 text-sm font-medium text-ink">{p.fix}</span>
                </motion.div>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </div>

      <Reveal className="mt-8 text-center" delay={0.1}>
        <p className="mx-auto max-w-xl text-lg font-semibold text-ink">
          From sales chaos to complete control — every lead, message and quote in one place.
        </p>
      </Reveal>
    </section>
  )
}
