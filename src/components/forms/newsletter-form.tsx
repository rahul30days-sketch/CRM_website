'use client'

import * as React from 'react'
import { useActionState } from 'react'
import { subscribeNewsletter, type FormState } from '@/lib/actions'
import { Input } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

const initialState: FormState = { status: 'idle', message: '' }

export function NewsletterForm() {
  const [state, formAction, pending] = useActionState(subscribeNewsletter, initialState)
  const [renderedAt] = React.useState(() => Date.now())

  if (state.status === 'success') {
    return (
      <p className="text-sm text-won" role="status">
        {state.message}
      </p>
    )
  }

  return (
    <form action={formAction} className="space-y-2">
      <label htmlFor="newsletter-email" className="text-sm text-fog">
        One useful sales-ops email a month:
      </label>
      <div className="flex gap-2">
        <Input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.in"
          className="max-w-56"
        />
        <Button type="submit" size="sm" className="h-auto inline-flex items-center justify-center" disabled={pending}>
          {pending ? (
            <>
              <Spinner invert className="me-2" /> Joining…
            </>
          ) : (
            'Join'
          )}
        </Button>
      </div>
      {/* Honeypot + time trap — invisible to real users */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <input type="hidden" name="renderedAt" value={renderedAt} />
      {state.status === 'error' ? (
        <p className="text-xs text-due" role="alert">
          {state.message}
        </p>
      ) : null}
    </form>
  )
}
