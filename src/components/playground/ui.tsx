'use client'

/**
 * Small building blocks shared by the playground modules: module heading
 * (receives focus after navigation so screen-reader and keyboard users land
 * on the new content), panels, chips, avatars, hints and the lead picker.
 */

import * as React from 'react'
import { Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { repById, sourceById, type PipelineStageId, type SourceId } from '@/demo/sample-data'
import { STAGE_LABEL, usePlayground } from './store'

export const fieldClass =
  'h-10 w-full min-w-0 rounded-chip border border-line bg-white px-3 text-sm text-ink placeholder:text-slate/70 transition-colors duration-fast hover:border-brand/40 aria-[invalid=true]:border-due disabled:bg-sky/40 disabled:text-slate'
export const labelClass = 'mb-1 block text-xs font-semibold text-ink'
export const smallBtn =
  'inline-flex h-10 items-center justify-center gap-1.5 rounded-chip border border-line bg-white px-3 text-sm font-semibold text-ink transition-colors duration-fast hover:border-brand/40 hover:text-brand disabled:pointer-events-none disabled:opacity-50'
export const brandBtn =
  'inline-flex h-10 items-center justify-center gap-1.5 rounded-chip bg-brand px-4 text-sm font-semibold text-white shadow-soft transition-colors duration-fast hover:bg-brand-deep disabled:pointer-events-none disabled:opacity-50'

export function ModuleHeader({
  title,
  description,
  actions,
}: {
  title: string
  description: string
  actions?: React.ReactNode
}) {
  const { consumeFocusRequest } = usePlayground()
  const ref = React.useRef<HTMLHeadingElement>(null)
  React.useEffect(() => {
    if (consumeFocusRequest()) ref.current?.focus({ preventScroll: true })
  }, [consumeFocusRequest])
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h2 ref={ref} tabIndex={-1} className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
          {title}
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-slate">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  )
}

export function Panel({
  title,
  right,
  children,
  className,
  bodyClassName,
}: {
  title?: string
  right?: React.ReactNode
  children: React.ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <section className={cn('min-w-0 rounded-chip border border-line bg-white shadow-press', className)}>
      {title ? (
        <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-2.5">
          <h3 className="text-sm font-semibold text-ink">{title}</h3>
          {right}
        </div>
      ) : null}
      <div className={cn('p-4', bodyClassName)}>{children}</div>
    </section>
  )
}

export function Avatar({ repId, size = 'md' }: { repId: string; size?: 'sm' | 'md' }) {
  if (!repId) {
    return (
      <span
        aria-hidden
        className={cn(
          'inline-flex shrink-0 items-center justify-center rounded-full border border-dashed border-slate/50 text-slate',
          size === 'sm' ? 'h-6 w-6 text-[0.625rem]' : 'h-8 w-8 text-xs',
        )}
      >
        ?
      </span>
    )
  }
  const rep = repById(repId)
  const tone = ['bg-brand/10 text-brand-deep', 'bg-won/10 text-won', 'bg-powder text-ink', 'bg-night text-white'][
    ['priya', 'arjun', 'neha', 'vikram'].indexOf(rep.id) % 4
  ]
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold',
        size === 'sm' ? 'h-6 w-6 text-[0.625rem]' : 'h-8 w-8 text-xs',
        tone ?? 'bg-sky text-ink',
      )}
    >
      {rep.initials}
    </span>
  )
}

export function OwnerLabel({ repId }: { repId: string }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2">
      <Avatar repId={repId} size="sm" />
      <span className={cn('truncate text-sm', repId ? 'text-ink' : 'font-semibold text-due')}>
        {repId ? repById(repId).name : 'Unassigned'}
      </span>
    </span>
  )
}

export function SourceChip({ source }: { source: SourceId }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-sky/60 px-2 py-0.5 text-[0.6875rem] font-semibold text-ink">
      {sourceById(source).short}
    </span>
  )
}

export function StageChip({ stage }: { stage: PipelineStageId }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold',
        stage === 'won'
          ? 'bg-won/10 text-won'
          : stage === 'lost'
            ? 'bg-due/10 text-due'
            : 'bg-brand/10 text-brand-deep',
      )}
    >
      {STAGE_LABEL[stage]}
    </span>
  )
}

/** Contextual tip. Plain text (not a hover tooltip) so touch and screen-reader users get it too. */
export function Hint({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('flex items-start gap-2 rounded-chip bg-sky/70 px-3 py-2 text-xs leading-relaxed text-slate', className)}>
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" aria-hidden />
      <span>
        <span className="sr-only">Tip: </span>
        {children}
      </span>
    </p>
  )
}

/** Select bound to the shared "selected lead", used by modules that act on one lead. */
export function LeadPicker({ id, label = 'Working on', className }: { id: string; label?: string; className?: string }) {
  const { state, dispatch } = usePlayground()
  return (
    <div className={cn('min-w-0', className)}>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <select
        id={id}
        className={fieldClass}
        value={state.selectedLeadId}
        onChange={(e) => dispatch({ type: 'SELECT_LEAD', leadId: e.target.value })}
      >
        {state.leads.map((l) => (
          <option key={l.id} value={l.id}>
            {l.company} · {l.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-chip border border-dashed border-line px-4 py-6 text-center text-sm text-slate">{children}</p>
}
