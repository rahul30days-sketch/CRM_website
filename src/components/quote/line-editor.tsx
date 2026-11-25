'use client'

/**
 * One editable quotation line: quantity, unit price, discount % and GST rate.
 *
 * Fields are text inputs with a numeric inputMode so phones show a number
 * keypad without the quirks of type="number". Invalid text is kept visible
 * with an inline message (linked via aria-describedby, aria-invalid set);
 * the calculation keeps using the last valid value until it is fixed.
 */

import { Trash2 } from 'lucide-react'
import { GST_RATES, formatINR, type GstRate, type LineResult } from '@/lib/gst'
import { cn } from '@/lib/utils'
import { validateField, type DraftField, type DraftLine } from './catalogue'

const FIELDS: { field: DraftField; label: string; inputMode: 'numeric' | 'decimal'; prefix?: string; suffix?: string }[] = [
  { field: 'qty', label: 'Qty', inputMode: 'numeric' },
  { field: 'unitPrice', label: 'Unit price', inputMode: 'decimal', prefix: '₹' },
  { field: 'discountPct', label: 'Discount', inputMode: 'decimal', suffix: '%' },
]

export function LineEditor({
  line,
  result,
  index,
  onField,
  onRate,
  onRemove,
}: {
  line: DraftLine
  result?: LineResult
  index: number
  onField: (field: DraftField, raw: string) => void
  onRate: (rate: GstRate) => void
  onRemove: () => void
}) {
  const base = `q-${line.id}`
  return (
    <li className="rounded-chip border border-line bg-white p-3 shadow-press sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">
            <span className="sr-only">Line {index + 1}: </span>
            {line.name}
          </p>
          <p className="mt-0.5 font-mono text-xs text-slate">
            {line.codeType} {line.code}
          </p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${line.name}`}
          className="-mr-1 -mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate transition-colors duration-fast hover:bg-due/10 hover:text-due"
        >
          <Trash2 className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-3 sm:grid-cols-4">
        {FIELDS.map(({ field, label, inputMode, prefix, suffix }) => {
          const id = `${base}-${field}`
          const raw = line.text[field]
          const error = validateField(field, raw)
          return (
            <div key={field} className="min-w-0">
              <label htmlFor={id} className="block text-xs font-semibold text-slate">
                {label}
                {suffix ? <span className="sr-only"> in percent</span> : null}
                {prefix ? <span className="sr-only"> in rupees</span> : null}
              </label>
              <div
                className={cn(
                  'mt-1 flex h-10 items-center rounded-chip border bg-white px-2.5 transition-colors duration-fast focus-within:border-brand',
                  error ? 'border-due' : 'border-line',
                )}
              >
                {prefix ? (
                  <span aria-hidden className="mr-1 font-mono text-sm text-slate">
                    {prefix}
                  </span>
                ) : null}
                <input
                  id={id}
                  type="text"
                  inputMode={inputMode}
                  autoComplete="off"
                  value={raw}
                  onChange={(e) => onField(field, e.target.value)}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? `${id}-err` : undefined}
                  className="w-full min-w-0 bg-transparent font-mono text-sm tabular-nums text-ink outline-none"
                />
                {suffix ? (
                  <span aria-hidden className="ml-1 font-mono text-sm text-slate">
                    {suffix}
                  </span>
                ) : null}
              </div>
              {error ? (
                <p id={`${id}-err`} className="mt-1 text-xs font-medium text-due">
                  {error} Using {String(line[field])}.
                </p>
              ) : null}
            </div>
          )
        })}
        <div className="min-w-0">
          <label htmlFor={`${base}-gst`} className="block text-xs font-semibold text-slate">
            GST rate
          </label>
          <select
            id={`${base}-gst`}
            value={line.gstRate}
            onChange={(e) => onRate(Number(e.target.value) as GstRate)}
            className="mt-1 h-10 w-full rounded-chip border border-line bg-white px-2 font-mono text-sm text-ink focus:border-brand"
          >
            {GST_RATES.map((r) => (
              <option key={r} value={r}>
                {r}%
              </option>
            ))}
          </select>
        </div>
      </div>

      {result ? (
        <p className="mt-3 flex flex-wrap items-baseline justify-between gap-x-3 border-t border-line pt-2 text-xs text-slate">
          <span>
            Taxable <span className="font-mono tabular-nums text-ink">{formatINR(result.taxable, { paise: true })}</span>
          </span>
          <span>
            Line total <span className="font-mono font-semibold tabular-nums text-ink">{formatINR(result.total, { paise: true })}</span>
          </span>
        </p>
      ) : null}
    </li>
  )
}
