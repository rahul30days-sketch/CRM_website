'use client'

/**
 * Conversion events — provider-agnostic.
 *
 * No analytics platform is installed yet (decision pending), so track()
 * does two harmless things:
 *  1. pushes to `window.dataLayer` if a tag manager has created it;
 *  2. dispatches a `ezcrm:track` DOM event any future provider can listen to.
 * It never sends form contents or personal data — only the event name and
 * small non-identifying properties (plan name, demo id, step count).
 */

export type TrackEvent =
  | 'demo_cta_clicked'
  | 'playground_opened'
  | 'demo_completed'
  | 'pricing_calculator_used'
  | 'pricing_plan_selected'
  | 'demo_form_started'
  | 'demo_form_submitted'
  | 'trial_cta_clicked'

type Props = Record<string, string | number | boolean>

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

export function track(event: TrackEvent, props: Props = {}) {
  if (typeof window === 'undefined') return
  try {
    window.dataLayer?.push({ event, ...props })
    window.dispatchEvent(new CustomEvent('ezcrm:track', { detail: { event, ...props } }))
  } catch {
    // Analytics must never break the page.
  }
}
