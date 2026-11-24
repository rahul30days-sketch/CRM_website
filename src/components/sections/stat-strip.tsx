/**
 * Finos-style glass stat strip. Numbers are tabular and precise — the
 * product's whole promise, and they count up when scrolled into view.
 * Content comes from the Homepage global.
 */
import { CountUp } from '@/components/motion/count-up'

const ACCENTS = ['text-brand', 'text-won', 'text-ink', 'text-brand']

export function StatStrip({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <div className="glass grid grid-cols-2 gap-px overflow-hidden bg-line/40 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <div key={stat.label} className="bg-white/60 px-6 py-7 text-center backdrop-blur">
          <CountUp
            value={stat.value}
            className={`block font-mono text-3xl font-bold tabular-nums ${ACCENTS[i % ACCENTS.length]}`}
          />
          <p className="mt-1 text-sm text-slate">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
