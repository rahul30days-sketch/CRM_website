'use client'

/**
 * Section 15 — Cinematic final CTA.
 *
 * The elements seen through the page converge into one EZCRM core: each labelled
 * chip is wired to the core with a connector line, particles stream inward along
 * those lines, and the core glows and pulses. framer-motion; existing links.
 * Reduced motion drops the particle flow and entrance.
 */

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Users, MessageCircle, FileText, UserCheck, Workflow, Handshake, BarChart3, Contact,
  type LucideIcon,
} from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Chip = { label: string; icon: LucideIcon }
const CHIPS: Chip[] = [
  { label: 'Leads', icon: Users },
  { label: 'WhatsApp', icon: MessageCircle },
  { label: 'Quotes', icon: FileText },
  { label: 'Sales reps', icon: UserCheck },
  { label: 'Automations', icon: Workflow },
  { label: 'Deals', icon: Handshake },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Customers', icon: Contact },
]
const R = 40

const POINTS = CHIPS.map((c, i) => {
  const a = (i / CHIPS.length) * Math.PI * 2 - Math.PI / 2
  return { ...c, x: Math.cos(a) * R, y: Math.sin(a) * R }
})

export function FinalCtaCinematic({
  primary = { label: 'Book your free demo', href: '/demo' },
  secondary = { label: 'Explore all features', href: '/features' },
}: {
  primary?: { label: string; href: string }
  secondary?: { label: string; href: string }
}) {
  const reduce = useReducedMotion()

  return (
    <section className="shell py-14 lg:py-20">
      <div className="relative overflow-hidden rounded-[2rem] border border-line bg-gradient-to-b from-white to-sky/50 px-6 py-16 text-center shadow-float sm:py-20">
        {/* converging constellation */}
        <div className="relative mx-auto mb-8 aspect-square w-full max-w-sm">
          {/* connectors + inward particle flow */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
            {POINTS.map((p, i) => (
              <line
                key={'l' + i}
                x1={50 + p.x}
                y1={50 + p.y}
                x2="50"
                y2="50"
                stroke="rgb(43,92,230)"
                strokeOpacity={0.16}
                strokeWidth={0.35}
              />
            ))}
            {!reduce &&
              POINTS.map((p, i) => (
                <motion.circle
                  key={'d' + i}
                  r={0.9}
                  fill="rgb(43,92,230)"
                  initial={{ cx: 50 + p.x, cy: 50 + p.y, opacity: 0 }}
                  animate={{ cx: [50 + p.x, 50], cy: [50 + p.y, 50], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.6 + i * 0.22, ease: 'easeIn' }}
                />
              ))}
          </svg>

          {/* chips */}
          {POINTS.map((p, i) => {
            const Icon = p.icon
            return (
              <motion.div
                key={p.label}
                initial={reduce ? false : { left: `${50 + p.x * 1.9}%`, top: `${50 + p.y * 1.9}%`, opacity: 0 }}
                whileInView={reduce ? undefined : { left: `${50 + p.x}%`, top: `${50 + p.y}%`, opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                style={reduce ? { left: `${50 + p.x}%`, top: `${50 + p.y}%` } : undefined}
                className="absolute -translate-x-1/2 -translate-y-1/2"
              >
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-white px-2.5 py-1 text-[11px] font-semibold text-slate shadow-soft">
                  <Icon className="h-3.5 w-3.5 text-brand" aria-hidden />
                  {p.label}
                </span>
              </motion.div>
            )
          })}

          {/* core — centering on a static wrapper so the scale animation can't shift it */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/15 blur-2xl" />
            {!reduce && (
              <motion.span
                aria-hidden
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand/30"
                initial={{ width: 80, height: 80, opacity: 0.5 }}
                animate={{ width: [80, 128], height: [80, 128], opacity: [0.5, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
            <motion.div
              initial={reduce ? false : { scale: 0.6, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: 0.3, type: 'spring', stiffness: 200, damping: 18 }}
              className="relative grid h-20 w-20 place-items-center rounded-2xl border border-brand/20 bg-white shadow-float"
            >
              <span className="font-display text-lg font-extrabold tracking-tight text-ink">
                EZ<span className="text-brand">CRM</span>
              </span>
            </motion.div>
          </div>
        </div>

        <h2 className="mx-auto max-w-3xl font-display text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
          Every lead. Every conversation. Every opportunity. <span className="text-brand">One EZCRM.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate">
          Bring your entire sales operation together and give your business the clarity, automation and control it deserves.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href={primary.href} className={buttonVariants({ size: 'lg' })}>
            {primary.label}
          </Link>
          <Link href={secondary.href} className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }))}>
            {secondary.label}
          </Link>
        </div>
      </div>
    </section>
  )
}
