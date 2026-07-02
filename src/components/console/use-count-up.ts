'use client'

import * as React from 'react'

/**
 * Counts 0 → target once with an ease-out curve. When disabled (reduced
 * motion), returns the target immediately — no animation, same information.
 */
export function useCountUp(target: number, enabled: boolean, duration = 1400): number {
  const [value, setValue] = React.useState(enabled ? 0 : target)

  React.useEffect(() => {
    if (!enabled) {
      setValue(target)
      return
    }
    let frame: number
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, enabled, duration])

  return value
}
