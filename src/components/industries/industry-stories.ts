/**
 * Per-industry workflow strips and sample scenarios for the homepage
 * "Industries" tabs. Copy about what EZCRM does stays in src/content/site.ts;
 * this file only holds the sales-process steps and a fictional walk-through
 * built from src/demo/sample-data.ts names and figures.
 *
 * Each scenario event points at the workflow step it belongs to, so the
 * strip and the scenario card highlight together.
 */

import { formatINR } from '@/lib/gst'
import {
  JOURNEY_CUSTOMER,
  JOURNEY_QUOTE,
  JOURNEY_QUOTE_NUMBER,
  SAMPLE_ENQUIRIES,
  repById,
  sourceById,
} from '@/demo/sample-data'

export interface ScenarioEvent {
  /** Index into the industry's workflow steps. */
  step: number
  time: string
  text: string
}

export interface IndustryStory {
  /** Lower-case name for the personalised CTA ("See EZCRM for …"). */
  ctaName: string
  steps: string[]
  scenario: {
    title: string
    customer: string
    meta: string
    owner: string
    events: ScenarioEvent[]
  }
}

const rakeshRep = repById(JOURNEY_CUSTOMER.repId)
const fb = SAMPLE_ENQUIRIES.facebook
const wa = SAMPLE_ENQUIRIES.whatsapp

export const INDUSTRY_STORIES: Record<string, IndustryStory> = {
  manufacturing: {
    ctaName: 'manufacturing & distribution',
    steps: ['Enquiry', 'Requirement', 'Product selection', 'GST quotation', 'Negotiation', 'Order', 'Payment'],
    scenario: {
      title: `Deal · ${JOURNEY_CUSTOMER.company}`,
      customer: JOURNEY_CUSTOMER.name,
      meta: `${JOURNEY_CUSTOMER.city} · ${sourceById(JOURNEY_CUSTOMER.source).name}`,
      owner: rakeshRep.name,
      events: [
        { step: 0, time: JOURNEY_CUSTOMER.receivedAt, text: `IndiaMART enquiry synced, assigned to ${rakeshRep.name}` },
        { step: 1, time: '10:47 AM', text: 'Requirement noted: 4 borewell pumps, 7.5 HP, with panels' },
        { step: 2, time: '10:48 AM', text: 'Catalogue shared from the media library' },
        {
          step: 3,
          time: '11:02 AM',
          text: `${JOURNEY_QUOTE_NUMBER} sent: ${formatINR(JOURNEY_QUOTE.grandTotal)} incl. CGST + SGST`,
        },
        { step: 4, time: 'Day 2', text: 'Revised quotation saved as v2, v1 kept on record' },
        { step: 5, time: 'Day 3', text: 'Order confirmed, deal moved to Won' },
        { step: 6, time: 'Day 3', text: 'Payment follow-up task created for the account' },
      ],
    },
  },
  'real-estate': {
    ctaName: 'real estate',
    steps: ['Portal enquiry', 'Buyer qualification', 'Property discussion', 'Site visit', 'Follow-up', 'Booking'],
    scenario: {
      title: 'Buyer · 3 BHK enquiry',
      customer: fb.name,
      meta: `${fb.city} · ${sourceById('facebook').name}`,
      owner: repById('neha').name,
      events: [
        { step: 0, time: 'Thu 7:40 PM', text: `Lead ad enquiry captured, assigned to ${repById('neha').name}` },
        { step: 1, time: 'Thu 7:52 PM', text: 'Budget, location and timeline added to the lead' },
        { step: 2, time: 'Fri', text: 'Floor plans shared on WhatsApp from the media library' },
        { step: 3, time: 'Sat', text: 'Sunday site visit booked; WhatsApp confirmation queued' },
        { step: 4, time: 'Mon', text: 'Follow-up reminder fires for Neha after the visit' },
        { step: 5, time: 'Wed', text: 'Booking recorded; the whole thread stays on the lead timeline' },
      ],
    },
  },
  services: {
    ctaName: 'service businesses',
    steps: ['Enquiry', 'Consultation', 'Proposal', 'Follow-up', 'Agreement', 'Customer support'],
    scenario: {
      title: `Account · ${wa.company}`,
      customer: wa.name,
      meta: `${wa.city} · ${sourceById('whatsapp').name}`,
      owner: repById('priya').name,
      events: [
        { step: 0, time: 'Mon', text: `WhatsApp enquiry: ${wa.requirement.toLowerCase()}` },
        { step: 1, time: 'Tue', text: 'Consultation call logged on the timeline' },
        { step: 2, time: 'Wed', text: `Proposal sent: ${formatINR(wa.value)} for the year` },
        { step: 3, time: 'Fri', text: 'Automated follow-up reminder for Priya' },
        { step: 4, time: 'Next week', text: 'Agreement signed; renewal sequence enrolled' },
        { step: 5, time: 'Later', text: 'Complaint raised on the ticket portal, SLA timer started' },
      ],
    },
  },
}
