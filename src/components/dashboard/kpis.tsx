'use client'

/**
 * The eight KPI tiles, computed from the filtered lead set. Values are a
 * <dl> (label → value) so they read as pairs; each value cross-fades when a
 * filter changes (opacity/transform only). Ratios with no denominator show
 * an em dash and say why, never NaN.
 */

import { motion, useReducedMotion } from 'framer-motion'
import { EASE } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { formatMins, money, pct, type Dashboard } from './data'

interface Kpi {
  label: string
  value: string
  note: string
  accent?: 'won' | 'brand' | 'cyan'
}

export function KpiGrid({ data, animate }: { data: Dashboard; animate: boolean }) {
  const s = data.summary
  const kpis: Kpi[] = [
    { label: 'Total revenue', value: money(s.revenue), note: `${s.won} deal${s.won === 1 ? '' : 's'} won`, accent: 'won' },
    { label: 'Total leads', value: String(s.leads), note: `${s.open} open · ${data.decided} decided`, accent: 'brand' },
    {
      label: 'Conversion rate',
      value: data.decided ? pct(s.conversion) : '—',
      note: data.decided ? `Won ÷ decided (${s.won} of ${data.decided})` : 'Won ÷ decided · none decided yet',
    },
    { label: 'Pipeline value', value: money(s.pipeline), note: `Open deals at full value`, accent: 'brand' },
    { label: 'Weighted forecast', value: money(s.weighted), note: 'Pipeline × stage probability', accent: 'cyan' },
    { label: 'Open opportunities', value: String(s.open), note: 'New to negotiation' },
    { label: 'Pending follow-ups', value: String(s.followUpsPending), note: 'Open at New or Qualified' },
    {
      label: 'Median first response',
      value: s.leads ? formatMins(s.medianResponseMins) : '—',
      note: s.leads ? 'Enquiry to first reply' : 'No enquiries in view',
    },
  ]

  return (
    <dl className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
      {kpis.map((k) => (
        <div key={k.label} className="relative min-w-0 overflow-hidden rounded-chip border border-night-line bg-night/60 p-3 sm:p-4">
          <span
            aria-hidden
            className={cn(
              'absolute inset-x-0 top-0 h-px',
              k.accent === 'won' ? 'bg-won' : k.accent === 'cyan' ? 'bg-cyan' : k.accent === 'brand' ? 'bg-brand-hi' : 'bg-night-line',
            )}
          />
          <dt className="text-[0.6875rem] leading-tight font-semibold uppercase tracking-[0.08em] text-white/70 sm:text-xs">{k.label}</dt>
          <dd className="mt-1.5">
            <KpiValue value={k.value} animate={animate} />
            <span className="mt-1 block text-[0.6875rem] leading-snug text-white/70 sm:text-xs">{k.note}</span>
          </dd>
        </div>
      ))}
    </dl>
  )
}

function KpiValue({ value, animate }: { value: string; animate: boolean }) {
  const reduce = useReducedMotion()
  return (
    <motion.span
      key={value}
      initial={animate && !reduce ? { opacity: 0, y: 6 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="block truncate font-mono text-xl font-semibold tabular-nums text-white sm:text-2xl"
    >
      {value}
    </motion.span>
  )
}
