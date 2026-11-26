/**
 * Data and colour maths for the India tile map. Every number comes from
 * filterLeads → groupBy/summarize on the shared DEMO_LEADS, so state rows,
 * the ranked list and the All India total always reconcile.
 */

import {
  DEMO_LEADS,
  INDIA_STATES,
  filterLeads,
  groupBy,
  repById,
  sourceById,
  summarize,
  type DemoPeriod,
  type DemoLead,
  type IndiaState,
  type SourceId,
} from '@/demo/sample-data'
import { formatINR, formatINRCompact } from '@/lib/gst'

export type GeoMetric = 'leads' | 'revenue' | 'won' | 'conversion'
export type GeoPeriod = Extract<DemoPeriod, 'week' | 'month' | 'quarter'>
export type Stats = ReturnType<typeof summarize>

export const GEO_PERIODS: GeoPeriod[] = ['week', 'month', 'quarter']

export const METRICS: { id: GeoMetric; label: string; short: (n: number) => string; long: (n: number) => string }[] = [
  { id: 'leads', label: 'Leads', short: (n) => String(n), long: (n) => `${n} ${n === 1 ? 'lead' : 'leads'}` },
  { id: 'revenue', label: 'Revenue (won)', short: formatINRCompact, long: (n) => `${formatINR(n)} won revenue` },
  { id: 'won', label: 'Deals won', short: (n) => String(n), long: (n) => `${n} ${n === 1 ? 'deal' : 'deals'} won` },
  { id: 'conversion', label: 'Conversion rate', short: (n) => `${Math.round(n)}%`, long: (n) => `${n}% conversion` },
]

export const metricById = (id: GeoMetric) => METRICS.find((m) => m.id === id) ?? METRICS[0]

export function metricValue(s: Stats, m: GeoMetric) {
  if (m === 'leads') return s.leads
  if (m === 'revenue') return s.revenue
  if (m === 'won') return s.won
  return s.conversion
}

export interface StateRow extends IndiaState {
  stats: Stats
}

export function buildGeo(period: GeoPeriod) {
  const leads = filterLeads(DEMO_LEADS, { period })
  const byState = new Map(groupBy(leads, (l) => l.state).map((g) => [g.key, g]))
  const empty = summarize([])
  const states: StateRow[] = INDIA_STATES.map((s) => ({ ...s, stats: byState.get(s.code) ?? empty }))
  const ranked = [...states].sort((a, b) => b.stats.revenue - a.stats.revenue || b.stats.leads - a.stats.leads)
  return { leads, states, ranked, total: summarize(leads) }
}

export function regionInsights(leads: DemoLead[]) {
  const stats = summarize(leads)
  const reps = groupBy(leads, (l) => l.repId).sort((a, b) => b.revenue - a.revenue)
  const sources = groupBy(leads, (l) => l.source).sort((a, b) => b.leads - a.leads)
  const topRep = reps[0] && reps[0].revenue > 0 ? { rep: repById(reps[0].key), revenue: reps[0].revenue, won: reps[0].won } : null
  const topSource = sources[0]
    ? { source: sourceById(sources[0].key as SourceId), leads: sources[0].leads, share: Math.round((sources[0].leads / stats.leads) * 100) }
    : null
  return { stats, topRep, topSource }
}

/* ── Heat scale ──────────────────────────────────────────────────────── */

/**
 * Six steps: none (a light neutral), then brand at rising opacity over the
 * white map background. Static class strings so Tailwind can see them. RGB
 * values mirror the theme tokens in globals.css and are only used to work out
 * which label colour (white or ink) has the higher contrast on each step.
 */
const RGB = {
  sky: [241, 243, 247],
  brand: [43, 92, 230],
  brandDeep: [30, 66, 180],
  ink: [15, 26, 51],
  white: [255, 255, 255],
} as const

type RGBt = readonly [number, number, number]
const mix = (fg: RGBt, bg: RGBt, a: number): RGBt =>
  [0, 1, 2].map((i) => fg[i] * a + bg[i] * (1 - a)) as unknown as RGBt

function luminance([r, g, b]: RGBt) {
  const f = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}

const contrast = (a: RGBt, b: RGBt) => {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

const STEP_DEFS: { bg: string; rgb: RGBt }[] = [
  { bg: 'bg-sky', rgb: RGB.sky },
  { bg: 'bg-brand/15', rgb: mix(RGB.brand, RGB.white, 0.15) },
  { bg: 'bg-brand/35', rgb: mix(RGB.brand, RGB.white, 0.35) },
  { bg: 'bg-brand/60', rgb: mix(RGB.brand, RGB.white, 0.6) },
  { bg: 'bg-brand', rgb: RGB.brand },
  { bg: 'bg-brand-deep', rgb: RGB.brandDeep },
]

export const HEAT_STEPS = STEP_DEFS.map((s) => {
  const onWhite = contrast(RGB.white, s.rgb)
  const onInk = contrast(RGB.ink, s.rgb)
  const dark = onInk > onWhite
  return {
    bg: s.bg,
    text: dark ? 'text-ink' : 'text-white',
    ratio: Math.round(Math.max(onWhite, onInk) * 10) / 10,
  }
})

export const HEAT_LEVELS = HEAT_STEPS.length - 1

/** 0 for no activity, else 1…5 by share of the highest state. */
export function heatLevel(v: number, max: number) {
  if (v <= 0 || max <= 0) return 0
  return Math.min(HEAT_LEVELS, Math.max(1, Math.ceil((v / max) * HEAT_LEVELS)))
}
