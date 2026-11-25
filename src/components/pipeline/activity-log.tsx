'use client'

/**
 * Activity timeline: every move the visitor makes is logged here, newest
 * first. Announcements go through the section's own live region, so this
 * list is not itself live (that would double-announce).
 */

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { EASE } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { stageLabel, type ActivityEntry } from './model'

export function ActivityLog({ entries }: { entries: ActivityEntry[] }) {
  const reduce = useReducedMotion()
  if (!entries.length) {
    return (
      <p className="rounded-chip border border-dashed border-line px-3 py-4 text-xs leading-relaxed text-slate">
        No moves yet. Drag a deal or use <span className="font-semibold text-ink">Move to…</span> on any card,
        and each change is logged here.
      </p>
    )
  }
  return (
    <ol className="relative space-y-3 before:absolute before:bottom-1 before:left-[0.4375rem] before:top-1 before:w-px before:bg-line">
      {entries.slice(0, 6).map((e) => (
        <motion.li
          key={e.seq}
          className="relative pl-6"
          initial={reduce ? false : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          <span
            aria-hidden
            className={cn(
              'absolute left-0 top-1 h-[0.9375rem] w-[0.9375rem] rounded-full border-2 border-white',
              e.to === 'won' ? 'bg-won' : e.to === 'lost' ? 'bg-slate/50' : 'bg-brand',
            )}
          />
          <p className="text-xs leading-snug text-ink">
            <span className="font-semibold">{e.company}</span> moved to{' '}
            <span className="font-semibold">{stageLabel(e.to)}</span> by you
          </p>
          <p className="mt-0.5 flex items-center gap-1 font-mono text-[0.6875rem] text-slate">
            {stageLabel(e.from)}
            <ArrowRight className="h-3 w-3" aria-label="to" />
            {stageLabel(e.to)} · {e.time}
          </p>
        </motion.li>
      ))}
    </ol>
  )
}
