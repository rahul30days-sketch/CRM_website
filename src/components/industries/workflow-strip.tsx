'use client'

/**
 * The sales process for one industry as a numbered strip: horizontal from md
 * up, vertical on phones. A progress line (scaleX / scaleY, transform only)
 * fills up to the current step.
 *
 * Steps are real buttons: choosing one jumps there and pauses the loop; the
 * change is announced through a polite live region (auto-advance is not
 * announced, to avoid chatter). Every label is plain text in the server HTML.
 */

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EASE } from '@/lib/motion'

export function WorkflowStrip({
  steps,
  index,
  onSelect,
  still,
  label,
  announcement,
}: {
  steps: string[]
  index: number
  onSelect: (i: number) => void
  still: boolean
  label: string
  announcement: string
}) {
  const progress = steps.length > 1 ? index / (steps.length - 1) : 1
  const transition = still ? { duration: 0 } : { duration: 0.6, ease: EASE }

  return (
    <div className="relative">
      <ol aria-label={label} className="relative flex flex-col gap-1 md:flex-row md:gap-0">
        {/* Vertical track (phones) */}
        <span aria-hidden className="absolute bottom-5 left-5 top-5 w-px bg-line md:hidden">
          <motion.span
            className="absolute inset-0 origin-top bg-brand"
            initial={false}
            animate={{ scaleY: progress }}
            transition={transition}
          />
        </span>
        {/* Horizontal track (md and up) */}
        <span
          aria-hidden
          className="absolute top-5 hidden h-px bg-line md:block"
          style={{ left: `${50 / steps.length}%`, right: `${50 / steps.length}%` }}
        >
          <motion.span
            className="absolute inset-0 origin-left bg-brand"
            initial={false}
            animate={{ scaleX: progress }}
            transition={transition}
          />
        </span>

        {steps.map((s, i) => {
          const done = i < index
          const current = i === index
          return (
            <li key={s} className="relative md:flex-1">
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-current={current ? 'step' : undefined}
                className="group flex w-full items-center gap-3 rounded-chip py-0.5 text-left md:flex-col md:gap-2 md:px-1 md:text-center"
              >
                <span
                  className={cn(
                    'relative grid h-10 w-10 shrink-0 place-items-center rounded-full border font-mono text-xs font-semibold transition-colors duration-base',
                    current && 'border-brand bg-brand text-white shadow-press',
                    done && 'border-brand bg-sky text-brand',
                    !current && !done && 'border-line bg-white text-slate group-hover:border-brand/40',
                  )}
                >
                  {done ? <Check className="h-4 w-4" aria-hidden /> : i + 1}
                  {current && !still ? (
                    <motion.span
                      key={index}
                      aria-hidden
                      className="absolute inset-0 rounded-full border-2 border-brand"
                      initial={{ scale: 1, opacity: 0.7 }}
                      animate={{ scale: 1.45, opacity: 0 }}
                      transition={{ duration: 1.2, ease: EASE }}
                    />
                  ) : null}
                </span>
                <span
                  className={cn(
                    'text-sm leading-tight md:text-xs lg:text-sm',
                    current ? 'font-semibold text-ink' : 'text-slate',
                  )}
                >
                  <span className="sr-only">Step {i + 1}: </span>
                  {s}
                  {done ? <span className="sr-only"> (done)</span> : null}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </div>
  )
}
