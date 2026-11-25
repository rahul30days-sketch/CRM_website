'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Reduced-motion preference, but only after hydration. The server can't know
 * the preference, so the first client render must match the server HTML;
 * switching to the static "final state" one effect later avoids a mismatch.
 */
export function useStill() {
  const reduce = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted && !!reduce
}
