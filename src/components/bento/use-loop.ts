'use client'

import { useEffect, useState } from 'react'

/**
 * A monotonic step counter that only advances while `running` is true.
 *
 * Callers pass a `running` flag already gated on useActiveMotion (on screen,
 * tab visible, motion allowed) so no interval ever ticks off screen. `offset`
 * delays the first tick so neighbouring cards don't change in lockstep.
 */
export function useLoop(running: boolean, intervalMs: number, offsetMs = 0) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!running) return
    let interval: ReturnType<typeof setInterval> | undefined
    const start = setTimeout(() => {
      setStep((s) => s + 1)
      interval = setInterval(() => setStep((s) => s + 1), intervalMs)
    }, offsetMs)
    return () => {
      clearTimeout(start)
      if (interval) clearInterval(interval)
    }
  }, [running, intervalMs, offsetMs])

  return step
}
