'use client'

/**
 * Right-hand panels of the lead hub: the "Incoming leads" queue (newest on
 * top, five at most) and the activity timeline. New rows slide in with
 * opacity/transform only; under reduced motion they simply appear.
 * Every text-bearing element can shrink (min-w-0, truncate, line-clamp), so
 * the cards never exceed their column, down to 320px.
 */

import { AnimatePresence, motion } from 'framer-motion'
import { formatINR } from '@/lib/gst'
import { sourceById } from '@/demo/sample-data'
import type { HubEvent, HubLead } from './lead-hub-data'

const EASE = [0.22, 1, 0.36, 1] as const

export function IncomingLeads({ leads, reduce }: { leads: HubLead[]; reduce: boolean }) {
  return (
    <div className="panel-frame min-w-0 overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-sky/50 px-4 py-2.5">
        <h3 className="text-sm font-semibold text-ink">Incoming leads</h3>
        <span className="font-mono text-xs text-slate">{leads.length} shown</span>
      </div>
      <ul className="divide-y divide-line">
        <AnimatePresence initial={false}>
          {leads.map((l) => (
            <motion.li
              key={l.key}
              layout={reduce ? false : 'position'}
              initial={reduce ? false : { opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="min-w-0 px-4 py-3"
            >
              <div className="flex min-w-0 items-baseline justify-between gap-3">
                <p className="min-w-0 truncate text-sm font-semibold text-ink">{l.name}</p>
                <p className="shrink-0 font-mono text-sm font-semibold text-ink">{formatINR(l.value)}</p>
              </div>
              <p className="mt-0.5 truncate text-xs text-slate">
                {l.company} · {l.city}
              </p>
              <p className="mt-1 line-clamp-2 break-words text-xs text-slate">{l.requirement}</p>
              <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5">
                <span className="rounded-full border border-line bg-sky px-2 py-0.5 text-[0.6875rem] font-semibold text-ink">
                  {sourceById(l.sourceId).short}
                </span>
                <span className="flex min-w-0 items-center gap-1.5 text-xs text-slate">
                  <span
                    aria-hidden
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 font-mono text-[0.5625rem] font-bold text-brand"
                  >
                    {l.rep.initials}
                  </span>
                  <span className="truncate">{l.rep.name}</span>
                </span>
                <span className="ml-auto font-mono text-[0.6875rem] text-slate">{l.time}</span>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}

export function ActivityTimeline({ events, reduce }: { events: HubEvent[]; reduce: boolean }) {
  return (
    <div className="panel-frame min-w-0 px-4 py-3.5">
      <h3 className="text-sm font-semibold text-ink">Activity</h3>
      <ol className="relative mt-3 space-y-2.5 border-l border-line pl-4">
        <AnimatePresence initial={false}>
          {events.map((e) => (
            <motion.li
              key={e.key}
              initial={reduce ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, transition: { duration: 0 } }}
              transition={{ duration: 0.3, ease: EASE }}
              className="relative min-w-0 text-xs text-slate"
            >
              <span aria-hidden className="absolute -left-[1.3rem] top-1 h-2 w-2 rounded-full border-2 border-white bg-brand" />
              <span className="mr-2 font-mono text-ink">{e.time}</span>
              <span className="break-words">{e.text}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
    </div>
  )
}
