'use client'

/**
 * Four pipeline KPIs computed from the live demo state. Values tween when a
 * deal moves; screen readers get the exact rupee figure.
 */

import { formatINR, formatINRCompact } from '@/lib/gst'
import { cn } from '@/lib/utils'
import { AnimatedNumber } from './animated-number'
import type { PipelineKpis } from './model'

/** -1 stands for "nothing decided yet". */
const fmtPct = (n: number) => (n < 0 ? '—' : `${n}%`)

export function KpiCards({ kpis }: { kpis: PipelineKpis }) {
  const cards = [
    {
      id: 'open',
      label: 'Open pipeline',
      value: kpis.openValue,
      format: formatINRCompact,
      exact: formatINR(kpis.openValue),
      note: `${kpis.openCount} open ${kpis.openCount === 1 ? 'deal' : 'deals'}`,
    },
    {
      id: 'weighted',
      label: 'Weighted forecast',
      value: kpis.weighted,
      format: formatINRCompact,
      exact: formatINR(kpis.weighted),
      note: 'Open value × stage probability',
    },
    {
      id: 'won',
      label: 'Won revenue',
      value: kpis.wonValue,
      format: formatINRCompact,
      exact: formatINR(kpis.wonValue),
      note: `${kpis.wonCount} won ${kpis.wonCount === 1 ? 'deal' : 'deals'}`,
      tone: 'won' as const,
    },
    {
      id: 'rate',
      label: 'Win rate',
      value: kpis.winRate ?? -1,
      format: fmtPct,
      exact: kpis.winRate === null ? 'No decided deals yet' : `${kpis.winRate}%`,
      note: `Won ÷ (won + lost) · ${kpis.wonCount} / ${kpis.wonCount + kpis.lostCount}`,
    },
  ]

  return (
    <dl className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3">
      {cards.map((c) => (
        <div key={c.id} className="min-w-0 rounded-chip border border-line bg-white p-3 sm:p-4">
          <dt className="text-xs font-semibold text-slate">{c.label}</dt>
          <dd className="mt-1">
            <AnimatedNumber
              value={c.value}
              format={c.format}
              className={cn(
                'block font-mono text-lg font-semibold tabular-nums sm:text-2xl',
                c.tone === 'won' ? 'text-won' : 'text-ink',
              )}
            />
            <span className="sr-only"> ({c.exact})</span>
            <span className="mt-0.5 block text-[0.6875rem] leading-snug text-slate">{c.note}</span>
          </dd>
        </div>
      ))}
    </dl>
  )
}
