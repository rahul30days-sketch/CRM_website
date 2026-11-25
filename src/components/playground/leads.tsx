'use client'

/**
 * Leads inbox: the lead list, a validated "New lead" form and a
 * "Simulate incoming enquiry" button that drops in one of the sample
 * enquiries. Errors are linked to their fields (aria-describedby) and focus
 * moves to the first invalid field on submit.
 */

import * as React from 'react'
import { ArrowRight, Inbox, Plus, X } from 'lucide-react'
import { formatINR } from '@/lib/gst'
import { cn } from '@/lib/utils'
import { SOURCES, type SourceId } from '@/demo/sample-data'
import { Hint, ModuleHeader, OwnerLabel, Panel, SourceChip, StageChip, brandBtn, fieldClass, labelClass, smallBtn } from './ui'
import { usePlayground, useSelection, type NewLeadInput } from './store'

type Field = 'name' | 'company' | 'city' | 'requirement' | 'value'
type Errors = Partial<Record<Field, string>>

const EMPTY = { name: '', company: '', city: '', source: 'indiamart' as SourceId, requirement: '', value: '' }

function validate(f: typeof EMPTY): Errors {
  const e: Errors = {}
  if (f.name.trim().length < 2) e.name = 'Enter the contact’s name (at least 2 characters).'
  if (f.company.trim().length < 2) e.company = 'Enter the company name.'
  if (f.city.trim().length < 2) e.city = 'Enter the city.'
  if (f.requirement.trim().length < 3) e.requirement = 'Describe what the customer needs.'
  const v = Number(f.value.replace(/[,\s₹]/g, ''))
  if (!f.value.trim()) e.value = 'Enter an estimated deal value in rupees.'
  else if (!Number.isFinite(v) || v <= 0) e.value = 'Value must be a number above 0.'
  else if (v > 100000000) e.value = 'Keep the value under ₹10 crore for this demo.'
  return e
}

function NewLeadForm({ onDone }: { onDone: () => void }) {
  const { dispatch } = usePlayground()
  const [form, setForm] = React.useState(EMPTY)
  const [errors, setErrors] = React.useState<Errors>({})
  const [submitted, setSubmitted] = React.useState(false)
  const refs = {
    name: React.useRef<HTMLInputElement>(null),
    company: React.useRef<HTMLInputElement>(null),
    city: React.useRef<HTMLInputElement>(null),
    requirement: React.useRef<HTMLInputElement>(null),
    value: React.useRef<HTMLInputElement>(null),
  }
  const firstRef = refs.name

  React.useEffect(() => {
    firstRef.current?.focus()
  }, [firstRef])

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const next = { ...form, [k]: e.target.value }
    setForm(next)
    if (submitted) setErrors(validate(next))
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    const errs = validate(form)
    setErrors(errs)
    const first = (Object.keys(refs) as Field[]).find((k) => errs[k])
    if (first) {
      refs[first].current?.focus()
      return
    }
    const input: NewLeadInput = {
      name: form.name,
      company: form.company,
      city: form.city,
      source: form.source,
      requirement: form.requirement,
      value: Math.round(Number(form.value.replace(/[,\s₹]/g, ''))),
    }
    dispatch({ type: 'CREATE_LEAD', input })
    onDone()
  }

  const text = (k: Field, label: string, opts: { placeholder?: string; inputMode?: 'numeric'; wide?: boolean } = {}) => (
    <div className={cn('min-w-0', opts.wide && 'sm:col-span-2')}>
      <label htmlFor={`pg-new-${k}`} className={labelClass}>
        {label}
      </label>
      <input
        id={`pg-new-${k}`}
        ref={refs[k]}
        className={fieldClass}
        value={form[k]}
        onChange={set(k)}
        placeholder={opts.placeholder}
        inputMode={opts.inputMode}
        autoComplete="off"
        aria-invalid={errors[k] ? true : undefined}
        aria-describedby={errors[k] ? `pg-new-${k}-err` : undefined}
        required
      />
      {errors[k] ? (
        <p id={`pg-new-${k}-err`} className="mt-1 text-xs font-medium text-due">
          {errors[k]}
        </p>
      ) : null}
    </div>
  )

  const count = Object.keys(errors).length
  return (
    <Panel
      title="New lead"
      className="mb-4 border-brand/30"
      right={
        <button type="button" onClick={onDone} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate hover:bg-sky hover:text-ink" aria-label="Close the new lead form">
          <X className="h-4 w-4" aria-hidden />
        </button>
      }
    >
      <form onSubmit={submit} noValidate aria-label="New lead">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {text('name', 'Contact name', { placeholder: 'e.g. Rakesh Gupta' })}
          {text('company', 'Company', { placeholder: 'e.g. Balaji Agro Implements' })}
          {text('city', 'City', { placeholder: 'e.g. Nagpur' })}
          <div className="min-w-0">
            <label htmlFor="pg-new-source" className={labelClass}>
              Source
            </label>
            <select id="pg-new-source" className={fieldClass} value={form.source} onChange={set('source')}>
              {SOURCES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          {text('requirement', 'Requirement', { placeholder: 'What do they need?', wide: true })}
          {text('value', 'Estimated value (₹)', { placeholder: 'e.g. 150000', inputMode: 'numeric' })}
        </div>
        <p className="sr-only" aria-live="polite">
          {submitted && count > 0 ? `${count} field${count > 1 ? 's need' : ' needs'} attention.` : ''}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button type="submit" className={brandBtn}>
            <Plus className="h-4 w-4" aria-hidden />
            Create lead
          </button>
          <button type="button" className={smallBtn} onClick={onDone}>
            Cancel
          </button>
          <span className="text-xs text-slate">Creates a lead, a “New lead” deal and a WhatsApp thread.</span>
        </div>
      </form>
    </Panel>
  )
}

export function LeadsModule() {
  const { state, dispatch, navigate } = usePlayground()
  const { lead: selected, deal } = useSelection()
  const [formOpen, setFormOpen] = React.useState(false)
  const newBtn = React.useRef<HTMLButtonElement>(null)

  const close = () => {
    setFormOpen(false)
    requestAnimationFrame(() => newBtn.current?.focus())
  }

  return (
    <div>
      <ModuleHeader
        title="Leads inbox"
        description="Every enquiry lands here with its source, requirement and owner. New leads also open a deal and a WhatsApp thread."
        actions={
          <>
            <button type="button" className={smallBtn} onClick={() => dispatch({ type: 'SIMULATE_ENQUIRY' })}>
              <Inbox className="h-4 w-4" aria-hidden />
              Simulate incoming enquiry
            </button>
            <button
              ref={newBtn}
              type="button"
              className={brandBtn}
              onClick={() => setFormOpen(true)}
              aria-expanded={formOpen}
              disabled={formOpen}
            >
              <Plus className="h-4 w-4" aria-hidden />
              New lead
            </button>
          </>
        }
      />

      {formOpen ? <NewLeadForm onDone={close} /> : null}

      <div className="grid gap-4 xl:grid-cols-[3fr_2fr]">
        <Panel title="All leads" right={<span className="font-mono text-xs text-slate">{state.leads.length}</span>} bodyClassName="p-0">
          <ul className="divide-y divide-line" aria-label="Leads, newest first">
            {state.leads.map((l) => {
              const d = state.deals.find((x) => x.id === l.dealId)
              const active = l.id === selected?.id
              return (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => dispatch({ type: 'SELECT_LEAD', leadId: l.id })}
                    aria-pressed={active}
                    className={cn(
                      'grid w-full grid-cols-[1fr_auto] gap-x-3 gap-y-1 px-4 py-3 text-left transition-colors duration-fast hover:bg-sky/50 sm:grid-cols-[minmax(0,2fr)_auto_minmax(0,1.2fr)_auto] sm:items-center',
                      active && 'bg-sky/70',
                    )}
                  >
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold text-ink">{l.company}</span>
                        {l.visitor ? (
                          <span className="shrink-0 rounded-full bg-brand px-1.5 py-px text-[0.625rem] font-bold uppercase tracking-wide text-white">
                            New
                          </span>
                        ) : null}
                      </span>
                      <span className="block truncate text-xs text-slate">
                        {l.name} · {l.city}
                      </span>
                    </span>
                    <span className="text-right font-mono text-sm text-ink sm:order-none">{formatINR(l.value)}</span>
                    <span className="flex min-w-0 items-center gap-2">
                      <SourceChip source={l.source} />
                      {d ? <StageChip stage={d.stage} /> : null}
                    </span>
                    <span className="flex items-center justify-end gap-2 text-right">
                      <OwnerLabel repId={l.repId} />
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </Panel>

        {selected ? (
          <div className="space-y-4">
            <Panel title="Lead details">
              <p className="font-display text-lg font-bold text-ink">{selected.company}</p>
              <p className="text-sm text-slate">
                {selected.name} · {selected.city}
              </p>
              <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="col-span-2">
                  <dt className="text-xs font-semibold text-slate">Requirement</dt>
                  <dd className="text-ink">{selected.requirement || 'Not captured'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-slate">Source</dt>
                  <dd className="mt-0.5">
                    <SourceChip source={selected.source} />
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-slate">Received</dt>
                  <dd className="font-mono text-ink">
                    {selected.daysAgo === 0 ? `Today ${selected.receivedAt}` : `${selected.daysAgo}d ago`}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-slate">Value</dt>
                  <dd className="font-mono text-ink">{formatINR(selected.value)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-slate">Stage</dt>
                  <dd className="mt-0.5">{deal ? <StageChip stage={deal.stage} /> : '—'}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs font-semibold text-slate">Owner</dt>
                  <dd className="mt-0.5">
                    <OwnerLabel repId={selected.repId} />
                  </dd>
                </div>
              </dl>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {(
                  [
                    ['assignment', selected.repId ? 'Reassign' : 'Assign an owner'],
                    ['conversation', 'Open conversation'],
                    ['quotation', 'Build quotation'],
                    ['pipeline', 'View in pipeline'],
                  ] as const
                ).map(([m, label]) => (
                  <button key={m} type="button" className={cn(smallBtn, 'justify-between')} onClick={() => navigate(m)}>
                    {label}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </button>
                ))}
              </div>
            </Panel>
            <Hint>
              Turn on “Auto-assign new leads round-robin” in Automation and the next lead gets an owner as it arrives.
            </Hint>
          </div>
        ) : null}
      </div>
    </div>
  )
}
