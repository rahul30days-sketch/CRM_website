'use client'

/**
 * Editable win probability for one stage (0–100). A labelled number input;
 * the roomy variant adds 40px −/+ steppers for touch. Won and Lost are
 * outcomes, so they render as fixed read-only values.
 */

import { useEffect, useId, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { clampProbability } from './model'

export function ProbabilityInput({
  stageName,
  value,
  locked,
  onChange,
  roomy = false,
}: {
  stageName: string
  value: number
  locked: boolean
  onChange: (n: number) => void
  roomy?: boolean
}) {
  const id = useId()
  const [draft, setDraft] = useState(String(value))
  useEffect(() => setDraft(String(value)), [value])

  if (locked) {
    return (
      <p className="font-mono text-[0.6875rem] text-slate">
        <span className="sr-only">{stageName} probability </span>
        {value}% <span className="font-sans">· fixed</span>
      </p>
    )
  }

  const stepBtn =
    'inline-flex h-10 w-10 items-center justify-center rounded-md border border-line bg-white text-ink hover:border-brand/40 hover:text-brand disabled:opacity-40'

  return (
    <div className="flex items-center gap-1.5">
      <label htmlFor={id} className={cn('text-[0.6875rem] text-slate', roomy && 'text-xs font-semibold text-ink')}>
        <span className="sr-only">{stageName} </span>
        Win prob.
      </label>
      {roomy ? (
        <button
          type="button"
          className={stepBtn}
          onClick={() => onChange(clampProbability(value - 5))}
          disabled={value <= 0}
          aria-label={`Lower ${stageName} probability by 5 points`}
        >
          <Minus className="h-4 w-4" aria-hidden />
        </button>
      ) : null}
      <span className="relative inline-flex items-center">
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={0}
          max={100}
          step={5}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value)
            const n = Number(e.target.value)
            if (e.target.value !== '' && Number.isFinite(n)) onChange(clampProbability(n))
          }}
          onBlur={() => setDraft(String(value))}
          className={cn(
            'rounded-md border border-line bg-white pr-4 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none text-right font-mono text-xs tabular-nums text-ink hover:border-brand/40',
            roomy ? 'h-10 w-16 pl-2' : 'h-7 w-[3.25rem] pl-1',
          )}
        />
        <span aria-hidden className="pointer-events-none absolute right-1.5 font-mono text-[0.6875rem] text-slate">
          %
        </span>
      </span>
      {roomy ? (
        <button
          type="button"
          className={stepBtn}
          onClick={() => onChange(clampProbability(value + 5))}
          disabled={value >= 100}
          aria-label={`Raise ${stageName} probability by 5 points`}
        >
          <Plus className="h-4 w-4" aria-hidden />
        </button>
      ) : null}
    </div>
  )
}
