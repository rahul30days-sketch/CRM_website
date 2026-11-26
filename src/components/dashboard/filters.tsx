'use client'

/**
 * Dashboard filter bar: a segmented period control plus salesperson, source
 * and region selects. All real form controls (buttons with aria-pressed,
 * labelled native <select>s), so they work by keyboard and screen reader.
 * On narrow screens the three selects collapse behind a "Filters" toggle
 * (aria-expanded) and the period control uses short labels.
 */

import { useId, useState } from 'react'
import { ChevronDown, RotateCcw, SlidersHorizontal } from 'lucide-react'
import { PERIOD_LABEL, SOURCES } from '@/demo/sample-data'
import { cn } from '@/lib/utils'
import {
  DEFAULT_FILTER,
  PERIODS,
  PERIOD_SHORT,
  REGION_OPTIONS,
  REP_OPTIONS,
  type DashboardFilter,
} from './data'

const focusRing = 'focus-visible:outline-cyan'

export function FilterBar({
  filter,
  onChange,
}: {
  filter: DashboardFilter
  onChange: (next: DashboardFilter) => void
}) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const extra = [filter.repId, filter.source, filter.state].filter(Boolean).length
  const isDefault =
    filter.period === DEFAULT_FILTER.period && extra === 0

  return (
    <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div role="group" aria-label="Period" className="flex w-full rounded-chip border border-line bg-sky p-1 sm:w-auto">
          {PERIODS.map((p) => {
            const active = filter.period === p
            return (
              <button
                key={p}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ ...filter, period: p })}
                className={cn(
                  'min-h-10 flex-1 rounded-[0.5rem] px-2 text-xs sm:flex-none font-semibold transition-colors duration-fast ease-out sm:px-3.5 sm:text-sm',
                  focusRing,
                  active ? 'bg-white text-ink shadow-press' : 'text-slate hover:bg-sky hover:text-ink',
                )}
              >
                <span className="sm:hidden">{PERIOD_SHORT[p]}</span>
                <span className="hidden sm:inline">{PERIOD_LABEL[p]}</span>
              </button>
            )
          })}
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className={cn(
            'inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-chip border border-line bg-white px-3 text-xs font-semibold text-ink sm:hidden',
            focusRing,
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
          Filters{extra ? <span className="font-mono">({extra})</span> : null}
          <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-fast', open && 'rotate-180')} aria-hidden />
        </button>
      </div>

      <div
        id={panelId}
        className={cn('grid-cols-1 gap-2 sm:grid sm:grid-cols-[repeat(3,minmax(0,1fr))_auto] sm:items-end xl:grid-cols-[repeat(3,minmax(0,11rem))_auto]', open ? 'grid' : 'hidden')}
      >
        <Select
          label="Salesperson"
          value={filter.repId}
          onChange={(v) => onChange({ ...filter, repId: v })}
          options={REP_OPTIONS.map((r) => ({ value: r.id, label: r.name }))}
          all="All salespeople"
        />
        <Select
          label="Lead source"
          value={filter.source}
          onChange={(v) => onChange({ ...filter, source: v as DashboardFilter['source'] })}
          options={SOURCES.map((s) => ({ value: s.id, label: s.name }))}
          all="All sources"
        />
        <Select
          label="Region"
          value={filter.state}
          onChange={(v) => onChange({ ...filter, state: v })}
          options={REGION_OPTIONS.map((r) => ({ value: r.code, label: r.name }))}
          all="All regions"
        />
        <button
          type="button"
          onClick={() => onChange(DEFAULT_FILTER)}
          disabled={isDefault}
          className={cn(
            'inline-flex min-h-10 items-center justify-center gap-1.5 rounded-chip border border-line px-3 text-xs font-semibold text-slate transition-colors duration-fast hover:bg-sky hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent',
            focusRing,
          )}
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          Reset filters
        </button>
      </div>
    </div>
  )
}

function Select({
  label,
  value,
  onChange,
  options,
  all,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  all: string
}) {
  const id = useId()
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <label htmlFor={id} className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-slate">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'min-h-10 w-full min-w-0 appearance-none truncate rounded-chip border bg-white py-2 pl-3 pr-8 text-sm text-ink transition-colors duration-fast',
            value ? 'border-cyan/60' : 'border-line hover:border-line',
            focusRing,
          )}
        >
          <option value="" className="bg-white text-ink">
            {all}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-white text-ink">
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate"
          aria-hidden
        />
      </div>
    </div>
  )
}
