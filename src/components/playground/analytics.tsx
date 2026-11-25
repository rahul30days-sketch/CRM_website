'use client'

/**
 * Analytics module: three hand-built SVG bar charts computed from the store
 * (deals by stage, won revenue by rep, leads by source). Bars grow with a
 * transform (scaleX) transition, which reduced-motion users skip. Each chart
 * has a one-line text summary and a visually hidden data table.
 */

import { formatINR, formatINRCompact } from '@/lib/gst'
import { cn } from '@/lib/utils'
import { PIPELINE_STAGES, REPS, SOURCES } from '@/demo/sample-data'
import { Hint, ModuleHeader, Panel } from './ui'
import { usePlayground } from './store'

interface Row {
  key: string
  label: string
  value: number
  display: string
  tone?: 'brand' | 'won' | 'due'
}

function BarChart({ title, summary, rows, unit }: { title: string; summary: string; rows: Row[]; unit: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value))
  return (
    <Panel title={title}>
      <figure>
        <figcaption className="mb-3 text-xs text-slate">{summary}</figcaption>
        <ul aria-hidden className="space-y-2">
          {rows.map((r) => (
            <li key={r.key} className="grid grid-cols-[6.5rem_1fr_auto] items-center gap-2 sm:grid-cols-[8rem_1fr_auto]">
              <span className="truncate text-xs text-ink">{r.label}</span>
              <svg className="h-4 w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 10">
                <rect x="0" y="0" width="100" height="10" rx="2" className="fill-sky" />
                <rect
                  x="0"
                  y="0"
                  width="100"
                  height="10"
                  rx="2"
                  className={cn(
                    'origin-left transition-transform duration-slow ease-out motion-reduce:transition-none',
                    r.tone === 'won' ? 'fill-won' : r.tone === 'due' ? 'fill-due/70' : 'fill-brand',
                  )}
                  style={{ transform: `scaleX(${r.value / max})`, transformBox: 'fill-box' }}
                />
              </svg>
              <span className="w-16 text-right font-mono text-xs text-ink">{r.display}</span>
            </li>
          ))}
        </ul>
        <table className="sr-only">
          <caption>{title}</caption>
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col">{unit}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key}>
                <th scope="row">{r.label}</th>
                <td>{r.display}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>
    </Panel>
  )
}

export function AnalyticsModule() {
  const { state } = usePlayground()

  const byStage: Row[] = PIPELINE_STAGES.map((s) => {
    const ds = state.deals.filter((d) => d.stage === s.id)
    const v = ds.reduce((a, d) => a + d.value, 0)
    return {
      key: s.id,
      label: `${s.label} (${ds.length})`,
      value: v,
      display: formatINRCompact(v),
      tone: s.id === 'won' ? 'won' : s.id === 'lost' ? 'due' : 'brand',
    }
  })
  const byRep: Row[] = REPS.map((r) => {
    const v = state.deals.filter((d) => d.stage === 'won' && d.repId === r.id).reduce((a, d) => a + d.value, 0)
    return { key: r.id, label: r.name, value: v, display: formatINRCompact(v), tone: 'won' }
  })
  const bySource: Row[] = SOURCES.map((s) => {
    const n = state.leads.filter((l) => l.source === s.id).length
    return { key: s.id, label: s.short, value: n, display: String(n) }
  })

  const topStage = [...byStage].filter((r) => r.key !== 'won' && r.key !== 'lost').sort((a, b) => b.value - a.value)[0]
  const topRep = [...byRep].sort((a, b) => b.value - a.value)[0]
  const topSource = [...bySource].sort((a, b) => b.value - a.value)[0]
  const wonTotal = byRep.reduce((a, r) => a + r.value, 0)
  const wonCount = state.deals.filter((d) => d.stage === 'won').length
  const lostCount = state.deals.filter((d) => d.stage === 'lost').length
  const owned = state.leads.filter((l) => l.repId).length
  const snapshot = [
    { label: 'Win rate (closed deals)', value: wonCount + lostCount ? `${Math.round((wonCount / (wonCount + lostCount)) * 100)}%` : '—' },
    { label: 'Average won deal', value: wonCount ? formatINRCompact(Math.round(wonTotal / wonCount)) : '—' },
    { label: 'Leads with an owner', value: `${owned}/${state.leads.length}` },
    { label: 'Open follow-ups', value: String(state.tasks.filter((t) => !t.done).length) },
  ]

  return (
    <div>
      <ModuleHeader
        title="Analytics"
        description="Charts drawn from the playground’s live data. Win a deal or add a lead and the bars update."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <BarChart
          title="Pipeline value by stage"
          unit="Value"
          rows={byStage}
          summary={`Most open value sits in ${topStage?.label.replace(/ \(\d+\)$/, '')} (${formatINR(topStage?.value ?? 0)}).`}
        />
        <BarChart
          title="Won revenue by rep"
          unit="Won revenue"
          rows={byRep}
          summary={
            wonTotal > 0
              ? `${formatINR(wonTotal)} won in total; ${topRep?.label} leads with ${formatINR(topRep?.value ?? 0)}.`
              : 'No won revenue yet.'
          }
        />
        <BarChart
          title="Leads by source"
          unit="Leads"
          rows={bySource}
          summary={`${state.leads.length} leads in total; ${topSource?.label} brings the most (${topSource?.value}).`}
        />
        <div className="space-y-4">
          <Panel title="Snapshot">
            <dl className="grid grid-cols-2 gap-3">
              {snapshot.map((s) => (
                <div key={s.label} className="rounded-chip bg-sky/50 px-3 py-2">
                  <dt className="text-xs text-slate">{s.label}</dt>
                  <dd className="font-mono text-lg font-semibold text-ink">{s.value}</dd>
                </div>
              ))}
            </dl>
          </Panel>
          <Hint>These charts read the same store as every other module, so they update the moment you act.</Hint>
        </div>
      </div>
    </div>
  )
}
