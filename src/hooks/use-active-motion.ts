'use client'

import { useEffect, useState, type RefObject } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Whether a continuously-animating element should be running right now:
 * on screen, tab visible, and the visitor has not asked for reduced motion.
 *
 * Use it to gate timers, requestAnimationFrame loops and `repeat: Infinity`
 * animations so nothing burns CPU/GPU while it can't be seen.
 */
export function useActiveMotion(ref: RefObject<Element | null>, rootMargin = '100px') {
  const reduce = useReducedMotion()
  const [inView, setInView] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // No IntersectionObserver (very old browsers): treat as always visible.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin])

  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState === 'visible')
    onVis()
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  return inView && visible && !reduce
}
