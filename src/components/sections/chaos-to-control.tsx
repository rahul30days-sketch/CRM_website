'use client'

/**
 * Section 03 — From scattered sales operations to complete control.
 *
 * Idea: the visitor drags a real comparison slider and watches eight tangible
 * artefacts of a messy sales day (a duplicate-ridden spreadsheet, an unread
 * WhatsApp, a quote with the wrong GST slab…) slide, straighten and snap into
 * one organised EZCRM workspace, each one turning into its resolved version.
 *
 * Mechanics: the <input type="range"> writes to a framer-motion value; a
 * spring smooths it and every card derives its own transform/opacity from
 * that value (no per-frame React state). React state only changes when the
 * slider crosses the halfway point, which drives the aria-live message.
 *
 * Accessibility: the slider is a native range input (arrow keys, Home/End)
 * with visible end labels and aria-valuetext; two quick buttons jump to
 * either end. The visual collage is aria-hidden; an equivalent list of
 * before/after pairs is in the server HTML for screen readers and crawlers.
 * Reduced motion: two side-by-side columns, the controls highlight one side
 * with no movement. Below lg: a two-button toggle over a stacked list.
 */

import { useRef, useState, type ChangeEvent } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { SampleBadge, SectionHeader } from '@/components/demo/kit'
import { CHAOS_ITEMS, type ChaosItem } from '@/components/lifecycle/chaos-items'
import { cn } from '@/lib/utils'

const LABEL_BEFORE = 'Without EZCRM'
const LABEL_AFTER = 'With EZCRM'

export function ChaosToControl() {
  const reduce = useReducedMotion()
  const inputRef = useRef<HTMLInputElement>(null)
  // 0 = without, 1 = with. Raw value follows the input; the spring is what cards read.
  const target = useMotionValue(0)
  const progress = useSpring(target, { stiffness: 160, damping: 26, mass: 0.9 })
  const fill = useTransform(target, (v) => `scaleX(${v})`)
  const [after, setAfter] = useState(false)

  useMotionValueEvent(target, 'change', (v) => {
    const next = v >= 0.5
    setAfter((prev) => (prev === next ? prev : next))
  })

  const valueText = (pct: number) =>
    pct <= 0 ? LABEL_BEFORE : pct >= 100 ? LABEL_AFTER : `${pct}% of the way to ${LABEL_AFTER}`

  const onSlide = (e: ChangeEvent<HTMLInputElement>) => {
    const pct = Number(e.currentTarget.value)
    e.currentTarget.setAttribute('aria-valuetext', valueText(pct))
    target.set(pct / 100)
  }

  const jump = (toAfter: boolean) => {
    const pct = toAfter ? 100 : 0
    const el = inputRef.current
    if (el) {
      el.value = String(pct)
      el.setAttribute('aria-valuetext', valueText(pct))
    }
    target.set(pct / 100)
    setAfter(toAfter)
  }

  const quickBtn = (active: boolean) =>
    cn(
      'inline-flex min-h-10 items-center justify-center rounded-full border px-4 text-sm font-semibold transition-colors duration-fast',
      active ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:border-brand/40 hover:text-brand',
    )

  return (
    <section className="py-16 lg:py-24" aria-labelledby="chaos-title">
      <div className="shell">
        <SectionHeader
          id="chaos-title"
          kicker="Before and after"
          title="From scattered sales operations to complete control."
          lede="The same sales day, run two ways. Drag the slider and watch the scattered pieces become one EZCRM workspace."
        />

        {/* Accessible equivalent of the collage — always in the server HTML. */}
        <div className="sr-only">
          <h3>{LABEL_BEFORE}, and what changes {LABEL_AFTER.toLowerCase()}</h3>
          <ul>
            {CHAOS_ITEMS.map((it) => (
              <li key={it.id}>
                {LABEL_BEFORE}: {it.before} {LABEL_AFTER}: {it.after}
              </li>
            ))}
          </ul>
        </div>

        {/* Controls */}
        <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Compare the sales day">
            <button type="button" className={quickBtn(!after)} aria-pressed={!after} onClick={() => jump(false)}>
              {LABEL_BEFORE}
            </button>
            <button type="button" className={quickBtn(after)} aria-pressed={after} onClick={() => jump(true)}>
              {LABEL_AFTER}
            </button>
            <SampleBadge className="ml-1" />
          </div>

          <div className="hidden w-full items-center gap-4 lg:flex">
            <span aria-hidden className="w-28 shrink-0 text-right text-sm font-semibold text-due">
              {LABEL_BEFORE}
            </span>
            <div className="relative h-10 flex-1">
              <span aria-hidden className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-line" />
              <motion.span
                aria-hidden
                style={{ transform: fill }}
                className="absolute inset-x-0 top-1/2 -mt-1 h-2 origin-left rounded-full bg-brand"
              />
              <input
                ref={inputRef}
                id="chaos-slider"
                type="range"
                min={0}
                max={100}
                step={1}
                defaultValue={0}
                onChange={onSlide}
                aria-label={`Compare: ${LABEL_BEFORE} to ${LABEL_AFTER}`}
                aria-valuetext={LABEL_BEFORE}
                aria-describedby="chaos-slider-hint"
                className={cn(
                  'relative h-10 w-full cursor-grab appearance-none bg-transparent active:cursor-grabbing',
                  '[&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:bg-transparent',
                  '[&::-webkit-slider-thumb]:-mt-2 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-brand [&::-webkit-slider-thumb]:shadow-soft',
                  '[&::-moz-range-track]:h-2 [&::-moz-range-track]:bg-transparent',
                  '[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-brand [&::-moz-range-thumb]:shadow-soft',
                )}
              />
            </div>
            <span aria-hidden className="w-28 shrink-0 text-sm font-semibold text-brand">
              {LABEL_AFTER}
            </span>
          </div>
          <p id="chaos-slider-hint" className="sr-only">
            Left is {LABEL_BEFORE}, right is {LABEL_AFTER}. Use the arrow keys to move between them.
          </p>
          <p className="sr-only" aria-live="polite">
            Showing the sales day {after ? LABEL_AFTER.toLowerCase() : LABEL_BEFORE.toLowerCase()}.
          </p>
        </div>

        {/* Desktop: the interactive collage (or side-by-side when motion is reduced). */}
        <div aria-hidden className="mt-8 hidden lg:block">
          {reduce ? <SideBySide after={after} /> : <Collage progress={progress} />}
        </div>

        {/* Below lg: a stacked list that toggles between the two states. */}
        <div aria-hidden className="mt-8 lg:hidden">
          <div
            className={cn(
              'rounded-card border p-3 transition-colors duration-base sm:p-4',
              after ? 'border-line bg-white shadow-glass' : 'border-due/20 bg-mist',
            )}
          >
            <p className={cn('kicker mb-3', after ? 'text-brand' : 'text-due')}>
              {after ? 'EZCRM · one workspace' : 'Scattered across tools'}
            </p>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {CHAOS_ITEMS.map((it, i) => (
                <motion.li
                  key={`${it.id}-${after ? 'a' : 'b'}`}
                  initial={reduce ? false : { opacity: 0, y: 8, rotate: after ? 0 : (i % 2 ? 1.5 : -1.5) }}
                  animate={{ opacity: 1, y: 0, rotate: after || reduce ? 0 : i % 2 ? 1.5 : -1.5 }}
                  transition={{ duration: 0.35, delay: reduce ? 0 : i * 0.035 }}
                  className="min-h-[7.5rem]"
                >
                  {after ? it.control : it.chaos}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Desktop collage ───────────────────────────────────────────────────── */

function Collage({ progress }: { progress: MotionValue<number> }) {
  const frameOpacity = useTransform(progress, [0.35, 0.85], [0, 1])
  const messOpacity = useTransform(progress, [0, 0.5], [1, 0])
  return (
    <div className="relative h-[540px] select-none">
      {/* the messy desk */}
      <motion.div
        style={{ opacity: messOpacity }}
        className="absolute inset-0 rounded-card border border-dashed border-due/25 bg-mist"
      >
        <p className="absolute left-5 top-4 kicker text-due">Scattered across tools</p>
      </motion.div>
      {/* the workspace frame that assembles around the cards */}
      <motion.div
        style={{ opacity: frameOpacity }}
        className="absolute inset-0 overflow-hidden rounded-card border border-line bg-white shadow-float"
      >
        <div className="flex items-center gap-2 border-b border-line bg-sky/50 px-4 py-2.5">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
          </span>
          <span className="font-mono text-xs text-slate">EZCRM · one workspace</span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-won/10 px-2.5 py-0.5 text-[11px] font-semibold text-won">
            <span className="h-1.5 w-1.5 rounded-full bg-won" />
            Everything in sync
          </span>
        </div>
      </motion.div>

      <div className="absolute inset-x-5 bottom-5 top-[3.75rem] grid grid-cols-4 grid-rows-2 gap-3">
        {CHAOS_ITEMS.map((it, i) => (
          <CollageCard key={it.id} item={it} index={i} progress={progress} />
        ))}
      </div>
    </div>
  )
}

function CollageCard({ item, index, progress }: { item: ChaosItem; index: number; progress: MotionValue<number> }) {
  // Each card starts a little later than the previous one, so they arrive in a ripple.
  const start = index * 0.035
  const local = useTransform(progress, [start, start + 0.7], [0, 1])
  const x = useTransform(local, [0, 1], [item.scatter.x, 0])
  const y = useTransform(local, [0, 1], [item.scatter.y, 0])
  const r = useTransform(local, [0, 1], [item.scatter.r, 0])
  const s = useTransform(local, [0, 1], [0.92, 1])
  const transform = useMotionTemplate`translate(${x}%, ${y}%) rotate(${r}deg) scale(${s})`
  const chaosOpacity = useTransform(local, [0.35, 0.6], [1, 0])
  const controlOpacity = useTransform(local, [0.45, 0.75], [0, 1])

  return (
    <motion.div style={{ transform }} className="relative min-h-0 will-change-transform">
      <motion.div style={{ opacity: chaosOpacity }} className="absolute inset-0">
        {item.chaos}
      </motion.div>
      <motion.div style={{ opacity: controlOpacity }} className="absolute inset-0">
        {item.control}
      </motion.div>
    </motion.div>
  )
}

/* ─── Reduced motion: two clean columns, nothing moves ─────────────────── */

function SideBySide({ after }: { after: boolean }) {
  const col = (active: boolean) =>
    cn('rounded-card border p-4', active ? 'border-brand bg-white ring-2 ring-brand' : 'border-line bg-mist')
  return (
    <div className="grid grid-cols-2 gap-5">
      <div className={col(!after)}>
        <p className="kicker mb-3 text-due">{LABEL_BEFORE}</p>
        <ul className="grid grid-cols-2 gap-2.5">
          {CHAOS_ITEMS.map((it) => (
            <li key={it.id} className="min-h-[8rem]">
              {it.chaos}
            </li>
          ))}
        </ul>
      </div>
      <div className={col(after)}>
        <p className="kicker mb-3 text-brand">{LABEL_AFTER}</p>
        <ul className="grid grid-cols-2 gap-2.5">
          {CHAOS_ITEMS.map((it) => (
            <li key={it.id} className="min-h-[8rem]">
              {it.control}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
