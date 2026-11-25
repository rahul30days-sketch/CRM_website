'use client'

/**
 * Compact conversion funnel: how many deals sit in each stage right now.
 * Bars grow with scaleX (transform only). Every row carries its count and
 * value as text, so the list itself is the accessible summary.
 */

import { motion, useReducedMotion } from 'framer-motion'
import { formatINRCompact } from '@/lib/gst'
import { EASE } from '@/lib/motion'
import { cn } from '@/lib/utils'
import type { stageCounts } from './model'

export function StageFunnel({ rows }: { rows: ReturnType<typeof stageCounts> }) {
  const reduce = useReducedMotion()
  const max = Math.max(1, ...rows.map((r) => r.count))
  return (
    <ol className="space-y-2.5" aria-label="Deals per stage">
      {rows.map((r) => (
        <li key={r.id} className="grid grid-cols-[6.5rem_1fr_auto] items-center gap-2.5 text-xs">
          <span className="truncate font-semibold text-ink">{r.label}</span>
          <span aria-hidden className="relative h-2.5 overflow-hidden rounded-full bg-sky">
            <motion.span
              className={cn(
                'absolute inset-0 origin-left rounded-full',
                r.id === 'won' ? 'bg-won' : r.id === 'lost' ? 'bg-slate/40' : 'bg-brand',
              )}
              initial={false}
              animate={{ scaleX: r.count / max }}
              transition={reduce ? { duration: 0 } : { duration: 0.45, ease: EASE }}
            />
          </span>
          <span className="whitespace-nowrap text-right font-mono tabular-nums text-slate">
            <span className="font-semibold text-ink">{r.count}</span>
            <span className="sr-only"> {r.count === 1 ? 'deal' : 'deals'},</span>
            <span className="ml-1.5">{formatINRCompact(r.value)}</span>
          </span>
        </li>
      ))}
    </ol>
  )
}
