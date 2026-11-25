'use client'

/**
 * The lead network: EZCRM in the centre, the six lead sources around it.
 *
 * Desktop/tablet (md+): an SVG of connection paths with real HTML <button>s
 * placed on the nodes. Firing a source sends a packet (a transform-animated
 * dot) along that source's path into the hub, which pulses on arrival.
 *
 * Mobile (< md): a dedicated vertical composition: a two-column grid of
 * source buttons that feeds, through a short rail, into the same hub card.
 *
 * Both compositions are in the DOM; CSS shows one. Every source button has a
 * visible label and an accessible name that starts with it. Under reduced
 * motion no packets are drawn; the lead simply appears.
 */

import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { SourceId } from '@/demo/sample-data'
import { HUB_NODES, VIEW_H, VIEW_W } from './lead-hub-data'

export interface Packet {
  key: number
  sourceId: SourceId
}

interface NetworkProps {
  packets: Packet[]
  lastSource: SourceId | null
  count: number
  /** True once a lead has arrived on the client (drives the hub pulse). */
  pulseKey: number
  reduce: boolean
  onFire: (id: SourceId) => void
  flightSeconds: number
}

function HubCard({ count, lastSource, pulseKey, reduce }: Pick<NetworkProps, 'count' | 'lastSource' | 'pulseKey' | 'reduce'>) {
  const last = HUB_NODES.find((n) => n.id === lastSource)
  return (
    <div className="relative w-full max-w-[11.5rem] rounded-card border border-brand/30 bg-white px-4 py-3.5 text-center shadow-float">
      {!reduce && pulseKey > 0 ? (
        <motion.span
          key={pulseKey}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-card border-2 border-brand"
          initial={{ opacity: 0.55, scale: 1 }}
          animate={{ opacity: 0, scale: 1.14 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      ) : null}
      <p className="font-display text-xl font-extrabold tracking-tight text-ink">EZCRM</p>
      <p className="kicker mt-0.5 !text-[0.625rem]">Lead queue</p>
      <p className="mt-2 text-xs text-slate">
        <span className="font-mono text-base font-semibold text-ink">{count}</span> leads captured
      </p>
      <p className="mt-1 truncate text-[0.6875rem] text-slate">
        {last ? <>Latest from {last.short}</> : 'Waiting for a lead'}
      </p>
    </div>
  )
}

export function LeadNetwork(props: NetworkProps) {
  const { packets, lastSource, reduce, onFire, flightSeconds } = props
  const flying = new Set(packets.map((p) => p.sourceId))

  return (
    <>
      {/* ── md+: radial network ───────────────────────────────────────── */}
      <div className="relative hidden w-full md:block" style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}>
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="absolute inset-0 h-full w-full overflow-visible"
          aria-hidden
          focusable="false"
        >
          {HUB_NODES.map((n) => {
            const hot = flying.has(n.id) || lastSource === n.id
            return (
              <g key={n.id}>
                <path d={n.d} fill="none" strokeWidth={6} className="stroke-sky" strokeLinecap="round" />
                <path
                  d={n.d}
                  fill="none"
                  strokeWidth={hot ? 2 : 1.5}
                  strokeDasharray={hot ? undefined : '4 6'}
                  strokeLinecap="round"
                  className={cn('transition-colors duration-base ease-out', hot ? 'stroke-brand' : 'stroke-line')}
                />
              </g>
            )
          })}
          {!reduce ? (
            <AnimatePresence>
              {packets.map((p) => {
                const n = HUB_NODES.find((h) => h.id === p.sourceId)
                if (!n) return null
                return (
                  <motion.g
                    key={p.key}
                    initial={{ x: n.xs[0], y: n.ys[0], opacity: 0 }}
                    animate={{ x: n.xs, y: n.ys, opacity: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.6] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: flightSeconds, ease: 'linear' }}
                  >
                    <circle r={11} className="fill-cyan/20" />
                    <circle r={5} className="fill-brand" />
                  </motion.g>
                )
              })}
            </AnimatePresence>
          ) : null}
        </svg>

        {/* Hub */}
        <div className="absolute left-1/2 top-1/2 flex w-[30%] -translate-x-1/2 -translate-y-1/2 justify-center">
          <HubCard {...props} />
        </div>

        {/* Source buttons on the nodes */}
        {HUB_NODES.map((n) => {
          const hot = lastSource === n.id
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => onFire(n.id)}
              aria-label={`${n.short}: send sample lead`}
              className={cn(
                'absolute flex min-h-11 w-[23%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-chip border px-2 py-1.5 text-center shadow-soft transition-colors duration-fast ease-out',
                hot ? 'border-brand bg-white text-ink' : 'border-line bg-white text-ink hover:border-brand/50',
              )}
              style={{ left: n.left, top: n.top }}
            >
              <span className="block max-w-full truncate text-sm font-semibold">{n.short}</span>
              <span className="block max-w-full truncate text-[0.6875rem] text-slate">Send sample lead</span>
            </button>
          )
        })}
      </div>

      {/* ── < md: vertical feeder ─────────────────────────────────────── */}
      <div className="md:hidden">
        <ul className="grid grid-cols-2 gap-2" aria-label="Lead sources">
          {HUB_NODES.map((n) => {
            const hot = lastSource === n.id
            return (
              <li key={n.id} className="min-w-0">
                <button
                  type="button"
                  onClick={() => onFire(n.id)}
                  aria-label={`${n.short}: send sample lead`}
                  className={cn(
                    'flex min-h-11 w-full items-center justify-between gap-2 rounded-chip border bg-white px-3 py-2 text-left text-sm font-semibold text-ink transition-colors duration-fast',
                    hot ? 'border-brand' : 'border-line',
                  )}
                >
                  <span className="min-w-0 truncate">{n.short}</span>
                  <span
                    aria-hidden
                    className={cn('h-2 w-2 shrink-0 rounded-full', hot ? 'bg-brand' : 'bg-line')}
                  />
                </button>
              </li>
            )
          })}
        </ul>
        <div aria-hidden className="relative mx-auto my-1 h-12 w-px bg-line">
          {!reduce ? (
            <AnimatePresence>
              {packets.map((p) => (
                <motion.span
                  key={p.key}
                  className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full bg-brand"
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: [0, 20, 40], opacity: [0, 1, 1] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: flightSeconds, ease: 'easeInOut' }}
                />
              ))}
            </AnimatePresence>
          ) : null}
        </div>
        <div className="flex justify-center">
          <HubCard {...props} />
        </div>
      </div>
    </>
  )
}
