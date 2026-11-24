'use client'

/**
 * Section 07 — Interactive sales pipeline.
 *
 * A miniature, interactive kanban. Tap/click a deal to advance it through the
 * stages; cards fly between columns via shared-layout animation and the won
 * tally updates live. Reset restores the demo. Click-to-advance is the primary
 * (touch-friendly) interaction. Labelled as an interactive demo with sample
 * data — not connected to any production records.
 */

import { useMemo, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { RotateCcw, Check } from 'lucide-react'

const COLUMNS = ['New', 'Qualified', 'Proposal', 'Negotiation', 'Won'] as const
type Col = (typeof COLUMNS)[number]

type Deal = { id: string; name: string; value: number; col: number }

const INITIAL: Deal[] = [
  { id: 'd1', name: 'Shri Balaji Agro', value: 212400, col: 0 },
  { id: 'd2', name: 'Vertex Realty', value: 850000, col: 1 },
  { id: 'd3', name: 'Millat Electronics', value: 118000, col: 2 },
  { id: 'd4', name: 'Chennai Interiors', value: 340000, col: 3 },
]

const inr = (n: number) => '₹' + new Intl.NumberFormat('en-IN').format(n)

export function SalesPipeline() {
  const reduce = useReducedMotion()
  const [deals, setDeals] = useState<Deal[]>(INITIAL)

  const advance = (id: string) =>
    setDeals((ds) =>
      ds.map((d) => (d.id === id ? { ...d, col: Math.min(COLUMNS.length - 1, d.col + 1) } : d)),
    )

  const wonTotal = useMemo(
    () => deals.filter((d) => d.col === COLUMNS.length - 1).reduce((s, d) => s + d.value, 0),
    [deals],
  )

  return (
    <section className="shell py-14 lg:py-20">
      <header className="mx-auto max-w-2xl text-center">
        <p className="kicker mb-3">Pipeline</p>
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
          Your entire pipeline. Always moving forward.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate">
          Tap a deal to move it through the stages and watch the numbers respond.
        </p>
      </header>

      <div className="mt-8 flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-slate">
          <span className="h-2 w-2 rounded-full bg-brand" /> Interactive demo · sample data
        </span>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-mono text-lg font-bold text-[rgb(var(--c-won))]">
              <motion.span key={wonTotal} initial={reduce ? false : { opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
                {inr(wonTotal)}
              </motion.span>
            </p>
            <p className="text-[11px] text-slate">won this view</p>
          </div>
          <button
            type="button"
            onClick={() => setDeals(INITIAL)}
            className="inline-flex items-center gap-1.5 rounded-chip border border-line bg-white px-3 py-2 text-sm font-medium text-slate transition-colors hover:text-ink"
          >
            <RotateCcw className="h-4 w-4" aria-hidden /> Reset
          </button>
        </div>
      </div>

      <LayoutGroup>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {COLUMNS.map((col, ci) => (
            <div key={col} className="rounded-card border border-line bg-sky/40 p-2.5">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate">{col}</p>
                {ci === COLUMNS.length - 1 && <Check className="h-3.5 w-3.5 text-[rgb(var(--c-won))]" aria-hidden />}
              </div>
              <div className="min-h-[4.5rem] space-y-2">
                <AnimatePresence>
                  {deals
                    .filter((d) => d.col === ci)
                    .map((d) => {
                      const isWon = ci === COLUMNS.length - 1
                      return (
                        <motion.button
                          key={d.id}
                          layoutId={d.id}
                          layout
                          type="button"
                          disabled={isWon}
                          onClick={() => advance(d.id)}
                          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 34 }}
                          className={`block w-full rounded-chip border p-2 text-left shadow-soft transition-colors ${
                            isWon
                              ? 'cursor-default border-[rgb(var(--c-won))]/30 bg-[rgb(var(--c-won))]/5'
                              : 'border-line bg-white hover:border-brand/40 hover:bg-white'
                          }`}
                        >
                          <p className="truncate text-xs font-bold text-ink">{d.name}</p>
                          <p className={`font-mono text-[11px] ${isWon ? 'text-[rgb(var(--c-won))]' : 'text-brand'}`}>
                            {inr(d.value)}
                          </p>
                        </motion.button>
                      )
                    })}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </LayoutGroup>
    </section>
  )
}
