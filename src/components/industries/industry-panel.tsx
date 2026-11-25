'use client'

/**
 * One industry's tab panel: headline and intro from the data file, the
 * animated workflow strip, pain → fix pairs, and a sample scenario card whose
 * events light up in step with the strip.
 *
 * The strip auto-advances only while this panel is the selected tab, on
 * screen, and not paused (useActiveMotion gates it). A Pause / Play button
 * controls it; choosing a step also pauses. Reduced motion shows the finished
 * process with every scenario event visible and nothing moving.
 */

import Link from 'next/link'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Pause, Play } from 'lucide-react'
import type { IndustryContent } from '@/content/site'
import { AppWindow, SampleBadge } from '@/components/demo/kit'
import { buttonVariants } from '@/components/ui/button'
import { useActiveMotion } from '@/hooks/use-active-motion'
import { track } from '@/lib/analytics'
import { EASE } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { useLoop } from '@/components/bento/use-loop'
import { useStill } from '@/components/bento/use-still'
import { WorkflowStrip } from './workflow-strip'
import type { IndustryStory } from './industry-stories'

export function IndustryPanel({
  industry,
  story,
  selected,
  tabId,
  panelId,
}: {
  industry: IndustryContent
  story?: IndustryStory
  selected: boolean
  tabId: string
  panelId: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useStill()
  const onScreen = useActiveMotion(ref)
  const [playing, setPlaying] = useState(true)
  const [manual, setManual] = useState<number | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const steps = story?.steps ?? []
  const tick = useLoop(selected && onScreen && playing && steps.length > 0, 1900)

  // One extra beat on the last step before the loop restarts.
  const cycle = steps.length + 1
  const auto = Math.min(tick % cycle, steps.length - 1)
  const index = manual ?? (reduce ? steps.length - 1 : auto)

  const select = (i: number) => {
    setPlaying(false)
    setManual(i)
    setAnnouncement(`Step ${i + 1} of ${steps.length}: ${steps[i]}`)
  }
  const togglePlay = () => {
    setManual(null)
    setPlaying((p) => !p)
  }

  const name = story?.ctaName ?? industry.name.toLowerCase()

  return (
    <div
      ref={ref}
      role="tabpanel"
      id={panelId}
      aria-labelledby={tabId}
      hidden={!selected}
      tabIndex={0}
      className="rounded-card"
    >
      <motion.div
        initial={false}
        animate={selected ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={reduce ? { duration: 0 } : { duration: 0.45, ease: EASE }}
        className="panel-frame p-5 sm:p-8"
      >
        <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h3 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">{industry.headline}</h3>
            <p className="mt-3 max-w-2xl text-slate">{industry.intro}</p>
          </div>
          {steps.length > 0 ? (
            <div className="lg:col-span-4 lg:justify-self-end">
              <button
                type="button"
                onClick={togglePlay}
                aria-pressed={!playing}
                disabled={reduce}
                className={buttonVariants({ variant: 'ghost', size: 'sm' })}
              >
                {playing ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
                {playing ? 'Pause walkthrough' : 'Play walkthrough'}
              </button>
            </div>
          ) : null}
        </div>

        {steps.length > 0 ? (
          <div className="mt-8 rounded-card border border-line bg-mist/60 p-4 sm:p-5">
            <WorkflowStrip
              steps={steps}
              index={index}
              onSelect={select}
              still={reduce}
              label={`${industry.name} sales process`}
              announcement={announcement}
            />
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="kicker mb-3">What changes</p>
            <ul className="divide-y divide-line rounded-card border border-line">
              {industry.pains.slice(0, 3).map((p) => (
                <li key={p.pain} className="grid gap-2 p-4 sm:grid-cols-[1fr_auto_1fr] sm:items-start sm:gap-4">
                  <p className="text-sm text-slate">
                    <span className="sr-only">Problem: </span>
                    {p.pain}
                  </p>
                  <ArrowRight className="hidden h-4 w-4 text-brand sm:mt-0.5 sm:block" aria-hidden />
                  <p className="text-sm font-semibold text-ink">
                    <span className="sr-only">With EZCRM: </span>
                    {p.fix}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/solutions/${industry.slug}`} className={buttonVariants({ variant: 'primary', size: 'md' })}>
                See EZCRM for {name}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/demo"
                onClick={() => track('demo_cta_clicked', { from: `industries-${industry.slug}` })}
                className={buttonVariants({ variant: 'secondary', size: 'md' })}
              >
                Book a demo
              </Link>
            </div>
          </div>

          {story ? (
            <div className="lg:col-span-5">
              <AppWindow title={story.scenario.title} right={<SampleBadge label="Sample" className="py-0.5" />}>
                <div className="flex items-center gap-3 border-b border-line px-4 py-3">
                  <span
                    aria-hidden
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sky font-mono text-xs font-semibold text-brand"
                  >
                    {story.scenario.customer
                      .split(' ')
                      .map((w) => w[0])
                      .join('')
                      .slice(0, 2)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{story.scenario.customer}</p>
                    <p className="truncate text-xs text-slate">
                      {story.scenario.meta} · owner {story.scenario.owner}
                    </p>
                  </div>
                </div>
                <ol className="space-y-0.5 p-2" aria-label={`Sample ${industry.name.toLowerCase()} timeline`}>
                  {story.scenario.events.map((e) => {
                    const state = e.step < index ? 'past' : e.step === index ? 'now' : 'next'
                    return (
                      <li
                        key={e.step}
                        aria-current={state === 'now' && !reduce ? 'step' : undefined}
                        className={cn(
                          'flex gap-3 rounded-chip px-2.5 py-2 text-sm transition-colors duration-base',
                          state === 'now' && 'bg-sky',
                        )}
                      >
                        <span className="w-20 shrink-0 font-mono text-xs leading-5 text-slate">{e.time}</span>
                        <span
                          className={cn(
                            'leading-5 transition-colors duration-base',
                            state === 'next' ? 'text-slate' : 'text-ink',
                            state === 'now' && 'font-semibold',
                          )}
                        >
                          {e.text}
                        </span>
                      </li>
                    )
                  })}
                </ol>
                <p className="border-t border-line px-4 py-2.5 text-xs text-slate">
                  Fictional customer and figures. Nothing is sent from this page.
                </p>
              </AppWindow>
            </div>
          ) : null}
        </div>
      </motion.div>
    </div>
  )
}
