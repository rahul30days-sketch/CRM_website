'use client'

/**
 * KPIs for the selected region (or All India): leads, won, revenue,
 * conversion, open pipeline and median first-response time, plus the
 * region's top sales rep by won revenue and its top lead source by volume.
 */

import { formatINR, formatINRCompact } from '@/lib/gst'
import type { regionInsights } from './geo-model'

export function RegionPanel({
  name,
  insights,
  periodLabel,
}: {
  name: string
  insights: ReturnType<typeof regionInsights>
  periodLabel: string
}) {
  const { stats, topRep, topSource } = insights
  const kpis = [
    { label: 'Leads', value: String(stats.leads), sr: `${stats.leads}` },
    { label: 'Deals won', value: String(stats.won), sr: `${stats.won}` },
    { label: 'Revenue (won)', value: formatINRCompact(stats.revenue), sr: formatINR(stats.revenue) },
    {
      label: 'Conversion',
      value: stats.won + stats.lost ? `${stats.conversion}%` : '—',
      sr: stats.won + stats.lost ? `${stats.conversion}%, ${stats.won} won of ${stats.won + stats.lost} decided` : 'no decided leads',
    },
    { label: 'Open pipeline', value: formatINRCompact(stats.pipeline), sr: formatINR(stats.pipeline) },
    {
      label: 'Median response',
      value: stats.leads ? `${stats.medianResponseMins} min` : '—',
      sr: stats.leads ? `${stats.medianResponseMins} minutes to first response` : 'no leads',
    },
  ]
  return (
    <section aria-labelledby="geo-region-title" className="rounded-card border border-line bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 id="geo-region-title" className="font-display text-lg font-bold text-ink">
          {name}
        </h3>
        <p className="font-mono text-[0.6875rem] text-slate">{periodLabel}</p>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {kpis.map((k) => (
          <div key={k.label} className="min-w-0 rounded-chip border border-line bg-sky px-3 py-2.5">
            <dt className="text-[0.6875rem] text-slate">{k.label}</dt>
            <dd className="mt-0.5 font-mono text-base font-semibold tabular-nums text-ink">
              <span aria-hidden>{k.value}</span>
              <span className="sr-only">{k.sr}</span>
            </dd>
          </div>
        ))}
      </dl>
      <dl className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="flex items-center gap-2.5 rounded-chip border border-line px-3 py-2.5">
          {topRep ? (
            <span
              aria-hidden
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand font-mono text-[0.6875rem] font-semibold text-white"
            >
              {topRep.rep.initials}
            </span>
          ) : null}
          <div className="min-w-0">
            <dt className="text-[0.6875rem] text-slate">Top rep · by won revenue</dt>
            <dd className="truncate text-sm font-semibold text-ink">
              {topRep ? (
                <>
                  {topRep.rep.name}{' '}
                  <span className="font-mono text-xs font-normal text-slate">{formatINRCompact(topRep.revenue)}</span>
                </>
              ) : (
                <span className="font-normal text-slate">No won deals yet</span>
              )}
            </dd>
          </div>
        </div>
        <div className="rounded-chip border border-line px-3 py-2.5">
          <dt className="text-[0.6875rem] text-slate">Top source · by leads</dt>
          <dd className="truncate text-sm font-semibold text-ink">
            {topSource ? (
              <>
                {topSource.source.name}{' '}
                <span className="font-mono text-xs font-normal text-slate">
                  {topSource.leads} · {topSource.share}%
                </span>
              </>
            ) : (
              <span className="font-normal text-slate">No leads in this period</span>
            )}
          </dd>
        </div>
      </dl>
    </section>
  )
}
