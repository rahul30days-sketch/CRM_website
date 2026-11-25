'use client'

/**
 * /experience playground — the ONE state model every module reads and writes.
 *
 * Idea: a tiny, fully client-side EZCRM. Leads, deals, WhatsApp threads,
 * quotations, follow-up tasks, automation rules and the activity feed all live
 * in a single useReducer, so creating a lead in the inbox shows up in the
 * pipeline, a won quotation moves the dashboard KPIs, and toggling an
 * automation rule changes what the reducer does on the next action.
 *
 * Determinism: the seed comes from src/demo/sample-data.ts and the playground
 * keeps its own simulated clock (minutes since midnight) instead of Date.now,
 * so the server render and the first client render match exactly. A saved
 * session (sessionStorage, best effort) is applied only after mount.
 *
 * Nothing here contacts a network service: "send on WhatsApp", "notify
 * manager" and "send quotation" only append to local state.
 */

import * as React from 'react'
import { useReducedMotion } from 'framer-motion'
import { computeQuote, formatINR, type QuoteLine } from '@/lib/gst'
import { track } from '@/lib/analytics'
import {
  DEALS,
  JOURNEY_CUSTOMER,
  JOURNEY_QUOTE_LINES,
  JOURNEY_QUOTE_NUMBER,
  PIPELINE_STAGES,
  REPS,
  SAMPLE_ENQUIRIES,
  SELLER,
  SOURCES,
  WHATSAPP_SCRIPT,
  repById,
  sourceById,
  type ChatMessage,
  type Deal,
  type PipelineStageId,
  type SourceId,
} from '@/demo/sample-data'

/* ─── Types ─────────────────────────────────────────────────────────────── */

export type ModuleId =
  | 'dashboard'
  | 'leads'
  | 'assignment'
  | 'conversation'
  | 'pipeline'
  | 'quotation'
  | 'automation'
  | 'analytics'

export interface PgLead {
  id: string
  name: string
  company: string
  city: string
  source: SourceId
  requirement: string
  value: number
  /** '' = unassigned. */
  repId: string
  /** Days before the demo "today" (0 = today). */
  daysAgo: number
  /** Clock time the enquiry arrived, e.g. "10:42". */
  receivedAt: string
  dealId: string
  /** Created by the visitor in this session (form or simulated enquiry). */
  visitor?: boolean
}

export interface PgDeal extends Deal {
  leadId: string
}

export type QuoteStatus = 'draft' | 'sent' | 'accepted'

export interface PgQuote {
  dealId: string
  number: string
  lines: QuoteLine[]
  placeOfSupply: string
  status: QuoteStatus
}

export interface PgTask {
  id: string
  leadId: string
  title: string
  due: string
  done: boolean
}

export type ActivityKind = 'lead' | 'assign' | 'message' | 'deal' | 'quote' | 'automation' | 'task'

export interface PgActivity {
  id: string
  time: string
  kind: ActivityKind
  text: string
}

export type RuleId = 'autoAssign' | 'followUp' | 'quoteToProposal' | 'notifyManager'

export interface RuleDef {
  id: RuleId
  name: string
  trigger: string
  action: string
}

export const RULES: RuleDef[] = [
  {
    id: 'autoAssign',
    name: 'Auto-assign new leads round-robin',
    trigger: 'When a new lead arrives',
    action: 'Give it to the next sales executive in rotation',
  },
  {
    id: 'followUp',
    name: 'Create follow-up task 30 min after assignment',
    trigger: 'When a lead is assigned',
    action: 'Add a call task for the owner, due in 30 minutes',
  },
  {
    id: 'quoteToProposal',
    name: 'Move deal to Proposal when a quotation is sent',
    trigger: 'When a quotation is shared',
    action: 'Move a New lead or Qualified deal to Proposal',
  },
  {
    id: 'notifyManager',
    name: 'Notify manager when a deal is Won',
    trigger: 'When a deal moves to Won',
    action: 'Alert the sales manager in the app',
  },
]

export interface PgRuleRun {
  id: string
  time: string
  rule: RuleId
  text: string
}

export interface PgNotice {
  id: string
  text: string
  tone: 'info' | 'won'
}

export interface Milestones {
  leadCreated: boolean
  assigned: boolean
  replied: boolean
  quoteSent: boolean
  dealWon: boolean
}

export interface PgState {
  version: 1
  /** Simulated clock, minutes since midnight. */
  clock: number
  /** Id counter. */
  seq: number
  /** Round-robin pointer into SALES_EXECS. */
  rr: number
  /** Next SOURCES index for "Simulate incoming enquiry". */
  simIdx: number
  leads: PgLead[]
  deals: PgDeal[]
  chats: Record<string, ChatMessage[]>
  /** For scripted threads: index of the next WHATSAPP_SCRIPT message to play. */
  scriptCursor: Record<string, number>
  /** Lead ids waiting for a simulated customer reply. */
  pendingReplies: string[]
  quotes: Record<string, PgQuote>
  tasks: PgTask[]
  /** Newest first. */
  activity: PgActivity[]
  rules: Record<RuleId, boolean>
  /** Newest first. */
  ruleRuns: PgRuleRun[]
  /** Oldest first; the shell shows the latest. */
  notices: PgNotice[]
  milestones: Milestones
  selectedLeadId: string
  module: ModuleId
  guideDismissed: boolean
  /** Bumped on reset/restore so editors holding local drafts remount. */
  epoch: number
}

/* ─── Constants & helpers ───────────────────────────────────────────────── */

export const SALES_EXECS = REPS.filter((r) => r.role === 'Sales executive')
export const MANAGER = REPS.find((r) => r.role === 'Sales manager') ?? REPS[REPS.length - 1]

export const STAGE_LABEL: Record<PipelineStageId, string> = Object.fromEntries(
  PIPELINE_STAGES.map((s) => [s.id, s.label]),
) as Record<PipelineStageId, string>

export const STAGE_PROB: Record<PipelineStageId, number> = Object.fromEntries(
  PIPELINE_STAGES.map((s) => [s.id, s.probability]),
) as Record<PipelineStageId, number>

const CITY_STATE: Record<string, string> = {
  nagpur: 'Maharashtra',
  pune: 'Maharashtra',
  nashik: 'Maharashtra',
  mumbai: 'Maharashtra',
  hyderabad: 'Telangana',
  surat: 'Gujarat',
  ahmedabad: 'Gujarat',
  chennai: 'Tamil Nadu',
  lucknow: 'Uttar Pradesh',
  kochi: 'Kerala',
  bengaluru: 'Karnataka',
  delhi: 'Delhi',
}

export const stateForCity = (city: string) => CITY_STATE[city.trim().toLowerCase()] ?? SELLER.state

/** "HH:MM", 24-hour, like the WhatsApp script. */
export function fmtClock(min: number) {
  const m = ((min % 1440) + 1440) % 1440
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}

export const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name

export const isOpenStage = (s: PipelineStageId) => s !== 'won' && s !== 'lost'

/* ─── Seed ──────────────────────────────────────────────────────────────── */

const SEED_TIMING: Record<string, { daysAgo: number; at: string }> = {
  'deal-balaji': { daysAgo: 0, at: JOURNEY_CUSTOMER.receivedAt.replace(/\s?AM|\s?PM/, '') },
  'deal-raman': { daysAgo: 0, at: '09:58' },
  'deal-joshi': { daysAgo: 0, at: '09:15' },
  'deal-kulkarni': { daysAgo: 1, at: '16:20' },
  'deal-qureshi': { daysAgo: 2, at: '12:05' },
  'deal-desai': { daysAgo: 3, at: '11:30' },
  'deal-verma': { daysAgo: 5, at: '14:10' },
  'deal-nair': { daysAgo: 12, at: '10:00' },
}

const BALAJI_SCRIPT_START = 6 // m1–m6 already happened; m7 is the next customer reply.

function seedState(): PgState {
  const enquiries = Object.values(SAMPLE_ENQUIRIES)
  const leads: PgLead[] = DEALS.map((d) => {
    const enquiry = enquiries.find((e) => e.company === d.company)
    const timing = SEED_TIMING[d.id] ?? { daysAgo: 7, at: '10:00' }
    return {
      id: `lead-${d.id.replace(/^deal-/, '')}`,
      name: d.contact,
      company: d.company,
      city: d.city,
      source: d.source,
      requirement:
        d.id === 'deal-balaji' ? JOURNEY_CUSTOMER.requirement : (enquiry?.requirement ?? ''),
      value: d.value,
      repId: d.repId,
      daysAgo: timing.daysAgo,
      receivedAt: timing.at,
      dealId: d.id,
    }
  })
  const deals: PgDeal[] = DEALS.map((d) => ({ ...d, leadId: `lead-${d.id.replace(/^deal-/, '')}` }))

  const chats: Record<string, ChatMessage[]> = {}
  for (const l of leads) {
    if (l.dealId === 'deal-balaji') {
      chats[l.id] = WHATSAPP_SCRIPT.slice(0, BALAJI_SCRIPT_START)
    } else {
      chats[l.id] = [greeting(l, 'g-' + l.id, l.receivedAt)]
    }
  }

  return {
    version: 1,
    clock: 11 * 60 + 5,
    seq: 100,
    rr: 0,
    simIdx: 0,
    leads,
    deals,
    chats,
    scriptCursor: { 'lead-balaji': BALAJI_SCRIPT_START },
    pendingReplies: [],
    quotes: {},
    tasks: [
      { id: 'task-s1', leadId: 'lead-kulkarni', title: 'Follow up on the proposal', due: '12:00', done: false },
      { id: 'task-s2', leadId: 'lead-qureshi', title: 'Call to confirm the site visit', due: '15:30', done: false },
    ],
    activity: [
      { id: 'a-s4', time: '11:02', kind: 'quote', text: `Quotation ${JOURNEY_QUOTE_NUMBER} shared with Balaji Agro Implements` },
      { id: 'a-s3', time: '10:44', kind: 'message', text: 'Approved WhatsApp template sent to Rakesh Gupta' },
      { id: 'a-s2', time: '10:42', kind: 'assign', text: 'Balaji Agro Implements assigned to Priya Sharma' },
      { id: 'a-s1', time: '10:42', kind: 'lead', text: 'New IndiaMART lead: Balaji Agro Implements' },
    ],
    rules: { autoAssign: false, followUp: true, quoteToProposal: true, notifyManager: true },
    ruleRuns: [],
    notices: [],
    milestones: { leadCreated: false, assigned: false, replied: false, quoteSent: false, dealWon: false },
    selectedLeadId: 'lead-balaji',
    module: 'dashboard',
    guideDismissed: false,
    epoch: 0,
  }
}

export const SEED: PgState = seedState()

export const SEED_WON = SEED.deals.filter((d) => d.stage === 'won').reduce((s, d) => s + d.value, 0)

function greeting(lead: Pick<PgLead, 'name' | 'source' | 'repId'>, id: string, time: string): ChatMessage {
  const rep = lead.repId ? firstName(repById(lead.repId).name) : ''
  return {
    id,
    from: 'agent',
    template: true,
    text: `Namaste ${firstName(lead.name)} ji, thank you for your ${sourceById(lead.source).short} enquiry. This is ${
      rep || 'the sales team'
    } from ${SELLER.name.replace(/\.$/, '')}. May I share details here?`,
    time,
  }
}

/** The quotation a deal starts with before the visitor edits it. */
export function defaultQuote(state: PgState, dealId: string): PgQuote {
  const deal = state.deals.find((d) => d.id === dealId)
  const lead = deal ? state.leads.find((l) => l.id === deal.leadId) : undefined
  if (dealId === 'deal-balaji') {
    return {
      dealId,
      number: JOURNEY_QUOTE_NUMBER,
      lines: JOURNEY_QUOTE_LINES.map((l) => ({ ...l })),
      placeOfSupply: JOURNEY_CUSTOMER.state,
      status: 'draft',
    }
  }
  const seedIdx = DEALS.findIndex((d) => d.id === dealId)
  const n = seedIdx >= 0 ? 419 + seedIdx : 500 + Number(dealId.replace(/\D/g, '') || 0)
  const value = deal?.value ?? 0
  return {
    dealId,
    number: `QT-2026-${String(n).padStart(4, '0')}`,
    lines: [
      {
        id: 'l1',
        name: lead?.requirement || `${deal?.company ?? 'Customer'} requirement`,
        code: '',
        codeType: 'HSN',
        qty: 1,
        // Priced so the GST-inclusive total lands near the lead's value.
        unitPrice: Math.round(value / 1.18),
        discountPct: 0,
        gstRate: 18,
      },
    ],
    placeOfSupply: stateForCity(lead?.city ?? deal?.city ?? ''),
    status: 'draft',
  }
}

export const quoteFor = (state: PgState, dealId: string) => state.quotes[dealId] ?? defaultQuote(state, dealId)

export const quoteTotal = (q: PgQuote) =>
  computeQuote(q.lines, { sellerState: SELLER.state, placeOfSupply: q.placeOfSupply }).grandTotal

/* ─── Actions ───────────────────────────────────────────────────────────── */

export interface NewLeadInput {
  name: string
  company: string
  city: string
  source: SourceId
  requirement: string
  value: number
}

export type PgAction =
  | { type: 'HYDRATE'; state: PgState }
  | { type: 'RESET' }
  | { type: 'NAVIGATE'; module: ModuleId }
  | { type: 'SELECT_LEAD'; leadId: string }
  | { type: 'CREATE_LEAD'; input: NewLeadInput }
  | { type: 'SIMULATE_ENQUIRY' }
  | { type: 'ASSIGN'; leadId: string; repId: string | 'round-robin' }
  | { type: 'ASSIGN_ALL_UNASSIGNED' }
  | { type: 'SEND_MESSAGE'; leadId: string; text: string; attachment?: ChatMessage['attachment'] }
  | { type: 'CUSTOMER_REPLY'; leadId: string }
  | { type: 'MOVE_DEAL'; dealId: string; stage: PipelineStageId }
  | { type: 'SAVE_QUOTE'; dealId: string; lines: QuoteLine[]; placeOfSupply: string }
  | { type: 'SEND_QUOTE'; dealId: string }
  | { type: 'ACCEPT_QUOTE'; dealId: string }
  | { type: 'TOGGLE_RULE'; rule: RuleId }
  | { type: 'COMPLETE_TASK'; taskId: string }
  | { type: 'DISMISS_NOTICE'; id: string }
  | { type: 'SET_GUIDE'; dismissed: boolean }

/* ─── Reducer ───────────────────────────────────────────────────────────── */

// Each case clones what it touches; helpers mutate the working copy `s`.

function nextId(s: PgState, prefix: string) {
  s.seq += 1
  return `${prefix}-${s.seq}`
}
function tick(s: PgState, minutes = 1) {
  s.clock += minutes
}
function log(s: PgState, kind: ActivityKind, text: string) {
  s.activity = [{ id: nextId(s, 'a'), time: fmtClock(s.clock), kind, text }, ...s.activity].slice(0, 60)
}
function notify(s: PgState, text: string, tone: PgNotice['tone'] = 'info') {
  s.notices = [...s.notices, { id: nextId(s, 'n'), text, tone }].slice(-5)
}
function ruleRan(s: PgState, rule: RuleId, text: string) {
  s.ruleRuns = [{ id: nextId(s, 'r'), time: fmtClock(s.clock), rule, text }, ...s.ruleRuns].slice(0, 40)
}
function patchLead(s: PgState, leadId: string, patch: Partial<PgLead>) {
  s.leads = s.leads.map((l) => (l.id === leadId ? { ...l, ...patch } : l))
}
function patchDeal(s: PgState, dealId: string, patch: Partial<PgDeal>) {
  s.deals = s.deals.map((d) => (d.id === dealId ? { ...d, ...patch } : d))
}
function addMessage(s: PgState, leadId: string, msg: Omit<ChatMessage, 'id' | 'time'>) {
  const m: ChatMessage = { ...msg, id: nextId(s, 'm'), time: fmtClock(s.clock) }
  s.chats = { ...s.chats, [leadId]: [...(s.chats[leadId] ?? []), m] }
}
function queueReply(s: PgState, leadId: string) {
  if (!s.pendingReplies.includes(leadId)) s.pendingReplies = [...s.pendingReplies, leadId]
}

function assign(s: PgState, leadId: string, repId: string, via: 'manual' | 'round-robin' | 'rule') {
  const lead = s.leads.find((l) => l.id === leadId)
  if (!lead) return
  let target = repId
  if (via !== 'manual') {
    target = SALES_EXECS[s.rr % SALES_EXECS.length].id
    s.rr += 1
  }
  if (lead.repId === target) return
  const rep = repById(target)
  const verb = lead.repId ? 'reassigned' : 'assigned'
  tick(s)
  patchLead(s, leadId, { repId: target })
  patchDeal(s, lead.dealId, { repId: target })
  log(s, 'assign', `${lead.company} ${verb} to ${rep.name}${via === 'manual' ? '' : ' (round-robin)'}`)
  notify(s, `${rep.name} notified: ${lead.company} is now theirs`)
  s.milestones = { ...s.milestones, assigned: true }
  if (via === 'rule') ruleRan(s, 'autoAssign', `${lead.company} → ${rep.name}`)

  if (s.rules.followUp) {
    const due = fmtClock(s.clock + 30)
    s.tasks = [
      { id: nextId(s, 'task'), leadId, title: `First follow-up call with ${lead.name}`, due, done: false },
      ...s.tasks,
    ]
    ruleRan(s, 'followUp', `Call task for ${rep.name}, due ${due}`)
    log(s, 'automation', `Follow-up task created for ${rep.name} (due ${due})`)
  }
}

function moveDeal(s: PgState, dealId: string, stage: PipelineStageId) {
  const deal = s.deals.find((d) => d.id === dealId)
  if (!deal || deal.stage === stage) return
  tick(s)
  patchDeal(s, dealId, { stage })
  const value = s.deals.find((d) => d.id === dealId)?.value ?? deal.value
  log(s, 'deal', `${deal.company} moved to ${STAGE_LABEL[stage]}`)
  if (stage === 'won') {
    s.milestones = { ...s.milestones, dealWon: true }
    notify(s, `Deal won: ${deal.company}, ${formatINR(value)}`, 'won')
    if (s.rules.notifyManager) {
      ruleRan(s, 'notifyManager', `${MANAGER.name} alerted: ${deal.company} won`)
      log(s, 'automation', `${MANAGER.name} (manager) notified of the win`)
    }
  }
}

function createLead(s: PgState, input: NewLeadInput) {
  tick(s, 2)
  const n = nextId(s, 'x').slice(2)
  const leadId = `lead-${n}`
  const dealId = `deal-${n}`
  const lead: PgLead = {
    id: leadId,
    name: input.name.trim(),
    company: input.company.trim(),
    city: input.city.trim(),
    source: input.source,
    requirement: input.requirement.trim(),
    value: input.value,
    repId: '',
    daysAgo: 0,
    receivedAt: fmtClock(s.clock),
    dealId,
    visitor: true,
  }
  s.leads = [lead, ...s.leads]
  s.deals = [
    {
      id: dealId,
      leadId,
      company: lead.company,
      contact: lead.name,
      value: lead.value,
      stage: 'new',
      repId: '',
      source: lead.source,
      city: lead.city,
    },
    ...s.deals,
  ]
  s.chats = { ...s.chats, [leadId]: [] }
  s.selectedLeadId = leadId
  s.milestones = { ...s.milestones, leadCreated: true }
  log(s, 'lead', `New ${sourceById(lead.source).short} lead: ${lead.company}`)
  notify(s, `New lead: ${lead.company} (${sourceById(lead.source).short})`)

  if (s.rules.autoAssign) assign(s, leadId, '', 'rule')

  const current = s.leads.find((l) => l.id === leadId) ?? lead
  const g = greeting(current, nextId(s, 'm'), fmtClock(s.clock))
  s.chats = { ...s.chats, [leadId]: [g] }
  log(s, 'message', `Approved WhatsApp template sent to ${lead.name} (simulated)`)
}

function cannedReply(s: PgState, leadId: string): string {
  const cursor = s.scriptCursor[leadId]
  if (cursor !== undefined) {
    const next = WHATSAPP_SCRIPT.slice(cursor).findIndex((m) => m.from === 'customer')
    if (next >= 0) {
      s.scriptCursor = { ...s.scriptCursor, [leadId]: cursor + next + 1 }
      return WHATSAPP_SCRIPT[cursor + next].text
    }
  }
  const lead = s.leads.find((l) => l.id === leadId)
  const lastAgent = [...(s.chats[leadId] ?? [])].reverse().find((m) => m.from === 'agent')
  const t = `${lastAgent?.text ?? ''} ${lastAgent?.attachment?.kind ?? ''}`.toLowerCase()
  if (t.includes('quotation') || t.includes('quote')) return 'Received the quotation. Will confirm by evening.'
  if (t.includes('catalogue')) return 'Thanks, I will go through the catalogue.'
  if (t.includes('location') || t.includes('site')) return `Site is in ${lead?.city || 'the city'}. I will share the pin.`
  if (t.includes('call')) return 'Please call after 4 PM.'
  if (t.includes('may i share')) return 'Yes, please share the details here.'
  return 'Okay, noted. Please share the details.'
}

export function reducer(state: PgState, action: PgAction): PgState {
  if (action.type === 'HYDRATE') return { ...action.state, epoch: state.epoch + 1 }
  if (action.type === 'RESET') return { ...SEED, epoch: state.epoch + 1 }

  const s: PgState = { ...state }
  switch (action.type) {
    case 'NAVIGATE':
      s.module = action.module
      return s
    case 'SELECT_LEAD':
      s.selectedLeadId = action.leadId
      return s
    case 'SET_GUIDE':
      s.guideDismissed = action.dismissed
      return s
    case 'DISMISS_NOTICE':
      s.notices = s.notices.filter((n) => n.id !== action.id)
      return s
    case 'CREATE_LEAD':
      createLead(s, action.input)
      return s
    case 'SIMULATE_ENQUIRY': {
      const src = SOURCES[s.simIdx % SOURCES.length]
      s.simIdx += 1
      createLead(s, { ...SAMPLE_ENQUIRIES[src.id], source: src.id })
      return s
    }
    case 'ASSIGN':
      if (action.repId === 'round-robin') assign(s, action.leadId, '', 'round-robin')
      else assign(s, action.leadId, action.repId, 'manual')
      return s
    case 'ASSIGN_ALL_UNASSIGNED':
      for (const l of state.leads) if (!l.repId) assign(s, l.id, '', 'round-robin')
      return s
    case 'SEND_MESSAGE': {
      const lead = s.leads.find((l) => l.id === action.leadId)
      if (!lead || !action.text.trim()) return state
      tick(s)
      addMessage(s, action.leadId, { from: 'agent', text: action.text.trim(), attachment: action.attachment })
      queueReply(s, action.leadId)
      s.milestones = { ...s.milestones, replied: true }
      log(s, 'message', `WhatsApp reply to ${lead.name} (simulated)`)
      return s
    }
    case 'CUSTOMER_REPLY': {
      if (!s.pendingReplies.includes(action.leadId)) return state
      const lead = s.leads.find((l) => l.id === action.leadId)
      s.pendingReplies = s.pendingReplies.filter((id) => id !== action.leadId)
      if (!lead) return s
      tick(s, 2)
      addMessage(s, action.leadId, { from: 'customer', text: cannedReply(s, action.leadId) })
      log(s, 'message', `${lead.name} replied on WhatsApp`)
      notify(s, `${lead.name} replied on WhatsApp`)
      return s
    }
    case 'MOVE_DEAL':
      moveDeal(s, action.dealId, action.stage)
      return s
    case 'SAVE_QUOTE': {
      const q = quoteFor(s, action.dealId)
      if (q.status === 'accepted') return state
      s.quotes = { ...s.quotes, [action.dealId]: { ...q, lines: action.lines, placeOfSupply: action.placeOfSupply } }
      return s
    }
    case 'SEND_QUOTE': {
      const q = quoteFor(s, action.dealId)
      const deal = s.deals.find((d) => d.id === action.dealId)
      if (!deal || q.status === 'accepted') return state
      const total = quoteTotal(q)
      tick(s)
      s.quotes = { ...s.quotes, [action.dealId]: { ...q, status: 'sent' } }
      addMessage(s, deal.leadId, {
        from: 'agent',
        text: 'Sharing the quotation with GST details.',
        attachment: { kind: 'quotation', title: `${q.number}.pdf`, meta: `Quotation · ${formatINR(total)} · GST included` },
      })
      queueReply(s, deal.leadId)
      s.milestones = { ...s.milestones, quoteSent: true }
      log(s, 'quote', `Quotation ${q.number} (${formatINR(total)}) shared with ${deal.company} (simulated)`)
      notify(s, `Quotation ${q.number} shared on WhatsApp (simulated)`)
      if (s.rules.quoteToProposal && (deal.stage === 'new' || deal.stage === 'qualified')) {
        ruleRan(s, 'quoteToProposal', `${deal.company} → Proposal`)
        moveDeal(s, deal.id, 'proposal')
      }
      return s
    }
    case 'ACCEPT_QUOTE': {
      const q = quoteFor(s, action.dealId)
      const deal = s.deals.find((d) => d.id === action.dealId)
      if (!deal || q.status === 'accepted') return state
      const total = quoteTotal(q)
      tick(s)
      s.quotes = { ...s.quotes, [action.dealId]: { ...q, status: 'accepted' } }
      s.milestones = { ...s.milestones, quoteSent: true }
      patchDeal(s, deal.id, { value: total })
      patchLead(s, deal.leadId, { value: total })
      log(s, 'quote', `${deal.company} accepted quotation ${q.number}`)
      moveDeal(s, deal.id, 'won')
      return s
    }
    case 'TOGGLE_RULE': {
      const on = !s.rules[action.rule]
      s.rules = { ...s.rules, [action.rule]: on }
      const def = RULES.find((r) => r.id === action.rule)
      log(s, 'automation', `Rule “${def?.name}” turned ${on ? 'on' : 'off'}`)
      return s
    }
    case 'COMPLETE_TASK': {
      const task = s.tasks.find((t) => t.id === action.taskId)
      if (!task || task.done) return state
      tick(s)
      s.tasks = s.tasks.map((t) => (t.id === action.taskId ? { ...t, done: true } : t))
      log(s, 'task', `Task done: ${task.title}`)
      return s
    }
    default:
      return state
  }
}

/* ─── Context ───────────────────────────────────────────────────────────── */

interface PgContextValue {
  state: PgState
  dispatch: (a: PgAction) => void
  /** Navigate and move focus to the new module's heading. */
  navigate: (m: ModuleId) => void
  /** True once, right after navigate(); the module heading consumes it. */
  consumeFocusRequest: () => boolean
}

const PgContext = React.createContext<PgContextValue | null>(null)

const STORAGE_KEY = 'ezcrm-playground:v1'

function isState(x: unknown): x is PgState {
  if (!x || typeof x !== 'object') return false
  const o = x as Partial<PgState>
  return (
    o.version === 1 &&
    Array.isArray(o.leads) &&
    Array.isArray(o.deals) &&
    Array.isArray(o.activity) &&
    typeof o.chats === 'object' &&
    typeof o.rules === 'object' &&
    typeof o.milestones === 'object' &&
    typeof o.epoch === 'number'
  )
}

export function PlaygroundProvider({ children }: { children: React.ReactNode }) {
  const [state, rawDispatch] = React.useReducer(reducer, SEED)
  const hydrated = React.useRef(false)
  const focusRequest = React.useRef(false)
  const reduce = useReducedMotion()

  // Restore a session after mount (never during render → no hydration mismatch).
  React.useEffect(() => {
    if (hydrated.current) return // StrictMode re-run: restore only once.
    hydrated.current = true
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed: unknown = JSON.parse(raw)
        if (isState(parsed)) rawDispatch({ type: 'HYDRATE', state: { ...parsed, notices: [] } })
      }
    } catch {
      // Storage blocked or corrupt: carry on with the seed.
    }
  }, [])

  React.useEffect(() => {
    // The untouched seed is never written, so a saved session can't be
    // overwritten before it has been restored.
    if (state === SEED) return
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Ignore quota / privacy-mode errors.
    }
  }, [state])

  // Simulated customer replies: one short one-shot timer per waiting thread.
  const timers = React.useRef(new Map<string, number>())
  React.useEffect(() => {
    const map = timers.current
    for (const leadId of state.pendingReplies) {
      if (map.has(leadId)) continue
      const t = window.setTimeout(
        () => {
          map.delete(leadId)
          rawDispatch({ type: 'CUSTOMER_REPLY', leadId })
        },
        reduce ? 500 : 1800,
      )
      map.set(leadId, t)
    }
  }, [state.pendingReplies, reduce])
  React.useEffect(() => {
    const map = timers.current
    return () => {
      map.forEach((t) => window.clearTimeout(t))
      map.clear()
    }
  }, [])

  const stateRef = React.useRef(state)
  stateRef.current = state

  const dispatch = React.useCallback((a: PgAction) => {
    const s = stateRef.current
    const wins =
      (a.type === 'MOVE_DEAL' && a.stage === 'won' && s.deals.find((d) => d.id === a.dealId)?.stage !== 'won') ||
      (a.type === 'ACCEPT_QUOTE' && quoteFor(s, a.dealId).status !== 'accepted')
    if (a.type === 'RESET') {
      timers.current.forEach((t) => window.clearTimeout(t))
      timers.current.clear()
    }
    rawDispatch(a)
    if (wins) track('demo_completed', { demo: 'playground' })
  }, [])

  const navigate = React.useCallback((m: ModuleId) => {
    focusRequest.current = true
    rawDispatch({ type: 'NAVIGATE', module: m })
  }, [])

  const consumeFocusRequest = React.useCallback(() => {
    const v = focusRequest.current
    focusRequest.current = false
    return v
  }, [])

  const value = React.useMemo(
    () => ({ state, dispatch, navigate, consumeFocusRequest }),
    [state, dispatch, navigate, consumeFocusRequest],
  )
  return <PgContext.Provider value={value}>{children}</PgContext.Provider>
}

export function usePlayground() {
  const ctx = React.useContext(PgContext)
  if (!ctx) throw new Error('usePlayground must be used inside <PlaygroundProvider>')
  return ctx
}

/* ─── Selectors ─────────────────────────────────────────────────────────── */

export function useSelection() {
  const { state } = usePlayground()
  const lead = state.leads.find((l) => l.id === state.selectedLeadId) ?? state.leads[0]
  const deal = state.deals.find((d) => d.id === lead?.dealId)
  return { lead, deal }
}

export function kpis(state: PgState) {
  const open = state.deals.filter((d) => isOpenStage(d.stage))
  const openPipeline = open.reduce((s, d) => s + d.value, 0)
  const weighted = Math.round(open.reduce((s, d) => s + (d.value * STAGE_PROB[d.stage]) / 100, 0))
  const won = state.deals.filter((d) => d.stage === 'won').reduce((s, d) => s + d.value, 0)
  return {
    openPipeline,
    openCount: open.length,
    weighted,
    won,
    wonCount: state.deals.filter((d) => d.stage === 'won').length,
    leadsToday: state.leads.filter((l) => l.daysAgo === 0).length,
    followUpsDue: state.tasks.filter((t) => !t.done).length,
    unassigned: state.leads.filter((l) => !l.repId).length,
  }
}

export const ONBOARDING_STEPS: { id: keyof Milestones; label: string; module: ModuleId; how: string }[] = [
  { id: 'leadCreated', label: 'Create a lead', module: 'leads', how: 'Leads: add one, or simulate an enquiry' },
  { id: 'assigned', label: 'Assign it', module: 'assignment', how: 'Pick an owner or use round-robin' },
  { id: 'replied', label: 'Reply on WhatsApp', module: 'conversation', how: 'Send a quick reply in Conversation' },
  { id: 'quoteSent', label: 'Send a quotation', module: 'quotation', how: 'Build the GST quote and share it' },
  { id: 'dealWon', label: 'Win the deal', module: 'quotation', how: 'Mark the quotation accepted' },
]
