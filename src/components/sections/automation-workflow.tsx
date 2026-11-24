'use client'

/**
 * Section 11 — One trigger. An entire workflow in motion.
 *
 * A workflow chain that activates node-by-node to show how one event cascades
 * through EZCRM automations. Auto-plays once on view, replayable on demand.
 * framer-motion; nodes reflect supported automation actions.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Inbox, UserPlus, Users, CalendarClock, MessageCircle, BellRing, Play } from 'lucide-react'

const NODES = [
  { icon: Inbox, label: 'New enquiry', sub: 'IndiaMART' },
  { icon: UserPlus, label: 'Lead created', sub: 'Auto-captured' },
  { icon: Users, label: 'Rep assigned', sub: 'Round-robin' },
  { icon: CalendarClock, label: 'Follow-up scheduled', sub: '+2 hours' },
  { icon: MessageCircle, label: 'Customer contacted', sub: 'WhatsApp template' },
  { icon: BellRing, label: 'Manager notified', sub: 'If no reply in 1h' },
]

export function AutomationWorkflow() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [step, setStep] = useState(reduce ? NODES.length : -1)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const run = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setStep(-1)
    NODES.forEach((_, i) => {
      timers.current.push(setTimeout(() => setStep(i), 350 + i * 650))
    })
  }, [])

  useEffect(() => {
    if (inView && !reduce) run()
    return () => timers.current.forEach(clearTimeout)
  }, [inView, reduce, run])

  return (
    <section className="shell py-14 lg:py-20">
      <header className="mx-auto max-w-2xl text-center">
        <p className="kicker mb-3">Funnels & automations</p>
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
          One trigger. An entire workflow in motion.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate">
          Set the rule once; EZCRM runs the busywork — assign, remind, message and escalate — every single time.
        </p>
      </header>

      <div ref={ref} className="mx-auto mt-12 max-w-4xl">
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-2">
          {NODES.map((n, i) => {
            const on = i <= step
            const Icon = n.icon
            return (
              <div key={n.label} className="relative flex flex-col items-center text-center">
                <motion.div
                  animate={{
                    backgroundColor: on ? 'rgb(43,92,230)' : 'rgb(255,255,255)',
                    color: on ? 'rgb(255,255,255)' : 'rgb(84,96,122)',
                    scale: i === step ? 1.12 : 1,
                    borderColor: on ? 'rgb(43,92,230)' : 'rgb(226,233,245)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                  className="grid h-14 w-14 place-items-center rounded-2xl border shadow-soft"
                >
                  <Icon className="h-6 w-6" aria-hidden />
                </motion.div>
                <p className="mt-2 text-xs font-semibold text-ink">{n.label}</p>
                <p className="font-mono text-[10px] text-slate">{n.sub}</p>
                {/* connector to next (desktop) */}
                {i < NODES.length - 1 && (
                  <span className="absolute right-[-0.5rem] top-7 hidden h-px w-4 bg-line lg:block">
                    <motion.span className="block h-full bg-brand" initial={{ width: 0 }} animate={{ width: on && i < step ? '100%' : 0 }} transition={{ duration: 0.4 }} />
                  </span>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={run}
            className="inline-flex items-center gap-2 rounded-chip border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-soft transition-colors hover:border-brand/40"
          >
            <Play className="h-4 w-4 text-brand" aria-hidden /> Replay automation
          </button>
        </div>
      </div>
    </section>
  )
}
