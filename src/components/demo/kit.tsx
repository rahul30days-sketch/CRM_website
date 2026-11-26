'use client'

/**
 * Shared pieces for every interactive demo on the site, so they label,
 * control and introduce themselves the same way.
 */

import * as React from 'react'
import { Pause, Play, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Required on every component that renders src/demo/sample-data. */
export function SampleBadge({
  className,
  label = 'Sample data · illustrative',
  tone = 'light',
}: {
  className?: string
  label?: string
  tone?: 'light' | 'night'
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold',
        tone === 'light' ? 'border-line bg-white text-slate' : 'border-night-line bg-night-raised text-white/80',
        className,
      )}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand" />
      {label}
    </span>
  )
}

/** Kicker + h2 + lede — the homepage section introduction. */
export function SectionHeader({
  kicker,
  title,
  lede,
  align = 'center',
  tone = 'light',
  id,
  className,
}: {
  kicker: string
  title: React.ReactNode
  lede?: React.ReactNode
  align?: 'center' | 'left'
  tone?: 'light' | 'night'
  id?: string
  className?: string
}) {
  return (
    <header className={cn(align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl', className)}>
      <p className={cn('kicker mb-3', tone === 'night' && 'text-cyan')}>{kicker}</p>
      <h2
        id={id}
        className={cn(
          'font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl',
          tone === 'night' ? 'text-white' : 'text-ink',
        )}
      >
        {title}
      </h2>
      {lede ? (
        <p
          className={cn(
            'mt-4 text-lg leading-relaxed',
            align === 'center' && 'mx-auto max-w-xl',
            tone === 'night' ? 'text-white/75' : 'text-slate',
          )}
        >
          {lede}
        </p>
      ) : null}
    </header>
  )
}

/**
 * Step controls for any stepped demo: previous / play-pause / next / replay,
 * plus a progress list. Fully keyboard operable; the live region announces
 * the current step.
 */
export function DemoControls({
  steps,
  index,
  onIndex,
  playing,
  onTogglePlay,
  onReplay,
  tone = 'light',
  label,
  className,
}: {
  steps: readonly { id: string; label: string }[]
  index: number
  onIndex: (i: number) => void
  playing?: boolean
  onTogglePlay?: () => void
  onReplay?: () => void
  tone?: 'light' | 'night'
  /** Accessible name for the control group, e.g. "Lead lifecycle steps". */
  label: string
  className?: string
}) {
  const btn = cn(
    'inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-fast disabled:opacity-40',
    tone === 'light'
      ? 'border-line bg-white text-ink hover:border-brand/40 hover:text-brand'
      : 'border-night-line bg-night-raised text-white hover:bg-white/10',
  )
  return (
    <div role="group" aria-label={label} className={cn('flex flex-wrap items-center gap-3', className)}>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          className={btn}
          onClick={() => onIndex(Math.max(0, index - 1))}
          disabled={index === 0}
          aria-label="Previous step"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </button>
        {onTogglePlay ? (
          <button
            type="button"
            className={btn}
            onClick={onTogglePlay}
            aria-label={playing ? 'Pause' : 'Play'}
            aria-pressed={playing}
          >
            {playing ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
          </button>
        ) : null}
        <button
          type="button"
          className={btn}
          onClick={() => onIndex(Math.min(steps.length - 1, index + 1))}
          disabled={index === steps.length - 1}
          aria-label="Next step"
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
        {onReplay ? (
          <button type="button" className={btn} onClick={onReplay} aria-label="Replay from the start">
            <RotateCcw className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
      </div>
      <ol className="flex flex-wrap items-center gap-1.5">
        {steps.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => onIndex(i)}
              aria-current={i === index ? 'step' : undefined}
              className={cn(
                'min-h-[2.5rem] rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-fast',
                i === index
                  ? tone === 'light'
                    ? 'bg-brand text-white'
                    : 'bg-white text-night'
                  : tone === 'light'
                    ? 'text-slate hover:bg-sky hover:text-ink'
                    : 'text-white/70 hover:bg-white/10 hover:text-white',
              )}
            >
              <span className="sr-only">Step {i + 1}: </span>
              {s.label}
            </button>
          </li>
        ))}
      </ol>
      <p className="sr-only" aria-live="polite">
        Step {index + 1} of {steps.length}: {steps[index]?.label}
      </p>
    </div>
  )
}

/** Mock app window chrome used by product demos. */
export function AppWindow({
  title,
  children,
  className,
  tone = 'light',
  right,
}: {
  title: string
  children: React.ReactNode
  className?: string
  tone?: 'light' | 'night'
  right?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-card border shadow-float',
        tone === 'light' ? 'border-line bg-white' : 'border-night-line bg-night-raised',
        className,
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between gap-3 border-b px-4 py-2.5',
          tone === 'light' ? 'border-line bg-sky/50' : 'border-night-line bg-night',
        )}
      >
        <div className="flex items-center gap-2">
          <span aria-hidden className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
          </span>
          <span
            className={cn('font-mono text-xs', tone === 'light' ? 'text-slate' : 'text-white/70')}
          >
            {title}
          </span>
        </div>
        {right}
      </div>
      {children}
    </div>
  )
}
