'use client'

/**
 * Section 13 — Built for how your industry actually sells.
 *
 * An industry selector that swaps the scenario (headline, intro, and real
 * pain → fix pairs) with shared-element transitions. Content is the canonical
 * `industries` data — only capabilities EZCRM actually supports.
 */

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { industries } from '@/content/site'

export function IndustryExperiences() {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const active = industries[i]

  return (
    <section className="mesh-deep py-14 lg:py-20">
      <div className="shell">
        <header className="mx-auto max-w-2xl text-center">
          <p className="kicker mb-3">By industry</p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Built for how your industry actually sells.
          </h2>
        </header>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {industries.map((ind, idx) => (
            <button
              key={ind.slug}
              type="button"
              onClick={() => setI(idx)}
              className={`rounded-chip px-4 py-2 text-sm font-semibold transition-colors ${
                idx === i ? 'bg-brand text-white shadow-soft' : 'border border-line bg-white text-slate hover:text-ink'
              }`}
            >
              {ind.name}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.slug}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-card border border-line bg-white p-6 shadow-float sm:p-8"
            >
              <h3 className="font-display text-2xl font-bold tracking-tight text-ink">{active.headline}</h3>
              <p className="mt-3 max-w-2xl text-slate">{active.intro}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {active.pains.map((p) => (
                  <div key={p.pain} className="rounded-card border border-line bg-sky/40 p-4">
                    <p className="text-sm font-semibold text-ink">{p.pain}</p>
                    <div className="mt-2 flex items-start gap-1.5 text-sm text-[rgb(var(--c-won))]">
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                      <span className="text-slate">{p.fix}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
