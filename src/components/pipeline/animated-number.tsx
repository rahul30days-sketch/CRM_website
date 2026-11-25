'use client'

/**
 * A number that tweens from its previous value to the new one when it
 * changes. The tween writes straight to the text node (no React render per
 * frame). Screen readers get the final value only, via a visually hidden copy.
 * With reduced motion the new value appears at once.
 */

import { useEffect, useRef } from 'react'
import { animate, useReducedMotion } from 'framer-motion'
import { EASE } from '@/lib/motion'

export function AnimatedNumber({
  value,
  format,
  className,
}: {
  value: number
  format: (n: number) => string
  className?: string
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const prev = useRef(value)

  useEffect(() => {
    const el = ref.current
    const from = prev.current
    prev.current = value
    if (!el) return
    if (reduce || from === value) {
      el.textContent = format(value)
      return
    }
    const controls = animate(from, value, {
      duration: 0.6,
      ease: EASE,
      onUpdate: (v) => {
        el.textContent = format(Math.round(v))
      },
    })
    return () => controls.stop()
  }, [value, format, reduce])

  return (
    <span className={className}>
      <span ref={ref} aria-hidden>
        {format(value)}
      </span>
      <span className="sr-only">{format(value)}</span>
    </span>
  )
}
