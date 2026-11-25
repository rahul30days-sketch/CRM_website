'use client'

/**
 * Pause / play control for ambient, looping decoration (WCAG 2.2.2). Rendered
 * by the hero and the final CTA; the parent hides it when motion is reduced.
 */

import { Pause, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MotionToggle({
  paused,
  onToggle,
  tone = 'light',
  className,
}: {
  paused: boolean
  onToggle: () => void
  tone?: 'light' | 'night'
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={paused}
      className={cn(
        'inline-flex h-10 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-colors duration-fast',
        tone === 'light'
          ? 'border-line bg-white text-slate hover:border-brand/40 hover:text-ink'
          : 'border-night-line bg-night-raised text-white/80 hover:bg-white/10 hover:text-white',
        className,
      )}
    >
      {paused ? <Play className="h-3.5 w-3.5" aria-hidden /> : <Pause className="h-3.5 w-3.5" aria-hidden />}
      {paused ? 'Play animation' : 'Pause animation'}
    </button>
  )
}
