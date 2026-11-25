/**
 * Dashboard view-model: everything the homepage sales dashboard shows,
 * derived from DEMO_LEADS through the shared filterLeads / summarize /
 * groupBy / dailySeries helpers, so every figure reconciles with the other
 * demos on the site. Pure and deterministic (no Date.now, no locale
 * formatting) so server and client render the same numbers.
 */

import {
  DEMO_LEADS,
  DEMO_TODAY,
  INDIA_STATES,
  PERIOD_DAYS,
  PERIOD_LABEL,
  PIPELINE_STAGES,
  REPS,
  SOURCES,
  dailySeries,
  filterLeads,
  groupBy,
  summarize,
  type DemoLead,
  type DemoPeriod,
  type SourceId,
} from '@/demo/sample-data'
import { formatINRCompact } from '@/lib/gst'

export interface DashboardFilter {
  period: DemoPeriod
  repId: string
  source: SourceId | ''
  state: string
}

export const DEFAULT_FILTER: DashboardFilter = { period: 'month', repId: '', source: '', state: '' }

export const PERIODS: DemoPeriod[] = ['today', 'week', 'month', 'quarter']

/** Short period labels for the narrow (mobile) segmented control. */
export const PERIOD_SHORT: Record<DemoPeriod, string> = {
  today: 'Today',
  week: 'Week',
  month: 'Month',
  quarter: 'Quarter',
}

/** Salespeople who actually own leads (the manager has none, so is left out). */
export const REP_OPTIONS = REPS.filter((r) => DEMO_LEADS.some((l) => l.repId === r.id))

/** Top states by lead volume across the whole sample, for the region filter. */
export const REGION_OPTIONS = groupBy(DEMO_LEADS, (l) => l.state)
  .sort((a, b) => b.leads - a.leads || (a.key < b.key ? -1 : 1))
  .slice(0, 8)
  .map((g) => ({ code: g.key, name: stateName(g.key) }))

export function stateName(code: string) {
  return INDIA_STATES.find((s) => s.code === code)?.name ?? code
}

export function repName(id: string) {
  return REPS.find((r) => r.id === id)?.name ?? id
}

export function sourceName(id: string) {
  return SOURCES.find((s) => s.id === id)?.name ?? id
}

/* ─── Formatting (locale-free) ─────────────────────────────────────────── */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const TODAY_UTC = Date.UTC(
  Number(DEMO_TODAY.slice(0, 4)),
  Number(DEMO_TODAY.slice(5, 7)) - 1,
  Number(DEMO_TODAY.slice(8, 10)),
)

/** "24 Nov" for a lead that is `daysAgo` days before DEMO_TODAY. */
export function dateLabel(daysAgo: number) {
  const d = new Date(TODAY_UTC - daysAgo * 86_400_000)
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`
}

export function relativeDay(daysAgo: number) {
  if (daysAgo === 0) return 'Today'
  if (daysAgo === 1) return 'Yesterday'
  return `${daysAgo} days ago`
}

export function formatMins(m: number) {
  if (m < 60) return `${m} min`
  const h = Math.floor(m / 60)
  const r = m % 60
  return r ? `${h} h ${r} min` : `${h} h`
}

export const money = (n: number) => formatINRCompact(n)

export function pct(n: number) {
  return `${n.toFixed(1).replace(/\.0$/, '')}%`
}

/* ─── View-model ───────────────────────────────────────────────────────── */

export interface TrendPoint {
  label: string
  /** Long label for tooltips and the data table. */
  longLabel: string
  leads: number
  revenue: number
  /** Inside the selected period (false only for the "Today" context days). */
  inPeriod: boolean
}

type OpenStage = DemoLead['stage']
const OPEN_STAGES = PIPELINE_STAGES.filter((s) => s.id !== 'won' && s.id !== 'lost') as unknown as {
  id: OpenStage
  label: string
  probability: number
}[]

function toLeadFilter(f: DashboardFilter, period: DemoPeriod = f.period) {
  return {
    period,
    repId: f.repId || undefined,
    source: f.source || undefined,
    state: f.state || undefined,
  }
}

function buildTrend(f: DashboardFilter) {
  // "Today" alone is one point, so show it against the six days before it.
  const window = f.period === 'today' ? 7 : PERIOD_DAYS[f.period]
  const leads = filterLeads(DEMO_LEADS, toLeadFilter(f, f.period === 'today' ? 'week' : f.period))
  const days = dailySeries(leads, window)

  if (f.period !== 'quarter') {
    const points: TrendPoint[] = days.map((d) => ({
      label: d.daysAgo === 0 ? 'Today' : dateLabel(d.daysAgo),
      longLabel: d.daysAgo === 0 ? `Today, ${dateLabel(0)}` : dateLabel(d.daysAgo),
      leads: d.leads,
      revenue: d.revenue,
      inPeriod: f.period !== 'today' || d.daysAgo === 0,
    }))
    return {
      points,
      bucket: 'day' as const,
      windowLabel: f.period === 'today' ? 'over the last 7 days' : PERIOD_LABEL[f.period].toLowerCase(),
    }
  }

  // Quarter: weekly buckets, newest week last. The oldest bucket may be short.
  const points: TrendPoint[] = []
  for (let end = days.length; end > 0; end -= 7) {
    const chunk = days.slice(Math.max(0, end - 7), end)
    const first = chunk[0].daysAgo
    const last = chunk[chunk.length - 1].daysAgo
    points.unshift({
      label: dateLabel(first),
      longLabel: `Week of ${dateLabel(first)}–${last === 0 ? 'today' : dateLabel(last)}`,
      leads: chunk.reduce((s, d) => s + d.leads, 0),
      revenue: chunk.reduce((s, d) => s + d.revenue, 0),
      inPeriod: true,
    })
  }
  return { points, bucket: 'week' as const, windowLabel: 'this quarter, by week' }
}

export function buildDashboard(f: DashboardFilter) {
  const leads = filterLeads(DEMO_LEADS, toLeadFilter(f))
  const s = summarize(leads)

  const open = leads.filter((l) => l.status === 'open')
  const funnel = [
    ...OPEN_STAGES.map((st) => {
      const ls = open.filter((l) => l.stage === st.id)
      return {
        id: st.id as string,
        label: st.label,
        count: ls.length,
        value: ls.reduce((sum, l) => sum + l.value, 0),
        probability: st.probability,
      }
    }),
    { id: 'won', label: 'Won', count: s.won, value: s.revenue, probability: 100 },
  ]

  // Peer comparisons ignore their own dimension, so a chosen source or rep is
  // shown highlighted against the others instead of alone.
  const withoutSource = filterLeads(DEMO_LEADS, { ...toLeadFilter(f), source: undefined })
  const bySource = new Map(groupBy(withoutSource, (l) => l.source).map((g) => [g.key, g]))
  const sources = SOURCES.map((src) => {
    const g = bySource.get(src.id)
    const decided = g ? g.won + g.lost : 0
    return {
      id: src.id,
      name: src.short,
      fullName: src.name,
      leads: g?.leads ?? 0,
      won: g?.won ?? 0,
      decided,
      conversion: g?.conversion ?? 0,
      revenue: g?.revenue ?? 0,
    }
  })

  const withoutRep = filterLeads(DEMO_LEADS, { ...toLeadFilter(f), repId: undefined })
  const byRep = new Map(groupBy(withoutRep, (l) => l.repId).map((g) => [g.key, g]))
  const reps = REP_OPTIONS.map((r) => {
    const g = byRep.get(r.id)
    return {
      id: r.id,
      name: r.name,
      initials: r.initials,
      revenue: g?.revenue ?? 0,
      won: g?.won ?? 0,
      leads: g?.leads ?? 0,
      conversion: g?.conversion ?? 0,
      decided: g ? g.won + g.lost : 0,
    }
  })

  const recent = [...leads]
    .sort((a, b) => a.daysAgo - b.daysAgo || (a.id < b.id ? 1 : -1))
    .slice(0, 6)

  return {
    leads,
    summary: s,
    decided: s.won + s.lost,
    trend: buildTrend(f),
    funnel,
    sources,
    reps,
    recent,
  }
}

export type Dashboard = ReturnType<typeof buildDashboard>

/** "This month · IndiaMART" — the human description of a filter. */
export function describeFilter(f: DashboardFilter) {
  const parts: string[] = [PERIOD_LABEL[f.period]]
  if (f.repId) parts.push(repName(f.repId))
  if (f.source) parts.push(sourceName(f.source))
  if (f.state) parts.push(stateName(f.state))
  return parts.join(' · ')
}
