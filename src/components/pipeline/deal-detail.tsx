'use client'

/**
 * Detail panel for the selected deal: company, contact, owner, source, value,
 * stage and the stage's current win probability. It is a labelled region the
 * card buttons point at with aria-controls.
 */

import type { ReactNode } from 'react'
import { repById, sourceById, type Deal } from '@/demo/sample-data'
import { formatINR } from '@/lib/gst'
import { cn } from '@/lib/utils'
import { stageLabel, type Probabilities } from './model'

export function DealDetail({ id, deal, probs }: { id: string; deal: Deal | undefined; probs: Probabilities }) {
  if (!deal) {
    return (
      <section id={id} aria-label="Deal details" className="text-sm text-slate">
        Select a deal to see its details.
      </section>
    )
  }
  const rep = repById(deal.repId)
  const p = probs[deal.stage]
  const rows: [string, ReactNode][] = [
    ['Contact', `${deal.contact} · ${deal.city}`],
    [
      'Owner',
      <span key="o" className="inline-flex items-center gap-1.5">
        <span
          aria-hidden
          className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky font-mono text-[0.5625rem] font-semibold text-brand"
        >
          {rep.initials}
        </span>
        {rep.name}
        <span className="text-slate">· {rep.role}</span>
      </span>,
    ],
    ['Source', sourceById(deal.source).name],
    ['Stage', stageLabel(deal.stage)],
    ['Probability', <span key="p" className="font-mono tabular-nums">{p}%</span>],
    [
      'Weighted',
      <span key="w" className="font-mono tabular-nums">
        {formatINR(Math.round((deal.value * p) / 100))}
      </span>,
    ],
  ]
  return (
    <section id={id} aria-label={`Deal details: ${deal.company}`}>
      <p className="text-base font-semibold leading-snug text-ink">{deal.company}</p>
      <p
        className={cn(
          'mt-1 font-mono text-xl font-semibold tabular-nums',
          deal.stage === 'won' ? 'text-won' : 'text-ink',
        )}
      >
        {formatINR(deal.value)}
      </p>
      <dl className="mt-3 divide-y divide-line border-y border-line text-xs">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-start justify-between gap-3 py-2">
            <dt className="shrink-0 text-slate">{k}</dt>
            <dd className="text-right font-semibold text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
