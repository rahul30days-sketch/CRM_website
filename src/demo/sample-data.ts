/**
 * EZCRM demo data — ONE fictional dataset shared by every interactive demo on
 * the site (homepage sections and the /experience playground), so names,
 * quantities and rupee figures agree everywhere a visitor sees them.
 *
 * Everything here is invented sample data. People and companies are
 * fictional; any resemblance to a real business is coincidental. Every
 * component that renders it must show <SampleBadge />.
 *
 * Deterministic on purpose: no Math.random / Date.now, so server and client
 * render identically and the numbers never drift between visits.
 */

import { computeQuote, type QuoteLine } from '@/lib/gst'

/* ─── Reference date ────────────────────────────────────────────────────── */

/** "Today" for all demo data. Fixed so SSR and client agree. */
export const DEMO_TODAY = '2026-11-24'

/* ─── Team ──────────────────────────────────────────────────────────────── */

export interface Rep {
  id: string
  name: string
  initials: string
  role: string
}

export const REPS: Rep[] = [
  { id: 'priya', name: 'Priya Sharma', initials: 'PS', role: 'Sales executive' },
  { id: 'arjun', name: 'Arjun Mehta', initials: 'AM', role: 'Sales executive' },
  { id: 'neha', name: 'Neha Iyer', initials: 'NI', role: 'Sales executive' },
  { id: 'vikram', name: 'Vikram Singh', initials: 'VS', role: 'Sales manager' },
]

export const repById = (id: string) => REPS.find((r) => r.id === id) ?? REPS[0]

/* ─── Lead sources (only channels the site lists as integrations) ───────── */

export type SourceId = 'indiamart' | 'justdial' | 'facebook' | 'whatsapp' | 'google' | 'website'

export interface LeadSource {
  id: SourceId
  name: string
  /** Short label for chips. */
  short: string
}

export const SOURCES: LeadSource[] = [
  { id: 'indiamart', name: 'IndiaMART', short: 'IndiaMART' },
  { id: 'justdial', name: 'JustDial', short: 'JustDial' },
  { id: 'facebook', name: 'Facebook Lead Ads', short: 'Facebook' },
  { id: 'whatsapp', name: 'WhatsApp', short: 'WhatsApp' },
  { id: 'google', name: 'Google lead forms', short: 'Google' },
  { id: 'website', name: 'Website form', short: 'Website' },
]

export const sourceById = (id: SourceId) => SOURCES.find((s) => s.id === id) ?? SOURCES[0]

/** One sample enquiry per source, for "click a source → a lead arrives". */
export const SAMPLE_ENQUIRIES: Record<
  SourceId,
  { name: string; company: string; city: string; requirement: string; value: number }
> = {
  indiamart: {
    name: 'Rakesh Gupta',
    company: 'Balaji Agro Implements',
    city: 'Nagpur',
    requirement: '7.5 HP submersible pump × 4, with control panels',
    value: 212400,
  },
  justdial: {
    name: 'Sneha Kulkarni',
    company: 'Kulkarni Dairy Farms',
    city: 'Pune',
    requirement: 'Bulk milk cooler, 500 L — price and delivery time',
    value: 186000,
  },
  facebook: {
    name: 'Imran Qureshi',
    company: 'Qureshi Constructions',
    city: 'Hyderabad',
    requirement: 'Dewatering pumps on rent for a 3-month site',
    value: 96000,
  },
  whatsapp: {
    name: 'Anita Desai',
    company: 'Desai Textiles',
    city: 'Surat',
    requirement: 'Annual maintenance contract for 12 machines',
    value: 144000,
  },
  google: {
    name: 'Karthik Raman',
    company: 'Raman Hospitality',
    city: 'Chennai',
    requirement: 'Hot-water booster pumps for a 40-room hotel',
    value: 128500,
  },
  website: {
    name: 'Meera Joshi',
    company: 'Joshi Agro Exports',
    city: 'Nashik',
    requirement: 'Drip-irrigation pump set for 20 acres',
    value: 74800,
  },
}

/* ─── The hero journey: one enquiry, start to finish ────────────────────── */

export const SELLER = {
  name: 'Sample Pumps Pvt. Ltd.',
  state: 'Maharashtra',
  gstin: '27AAACS0000X1Z5', // invented, format-only
}

export const JOURNEY_CUSTOMER = {
  name: 'Rakesh Gupta',
  company: 'Balaji Agro Implements',
  city: 'Nagpur',
  state: 'Maharashtra',
  phone: '+91 9•••• ••210',
  source: 'indiamart' as SourceId,
  receivedAt: '10:42 AM',
  requirement: '7.5 HP submersible pump × 4, with control panels and installation',
  repId: 'priya',
}

export const JOURNEY_QUOTE_LINES: QuoteLine[] = [
  {
    id: 'pump',
    name: 'Submersible pump 7.5 HP, 3-phase',
    code: '8413',
    codeType: 'HSN',
    qty: 4,
    unitPrice: 38500,
    discountPct: 5,
    gstRate: 18,
  },
  {
    id: 'panel',
    name: 'Control panel with DOL starter',
    code: '8537',
    codeType: 'HSN',
    qty: 4,
    unitPrice: 6200,
    discountPct: 0,
    gstRate: 18,
  },
  {
    id: 'install',
    name: 'Installation & commissioning',
    code: '9987',
    codeType: 'SAC',
    qty: 1,
    unitPrice: 8000,
    discountPct: 0,
    gstRate: 18,
  },
]

export const JOURNEY_QUOTE = computeQuote(JOURNEY_QUOTE_LINES, {
  sellerState: SELLER.state,
  placeOfSupply: JOURNEY_CUSTOMER.state,
})

export const JOURNEY_QUOTE_NUMBER = 'QT-2026-0418'

/** The seven lifecycle stages, in order. */
export const LIFECYCLE_STAGES = [
  { id: 'capture', label: 'Capture' },
  { id: 'assign', label: 'Assign' },
  { id: 'engage', label: 'Engage' },
  { id: 'follow-up', label: 'Follow up' },
  { id: 'quote', label: 'Quote' },
  { id: 'convert', label: 'Convert' },
  { id: 'support', label: 'Support' },
] as const

export type LifecycleStageId = (typeof LIFECYCLE_STAGES)[number]['id']

/* ─── WhatsApp conversation (used by the lifecycle and WhatsApp demo) ───── */

export interface ChatMessage {
  id: string
  from: 'customer' | 'agent' | 'system'
  text: string
  time: string
  /** Optional attachment shown as a card. */
  attachment?: { kind: 'catalogue' | 'quotation'; title: string; meta: string }
  /** Template messages must be pre-approved by Meta to start a conversation. */
  template?: boolean
}

export const WHATSAPP_SCRIPT: ChatMessage[] = [
  {
    id: 'm1',
    from: 'agent',
    template: true,
    text: 'Namaste Rakesh ji, thank you for your IndiaMART enquiry. This is Priya from Sample Pumps. May I share details here?',
    time: '10:44',
  },
  { id: 'm2', from: 'customer', text: 'Yes please. Need 4 pumps for borewells, 7.5 HP.', time: '10:47' },
  {
    id: 'm3',
    from: 'agent',
    text: 'Sure. Here is our submersible range with specs.',
    time: '10:48',
    attachment: { kind: 'catalogue', title: 'Submersible pumps — 2026 catalogue.pdf', meta: 'PDF · 2.4 MB' },
  },
  { id: 'm4', from: 'customer', text: 'Panel also required. Installation possible in Nagpur?', time: '10:55' },
  {
    id: 'm5',
    from: 'agent',
    text: 'Yes, our team covers Nagpur. Sharing the quotation with panels and installation.',
    time: '11:02',
    attachment: { kind: 'quotation', title: `${JOURNEY_QUOTE_NUMBER}.pdf`, meta: 'Quotation · GST included' },
  },
  { id: 'm6', from: 'system', text: 'Conversation assigned to Priya Sharma · visible to Vikram (manager)', time: '11:02' },
  { id: 'm7', from: 'customer', text: 'Approved. Please proceed 👍', time: '15:20' },
]

/** Quick replies offered in the shared inbox. */
export const QUICK_REPLIES = ['Share catalogue', 'Ask for site location', 'Send quotation', 'Book a call']

/* ─── Pipeline ──────────────────────────────────────────────────────────── */

export const PIPELINE_STAGES = [
  { id: 'new', label: 'New lead', probability: 10 },
  { id: 'qualified', label: 'Qualified', probability: 25 },
  { id: 'proposal', label: 'Proposal', probability: 50 },
  { id: 'negotiation', label: 'Negotiation', probability: 75 },
  { id: 'won', label: 'Won', probability: 100 },
  { id: 'lost', label: 'Lost', probability: 0 },
] as const

export type PipelineStageId = (typeof PIPELINE_STAGES)[number]['id']

export interface Deal {
  id: string
  company: string
  contact: string
  value: number
  stage: PipelineStageId
  repId: string
  source: SourceId
  city: string
}

export const DEALS: Deal[] = [
  {
    id: 'deal-balaji',
    company: JOURNEY_CUSTOMER.company,
    contact: JOURNEY_CUSTOMER.name,
    value: JOURNEY_QUOTE.grandTotal,
    stage: 'negotiation',
    repId: 'priya',
    source: 'indiamart',
    city: 'Nagpur',
  },
  { id: 'deal-kulkarni', company: 'Kulkarni Dairy Farms', contact: 'Sneha Kulkarni', value: 186000, stage: 'proposal', repId: 'arjun', source: 'justdial', city: 'Pune' },
  { id: 'deal-qureshi', company: 'Qureshi Constructions', contact: 'Imran Qureshi', value: 96000, stage: 'qualified', repId: 'neha', source: 'facebook', city: 'Hyderabad' },
  { id: 'deal-desai', company: 'Desai Textiles', contact: 'Anita Desai', value: 144000, stage: 'proposal', repId: 'priya', source: 'whatsapp', city: 'Surat' },
  { id: 'deal-raman', company: 'Raman Hospitality', contact: 'Karthik Raman', value: 128500, stage: 'new', repId: 'arjun', source: 'google', city: 'Chennai' },
  { id: 'deal-joshi', company: 'Joshi Agro Exports', contact: 'Meera Joshi', value: 74800, stage: 'new', repId: 'neha', source: 'website', city: 'Nashik' },
  { id: 'deal-verma', company: 'Verma Cold Storage', contact: 'Sanjay Verma', value: 315000, stage: 'qualified', repId: 'vikram', source: 'indiamart', city: 'Lucknow' },
  { id: 'deal-nair', company: 'Nair Builders', contact: 'Deepak Nair', value: 262000, stage: 'won', repId: 'neha', source: 'justdial', city: 'Kochi' },
]

/* ─── Dashboard / geography dataset ─────────────────────────────────────── */

export interface IndiaState {
  code: string
  name: string
  /** Tile-map position (not to scale): row, column. */
  row: number
  col: number
  /** Relative weight of demo lead volume. */
  weight: number
}

/**
 * Tile map of Indian states and major UTs — each region one equal tile,
 * placed roughly where it sits. A schematic, not a geographic map.
 */
export const INDIA_STATES: IndiaState[] = [
  { code: 'JK', name: 'Jammu & Kashmir', row: 0, col: 2, weight: 1 },
  { code: 'LA', name: 'Ladakh', row: 0, col: 3, weight: 0.2 },
  { code: 'PB', name: 'Punjab', row: 1, col: 1, weight: 3 },
  { code: 'HP', name: 'Himachal Pradesh', row: 1, col: 2, weight: 1 },
  { code: 'UK', name: 'Uttarakhand', row: 1, col: 3, weight: 1.5 },
  { code: 'RJ', name: 'Rajasthan', row: 2, col: 0, weight: 5 },
  { code: 'HR', name: 'Haryana', row: 2, col: 1, weight: 4 },
  { code: 'DL', name: 'Delhi', row: 2, col: 2, weight: 7 },
  { code: 'UP', name: 'Uttar Pradesh', row: 2, col: 3, weight: 8 },
  { code: 'BR', name: 'Bihar', row: 2, col: 4, weight: 3 },
  { code: 'SK', name: 'Sikkim', row: 2, col: 5, weight: 0.3 },
  { code: 'AS', name: 'Assam', row: 2, col: 6, weight: 2 },
  { code: 'AR', name: 'Arunachal Pradesh', row: 2, col: 7, weight: 0.3 },
  { code: 'GJ', name: 'Gujarat', row: 3, col: 0, weight: 9 },
  { code: 'MP', name: 'Madhya Pradesh', row: 3, col: 1, weight: 5 },
  { code: 'CG', name: 'Chhattisgarh', row: 3, col: 2, weight: 2 },
  { code: 'JH', name: 'Jharkhand', row: 3, col: 3, weight: 2 },
  { code: 'WB', name: 'West Bengal', row: 3, col: 4, weight: 5 },
  { code: 'ML', name: 'Meghalaya', row: 3, col: 5, weight: 0.4 },
  { code: 'MN', name: 'Manipur', row: 3, col: 6, weight: 0.3 },
  { code: 'NL', name: 'Nagaland', row: 3, col: 7, weight: 0.3 },
  { code: 'MH', name: 'Maharashtra', row: 4, col: 1, weight: 12 },
  { code: 'TG', name: 'Telangana', row: 4, col: 2, weight: 6 },
  { code: 'OD', name: 'Odisha', row: 4, col: 3, weight: 2.5 },
  { code: 'TR', name: 'Tripura', row: 4, col: 5, weight: 0.3 },
  { code: 'MZ', name: 'Mizoram', row: 4, col: 6, weight: 0.2 },
  { code: 'GA', name: 'Goa', row: 5, col: 0, weight: 1 },
  { code: 'KA', name: 'Karnataka', row: 5, col: 1, weight: 8 },
  { code: 'AP', name: 'Andhra Pradesh', row: 5, col: 2, weight: 4 },
  { code: 'KL', name: 'Kerala', row: 6, col: 1, weight: 4 },
  { code: 'TN', name: 'Tamil Nadu', row: 6, col: 2, weight: 8 },
  { code: 'PY', name: 'Puducherry', row: 6, col: 3, weight: 0.4 },
]

export interface DemoLead {
  id: string
  /** Days before DEMO_TODAY (0 = today). */
  daysAgo: number
  source: SourceId
  repId: string
  state: string
  status: 'open' | 'won' | 'lost'
  /** Deal value in rupees (potential for open, realised for won). */
  value: number
  /** Stage for open leads. */
  stage: Exclude<PipelineStageId, 'won' | 'lost'>
  /** Minutes from enquiry to first response. */
  responseMins: number
}

/** Small seeded PRNG (mulberry32) — deterministic across server and client. */
function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pickWeighted<T>(items: T[], weight: (t: T) => number, r: number) {
  const total = items.reduce((s, i) => s + weight(i), 0)
  let x = r * total
  for (const i of items) {
    x -= weight(i)
    if (x <= 0) return i
  }
  return items[items.length - 1]
}

const SOURCE_WEIGHT: Record<SourceId, number> = {
  indiamart: 34,
  justdial: 18,
  facebook: 16,
  whatsapp: 14,
  google: 10,
  website: 8,
}

/** Win rate differs by source so filters show real differences. */
const SOURCE_WIN: Record<SourceId, number> = {
  indiamart: 0.24,
  justdial: 0.18,
  facebook: 0.12,
  whatsapp: 0.27,
  google: 0.2,
  website: 0.22,
}

/** 90 days of sample leads, generated once from a fixed seed. */
export const DEMO_LEADS: DemoLead[] = (() => {
  const r = rng(20261124)
  const out: DemoLead[] = []
  const open: DemoLead['stage'][] = ['new', 'qualified', 'proposal', 'negotiation']
  const sellers = REPS.filter((x) => x.id !== 'vikram')
  for (let i = 0; i < 720; i++) {
    const daysAgo = Math.floor(Math.pow(r(), 1.15) * 90)
    const source = pickWeighted(SOURCES, (s) => SOURCE_WEIGHT[s.id], r()).id
    const state = pickWeighted(INDIA_STATES, (s) => s.weight, r()).code
    const repId = sellers[Math.floor(r() * sellers.length)].id
    const value = Math.round((35000 + Math.pow(r(), 2) * 420000) / 100) * 100
    // Older leads have had time to resolve; recent ones are mostly open.
    const resolved = r() < Math.min(0.85, 0.15 + daysAgo / 60)
    const status: DemoLead['status'] = resolved ? (r() < SOURCE_WIN[source] * 1.6 ? 'won' : 'lost') : 'open'
    out.push({
      id: `L${String(i + 1).padStart(4, '0')}`,
      daysAgo,
      source,
      repId,
      state,
      status,
      value,
      stage: open[Math.floor(r() * open.length)],
      responseMins: Math.round(2 + Math.pow(r(), 3) * 90),
    })
  }
  return out
})()

export type DemoPeriod = 'today' | 'week' | 'month' | 'quarter'

export const PERIOD_DAYS: Record<DemoPeriod, number> = {
  today: 1,
  week: 7,
  month: 30,
  quarter: 90,
}

export const PERIOD_LABEL: Record<DemoPeriod, string> = {
  today: 'Today',
  week: 'This week',
  month: 'This month',
  quarter: 'This quarter',
}

export interface LeadFilter {
  period: DemoPeriod
  repId?: string
  source?: SourceId
  state?: string
}

export function filterLeads(leads: DemoLead[], f: LeadFilter) {
  const days = PERIOD_DAYS[f.period]
  return leads.filter(
    (l) =>
      l.daysAgo < days &&
      (!f.repId || l.repId === f.repId) &&
      (!f.source || l.source === f.source) &&
      (!f.state || l.state === f.state),
  )
}

/**
 * Every KPI the demos show, computed from the same filtered set so totals
 * always reconcile (e.g. conversion = won ÷ (won + lost)).
 */
export function summarize(leads: DemoLead[]) {
  const won = leads.filter((l) => l.status === 'won')
  const lost = leads.filter((l) => l.status === 'lost')
  const open = leads.filter((l) => l.status === 'open')
  const prob: Record<DemoLead['stage'], number> = { new: 0.1, qualified: 0.25, proposal: 0.5, negotiation: 0.75 }
  const revenue = won.reduce((s, l) => s + l.value, 0)
  const pipeline = open.reduce((s, l) => s + l.value, 0)
  const weighted = Math.round(open.reduce((s, l) => s + l.value * prob[l.stage], 0))
  const decided = won.length + lost.length
  const median = (xs: number[]) => {
    if (!xs.length) return 0
    const s = [...xs].sort((a, b) => a - b)
    const m = Math.floor(s.length / 2)
    return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2)
  }
  return {
    leads: leads.length,
    won: won.length,
    lost: lost.length,
    open: open.length,
    revenue,
    pipeline,
    weighted,
    /** Won ÷ decided (won + lost), as a percentage with one decimal. */
    conversion: decided ? Math.round((won.length / decided) * 1000) / 10 : 0,
    medianResponseMins: median(leads.map((l) => l.responseMins)),
    /** Open leads in early stages count as follow-ups pending. */
    followUpsPending: open.filter((l) => l.stage === 'new' || l.stage === 'qualified').length,
  }
}

/** Group a lead set by a key and summarise each group. */
export function groupBy<K extends string>(leads: DemoLead[], key: (l: DemoLead) => K) {
  const map = new Map<K, DemoLead[]>()
  for (const l of leads) {
    const k = key(l)
    const arr = map.get(k) ?? []
    arr.push(l)
    map.set(k, arr)
  }
  return [...map.entries()].map(([k, ls]) => ({ key: k, ...summarize(ls) }))
}

/** Daily series (oldest → newest) for trend charts. */
export function dailySeries(leads: DemoLead[], days: number) {
  const out = Array.from({ length: days }, (_, i) => ({ daysAgo: days - 1 - i, leads: 0, revenue: 0 }))
  for (const l of leads) {
    if (l.daysAgo >= days) continue
    const row = out[days - 1 - l.daysAgo]
    row.leads += 1
    if (l.status === 'won') row.revenue += l.value
  }
  return out
}

/* ─── Automations ───────────────────────────────────────────────────────── */

export type FlowNodeKind = 'trigger' | 'action' | 'condition' | 'wait'

export interface FlowNode {
  id: string
  kind: FlowNodeKind
  title: string
  detail: string
  /** For conditions: labels of the yes / no branches. */
  branches?: { yes: string; no: string }
}

export interface Workflow {
  id: string
  name: string
  summary: string
  nodes: FlowNode[]
}

export const WORKFLOWS: Workflow[] = [
  {
    id: 'assign',
    name: 'New lead assignment',
    summary: 'Every new enquiry gets an owner and a first touch within minutes.',
    nodes: [
      { id: 't', kind: 'trigger', title: 'New enquiry', detail: 'From IndiaMART, JustDial, Facebook or your website' },
      { id: 'a1', kind: 'action', title: 'Create lead', detail: 'Source, product and city captured' },
      { id: 'a2', kind: 'action', title: 'Assign round-robin', detail: 'Next available sales executive' },
      { id: 'a3', kind: 'action', title: 'Send WhatsApp template', detail: 'Approved welcome message' },
      { id: 'a4', kind: 'action', title: 'Schedule follow-up', detail: 'Call task due in 30 minutes' },
    ],
  },
  {
    id: 'overdue',
    name: 'Overdue follow-up',
    summary: 'Missed follow-ups are escalated before the lead goes cold.',
    nodes: [
      { id: 't', kind: 'trigger', title: 'Follow-up overdue', detail: 'Task not completed by its due time' },
      { id: 'w', kind: 'wait', title: 'Wait 2 hours', detail: 'Give the owner a grace period' },
      {
        id: 'c',
        kind: 'condition',
        title: 'Still not done?',
        detail: 'Check the task status',
        branches: { yes: 'Notify manager', no: 'Close the alert' },
      },
      { id: 'a', kind: 'action', title: 'Notify sales manager', detail: 'In-app and email alert' },
    ],
  },
  {
    id: 'quote-reminder',
    name: 'Quotation reminder',
    summary: 'Sent quotations get a polite nudge instead of silence.',
    nodes: [
      { id: 't', kind: 'trigger', title: 'Quotation sent', detail: 'Status changes to Sent' },
      { id: 'w', kind: 'wait', title: 'Wait 3 days', detail: 'No response from the customer' },
      {
        id: 'c',
        kind: 'condition',
        title: 'Opened the quotation?',
        detail: 'Check the view status',
        branches: { yes: 'Call task for owner', no: 'Send WhatsApp reminder' },
      },
      { id: 'a', kind: 'action', title: 'Create call task', detail: 'Due tomorrow, 11:00' },
    ],
  },
  {
    id: 'onboarding',
    name: 'Customer onboarding',
    summary: 'Won deals hand over to support without a dropped ball.',
    nodes: [
      { id: 't', kind: 'trigger', title: 'Deal marked Won', detail: 'Pipeline stage changes' },
      { id: 'a1', kind: 'action', title: 'Send welcome message', detail: 'WhatsApp template with next steps' },
      { id: 'a2', kind: 'action', title: 'Open onboarding ticket', detail: 'Assigned to the support team' },
      { id: 'a3', kind: 'action', title: 'Schedule check-in', detail: 'Call in 7 days' },
    ],
  },
  {
    id: 'escalation',
    name: 'Sales manager escalation',
    summary: 'High-value deals stuck in a stage get the manager’s attention.',
    nodes: [
      { id: 't', kind: 'trigger', title: 'Deal idle for 5 days', detail: 'No activity logged' },
      {
        id: 'c',
        kind: 'condition',
        title: 'Value above ₹2 lakh?',
        detail: 'Check the deal value',
        branches: { yes: 'Escalate to manager', no: 'Remind the owner' },
      },
      { id: 'a', kind: 'action', title: 'Notify sales manager', detail: 'With the deal timeline attached' },
    ],
  },
]
