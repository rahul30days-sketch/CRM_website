'use client'

import * as React from 'react'
import { useActionState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { submitDemoRequest, type FormState } from '@/lib/actions'
import { Field, Input, Select, Textarea } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { modules } from '@/content/modules'
import { track } from '@/lib/analytics'

const initialState: FormState = { status: 'idle', message: '' }

export function DemoForm({ source = 'demo-page' }: { source?: string }) {
  const [state, formAction, pending] = useActionState(submitDemoRequest, initialState)
  // Set after mount: a value computed during render differs between server
  // and client and causes a hydration mismatch.
  const [renderedAt, setRenderedAt] = React.useState(0)
  React.useEffect(() => setRenderedAt(Date.now()), [])
  const formRef = React.useRef<HTMLFormElement>(null)
  const started = React.useRef(false)

  // Analytics: started (first interaction) and submitted — never field values.
  React.useEffect(() => {
    if (state.status === 'success') track('demo_form_submitted', { source })
    // On a validation error, move focus to the first invalid field.
    if (state.status === 'error') {
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    }
  }, [state, source])

  if (state.status === 'success') {
    return (
      <div className="panel-frame flex items-start gap-3 p-6" role="status">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-won" aria-hidden />
        <div>
          <p className="font-medium text-ink">Request received.</p>
          <p className="mt-1 text-sm text-slate">{state.message}</p>
        </div>
      </div>
    )
  }

  const errors = state.fieldErrors ?? {}

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-5"
      noValidate
      onFocusCapture={() => {
        if (started.current) return
        started.current = true
        track('demo_form_started', { source })
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" htmlFor="demo-name" required error={errors.name}>
          <Input id="demo-name" name="name" required autoComplete="name" maxLength={120} aria-invalid={Boolean(errors.name)} />
        </Field>
        <Field label="Work email" htmlFor="demo-email" required error={errors.workEmail}>
          <Input id="demo-email" name="workEmail" type="email" required autoComplete="email" maxLength={254} aria-invalid={Boolean(errors.workEmail)} />
        </Field>
        <Field label="Mobile number" htmlFor="demo-phone" required error={errors.phone}>
          <Input id="demo-phone" name="phone" type="tel" required autoComplete="tel" placeholder="10-digit mobile number" maxLength={20} aria-invalid={Boolean(errors.phone)} />
        </Field>
        <Field label="Company" htmlFor="demo-company" required error={errors.company}>
          <Input id="demo-company" name="company" required autoComplete="organization" maxLength={160} aria-invalid={Boolean(errors.company)} />
        </Field>
        <Field label="Team size" htmlFor="demo-size" error={errors.companySize}>
          <Select id="demo-size" name="companySize" defaultValue="">
            <option value="" disabled>
              Select…
            </option>
            <option value="1-5">1–5 people</option>
            <option value="6-20">6–20 people</option>
            <option value="21-50">21–50 people</option>
            <option value="51-200">51–200 people</option>
            <option value="200+">200+ people</option>
          </Select>
        </Field>
        <Field label="What matters most to you?" htmlFor="demo-interest" error={errors.interest}>
          <Select id="demo-interest" name="interest" defaultValue="">
            <option value="">Show me everything</option>
            {modules.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.title}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Anything we should prepare for?" htmlFor="demo-message" error={errors.message}>
        <Textarea
          id="demo-message"
          name="message"
          maxLength={2000}
          placeholder="e.g. We get ~200 IndiaMART leads a month and follow up on WhatsApp…"
        />
      </Field>

      {/* Honeypot + time trap — invisible to real users */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <input type="hidden" name="renderedAt" value={renderedAt} />
      <input type="hidden" name="source" value={source} />

      {state.status === 'error' && !state.fieldErrors ? (
        <p className="text-sm text-due" role="alert">
          {state.message}
        </p>
      ) : null}
      {state.status === 'error' && state.fieldErrors ? (
        <p className="text-sm text-due" role="alert">
          {state.message}
        </p>
      ) : null}

      <Button type="submit" variant="brand" size="lg" disabled={pending} className="w-full sm:w-auto inline-flex items-center justify-center">
        {pending ? (
          <>
            <Spinner invert className="me-2" /> Sending…
          </>
        ) : (
          'Book my demo'
        )}
      </Button>
      <p className="text-xs text-slate">
        A product specialist calls within one working day. Your details are used only to arrange
        the demo — see our <a href="/legal/privacy" className="underline underline-offset-2">privacy policy</a>.
      </p>
    </form>
  )
}
