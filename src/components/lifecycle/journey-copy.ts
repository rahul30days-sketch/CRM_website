/**
 * Headings and copy for the seven lifecycle stages in <LeadJourneyCinematic />.
 * Kept apart from the visuals so every stage's text can be rendered in the
 * server HTML regardless of which stage is on screen.
 */

import { formatINR } from '@/lib/gst'
import { JOURNEY_CUSTOMER, JOURNEY_QUOTE, JOURNEY_QUOTE_LINES, LIFECYCLE_STAGES, REPS } from '@/demo/sample-data'

const rep = REPS.find((r) => r.id === JOURNEY_CUSTOMER.repId) ?? REPS[0]
const maxDiscount = Math.max(...JOURNEY_QUOTE_LINES.map((l) => l.discountPct))

export const JOURNEY_STEPS = LIFECYCLE_STAGES.map((s) => ({ id: s.id, label: s.label }))

export const JOURNEY_COPY: Record<(typeof LIFECYCLE_STAGES)[number]['id'], { title: string; copy: string }> = {
  capture: {
    title: 'The enquiry becomes a lead, not a notification.',
    copy: `An IndiaMART enquiry from ${JOURNEY_CUSTOMER.name} arrives at ${JOURNEY_CUSTOMER.receivedAt}. EZCRM reads it into a structured lead record: contact, company, city, requirement and source, with nothing retyped.`,
  },
  assign: {
    title: 'Routed to the next rep in the rotation.',
    copy: `EZCRM's round-robin rule assigns the lead to ${rep.name} and notifies her, so the enquiry has an owner before anyone has to ask who is handling it.`,
  },
  engage: {
    title: 'One WhatsApp thread the whole team can see.',
    copy: `${rep.name.split(' ')[0]} replies from the shared inbox with an approved template and shares the catalogue. The conversation stays on the lead, and her manager sees the same thread.`,
  },
  'follow-up': {
    title: "Follow-ups that don't depend on memory.",
    copy: 'A follow-up call is scheduled on the lead, a reminder arrives before it is due, and once it is done it joins the activity timeline with everything else.',
  },
  quote: {
    title: 'A GST quotation, worked out line by line.',
    copy: `Each line carries its HSN or SAC code and any discount (${maxDiscount}% on the pumps). Supply within ${JOURNEY_CUSTOMER.state} splits 18% GST into CGST 9% and SGST 9%, for ${formatINR(JOURNEY_QUOTE.grandTotal)}. The customer approves it digitally.`,
  },
  convert: {
    title: 'Negotiation to Won, and the numbers follow.',
    copy: `The approved quotation moves the deal from Negotiation to Won, and the revenue view rises by exactly the quote total of ${formatINR(JOURNEY_QUOTE.grandTotal)}.`,
  },
  support: {
    title: 'After the sale, the history stays together.',
    copy: 'Installation is raised as a support ticket on the same customer record, next to every message, quotation and deal that came before it.',
  },
}
