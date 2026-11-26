'use client'

/**
 * Section 09: geographic sales intelligence, on a night section.
 *
 * A tile map of India (one equal square per state / UT, explicitly not to
 * scale) heat-shaded by the chosen metric (leads, won revenue, deals won or
 * conversion) for the chosen period. Selecting a tile, a ranked-list row or
 * an option in the region picker shows that region's KPIs, its top sales rep
 * and its top lead source. The ranked list (top 8 by revenue) ends with an
 * "Other states" row and an All India total, which equals summarize() of
 * the whole filtered set, so the figures visibly reconcile.
 *
 * Accessibility: metric and period are toggle-button groups; the map is a
 * single tab stop with arrow-key movement (see TileMap); the legend is text;
 * a visually hidden table carries every state's numbers; changes are
 * announced through a polite live region. Bars use scaleX only; with reduced
 * motion they jump. All sample data, labelled as such.
 */

import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { PERIOD_LABEL } from '@/demo/sample-data'
import { SampleBadge, SectionHeader } from '@/components/demo/kit'
import { formatINR, formatINRCompact } from '@/lib/gst'
import { EASE } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { RegionPanel } from '@/components/geo/region-panel'
import { TileMap } from '@/components/geo/tile-map'
import {
  GEO_PERIODS,
  HEAT_LEVELS,
  HEAT_STEPS,
  METRICS,
  buildGeo,
  metricById,
  metricValue,
  regionInsights,
  type GeoMetric,
  type GeoPeriod,
} from '@/components/geo/geo-model'

const DEFAULT_PERIOD: GeoPeriod = 'month'
const DEFAULT_REGION = buildGeo(DEFAULT_PERIOD).ranked[0].code

function Toggle<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { id: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-1 rounded-chip border border-line bg-white p-1">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            'min-h-10 rounded-md px-3 text-xs font-semibold transition-colors duration-fast',
            value === o.id ? 'bg-brand text-white' : 'text-slate hover:bg-sky hover:text-ink',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function IndiaIntelligence() {
  const reduce = useReducedMotion()
  const [period, setPeriod] = useState<GeoPeriod>(DEFAULT_PERIOD)
  const [metric, setMetric] = useState<GeoMetric>('revenue')
  const [region, setRegion] = useState<string | null>(DEFAULT_REGION)
  const [announce, setAnnounce] = useState('')

  const geo = useMemo(() => buildGeo(period), [period])
  const m = metricById(metric)
  const regionRow = geo.states.find((s) => s.code === region) ?? null
  const insights = useMemo(
    () => regionInsights(region ? geo.leads.filter((l) => l.state === region) : geo.leads),
    [geo, region],
  )

  const top = geo.ranked.slice(0, 8)
  const rest = geo.ranked.slice(8)
  const restRevenue = rest.reduce((s, r) => s + r.stats.revenue, 0)
  const restLeads = rest.reduce((s, r) => s + r.stats.leads, 0)
  const maxRevenue = Math.max(1, top[0]?.stats.revenue ?? 0)
  const max = Math.max(0, ...geo.states.map((s) => metricValue(s.stats, metric)))

  const select = (code: string | null) => {
    setRegion(code)
    const name = code ? geo.states.find((s) => s.code === code)?.name : 'All India'
    const st = code ? geo.states.find((s) => s.code === code)?.stats : geo.total
    if (name && st) setAnnounce(`${name} selected: ${st.leads} leads, ${formatINR(st.revenue)} won revenue.`)
  }

  const legend = HEAT_STEPS.map((step, i) => {
    const lo = i === 0 ? 0 : (max * (i - 1)) / HEAT_LEVELS
    const hi = (max * i) / HEAT_LEVELS
    const text = i === 0 ? 'None' : `${m.short(lo)}–${m.short(hi)}`
    return { ...step, text }
  })

  return (
    <section aria-labelledby="geo-title" className="relative overflow-hidden bg-sky py-16 lg:py-24">
      <div className="shell">
        <SectionHeader
          id="geo-title"
          tone="light"
          kicker="India sales intelligence"
          title="Across cities. Across teams. One command center."
          lede="Every lead carries its state, source and owner. Switch the metric and period, then pick a state to see its numbers, its top rep and its top source."
        />

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 lg:mt-14">
          <div className="flex flex-wrap gap-2">
            <Toggle
              label="Map metric"
              options={METRICS.map((x) => ({ id: x.id, label: x.label }))}
              value={metric}
              onChange={(v) => {
                setMetric(v)
                setAnnounce(`Map now shows ${metricById(v).label.toLowerCase()}.`)
              }}
            />
            <Toggle
              label="Period"
              options={GEO_PERIODS.map((p) => ({ id: p, label: PERIOD_LABEL[p] }))}
              value={period}
              onChange={(v) => {
                setPeriod(v)
                const t = buildGeo(v).total
                setAnnounce(`${PERIOD_LABEL[v]}: ${t.leads} leads, ${formatINR(t.revenue)} won revenue across India.`)
              }}
            />
          </div>
          <SampleBadge tone="light" label="Sample data — not real customer activity" />
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-12">
          {/* Map */}
          <div className="rounded-card border border-line bg-white p-3 sm:p-5 lg:col-span-7">
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-sm font-semibold text-ink">
                {m.label} by state · {PERIOD_LABEL[period]}
              </h3>
              <p className="font-mono text-[0.6875rem] text-slate">Tile map · not to scale</p>
            </div>

            <label className="mb-4 block lg:hidden">
              <span className="mb-1.5 block text-xs font-semibold text-slate">Region</span>
              <select
                value={region ?? ''}
                onChange={(e) => select(e.target.value || null)}
                className="h-11 w-full rounded-chip border border-line bg-white px-3 text-sm text-ink"
              >
                <option value="">All India</option>
                {[...geo.states]
                  .sort((a, b) => a.name.localeCompare(b.name, 'en-IN'))
                  .map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </label>

            <TileMap
              states={geo.states}
              metric={metric}
              selected={region}
              onSelect={(code) => select(region === code ? null : code)}
            />

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <ul aria-label={`Legend: ${m.label}`} className="flex flex-wrap gap-x-3 gap-y-1.5">
                {legend.map((l) => (
                  <li key={l.bg} className="flex items-center gap-1.5 font-mono text-[0.6875rem] text-slate">
                    <span aria-hidden className={cn('h-3 w-3 rounded-[3px] border border-white/15', l.bg)} />
                    {l.text}
                  </li>
                ))}
              </ul>
              {region ? (
                <button
                  type="button"
                  onClick={() => select(null)}
                  className="min-h-10 rounded-md px-2 text-xs font-semibold text-slate underline underline-offset-4 hover:text-ink"
                >
                  Show All India
                </button>
              ) : null}
            </div>
          </div>

          {/* Region + ranking */}
          <div className="space-y-5 lg:col-span-5">
            <RegionPanel
              name={regionRow ? regionRow.name : 'All India'}
              insights={insights}
              periodLabel={PERIOD_LABEL[period]}
            />

            <section aria-labelledby="geo-rank-title" className="rounded-card border border-line bg-white p-4 sm:p-5">
              <div className="mb-3 flex items-baseline justify-between gap-2">
                <h3 id="geo-rank-title" className="text-sm font-semibold text-ink">
                  Top 8 states by won revenue
                </h3>
                <span className="font-mono text-[0.6875rem] text-slate">Leads · Revenue</span>
              </div>
              <ol className="space-y-1">
                {top.map((s, i) => (
                  <li key={s.code}>
                    <button
                      type="button"
                      onClick={() => select(s.code)}
                      aria-pressed={region === s.code}
                      className={cn(
                        'grid min-h-10 w-full grid-cols-[1.25rem_minmax(0,1fr)_auto] items-center gap-x-2 rounded-md px-2 py-1.5 text-left transition-colors duration-fast',
                        region === s.code ? 'bg-sky' : 'hover:bg-line',
                      )}
                    >
                      <span className="font-mono text-[0.6875rem] text-slate">{i + 1}</span>
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-semibold text-ink">{s.name}</span>
                        <span aria-hidden className="mt-1 block h-1 overflow-hidden rounded-full bg-sky">
                          <motion.span
                            className="block h-full origin-left rounded-full bg-brand-hi"
                            initial={false}
                            animate={{ scaleX: s.stats.revenue / maxRevenue }}
                            transition={reduce ? { duration: 0 } : { duration: 0.45, ease: EASE }}
                          />
                        </span>
                      </span>
                      <span className="text-right font-mono text-xs tabular-nums text-ink">
                        <span className="text-slate">{s.stats.leads}</span>
                        <span className="sr-only"> leads, </span>
                        <span className="ml-2">{formatINRCompact(s.stats.revenue)}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
              <dl className="mt-2 space-y-1 border-t border-line pt-2 font-mono text-xs">
                <div className="flex justify-between gap-2 px-2 py-1 text-slate">
                  <dt className="font-sans">Other {rest.length} states &amp; UTs</dt>
                  <dd className="tabular-nums">
                    {restLeads}
                    <span className="sr-only"> leads, </span>
                    <span className="ml-2">{formatINRCompact(restRevenue)}</span>
                  </dd>
                </div>
                <div className="flex justify-between gap-2 rounded-md bg-line px-2 py-1.5 font-semibold text-ink">
                  <dt className="font-sans">All India</dt>
                  <dd className="tabular-nums">
                    {geo.total.leads}
                    <span className="sr-only"> leads, </span>
                    <span className="ml-2">{formatINRCompact(geo.total.revenue)}</span>
                  </dd>
                </div>
              </dl>
            </section>
          </div>
        </div>

        <table className="sr-only">
          <caption>
            Sample data by state, {PERIOD_LABEL[period].toLowerCase()}. Not real customer activity.
          </caption>
          <thead>
            <tr>
              <th scope="col">State or UT</th>
              <th scope="col">Leads</th>
              <th scope="col">Deals won</th>
              <th scope="col">Won revenue</th>
              <th scope="col">Conversion</th>
              <th scope="col">Open pipeline</th>
              <th scope="col">Median response (min)</th>
            </tr>
          </thead>
          <tbody>
            {geo.ranked.map((s) => (
              <tr key={s.code}>
                <th scope="row">{s.name}</th>
                <td>{s.stats.leads}</td>
                <td>{s.stats.won}</td>
                <td>{formatINR(s.stats.revenue)}</td>
                <td>{s.stats.conversion}%</td>
                <td>{formatINR(s.stats.pipeline)}</td>
                <td>{s.stats.medianResponseMins}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">All India</th>
              <td>{geo.total.leads}</td>
              <td>{geo.total.won}</td>
              <td>{formatINR(geo.total.revenue)}</td>
              <td>{geo.total.conversion}%</td>
              <td>{formatINR(geo.total.pipeline)}</td>
              <td>{geo.total.medianResponseMins}</td>
            </tr>
          </tfoot>
        </table>

        <p className="sr-only" role="status" aria-live="polite">
          {announce}
        </p>
      </div>
    </section>
  )
}
