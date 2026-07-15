/**
 * Comparison ("EZCRM vs …") content — bottom-funnel SEO for CRM buyers.
 *
 * Single source of truth: seeded into the `comparisons` Payload collection and
 * used as the frontend fallback (same contract as modules.ts / stories.ts).
 * Competitor claims are kept fair and hedged ("via add-on", "on higher tiers")
 * — honest comparisons convert and rank better than strawmen.
 */

export type CompareValue = 'yes' | 'partial' | 'no'

export interface CompareRow {
  feature: string
  ezcrm: CompareValue
  competitor: CompareValue
  note?: string
}

export interface ComparisonContent {
  slug: string
  competitor: string
  kicker: string
  heading: string
  lede: string
  verdict: string
  ezcrmWinsWhen: string[]
  competitorFitsWhen: string[]
  rows: CompareRow[]
  differentiators: { title: string; detail: string }[]
  migration: string
  faqs: { question: string; answer: string }[]
  order: number
}

export const comparisons: ComparisonContent[] = [
  {
    slug: 'zoho',
    competitor: 'Zoho CRM',
    kicker: 'EZCRM vs Zoho CRM',
    heading: 'EZCRM vs Zoho CRM',
    lede: 'Zoho is a broad, powerful suite built for every kind of business, everywhere. EZCRM is built for one: an Indian sales team that runs on IndiaMART, WhatsApp and GST quotations — and wants to be live this week, not this quarter.',
    verdict:
      'Choose Zoho if you want a sprawling suite and have an admin (or partner) to configure it. Choose EZCRM if you want portal leads, WhatsApp and GST-correct quotations working out of the box, priced simply in rupees.',
    ezcrmWinsWhen: [
      'Your leads come from IndiaMART, JustDial and Facebook and you need them routed in seconds',
      'WhatsApp is your main sales channel and you want an official, shared team inbox — not an add-on',
      'You send GST quotations with HSN/SAC codes and want them built into the CRM',
      'You want to be set up in days without a consultant',
    ],
    competitorFitsWhen: [
      'You already run other Zoho apps (Books, Desk, Inventory) and want everything in one account',
      'You need deep, highly custom workflows and have someone to build and maintain them',
      'You operate across many countries and need broad localization',
    ],
    rows: [
      { feature: 'Official WhatsApp Business API — two-way team inbox', ezcrm: 'yes', competitor: 'partial', note: 'Zoho: via marketplace add-on / third-party' },
      { feature: 'IndiaMART & JustDial lead sync (native)', ezcrm: 'yes', competitor: 'no', note: 'Zoho: needs Zoho Flow or a third-party connector' },
      { feature: 'Facebook Lead Ads sync', ezcrm: 'yes', competitor: 'yes' },
      { feature: 'GST quotations with HSN/SAC codes built in', ezcrm: 'yes', competitor: 'partial', note: 'Zoho: separate app (Books/Inventory)' },
      { feature: 'DLT-compliant SMS (India)', ezcrm: 'yes', competitor: 'partial', note: 'Zoho: via SMS add-on providers' },
      { feature: 'Round-robin lead routing', ezcrm: 'yes', competitor: 'yes' },
      { feature: 'Drag-and-drop pipeline (Kanban)', ezcrm: 'yes', competitor: 'yes' },
      { feature: 'Built-in ticketing / help desk', ezcrm: 'yes', competitor: 'partial', note: 'Zoho: Zoho Desk, separate product' },
      { feature: 'Multi-tenant white-label (for resellers)', ezcrm: 'yes', competitor: 'no' },
      { feature: 'Priced per user in ₹, India support hours', ezcrm: 'yes', competitor: 'partial', note: 'Zoho: global pricing tiers' },
      { feature: 'Setup without a consultant', ezcrm: 'yes', competitor: 'partial' },
    ],
    differentiators: [
      { title: 'India lead sources are native, not add-ons', detail: 'IndiaMART and JustDial sync out of the box. In Zoho you typically wire these up through Zoho Flow or a paid third-party connector.' },
      { title: 'WhatsApp is a first-class inbox', detail: 'A shared team inbox on the official Meta API ships with EZCRM. In Zoho, WhatsApp is a marketplace extension you add and maintain.' },
      { title: 'Quotations are built in', detail: 'GST-correct quotes with HSN/SAC codes live inside the CRM — no separate Books/Inventory subscription to stitch in.' },
    ],
    migration:
      'Switching from Zoho is a straight XLSX export/import: leads, contacts and deals map to EZCRM fields, and your WhatsApp number connects through the official Meta API. Most teams are fully moved within a week.',
    faqs: [
      { question: 'Is EZCRM cheaper than Zoho CRM?', answer: 'EZCRM is priced simply per user per month in rupees, with WhatsApp, quotations and India lead-source connectors included rather than sold as add-ons — so the all-in cost is usually lower for an Indian SMB once you account for the extensions Zoho needs.' },
      { question: 'Can I move my Zoho data to EZCRM?', answer: 'Yes. Export your leads, contacts and deals from Zoho as XLSX and import them into EZCRM with field mapping. Your team is usually live within a week.' },
      { question: 'Does EZCRM do everything Zoho does?', answer: 'No — Zoho is a much broader suite. EZCRM deliberately covers what an Indian sales team needs day to day (leads, WhatsApp, pipeline, quotations, campaigns, ticketing) and does those without add-ons.' },
    ],
    order: 1,
  },
  {
    slug: 'freshsales',
    competitor: 'Freshsales',
    kicker: 'EZCRM vs Freshsales',
    heading: 'EZCRM vs Freshsales (Freshworks)',
    lede: 'Freshsales is a polished sales CRM with strong automation. EZCRM covers the same sales core, then adds the India-specific plumbing — IndiaMART/JustDial capture, an official WhatsApp inbox, DLT SMS and GST quotations — as standard.',
    verdict:
      'Freshsales is a great fit if you sell globally and live in email + phone. EZCRM fits better if your pipeline is fed by Indian portals and worked over WhatsApp, and you want quotations and ticketing in the same tool.',
    ezcrmWinsWhen: [
      'IndiaMART, JustDial and Facebook are your main lead sources',
      'You want an official WhatsApp team inbox included, not bought from a marketplace',
      'You need GST quotations and a help desk without buying more products',
      'You want rupee pricing and India-hours support',
    ],
    competitorFitsWhen: [
      'You sell globally and email/phone is your primary channel',
      'You want Freshworks’ built-in phone (Freshcaller) and email sequences',
      'You are standardising on the wider Freshworks suite',
    ],
    rows: [
      { feature: 'Official WhatsApp Business API — two-way team inbox', ezcrm: 'yes', competitor: 'partial', note: 'Freshsales: via marketplace app' },
      { feature: 'IndiaMART & JustDial lead sync (native)', ezcrm: 'yes', competitor: 'no' },
      { feature: 'Facebook Lead Ads sync', ezcrm: 'yes', competitor: 'yes' },
      { feature: 'GST quotations with HSN/SAC codes', ezcrm: 'yes', competitor: 'no' },
      { feature: 'DLT-compliant SMS (India)', ezcrm: 'yes', competitor: 'partial', note: 'Freshsales: via add-on' },
      { feature: 'Round-robin lead routing', ezcrm: 'yes', competitor: 'yes' },
      { feature: 'Email & drip campaigns', ezcrm: 'yes', competitor: 'yes' },
      { feature: 'Built-in ticketing / help desk', ezcrm: 'yes', competitor: 'partial', note: 'Freshsales: Freshdesk, separate product' },
      { feature: 'Multi-tenant white-label (for resellers)', ezcrm: 'yes', competitor: 'no' },
      { feature: 'Priced per user in ₹, India support hours', ezcrm: 'yes', competitor: 'partial' },
      { feature: 'Setup without a consultant', ezcrm: 'yes', competitor: 'yes' },
    ],
    differentiators: [
      { title: 'Portal leads land themselves', detail: 'IndiaMART and JustDial enquiries sync natively and route in seconds — no marketplace connector to configure.' },
      { title: 'One tool for sell + support + quote', detail: 'WhatsApp inbox, quotations and ticketing are built in, where Freshworks splits these across Freshsales, Freshdesk and add-ons.' },
      { title: 'Made for the ₹ and the DLT rules', detail: 'GST quotations and DLT-compliant SMS are first-class, not afterthoughts.' },
    ],
    migration:
      'Export your Freshsales leads, contacts and deals to CSV/XLSX and import into EZCRM with field mapping. Connect your WhatsApp number through the official Meta API and you are live — typically within a week.',
    faqs: [
      { question: 'How is EZCRM different from Freshsales?', answer: 'Both handle the sales core well. EZCRM adds India-specific capture (IndiaMART/JustDial), an official WhatsApp team inbox, DLT SMS and GST quotations as standard, and bundles ticketing — rather than spreading these across separate Freshworks products and add-ons.' },
      { question: 'Can I keep my email sequences?', answer: 'EZCRM has email and drip campaigns built in; you rebuild sequences once during migration. Your contacts and deals import via XLSX.' },
      { question: 'Does EZCRM have a built-in dialer?', answer: 'EZCRM focuses on capture, WhatsApp, pipeline and quotations. If a built-in phone dialer is essential, Freshsales’ Freshcaller may suit you better — many Indian teams work leads primarily on WhatsApp and mobile calls instead.' },
    ],
    order: 2,
  },
  {
    slug: 'kylas',
    competitor: 'Kylas',
    kicker: 'EZCRM vs Kylas',
    heading: 'EZCRM vs Kylas',
    lede: 'Kylas is a solid India-focused CRM with an unlimited-users pricing model. EZCRM competes head-on on India features, then goes deeper on the official WhatsApp inbox, GST quotations and white-label for resellers.',
    verdict:
      'Both are built for Indian SMBs. Pick Kylas if flat unlimited-user pricing is the deciding factor. Pick EZCRM if you want a deeper official-WhatsApp inbox, built-in GST quotations, and white-label to resell under your own brand.',
    ezcrmWinsWhen: [
      'WhatsApp is central and you want a full official-API team inbox with automations',
      'You send GST quotations with HSN/SAC codes and want them inside the CRM',
      'You are an agency/reseller who wants to white-label the platform',
      'You want round-robin routing from IndiaMART/JustDial/Facebook out of the box',
    ],
    competitorFitsWhen: [
      'A flat, unlimited-users price is the single most important factor for you',
      'Your team is very large and per-user pricing would be costly',
      'You need a specific Kylas feature or existing Kylas setup',
    ],
    rows: [
      { feature: 'Official WhatsApp Business API — two-way team inbox', ezcrm: 'yes', competitor: 'partial', note: 'Kylas: WhatsApp available; inbox/automation depth varies' },
      { feature: 'IndiaMART & JustDial lead sync', ezcrm: 'yes', competitor: 'yes' },
      { feature: 'Facebook Lead Ads sync', ezcrm: 'yes', competitor: 'yes' },
      { feature: 'GST quotations with HSN/SAC codes built in', ezcrm: 'yes', competitor: 'partial' },
      { feature: 'DLT-compliant SMS (India)', ezcrm: 'yes', competitor: 'yes' },
      { feature: 'Visual automations & funnels', ezcrm: 'yes', competitor: 'yes' },
      { feature: 'Built-in ticketing / help desk', ezcrm: 'yes', competitor: 'partial' },
      { feature: 'Multi-tenant white-label (for resellers)', ezcrm: 'yes', competitor: 'no' },
      { feature: 'AI chatbot for your website', ezcrm: 'yes', competitor: 'partial' },
      { feature: 'Pricing model', ezcrm: 'partial', competitor: 'yes', note: 'EZCRM: per user · Kylas: flat unlimited users' },
      { feature: 'India support hours & onboarding', ezcrm: 'yes', competitor: 'yes' },
    ],
    differentiators: [
      { title: 'A deeper WhatsApp inbox', detail: 'Two-way shared inbox with agent assignment, approved-template broadcasts with per-recipient logs, and keyword/drip automations on the official Meta API.' },
      { title: 'Quotations + ticketing built in', detail: 'GST-correct quotations and an SLA help desk ship as part of EZCRM, not as separate tools.' },
      { title: 'White-label for resellers', detail: 'Run EZCRM under your own brand with isolated tenants — a fit for agencies that resell CRM to their clients.' },
    ],
    migration:
      'Move from Kylas with an XLSX export/import of leads, contacts and deals, and reconnect your WhatsApp number and lead sources. Both tools speak the same India-SMB language, so the switch is quick.',
    faqs: [
      { question: 'Is EZCRM or Kylas better for Indian SMBs?', answer: 'Both are built for India. EZCRM leans into a deeper official-WhatsApp inbox, built-in GST quotations and reseller white-label; Kylas leans into flat unlimited-user pricing. The right choice depends on team size and whether WhatsApp/quotations/white-label matter most to you.' },
      { question: 'Does EZCRM offer unlimited users like Kylas?', answer: 'EZCRM is priced per user, which is cost-effective for small and mid teams. For very large teams, compare the all-in cost both ways — talk to us and we’ll model it for your headcount.' },
      { question: 'Can I white-label EZCRM?', answer: 'Yes. EZCRM’s Command plan is multi-tenant and white-label, so agencies and resellers can offer it under their own brand with each client isolated.' },
    ],
    order: 3,
  },
  {
    slug: 'excel-whatsapp',
    competitor: 'Excel + WhatsApp',
    kicker: 'EZCRM vs Excel + WhatsApp',
    heading: 'EZCRM vs Excel + personal WhatsApp',
    lede: 'The most common “CRM” in Indian SMBs is a spreadsheet plus everyone’s personal WhatsApp. It’s free and familiar — and it quietly loses deals every day to slow follow-up and lost history.',
    verdict:
      'Excel + WhatsApp works until it doesn’t: leads slip, history walks out the door with staff, and nobody can see the pipeline. EZCRM keeps the WhatsApp-first habit your team already has, and puts a system of record behind it.',
    ezcrmWinsWhen: [
      'Portal and ad leads sometimes sit unnoticed for hours',
      'Conversations and quotes live on staff phones and vanish when they leave',
      'You can’t answer “what’s closing this month?” without a spreadsheet session',
      'Follow-ups depend on someone remembering',
    ],
    competitorFitsWhen: [
      'You have only a handful of leads a month and one person handles everything',
      'You are pre-revenue and testing whether there’s demand at all',
    ],
    rows: [
      { feature: 'Leads captured automatically from portals & ads', ezcrm: 'yes', competitor: 'no' },
      { feature: 'Round-robin routing so no lead waits', ezcrm: 'yes', competitor: 'no' },
      { feature: 'Official WhatsApp team inbox (history stays with the business)', ezcrm: 'yes', competitor: 'no', note: 'Personal WhatsApp: history leaves with the employee' },
      { feature: 'Automatic follow-up reminders & drips', ezcrm: 'yes', competitor: 'no' },
      { feature: 'Live pipeline & revenue dashboard', ezcrm: 'yes', competitor: 'no' },
      { feature: 'GST quotations with HSN/SAC codes', ezcrm: 'yes', competitor: 'no' },
      { feature: 'Role-based access & audit trail', ezcrm: 'yes', competitor: 'no' },
      { feature: 'Broadcasts on approved templates (no ban risk)', ezcrm: 'yes', competitor: 'no', note: 'Personal WhatsApp: broadcasting risks a ban' },
      { feature: 'Works on your team’s phones', ezcrm: 'yes', competitor: 'yes' },
      { feature: 'Zero software cost', ezcrm: 'no', competitor: 'yes', note: 'The hidden cost of Excel+WhatsApp is the deals you lose' },
    ],
    differentiators: [
      { title: 'No lead waits for a human to notice it', detail: 'Portal and ad enquiries are captured and routed round-robin in seconds — the fastest caller usually wins the deal.' },
      { title: 'Your customer history is yours', detail: 'On personal WhatsApp, conversations and quotes leave when an employee does. In EZCRM they live on the lead’s timeline forever.' },
      { title: 'You can finally see the business', detail: 'A live dashboard replaces the Sunday-night spreadsheet: pipeline value, follow-ups due, and which source actually converts.' },
    ],
    migration:
      'Import your existing sheets into EZCRM via XLSX with field mapping, connect your WhatsApp number through the official Meta API, and keep working the way your team already does — just with nothing slipping through the cracks. Most teams are live within a week.',
    faqs: [
      { question: 'We’re small — do we really need a CRM?', answer: 'If you’re getting more leads than one person can reliably follow up, yes. The moment a lead waits hours for a callback, or a quote can’t be found, Excel + WhatsApp is already costing you deals. EZCRM keeps your WhatsApp-first habit and stops the leaks.' },
      { question: 'Will my team have to change how they work?', answer: 'Not much — they keep working leads on WhatsApp. The difference is the conversations, follow-ups and quotes are now on record and visible to you, instead of trapped on individual phones.' },
      { question: 'Isn’t Excel + WhatsApp free?', answer: 'The software is free; the lost deals aren’t. Slow first response, forgotten follow-ups and customer history walking out with staff are the real costs — usually far more than a per-user CRM subscription.' },
    ],
    order: 4,
  },
]

export function getComparison(slug: string): ComparisonContent | undefined {
  return comparisons.find((c) => c.slug === slug)
}
