/**
 * Motion tokens — the one place durations and easing are defined.
 * Tailwind mirrors these as `ease-out` and `duration-fast|base|slow`.
 */

/** The site's single easing curve: fast start, long soft settle. */
export const EASE = [0.22, 1, 0.36, 1] as const

/** Durations in seconds (framer-motion units). */
export const DURATION = {
  fast: 0.15,
  base: 0.25,
  enter: 0.45,
  slow: 0.6,
} as const

/** Default viewport trigger for scroll reveals. */
export const IN_VIEW = { once: true, amount: 0.15 } as const
