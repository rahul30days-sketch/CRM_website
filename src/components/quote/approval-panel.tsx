'use client'

/**
 * Approval flow and version history for the quotation simulation.
 *
 * Status track Draft → Sent → Viewed → Approved is driven only by local
 * state ("Simulate approval"); nothing is sent anywhere. Download / WhatsApp
 * / payment-link buttons are shown as unavailable (aria-disabled, still
 * focusable so their tooltip can be read by keyboard and screen readers).
 */

import { Check, FileDown, History, Link2, MessageCircle } from 'lucide-react'
import { formatINR } from '@/lib/gst'
import { cn } from '@/lib/utils'

export const STATUSES = ['Draft', 'Sent', 'Viewed', 'Approved'] as const
export type QuoteStatus = (typeof STATUSES)[number]

export interface QuoteVersion {
  v: number
  lines: number
  total: number
  placeOfSupply: string
  note: string
}

const SIM_TIP = 'Available in EZCRM — simulated here'

export function ApprovalPanel({
  status,
  simulating,
  onSimulate,
  onReset,
  versions,
  canSave,
  onSave,
}: {
  status: QuoteStatus
  simulating: boolean
  onSimulate: () => void
  onReset: () => void
  versions: QuoteVersion[]
  canSave: boolean
  onSave: () => void
}) {
  const at = STATUSES.indexOf(status)
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* approval track */}
      <div className="rounded-card border border-line bg-white p-4 shadow-soft">
        <p className="text-sm font-semibold text-ink">Approval</p>
        <ol className="mt-3 grid grid-cols-4 gap-1" aria-label="Quotation status">
          {STATUSES.map((s, i) => {
            const done = i <= at
            return (
              <li key={s} aria-current={i === at ? 'step' : undefined} className="min-w-0 text-center">
                <span
                  className={cn(
                    'mx-auto flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold transition-colors duration-base',
                    done ? 'border-brand bg-brand text-white' : 'border-line bg-white text-slate',
                  )}
                  aria-hidden
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span className={cn('mt-1 block truncate text-[11px] font-semibold', done ? 'text-ink' : 'text-slate')}>
                  {s}
                  <span className="sr-only">{done ? ' (reached)' : ' (not yet)'}</span>
                </span>
              </li>
            )
          })}
        </ol>
        <div className="mt-4 flex flex-wrap gap-2">
          {status === 'Approved' ? (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex h-10 items-center rounded-full border border-line px-4 text-sm font-semibold text-ink transition-colors duration-fast hover:border-brand/40 hover:text-brand"
            >
              Back to draft
            </button>
          ) : (
            <button
              type="button"
              onClick={onSimulate}
              disabled={simulating}
              className="inline-flex h-10 items-center rounded-full bg-brand px-4 text-sm font-semibold text-white transition-colors duration-fast hover:bg-brand-deep disabled:opacity-60"
            >
              {simulating ? 'Simulating…' : 'Simulate approval'}
            </button>
          )}
        </div>
        <p className="mt-2 text-xs text-slate">Simulated, nothing is sent to anyone.</p>

        <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-3">
          <SimButton icon={FileDown} label="Download PDF" />
          <SimButton icon={MessageCircle} label="Share on WhatsApp" />
          <SimButton icon={Link2} label="Payment link" />
        </div>
      </div>

      {/* versions */}
      <div className="rounded-card border border-line bg-white p-4 shadow-soft">
        <div className="flex items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink">
            <History className="h-4 w-4 text-brand" aria-hidden /> Version history
          </p>
          <button
            type="button"
            onClick={onSave}
            disabled={!canSave}
            className="inline-flex h-10 items-center rounded-full border border-line px-3 text-xs font-semibold text-ink transition-colors duration-fast hover:border-brand/40 hover:text-brand disabled:opacity-50 disabled:hover:border-line disabled:hover:text-ink"
          >
            Save as new version
          </button>
        </div>
        {!canSave ? <p className="mt-1 text-xs text-slate">Edit the quotation to save a new version.</p> : null}
        <ol className="mt-3 space-y-2" aria-label="Saved versions, newest first">
          {[...versions].reverse().map((v, i) => (
            <li
              key={v.v}
              className={cn(
                'flex items-start justify-between gap-3 rounded-chip border px-3 py-2 text-xs',
                i === 0 ? 'border-brand/30 bg-sky/60' : 'border-line',
              )}
            >
              <div className="min-w-0">
                <p className="font-semibold text-ink">
                  v{v.v} <span className="font-normal text-slate">· {v.note}</span>
                </p>
                <p className="mt-0.5 text-slate">
                  {v.lines} {v.lines === 1 ? 'line' : 'lines'} · {v.placeOfSupply}
                </p>
              </div>
              <span className="shrink-0 font-mono font-semibold tabular-nums text-ink">{formatINR(v.total)}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

function SimButton({ icon: Icon, label }: { icon: typeof FileDown; label: string }) {
  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        aria-disabled="true"
        aria-label={`${label}. ${SIM_TIP}`}
        title={SIM_TIP}
        onClick={(e) => e.preventDefault()}
        className="inline-flex h-10 cursor-not-allowed items-center gap-1.5 rounded-full border border-dashed border-line px-3 text-xs font-semibold text-slate"
      >
        <Icon className="h-3.5 w-3.5" aria-hidden />
        {label}
      </button>
      <span
        role="tooltip"
        aria-hidden
        className="pointer-events-none absolute bottom-full left-0 z-10 mb-1.5 w-max max-w-[220px] rounded-chip bg-ink px-2.5 py-1.5 text-[11px] font-medium text-white opacity-0 shadow-soft transition-opacity duration-fast group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {SIM_TIP}
      </span>
    </span>
  )
}
