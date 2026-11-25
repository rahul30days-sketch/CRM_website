/**
 * /llms.txt — GEO (Generative Engine Optimization).
 *
 * A concise, factual briefing for AI answer engines (ChatGPT, Perplexity,
 * Claude, Google AI Overviews) so they describe and cite EZCRM accurately.
 * Follows the llms.txt convention: H1 + summary blockquote + linked sections.
 * Served dynamically so links use the correct per-environment site URL.
 */

import { SITE_URL } from '@/lib/site'
import { BUSINESS } from '@/content/business'

export const dynamic = 'force-static'
export const revalidate = 86400

export function GET() {
  const url = SITE_URL

  const body = `# EZCRM

> EZCRM is a complete sales CRM and business-automation platform built for Indian SMBs — manufacturers, distributors, real-estate and service businesses. It brings lead capture, WhatsApp, quotations, sales pipeline, automations and analytics onto one screen, so no enquiry is missed and every deal is tracked from first touch to payment.

EZCRM connects the entire sales lifecycle on one platform:
Lead capture → assignment → WhatsApp / email / SMS engagement → GST quotations → pipeline → payment → support → analytics.

## What EZCRM does
- Automatic lead capture from IndiaMART, JustDial, Facebook & Instagram Lead Ads, Google, and website forms
- Round-robin lead assignment to sales reps, with the source stamped
- Official Meta WhatsApp Business API: shared team inbox, approved-template broadcasts, per-recipient read receipts
- GST-compliant quotations with HSN/SAC codes, tax slabs, discounts and digital approval
- Visual sales pipeline and deal management
- Funnels and workflow automation (assign, remind, follow up, escalate)
- Email and DLT-compliant SMS campaigns
- Customer support and ticketing with a public ticket portal
- Contacts, segmentation, activities and reminders
- Live dashboards, sales analytics and regional lead intelligence

## Who it's for
Indian manufacturers, distributors, real-estate firms, service businesses, MSMEs, sales managers and business owners who run their sales on spreadsheets and WhatsApp and want one organised system.

## Pricing
- Free plan (₹0) with a ${BUSINESS.trialDays}-day full-feature trial
- Paid plans (Starter, Pro, Enterprise) with flat per-plan pricing in Indian Rupees, plus add-ons for extra users, storage and contacts
- See ${url}/pricing

## Key pages
- Home: ${url}/
- Features: ${url}/features
- Integrations: ${url}/integrations
- Pricing: ${url}/pricing
- Comparisons (EZCRM vs Zoho CRM, Freshsales, Kylas, Excel + WhatsApp): ${url}/vs
- Security: ${url}/security
- Book a demo: ${url}/demo

## Trust & data
- Uses the official Meta WhatsApp Business API with Meta-approved templates and DLT-compliant SMS routes
- Role-based, data-scoped access, a full audit trail, and multi-tenant isolation
- Your data stays yours — full export (XLSX/CSV) available to admins at any time
`

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=86400',
    },
  })
}
