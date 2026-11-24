'use client'

/**
 * CountUp — animates the numeric part of a stat string ("12,400+", "40%",
 * "₹8.4Cr") up from zero when it scrolls into view. The literal final string
 * is server-rendered as the element's text, so crawlers and reduced-motion /
 * no-JS users see the real value; JS only overrides it during the animation.
 */

import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

function parse(value: string): { prefix: string; num: number; decimals: number; suffix: string } | null {
  const m = value.match(/^(\D*?)([\d,]+(?:\.\d+)?)(\D*)$/)
  if (!m) return null
  const raw = m[2].replace(/,/g, '')
  const num = parseFloat(raw)
  if (!isFinite(num)) return null
  const decimals = raw.includes('.') ? raw.split('.')[1].length : 0
  return { prefix: m[1], num, decimals, suffix: m[3] }
}

export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(value)
  const parsed = parse(value)

  useEffect(() => {
    if (!inView || reduce || !parsed) return
    const controls = animate(0, parsed.num, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(v) {
        const formatted =
          parsed.decimals > 0
            ? v.toFixed(parsed.decimals)
            : Math.round(v).toLocaleString('en-IN')
        setDisplay(`${parsed.prefix}${formatted}${parsed.suffix}`)
      },
      onComplete() {
        setDisplay(value)
      },
    })
    return () => controls.stop()
  }, [inView, reduce, parsed, value])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}
