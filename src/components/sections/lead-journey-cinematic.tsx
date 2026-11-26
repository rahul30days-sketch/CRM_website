'use client'

/**
 * Section 04 — the homepage centerpiece: one IndiaMART enquiry from Balaji
 * Agro Implements travels through all seven EZCRM lifecycle stages inside a
 * single app window whose frame stays put while its content morphs.
 *
 * Two modes, one DOM:
 *  - Scroll mode (lg+ and motion allowed): a tall track (7 × 70vh) with the
 *    window pinned by `position: sticky`; useScroll progress picks the stage.
 *    The page scrolls normally — nothing is hijacked. DemoControls jump-scroll
 *    to a stage's scroll position.
 *  - Step mode (below lg, or reduced motion anywhere): DemoControls with
 *    prev / next / play-pause; autoplay only runs while the section is on
 *    screen (useActiveMotion) and stops at the last stage.
 *
 * Accessibility & SEO: every stage's number, heading and copy is in the server
 * HTML (inactive stages are visually collapsed, not removed). DemoControls
 * provides a labelled, keyboard-operable progress list and an aria-live
 * announcement of the current stage. Reduced motion: step mode, no
 * transitions, each panel shows its final state. Track and sticky heights are
 * CSS (`lg:motion-safe:`) so the layout is right before hydration.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { Building2, CalendarClock, Columns3, FileText, MessageCircle, Users } from 'lucide-react'
import { AppWindow, DemoControls, SampleBadge, SectionHeader } from '@/components/demo/kit'
import { JOURNEY_COPY, JOURNEY_STEPS } from '@/components/lifecycle/journey-copy'
import { PANELS } from '@/components/lifecycle/journey-panels'
import { JOURNEY_CUSTOMER } from '@/demo/sample-data'
import { useActiveMotion } from '@/hooks/use-active-motion'
import { track } from '@/lib/analytics'
import { EASE } from '@/lib/motion'
import { cn } from '@/lib/utils'

const COUNT = JOURNEY_STEPS.length
const AUTOPLAY_MS = 5200

/** Sidebar module per stage, so the window frame feels like one product. */
const NAV = [
  { label: 'Leads', icon: Users, stages: [0, 1] },
  { label: 'Inbox', icon: MessageCircle, stages: [2] },
  { label: 'Tasks', icon: CalendarClock, stages: [3] },
  { label: 'Quotations', icon: FileText, stages: [4] },
  { label: 'Pipeline', icon: Columns3, stages: [5] },
  { label: 'Customers', icon: Building2, stages: [6] },
]

const WINDOW_TITLES = [
  `Leads › ${JOURNEY_CUSTOMER.name}`,
  'Leads › Assignment rules',
  `Inbox › ${JOURNEY_CUSTOMER.name}`,
  'Tasks › Follow-ups',
  'Quotations › Builder',
  'Pipeline › This period',
  `Customers › ${JOURNEY_CUSTOMER.company}`,
]

function useIsDesktop() {
  const [match, setMatch] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const on = () => setMatch(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return match
}

export function LeadJourneyCinematic() {
  const reduce = useReducedMotion()
  const isDesktop = useIsDesktop()
  const scrollMode = isDesktop && !reduce

  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const active = useActiveMotion(sectionRef)

  const [stage, setStage] = useState(0)
  const [playing, setPlaying] = useState(true)
  const completed = useRef(false)

  // Scroll mode: the pinned track's progress picks the stage.
  // Offsets match the sticky box (top 10vh, height 80vh).
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start 0.1', 'end 0.9'] })
  const stageFromProgress = (v: number) => Math.min(COUNT - 1, Math.max(0, Math.floor(v * COUNT)))
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!scrollMode) return
    const next = stageFromProgress(v)
    setStage((prev) => (prev === next ? prev : next))
  })
  useEffect(() => {
    if (scrollMode) setStage(stageFromProgress(scrollYProgress.get()))
  }, [scrollMode, scrollYProgress])

  // Step mode: autoplay, gated on visibility/reduced motion, stops at the end.
  useEffect(() => {
    if (scrollMode || !playing || !active) return
    if (stage >= COUNT - 1) {
      setPlaying(false)
      return
    }
    const t = window.setTimeout(() => setStage((s) => Math.min(COUNT - 1, s + 1)), AUTOPLAY_MS)
    return () => window.clearTimeout(t)
  }, [scrollMode, playing, active, stage])

  useEffect(() => {
    if (stage === COUNT - 1 && !completed.current) {
      completed.current = true
      track('demo_completed', { demo: 'lifecycle' })
    }
  }, [stage])

  /** Scroll mode: put the page at the middle of stage i's slice of the track. */
  const scrollToStage = useCallback(
    (i: number) => {
      const el = trackRef.current
      if (!el) return
      const vh = window.innerHeight
      const top = el.getBoundingClientRect().top + window.scrollY
      const distance = el.offsetHeight - 0.8 * vh
      const y = top - 0.1 * vh + ((i + 0.5) / COUNT) * distance
      window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' })
    },
    [reduce],
  )

  const goTo = (i: number) => {
    const next = Math.min(COUNT - 1, Math.max(0, i))
    if (scrollMode) scrollToStage(next)
    else {
      setPlaying(false)
      setStage(next)
    }
  }

  const replay = () => {
    if (scrollMode) scrollToStage(0)
    else {
      setStage(0)
      setPlaying(true)
    }
  }

  const togglePlay = () => {
    if (!playing && stage >= COUNT - 1) setStage(0)
    setPlaying((p) => !p)
  }

  const Panel = PANELS[stage]
  const playPanels = active && !reduce

  return (
    <section ref={sectionRef} aria-labelledby="journey-title" className="bg-sky py-16 text-ink lg:py-24">
      <div className="shell">
        <SectionHeader
          id="journey-title"
          tone="light"
          kicker="One enquiry, start to finish"
          title="Watch one enquiry become revenue."
          lede={`Follow a single IndiaMART enquiry from ${JOURNEY_CUSTOMER.company} through all seven stages of the EZCRM lifecycle, in one workspace.`}
        />
        <div className="mt-5 flex justify-center">
          <SampleBadge tone="light" />
        </div>

        <div ref={trackRef} className="relative mt-10 lg:mt-14 lg:motion-safe:h-[490vh]">
          <div
            className={cn(
              'grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[1fr_auto] lg:gap-x-12 lg:gap-y-6',
              'lg:motion-safe:sticky lg:motion-safe:top-[10vh] lg:motion-safe:h-[80vh] lg:motion-safe:content-center',
            )}
          >
            {/* Stage text: all seven in the HTML; the active one is shown. */}
            <ol className="lg:col-start-1 lg:row-start-1 lg:self-end" aria-label="Lifecycle stages">
              {JOURNEY_STEPS.map((s, i) => {
                const on = i === stage
                const c = JOURNEY_COPY[s.id]
                return (
                  <li
                    key={s.id}
                    aria-current={on ? 'step' : undefined}
                    className={cn(
                      'lg:border-l lg:py-2 lg:pl-5',
                      on ? 'lg:border-cyan' : 'sr-only lg:not-sr-only lg:border-line',
                    )}
                  >
                    <p className={cn('font-mono text-xs font-semibold', on ? 'text-brand' : 'text-slate')}>
                      {String(i + 1).padStart(2, '0')} · {s.label}
                    </p>
                    <h3
                      className={cn(
                        'font-display font-bold tracking-tight',
                        on ? 'mt-1 text-2xl text-ink sm:text-3xl lg:text-2xl' : 'text-base text-slate lg:sr-only',
                      )}
                    >
                      {c.title}
                    </h3>
                    <p className={cn('text-base leading-relaxed text-slate', on ? 'mt-2' : 'sr-only')}>{c.copy}</p>
                  </li>
                )
              })}
            </ol>

            {/* The one window; only its inner panel changes. */}
            <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
              <AppWindow
                title={`EZCRM · ${WINDOW_TITLES[stage]}`}
                right={
                  <span className="font-mono text-[11px] text-slate">
                    {stage + 1}/{COUNT}
                  </span>
                }
              >
                <div className="flex">
                  <nav aria-hidden className="hidden w-32 shrink-0 border-r border-line bg-mist/60 py-3 sm:block">
                    <ul className="space-y-0.5 px-2">
                      {NAV.map((n) => {
                        const Icon = n.icon
                        const here = n.stages.includes(stage)
                        return (
                          <li
                            key={n.label}
                            className={cn(
                              'flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors duration-base',
                              here ? 'bg-white font-semibold text-brand shadow-press' : 'text-slate',
                            )}
                          >
                            <Icon className="h-3.5 w-3.5" aria-hidden />
                            {n.label}
                          </li>
                        )
                      })}
                    </ul>
                  </nav>
                  <div className="relative h-[34rem] min-w-0 flex-1 overflow-hidden bg-white text-ink sm:h-[26rem]">
                    <AnimatePresence initial={false}>
                      <motion.div
                        key={stage}
                        className="absolute inset-0"
                        initial={reduce ? false : { opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, x: -24 }}
                        transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
                      >
                        <Panel play={playPanels} />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </AppWindow>
            </div>

            <DemoControls
              tone="light"
              label="Lead lifecycle stages"
              steps={JOURNEY_STEPS}
              index={stage}
              onIndex={goTo}
              playing={scrollMode ? undefined : playing}
              onTogglePlay={scrollMode || reduce ? undefined : togglePlay}
              onReplay={replay}
              className="lg:col-start-1 lg:row-start-2 lg:self-start"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
