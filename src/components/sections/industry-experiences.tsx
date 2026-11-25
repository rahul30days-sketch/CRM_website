'use client'

/**
 * Homepage "Industries" — built for how each industry actually sells.
 *
 * A WAI-ARIA tabs widget over the `industries` data (src/content/site.ts).
 * Each panel walks through that industry's sales process as an animated
 * strip, pairs it with the industry's real pains → fixes, and shows a sample
 * scenario that highlights in step with the strip, ending in a personalised
 * CTA to /solutions/<slug> and a demo CTA.
 *
 * Accessibility: role=tablist/tab/tabpanel with roving tabindex; Left/Right
 * (and Up/Down, since tabs stack on phones) move and activate, Home/End jump.
 * Every panel is rendered on the server; inactive ones carry `hidden`, so
 * their text is in the HTML but out of the reading order until selected.
 */

import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { industries } from '@/content/site'
import { SectionHeader } from '@/components/demo/kit'
import { EASE } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { IndustryPanel } from '@/components/industries/industry-panel'
import { INDUSTRY_STORIES } from '@/components/industries/industry-stories'
import { useStill } from '@/components/bento/use-still'

const DEFAULT_INDEX = Math.max(
  0,
  industries.findIndex((i) => i.slug === 'manufacturing'),
)

export function IndustryExperiences() {
  const [active, setActive] = useState(DEFAULT_INDEX)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const base = useId()
  const still = useStill()
  const tabId = (slug: string) => `${base}-tab-${slug}`
  const panelId = (slug: string) => `${base}-panel-${slug}`

  const focusTab = (i: number) => {
    const n = industries.length
    const next = ((i % n) + n) % n
    setActive(next)
    tabs.current[next]?.focus()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault()
        focusTab(i + 1)
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault()
        focusTab(i - 1)
        break
      case 'Home':
        e.preventDefault()
        focusTab(0)
        break
      case 'End':
        e.preventDefault()
        focusTab(industries.length - 1)
        break
    }
  }

  return (
    <section className="border-y border-line bg-mist/60 py-16 lg:py-24" aria-labelledby={`${base}-title`}>
      <div className="shell">
        <SectionHeader
          id={`${base}-title`}
          kicker="Industries"
          title="Built for how your industry actually sells."
          lede="Pick your industry to see its sales process, the problems EZCRM is set up to fix, and a sample deal moving through it."
        />

        <div className="mt-10 flex justify-center">
          <div
            role="tablist"
            aria-label="Industries"
            className="flex w-full flex-col gap-1 rounded-card border border-line bg-white p-1.5 shadow-soft sm:w-auto sm:flex-row sm:rounded-full"
          >
            {industries.map((ind, i) => {
              const selected = i === active
              return (
                <button
                  key={ind.slug}
                  ref={(el) => {
                    tabs.current[i] = el
                  }}
                  type="button"
                  role="tab"
                  id={tabId(ind.slug)}
                  aria-selected={selected}
                  aria-controls={panelId(ind.slug)}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={cn(
                    'relative min-h-10 rounded-chip px-5 py-2 text-sm font-semibold transition-colors duration-base sm:rounded-full',
                    selected ? 'text-white' : 'text-slate hover:text-ink',
                  )}
                >
                  {selected ? (
                    <motion.span
                      aria-hidden
                      layoutId={`${base}-tab-indicator`}
                      transition={still ? { duration: 0 } : { duration: 0.45, ease: EASE }}
                      className="absolute inset-0 rounded-chip bg-brand shadow-press sm:rounded-full"
                    />
                  ) : null}
                  <span className="relative">{ind.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-8">
          {industries.map((ind, i) => (
            <IndustryPanel
              key={ind.slug}
              industry={ind}
              story={INDUSTRY_STORIES[ind.slug]}
              selected={i === active}
              tabId={tabId(ind.slug)}
              panelId={panelId(ind.slug)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
