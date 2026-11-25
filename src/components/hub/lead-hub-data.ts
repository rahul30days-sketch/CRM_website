/**
 * Shared types, geometry and helpers for the lead-capture hub demo.
 *
 * Geometry lives in one 600 × 440 SVG coordinate space. Source buttons are
 * HTML positioned at the same percentages, so the lines meet the buttons at
 * every width without measuring the DOM. Packet paths are cubic Béziers that
 * we sample with plain maths (no getPointAtLength, no layout reads) and feed
 * to framer-motion as transform keyframes.
 */

import { REPS, SOURCES, SAMPLE_ENQUIRIES, type Rep, type SourceId } from '@/demo/sample-data'

export const VIEW_W = 600
export const VIEW_H = 440
export const HUB = { x: 300, y: 220 }
/** Half-width of the hub card in viewBox units; lines stop at its edge. */
const HUB_EDGE = 74

/** Fixed node positions: three sources on each side of EZCRM. */
const NODE_POS: Record<SourceId, { x: number; y: number }> = {
  indiamart: { x: 92, y: 74 },
  justdial: { x: 92, y: 220 },
  facebook: { x: 92, y: 366 },
  whatsapp: { x: 508, y: 74 },
  google: { x: 508, y: 220 },
  website: { x: 508, y: 366 },
}

type Pt = { x: number; y: number }

function control(id: SourceId): [Pt, Pt, Pt, Pt] {
  const p0 = NODE_POS[id]
  const end = { x: p0.x < HUB.x ? HUB.x - HUB_EDGE : HUB.x + HUB_EDGE, y: HUB.y }
  const dx = end.x - p0.x
  return [p0, { x: p0.x + dx * 0.55, y: p0.y }, { x: end.x - dx * 0.45, y: end.y }, end]
}

function bezier(t: number, [a, b, c, d]: [Pt, Pt, Pt, Pt]): Pt {
  const u = 1 - t
  return {
    x: u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t * t * t * d.x,
    y: u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t * t * t * d.y,
  }
}

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
const r1 = (n: number) => Math.round(n * 10) / 10

export interface HubNode {
  id: SourceId
  name: string
  short: string
  x: number
  y: number
  /** Position as a percentage of the network box, for the HTML button. */
  left: string
  top: string
  d: string
  /** Sampled packet keyframes along the path. */
  xs: number[]
  ys: number[]
}

export const HUB_NODES: HubNode[] = SOURCES.map((s) => {
  const c = control(s.id)
  const [p0, p1, p2, p3] = c
  const samples = Array.from({ length: 15 }, (_, i) => bezier(easeInOut(i / 14), c))
  return {
    id: s.id,
    name: s.name,
    short: s.short,
    x: p0.x,
    y: p0.y,
    left: `${r1((p0.x / VIEW_W) * 100)}%`,
    top: `${r1((p0.y / VIEW_H) * 100)}%`,
    d: `M ${p0.x} ${p0.y} C ${r1(p1.x)} ${r1(p1.y)}, ${r1(p2.x)} ${r1(p2.y)}, ${p3.x} ${p3.y}`,
    xs: samples.map((p) => r1(p.x)),
    ys: samples.map((p) => r1(p.y)),
  }
})

/** Reps who receive new leads. The manager oversees and is not in the rotation. */
export const ASSIGNABLE: Rep[] = REPS.filter((r) => r.id !== 'vikram')

export interface HubLead {
  key: number
  sourceId: SourceId
  name: string
  company: string
  city: string
  requirement: string
  value: number
  rep: Rep
  time: string
}

export interface HubEvent {
  key: number
  time: string
  text: string
}

/** Demo clock: lead n arrives two minutes after lead n-1, from 10:30. */
export function demoTime(n: number) {
  const total = 10 * 60 + 30 + n * 2
  const h = Math.floor(total / 60) % 24
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function makeLead(n: number, sourceId: SourceId): HubLead {
  const e = SAMPLE_ENQUIRIES[sourceId]
  return { key: n, sourceId, ...e, rep: ASSIGNABLE[n % ASSIGNABLE.length], time: demoTime(n) }
}

export function eventFor(lead: HubLead): HubEvent {
  const source = SOURCES.find((s) => s.id === lead.sourceId)
  return {
    key: lead.key,
    time: lead.time,
    text: `Lead created from ${source?.name ?? lead.sourceId} · assigned to ${lead.rep.name}`,
  }
}

/**
 * Three leads already in the queue on first paint (server HTML), so the panel
 * is informative without JavaScript. Chosen so the next lead goes to Priya.
 */
const SEED_SOURCES: SourceId[] = ['website', 'google', 'justdial']
export const SEED_LEADS: HubLead[] = SEED_SOURCES.map((id, i) => makeLead(i, id)).reverse()
export const SEED_EVENTS: HubEvent[] = SEED_LEADS.map(eventFor)

export const MAX_LEADS = 5
export const MAX_EVENTS = 6
