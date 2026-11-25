'use client'

/**
 * Section 05 — Lead capture: an interactive lead integration ecosystem.
 *
 * Idea: cause and effect. Pick a source (IndiaMART, JustDial, Facebook Lead
 * Ads, WhatsApp, Google lead forms, website form) and its sample enquiry
 * travels along that source's connection into EZCRM, lands at the top of
 * "Incoming leads", is assigned round-robin to a sales executive (the manager
 * is not in the rotation), and is logged in the activity timeline.
 *
 * Motion: a gentle auto-demo fires one source every 3s, only while the
 * section is on screen, the tab is visible and motion is allowed
 * (useActiveMotion). It stops for good the moment the visitor picks a source;
 * the visible Pause/Play button controls it too.
 *
 * Accessibility: sources are real buttons; leads the visitor creates are
 * announced in a polite live region (auto-demo leads are not announced, so a
 * screen reader is not interrupted every three seconds). Reduced motion: no
 * packets or slides, the lead appears immediately; the auto-demo never runs.
 * No JS / SSR: three seeded leads and their timeline entries are in the HTML.
 */

import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Pause, Play } from 'lucide-react'
import { useActiveMotion } from '@/hooks/use-active-motion'
import { SectionHeader, SampleBadge } from '@/components/demo/kit'
import { sourceById, type SourceId } from '@/demo/sample-data'
import { LeadNetwork, type Packet } from '@/components/hub/lead-network'
import { ActivityTimeline, IncomingLeads } from '@/components/hub/lead-panels'
import {
  HUB_NODES,
  MAX_EVENTS,
  MAX_LEADS,
  SEED_EVENTS,
  SEED_LEADS,
  eventFor,
  makeLead,
  type HubEvent,
  type HubLead,
} from '@/components/hub/lead-hub-data'

const FLIGHT_MS = 900
const AUTO_MS = 3000

interface HubState {
  leads: HubLead[]
  events: HubEvent[]
  count: number
  pulse: number
}

function reducer(state: HubState, lead: HubLead): HubState {
  return {
    leads: [lead, ...state.leads].slice(0, MAX_LEADS),
    events: [eventFor(lead), ...state.events].slice(0, MAX_EVENTS),
    count: state.count + 1,
    pulse: state.pulse + 1,
  }
}

const INITIAL: HubState = { leads: SEED_LEADS, events: SEED_EVENTS, count: SEED_LEADS.length, pulse: 0 }

export function LeadMagnet() {
  const sectionRef = useRef<HTMLElement>(null)
  const active = useActiveMotion(sectionRef)
  const prefersReduced = useReducedMotion()
  // Only branch on reduced motion after mount, so SSR and hydration agree.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const reduce = mounted && !!prefersReduced

  const [state, add] = useReducer(reducer, INITIAL)
  const [packets, setPackets] = useState<Packet[]>([])
  const [lastSource, setLastSource] = useState<SourceId | null>(null)
  const [auto, setAuto] = useState(true)
  const [touched, setTouched] = useState(false)
  const [announcement, setAnnouncement] = useState('')

  const seq = useRef(SEED_LEADS.length)
  const autoIdx = useRef(0)
  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())
  const reduceRef = useRef(reduce)
  useEffect(() => {
    reduceRef.current = reduce
  }, [reduce])

  useEffect(() => {
    const set = timers.current
    return () => set.forEach(clearTimeout)
  }, [])

  const fire = useCallback((id: SourceId, byVisitor: boolean) => {
    const n = seq.current++
    const lead = makeLead(n, id)
    setLastSource(id)
    const land = () => {
      add(lead)
      if (byVisitor) {
        setAnnouncement(
          `New lead from ${sourceById(id).name}: ${lead.name}, ${lead.company}, ${lead.city}. Assigned to ${lead.rep.name}.`,
        )
      }
    }
    if (reduceRef.current) {
      land()
      return
    }
    setPackets((p) => [...p, { key: n, sourceId: id }])
    const t = setTimeout(() => {
      timers.current.delete(t)
      setPackets((p) => p.filter((x) => x.key !== n))
      land()
    }, FLIGHT_MS)
    timers.current.add(t)
  }, [])

  const onVisitorFire = useCallback(
    (id: SourceId) => {
      setAuto(false)
      setTouched(true)
      fire(id, true)
    },
    [fire],
  )

  // Gentle auto-demo, gated on visibility/motion and stopped by interaction.
  useEffect(() => {
    if (!auto || !active) return
    const t = setInterval(() => {
      const node = HUB_NODES[autoIdx.current % HUB_NODES.length]
      autoIdx.current++
      fire(node.id, false)
    }, AUTO_MS)
    return () => clearInterval(t)
  }, [auto, active, fire])

  return (
    <section ref={sectionRef} aria-labelledby="lead-capture-title" className="relative py-16 lg:py-24">
      <div className="shell">
        <SectionHeader
          id="lead-capture-title"
          kicker="Lead capture"
          title="Every lead. From everywhere. In one queue."
          lede="EZCRM connects to the places your enquiries come from and captures each lead into one queue, then assigns it to a sales rep. Pick a source to send a sample enquiry through."
        />

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:mt-12">
          <SampleBadge />
          {!reduce ? (
            <button
              type="button"
              onClick={() => setAuto((a) => !a)}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-xs font-semibold text-ink transition-colors duration-fast hover:border-brand/50"
            >
              {auto ? <Pause className="h-3.5 w-3.5" aria-hidden /> : <Play className="h-3.5 w-3.5" aria-hidden />}
              {auto ? 'Pause auto-demo' : 'Play auto-demo'}
            </button>
          ) : null}
          {touched && !auto ? (
            <p className="text-xs text-slate">Auto-demo stopped. Pick any source.</p>
          ) : null}
        </div>

        <div className="mt-8 grid min-w-0 gap-6 lg:grid-cols-12 lg:items-start lg:gap-10">
          <div className="min-w-0 lg:col-span-7">
            <LeadNetwork
              packets={packets}
              lastSource={lastSource}
              count={state.count}
              pulseKey={state.pulse}
              reduce={reduce}
              onFire={onVisitorFire}
              flightSeconds={FLIGHT_MS / 1000}
            />
            <p className="mt-4 text-center text-xs text-slate">
              Simulated enquiries. Nothing is sent to or received from any external service.
            </p>
          </div>
          <div className="grid min-w-0 gap-4 md:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            <IncomingLeads leads={state.leads} reduce={reduce} />
            <ActivityTimeline events={state.events} reduce={reduce} />
          </div>
        </div>

        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {announcement}
        </p>
      </div>
    </section>
  )
}
