'use client'

/**
 * Section 15 — Cinematic final CTA (dark `night` band).
 *
 * Idea: the parts of a sales operation the page has shown (lead sources,
 * WhatsApp, quotations, pipeline, team) converge into one EZCRM core. On
 * entering view the five nodes travel inward from wider positions to their
 * ring, then cyan packets stream along the spokes into the core and a ring
 * pulses outward from it. Transform and opacity only.
 *
 * Accessibility: the visual is one role="img" with a summary label; headline,
 * copy and both CTAs are server-rendered real links. Looping motion runs only
 * while on screen (useActiveMotion) and has a Pause control; reduced motion
 * shows the converged state with static markers on each spoke.
 */

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { MotionConfig, motion } from 'framer-motion'
import { FileText, Inbox, Kanban, MessageCircle, Users, type LucideIcon } from 'lucide-react'
import { useActiveMotion } from '@/hooks/use-active-motion'
import { buttonVariants } from '@/components/ui/button'
import { MotionToggle } from '@/components/hero/motion-toggle'
import { track } from '@/lib/analytics'
import { EASE } from '@/lib/motion'
import { cn } from '@/lib/utils'

type Node = { label: string; icon: LucideIcon; x: number; y: number }

/**
 * Ring positions in % (centre 50/50, radius 36, angles −90°, −18°, 54°, 126°,
 * 198°). Precomputed so server and client never disagree on trig rounding.
 */
const NODES: Node[] = [
  { label: 'Lead sources', icon: Inbox, x: 50, y: 14 },
  { label: 'WhatsApp', icon: MessageCircle, x: 84.24, y: 38.88 },
  { label: 'Quotations', icon: FileText, x: 71.16, y: 79.12 },
  { label: 'Pipeline', icon: Kanban, x: 28.84, y: 79.12 },
  { label: 'Team', icon: Users, x: 15.76, y: 38.88 },
]

/** Points along a spoke from the node (t=0) towards the core edge (t=0.78). */
const spoke = (n: Node, t: number) => ({ x: n.x + (50 - n.x) * t, y: n.y + (50 - n.y) * t })

export function FinalCtaCinematic({
  primary = { label: 'Book your free demo', href: '/demo' },
  secondary = { label: 'Explore all features', href: '/features' },
}: {
  primary?: { label: string; href: string }
  secondary?: { label: string; href: string }
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const active = useActiveMotion(sectionRef)
  const [paused, setPaused] = useState(false)
  const [canAnimate, setCanAnimate] = useState(false)
  useEffect(() => {
    setCanAnimate(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])
  const flowing = active && !paused && canAnimate

  return (
    <MotionConfig reducedMotion="user">
      <section ref={sectionRef} aria-labelledby="final-cta-title" className="shell py-16 lg:py-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-night px-5 py-14 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
            {/* Copy and CTAs */}
            <div className="text-center lg:order-1 lg:text-left">
              <h2
                id="final-cta-title"
                className="font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-5xl"
              >
                Your entire sales operation. <span className="text-brand-hi">Finally working as one.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/75 lg:mx-0">
                Bring your leads, conversations, salespeople, quotations and customer relationships together with
                EZCRM.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Link
                  href={primary.href}
                  onClick={() => track('demo_cta_clicked', { from: 'final-cta' })}
                  className={buttonVariants({ variant: 'brand', size: 'lg' })}
                >
                  {primary.label}
                </Link>
                <Link href={secondary.href} className={buttonVariants({ variant: 'onNight', size: 'lg' })}>
                  {secondary.label}
                </Link>
              </div>
            </div>

            {/* Convergence visual */}
            <div className="relative mx-auto w-full max-w-[22rem] sm:max-w-sm lg:order-2 lg:max-w-md">
              <div
                role="img"
                aria-label="Lead sources, WhatsApp, quotations, pipeline and team converging into one EZCRM core"
                className="relative aspect-square w-full"
              >
                {/* One soft glow behind the core. */}
                <div
                  aria-hidden
                  className="absolute left-1/2 top-1/2 h-2/5 w-2/5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/25 blur-3xl"
                />

                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden focusable="false">
                  <circle cx={50} cy={50} r={36} fill="none" strokeWidth={0.3} className="stroke-night-line" />
                  {NODES.map((n) => (
                    <line
                      key={n.label}
                      x1={n.x}
                      y1={n.y}
                      x2={50}
                      y2={50}
                      strokeWidth={0.4}
                      strokeLinecap="round"
                      className="stroke-cyan/30"
                    />
                  ))}
                  {!flowing &&
                    NODES.map((n) => {
                      const p = spoke(n, 0.45)
                      return <circle key={'s' + n.label} cx={p.x} cy={p.y} r={0.9} className="fill-cyan/70" />
                    })}
                  {flowing &&
                    NODES.map((n, i) => {
                      const a = spoke(n, 0.12)
                      const b = spoke(n, 0.72)
                      return (
                        <motion.circle
                          key={'p' + n.label}
                          cx={0}
                          cy={0}
                          r={1}
                          className="fill-cyan"
                          initial={{ x: a.x, y: a.y, opacity: 0 }}
                          animate={{ x: [a.x, b.x], y: [a.y, b.y], opacity: [0, 1, 1, 0] }}
                          transition={{
                            duration: 2.2,
                            ease: 'easeIn',
                            repeat: Infinity,
                            repeatDelay: 0.9,
                            delay: 0.9 + i * 0.45,
                          }}
                        />
                      )
                    })}
                </svg>

                {/* Nodes converge from a wider ring once, on entering view. */}
                {NODES.map((n, i) => {
                  const Icon = n.icon
                  return (
                    <div
                      key={n.label}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${n.x}%`, top: `${n.y}%` }}
                    >
                      <motion.div
                        initial={{ opacity: 0, x: (n.x - 50) * 1.6, y: (n.y - 50) * 1.6 }}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.8, delay: i * 0.07, ease: EASE }}
                        className="flex flex-col items-center gap-1.5"
                      >
                        <span className="grid h-10 w-10 place-items-center rounded-full border border-night-line bg-night-raised text-cyan sm:h-11 sm:w-11">
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
                        </span>
                        <span className="whitespace-nowrap text-[11px] font-semibold text-white/80 sm:text-xs">
                          {n.label}
                        </span>
                      </motion.div>
                    </div>
                  )
                })}

                {/* Core: centring on a static wrapper so scale can't shift it. */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  {flowing && (
                    <motion.span
                      aria-hidden
                      className="absolute inset-0 rounded-2xl border border-cyan/40"
                      initial={{ scale: 1, opacity: 0.6 }}
                      animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
                      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut', delay: 1.2 }}
                    />
                  )}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
                    className={cn(
                      'relative grid h-20 w-20 place-items-center rounded-2xl border border-cyan/30 bg-night-raised shadow-float sm:h-24 sm:w-24',
                    )}
                  >
                    <span className="font-display text-lg font-extrabold tracking-tight text-white sm:text-xl">
                      EZ<span className="text-cyan">CRM</span>
                    </span>
                  </motion.div>
                </div>
              </div>

              {canAnimate && (
                <div className="mt-2 flex justify-center lg:justify-end">
                  <MotionToggle tone="night" paused={paused} onToggle={() => setPaused((p) => !p)} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  )
}
