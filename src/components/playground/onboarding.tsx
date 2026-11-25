'use client'

/**
 * Guided onboarding: a five-step checklist that ticks itself off from store
 * milestones (nothing to click "done"). Each step has a Go button to the
 * module where it happens. Progress is announced politely; once every step is
 * done the panel offers the Book a demo CTA. Dismissible; reopen from the
 * playground toolbar.
 */

import Link from 'next/link'
import { ArrowRight, Check, X } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/utils'
import { ONBOARDING_STEPS, usePlayground } from './store'

export function Onboarding() {
  const { state, dispatch, navigate } = usePlayground()
  const done = ONBOARDING_STEPS.filter((s) => state.milestones[s.id]).length
  const complete = done === ONBOARDING_STEPS.length
  const nextStep = ONBOARDING_STEPS.find((s) => !state.milestones[s.id])

  return (
    <section
      aria-labelledby="pg-guide-title"
      className={cn('mb-5 rounded-chip border p-3 sm:p-4', complete ? 'border-won/40 bg-won/5' : 'border-brand/25 bg-sky/50')}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 id="pg-guide-title" className="text-sm font-semibold text-ink">
            {complete ? 'You ran a full sales cycle' : 'Guided tour: one lead, start to finish'}
          </h2>
          <p className="text-xs text-slate" aria-live="polite">
            <span className="font-mono">{done}</span> of <span className="font-mono">{ONBOARDING_STEPS.length}</span> steps done
            {nextStep ? ` · Next: ${nextStep.label.toLowerCase()}` : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_GUIDE', dismissed: true })}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate hover:bg-white hover:text-ink"
          aria-label="Hide the guided tour"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-white" aria-hidden>
        <div
          className={cn(
            'h-full w-full origin-left rounded-full transition-transform duration-slow ease-out motion-reduce:transition-none',
            complete ? 'bg-won' : 'bg-brand',
          )}
          style={{ transform: `scaleX(${done / ONBOARDING_STEPS.length})` }}
        />
      </div>

      <ol className="mt-3 grid gap-1.5 sm:grid-cols-5 sm:gap-2">
        {ONBOARDING_STEPS.map((s, i) => {
          const ok = state.milestones[s.id]
          const isNext = s.id === nextStep?.id
          return (
            <li
              key={s.id}
              className={cn(
                'flex min-w-0 items-center gap-2 rounded-chip border bg-white px-2.5 py-2 sm:flex-col sm:items-start',
                ok ? 'border-won/30' : isNext ? 'border-brand/50' : 'border-line',
              )}
            >
              <span className="flex min-w-0 flex-1 items-center gap-2">
                <span
                  aria-hidden
                  className={cn(
                    'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[0.625rem] font-bold',
                    ok ? 'bg-won text-white' : isNext ? 'bg-brand text-white' : 'bg-sky text-slate',
                  )}
                >
                  {ok ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                <span className="min-w-0">
                  <span className={cn('block truncate text-xs font-semibold', ok ? 'text-won' : 'text-ink')}>
                    {s.label}
                    <span className="sr-only">{ok ? ' (done)' : ' (not done yet)'}</span>
                  </span>
                  <span className="hidden text-[0.6875rem] leading-snug text-slate sm:block">{s.how}</span>
                </span>
              </span>
              {!ok ? (
                <button
                  type="button"
                  onClick={() => navigate(s.module)}
                  className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full px-2 text-[0.6875rem] font-semibold text-brand hover:bg-sky sm:-ml-1"
                >
                  Go<span className="sr-only"> to step {i + 1}: {s.label}</span>
                  <ArrowRight className="h-3 w-3" aria-hidden />
                </button>
              ) : null}
            </li>
          )
        })}
      </ol>

      {complete ? (
        <div className="mt-3 flex flex-col gap-3 rounded-chip bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink">
            Lead in, owner assigned, WhatsApp reply, GST quotation, deal won. Want to see it on your own lead flow?
          </p>
          <Link
            href="/demo"
            className={cn(buttonVariants({ variant: 'primary', size: 'sm' }), 'shrink-0')}
            onClick={() => track('demo_cta_clicked', { from: 'playground_onboarding' })}
          >
            Book a demo
          </Link>
        </div>
      ) : null}
    </section>
  )
}
