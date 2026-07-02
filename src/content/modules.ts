/**
 * Canonical marketing copy for every EZCRM module.
 *
 * Single source of truth: the seed script pushes this into Payload, and the
 * frontend falls back to it when the CMS is unreachable (e.g. first local
 * run before Mongo is configured). Once seeded, editors own the copy in
 * Payload — this file is the factory default, not the live source.
 */

export type ModuleCategory = 'capture' | 'engage' | 'close' | 'support' | 'operate'

export interface ModuleContent {
  slug: string
  title: string
  category: ModuleCategory
  tagline: string
  shortDescription: string
  problem: string
  howItWorks: { step: string; detail: string }[]
  capabilities: string[]
  metric?: { before: string; after: string; caption: string }
  related: string[]
}

export const moduleCategories: Record<ModuleCategory, { label: string; blurb: string }> = {
  capture: {
    label: 'Capture',
    blurb: 'Every enquiry, from every channel, lands in one queue — before your competitor calls them back.',
  },
  engage: {
    label: 'Engage',
    blurb: 'WhatsApp, email and SMS from the same screen the lead lives on.',
  },
  close: {
    label: 'Close',
    blurb: 'Pipelines, quotations and the paperwork between “interested” and “paid”.',
  },
  support: {
    label: 'Support',
    blurb: 'Keep the customers you worked so hard to win.',
  },
  operate: {
    label: 'Run the floor',
    blurb: 'The numbers, schedules and assets that keep a sales team honest.',
  },
}

export const modules: ModuleContent[] = [
  {
    slug: 'dashboard',
    title: 'Dashboard & Analytics',
    category: 'operate',
    tagline: 'Walk in at 9am and know exactly where the month stands.',
    shortDescription:
      'Live revenue, pipeline value, lead trends and follow-ups due — one screen your whole team opens first, with widgets that match each person’s role.',
    problem:
      'Most owners run their business on a WhatsApp group and a mental estimate. Asking “how many leads did JustDial send us last month, and how many did we actually call?” means an hour of somebody digging through spreadsheets — so nobody asks, and leaks stay invisible.',
    howItWorks: [
      {
        step: 'Open the command view',
        detail:
          'Revenue this month, active leads, deals by stage and follow-ups due today load in real time — no report to generate, no filter to remember.',
      },
      {
        step: 'Trace any number to its source',
        detail:
          'The lead-source donut and 3/6/12-month trend lines show which channels actually convert. Click a slice and you are looking at the leads behind it.',
      },
      {
        step: 'See India, not just totals',
        detail:
          'A state-level heatmap shows where enquiries and revenue concentrate — useful the day you decide where the next field rep goes.',
      },
      {
        step: 'Let the AI flag what you would have missed',
        detail:
          'Insight cards call out anomalies: “Facebook leads up 40% this week, but response time doubled.” The kind of thing you find out a month too late otherwise.',
      },
    ],
    capabilities: [
      'Real-time KPI tiles: revenue, active leads, open deals, follow-ups due',
      'Lead trend charts across 3, 6 and 12-month windows',
      'Lead-source breakdown that names names — IndiaMART vs Facebook vs walk-in',
      'Pipeline command view with stage-by-stage value',
      'India state-level geo heatmap of enquiries and revenue',
      'AI insight cards for anomalies and stalled deals',
      'Role-aware widgets — an owner and a telecaller see different dashboards',
    ],
    metric: {
      before: 'Monthly review took a day of Excel',
      after: 'Numbers live on one screen, all day',
      caption: 'What changes when reporting stops being a chore',
    },
    related: ['deals-pipeline', 'leads', 'lead-integrations'],
  },
  {
    slug: 'leads',
    title: 'Lead Management',
    category: 'capture',
    tagline: 'No lead sits unclaimed for more than a few seconds.',
    shortDescription:
      'Capture, group and route every enquiry with custom fields, statuses and priorities — with round-robin assignment so fresh leads never wait for a manager to notice them.',
    problem:
      'The fastest caller usually wins the deal, and in most teams a new enquiry waits hours because it landed in someone’s personal inbox, or because “whose turn is it?” has no answer. Leads also die quietly when the person handling them leaves and their follow-up history leaves with them.',
    howItWorks: [
      {
        step: 'Everything lands in one queue',
        detail:
          'Web forms, imports, integrations and manual entries arrive with source, custom fields and priority already set.',
      },
      {
        step: 'Round-robin does the routing',
        detail:
          'New leads distribute across your team automatically — evenly, instantly, and without a manager playing traffic police at 11pm.',
      },
      {
        step: 'The timeline remembers everything',
        detail:
          'Every call note, status change, WhatsApp message and quotation sits on the lead’s activity timeline. Hand the lead to someone new and nothing is lost.',
      },
      {
        step: 'Bulk operations for the messy days',
        detail:
          'Import 5,000 leads from an XLSX, bulk-assign an exhibition’s worth of visiting cards, or clean out junk in one action.',
      },
    ],
    capabilities: [
      'Custom fields, statuses, priorities and sources — model your process, not ours',
      'Bulk XLSX import and export with field mapping',
      'Bulk assign, bulk status change, bulk delete',
      'Lead groups for campaigns, exhibitions and territories',
      'Round-robin auto-assignment with per-team rules',
      'Full per-lead activity timeline: calls, notes, messages, quotes',
      'Duplicate detection on phone and email',
    ],
    metric: {
      before: 'First call in ~4 hours',
      after: 'First call in under 5 minutes',
      caption: 'Typical response-time change after switching on round-robin routing',
    },
    related: ['lead-integrations', 'deals-pipeline', 'whatsapp'],
  },
  {
    slug: 'deals-pipeline',
    title: 'Deals & Pipeline',
    category: 'close',
    tagline: 'Your entire order book, draggable.',
    shortDescription:
      'Multiple pipelines with your stages, drag-and-drop Kanban, deal values and expected close dates — so “what’s closing this month?” takes five seconds to answer.',
    problem:
      'A pipeline in a notebook or a spreadsheet is always out of date, and it hides the one number an owner actually needs: how much money is sitting at each stage, and which deals have gone quiet.',
    howItWorks: [
      {
        step: 'Convert a lead when it gets real',
        detail:
          'One click turns a qualified lead into a deal, carrying its history along. Nothing re-typed, nothing lost.',
      },
      {
        step: 'Drag deals through your stages',
        detail:
          'Build separate pipelines per product line or branch, name the stages the way your team already talks, and move deals by dragging cards.',
      },
      {
        step: 'Every deal carries its paperwork',
        detail:
          'Value, expected close date, files, activities and reminders live on the card. Won/lost reasons feed your reports.',
      },
    ],
    capabilities: [
      'Multiple pipelines — per branch, product line or team',
      'Fully customizable stages with per-stage value totals',
      'Drag-and-drop Kanban, plus table and card views',
      'Lead → deal conversion with full history carry-over',
      'Deal value, expected close date, won/lost tracking with reasons',
      'Round-robin deal assignment',
      'Deal-level activities, file attachments and reminders',
    ],
    metric: {
      before: '“What’s closing this month?” — a meeting',
      after: '“What’s closing this month?” — a glance',
      caption: 'Stage-wise pipeline value is always current',
    },
    related: ['quotations', 'dashboard', 'automations'],
  },
  {
    slug: 'contacts',
    title: 'Contacts & Segments',
    category: 'operate',
    tagline: 'One customer database instead of eleven phone books.',
    shortDescription:
      'A unified people database with tags, rule-based segments and public capture forms — so a campaign to “Pune distributors who bought last Diwali” takes minutes, not a data-cleaning weekend.',
    problem:
      'Customer data usually lives in saved phone contacts, old bill books and three different Excel files. Nobody can answer “which customers haven’t ordered in six months?” — which is exactly the list your next campaign should go to.',
    howItWorks: [
      {
        step: 'Merge everything into one database',
        detail: 'Bulk import from XLSX, capture from forms, or sync from leads — deduplicated into one record per person.',
      },
      {
        step: 'Tag and segment by rules',
        detail:
          'Build segments like “Maharashtra + bought in last 12 months + ticket value above ₹50,000”. Rule-based segments update themselves as data changes.',
      },
      {
        step: 'Campaigns pick up the segment',
        detail: 'Email, SMS and WhatsApp campaigns target segments directly — no export/import shuffle.',
      },
    ],
    capabilities: [
      'Unified contact database with custom fields',
      'Tags plus rule-based and manual segments',
      'Bulk XLSX import/export',
      'Public lead-capture forms you can embed anywhere',
      'Per-contact activity timeline across every channel',
      'Segment-targeted campaigns in one click',
    ],
    related: ['email-campaigns', 'sms-campaigns', 'leads'],
  },
  {
    slug: 'ticketing',
    title: 'Ticketing & Support',
    category: 'support',
    tagline: 'Complaints stop disappearing into personal phones.',
    shortDescription:
      'A multi-department help desk with SLA timers, canned responses and a public portal where customers raise and track tickets without creating an account.',
    problem:
      'After-sales complaints usually go to whichever staff member the customer has on WhatsApp. If that person is on leave, the complaint waits — and the owner only hears about it when the customer is already gone.',
    howItWorks: [
      {
        step: 'Customers raise tickets without logging in',
        detail:
          'A public portal takes the complaint, issues a ticket number, and lets the customer check status — no app download, no account.',
      },
      {
        step: 'Tickets route to the right department',
        detail: 'Service, accounts, dispatch — each with its own queue, priorities and SLA policy.',
      },
      {
        step: 'SLA timers keep everyone honest',
        detail:
          'Every ticket shows time-to-breach. Threaded replies and canned responses keep answers fast and consistent.',
      },
    ],
    capabilities: [
      'Multi-department queues with independent workflows',
      'SLA policies with visible time-to-breach on every ticket',
      'Canned responses for the questions you answer daily',
      'Threaded replies with full conversation history',
      'Status and priority workflow with reassignment',
      'No-login public ticket portal for customers',
    ],
    metric: {
      before: 'Complaints resolved “whenever”',
      after: '92% resolved within SLA',
      caption: 'What a visible timer does to resolution discipline',
    },
    related: ['whatsapp', 'contacts', 'automations'],
  },
  {
    slug: 'email-campaigns',
    title: 'Email Campaigns',
    category: 'engage',
    tagline: 'Reach the inbox, not the promotions graveyard.',
    shortDescription:
      'A drag-and-drop builder with A/B testing, drip sequences, open/click reports — and an automated 28-day warmup so your new domain doesn’t start life in spam.',
    problem:
      'Businesses buy an email tool, blast 10,000 messages from a cold domain on day one, and land in spam forever after. Deliverability is the whole game, and most tools leave you to figure it out alone.',
    howItWorks: [
      {
        step: 'Warm up before you blast',
        detail:
          'The 28-day automated warmup ramps sending volume gradually so mailbox providers learn to trust your domain.',
      },
      {
        step: 'Build once, test twice',
        detail:
          'Drag-and-drop builder with your branding; A/B test subject lines on a slice of the list before the full send.',
      },
      {
        step: 'Drip sequences do the following up',
        detail:
          'New lead gets mail one today, a case study on day three, a nudge on day seven — automatically, until they reply or convert.',
      },
      {
        step: 'Reports name names',
        detail: 'Opens, clicks and bounces per campaign and per recipient — synced back to each contact’s timeline.',
      },
    ],
    capabilities: [
      'Drag-and-drop rich-text email builder',
      'Scheduling, A/B testing and drip sequences',
      'Automated 28-day domain warmup',
      'Multi-SMTP support with per-route volume control',
      'Delivery, open and click tracking per recipient',
      'Segment targeting from Contacts',
    ],
    related: ['contacts', 'automations', 'sms-campaigns'],
  },
  {
    slug: 'sms-campaigns',
    title: 'SMS Campaigns',
    category: 'engage',
    tagline: 'DLT-compliant SMS without the compliance headache.',
    shortDescription:
      'Template library, scheduling and per-campaign analytics — built around India’s DLT rules so your campaigns actually deliver instead of silently dying at the operator.',
    problem:
      'Since DLT, half of all business SMS in India silently fails: unregistered templates, mismatched headers, blocked routes. Most owners don’t find out until a campaign produces zero calls.',
    howItWorks: [
      {
        step: 'Register once, reuse forever',
        detail:
          'Store your DLT-approved templates and headers in the library. EZCRM matches every send against them so nothing goes out that will be dropped.',
      },
      {
        step: 'Schedule around your customer’s day',
        detail: 'Queue campaigns for the windows that convert — 11am for B2B, evenings for retail.',
      },
      {
        step: 'Read the numbers per campaign',
        detail: 'Delivered, failed and click-through per campaign, so you know which template earns its cost.',
      },
    ],
    capabilities: [
      'DLT template and header library with send-time validation',
      'Campaign scheduling with segment targeting',
      'Per-campaign delivery and click analytics',
      'Personalization variables from contact fields',
      'Sender-route management across providers',
    ],
    related: ['email-campaigns', 'whatsapp', 'contacts'],
  },
  {
    slug: 'whatsapp',
    title: 'WhatsApp Business',
    category: 'engage',
    tagline: 'The channel your customers actually answer — with a real inbox behind it.',
    shortDescription:
      'Official Meta API: a two-way team inbox with agent assignment, approved-template broadcasts with per-recipient logs, and a visual automation builder for drips and keyword replies.',
    problem:
      'WhatsApp is where Indian buyers reply — but on a personal number it’s invisible to the business. Conversations vanish when staff leave, nobody knows who answered whom, and broadcast from a personal number risks a ban.',
    howItWorks: [
      {
        step: 'Connect your official WABA number',
        detail:
          'Built on Meta’s official WhatsApp Business API — multiple numbers supported, no grey-market gateways, no ban roulette.',
      },
      {
        step: 'Work from a shared team inbox',
        detail:
          'Incoming chats assign to agents, every conversation is visible to managers, and quick replies handle the questions you get fifty times a day.',
      },
      {
        step: 'Broadcast with receipts',
        detail:
          'Send approved templates to segments and see sent/delivered/read per recipient — not a blind blast.',
      },
      {
        step: 'Automate the boring threads',
        detail:
          'A visual builder wires keyword triggers and drip sequences: price-list requests, catalogue sends, follow-up nudges — answered at 2am without you.',
      },
    ],
    capabilities: [
      'Official Meta WhatsApp Business API — multi-number support',
      'Two-way team inbox with agent assignment and handover',
      'Approved template sync straight from Meta',
      'Broadcast campaigns with per-recipient delivery/read logs',
      'Quick replies and saved responses',
      'Visual drip and keyword-trigger automation builder',
      'Full chat history on the lead’s timeline',
    ],
    metric: {
      before: '45% of chats never answered',
      after: 'Every chat assigned, tracked, answered',
      caption: 'What moving off personal numbers actually fixes',
    },
    related: ['leads', 'automations', 'sms-campaigns'],
  },
  {
    slug: 'lead-integrations',
    title: 'Lead Integration Hub',
    category: 'capture',
    tagline: 'IndiaMART, JustDial and Facebook leads — in your CRM before the portal email arrives.',
    shortDescription:
      'One-click connectors pull enquiries from Facebook Lead Ads, IndiaMART, JustDial, webhooks and custom sources, auto-parse them and route them through round-robin.',
    problem:
      'Portal leads arrive as emails that someone must copy into a sheet. By the time that happens, a competitor who called in five minutes has the order. Paid leads going stale in an inbox is the most expensive leak in Indian SMB sales.',
    howItWorks: [
      {
        step: 'Connect each source once',
        detail:
          'Authorize Facebook Lead Ads, paste your IndiaMART/JustDial keys, or point any other system at a webhook. Multiple accounts per platform are fine.',
      },
      {
        step: 'Enquiries parse themselves',
        detail:
          'Name, phone, product interest and message map to your custom fields automatically — no copy-paste, no typos.',
      },
      {
        step: 'Routing fires instantly',
        detail:
          'The new lead hits round-robin, the assigned rep gets notified, and the first call happens while the enquiry is still warm.',
      },
    ],
    capabilities: [
      'One-click Facebook Lead Ads connector',
      'IndiaMART and JustDial enquiry sync',
      'Generic inbound webhooks and custom connectors',
      'Multiple instances per platform (several accounts/pages)',
      'Auto-parsing into custom fields with source stamped',
      'Instant round-robin routing and rep notification',
    ],
    metric: {
      before: 'Portal lead → CRM: next morning',
      after: 'Portal lead → assigned rep: seconds',
      caption: 'Measured from enquiry to assignment',
    },
    related: ['leads', 'automations', 'dashboard'],
  },
  {
    slug: 'quotations',
    title: 'Quotations & Finance',
    category: 'close',
    tagline: 'Professional, GST-correct quotes in minutes — with every revision on record.',
    shortDescription:
      'A versioned quotation builder with line items, tax slabs, UOM conversions, T&C sets, digital signatures and PDF export — backed by a product catalog with HSN/SAC codes.',
    problem:
      'Quotes made in Word take an hour, carry last customer’s name half the time, and vanish into email threads. When the customer says “but you quoted less last month”, nobody can prove otherwise.',
    howItWorks: [
      {
        step: 'Pick products, not fights with Excel',
        detail:
          'Line items come from your catalog with HSN/SAC codes, tax slabs and unit conversions already correct. Totals compute themselves.',
      },
      {
        step: 'Every revision is a version',
        detail:
          'Negotiation round two? Revise the quote — version 1 stays on record. The deal timeline shows exactly what was offered when.',
      },
      {
        step: 'Send, sign, done',
        detail:
          'Branded PDF with your T&C set, sent from the deal. Customers can accept with a digital signature — no printer required.',
      },
    ],
    capabilities: [
      'Versioned quotation builder with full revision history',
      'Product catalog with HSN/SAC codes and multi-tax support',
      'Tax slabs, discounts and UOM conversions per line item',
      'Reusable terms & conditions sets',
      'Digital signature acceptance',
      'Branded PDF export, attached to the deal automatically',
    ],
    metric: {
      before: '~1 hour per quote in Word',
      after: '~6 minutes, catalog-driven',
      caption: 'And zero “wrong customer name” incidents',
    },
    related: ['deals-pipeline', 'media-library', 'contacts'],
  },
  {
    slug: 'automations',
    title: 'Funnels & Automations',
    category: 'operate',
    tagline: 'The follow-up that happens even when everyone is busy.',
    shortDescription:
      'A visual funnel builder and trigger-based automations across leads, deals and messaging — with enrollment tracking so you can see exactly who is inside each sequence.',
    problem:
      'Everyone agrees follow-up wins deals; nobody has time to do it manually on day 3, day 7 and day 14 for every lead. The leads that needed three nudges simply never get them.',
    howItWorks: [
      {
        step: 'Draw the funnel you already run',
        detail:
          'Stages from first touch to closed — mapped visually, so the whole team sees the same process.',
      },
      {
        step: 'Set triggers, not reminders',
        detail:
          '“Lead source is IndiaMART → send WhatsApp template within 1 minute.” “Deal idle 7 days → task for the rep, alert to the manager.”',
      },
      {
        step: 'Watch enrollment, not hope',
        detail:
          'See who is inside every sequence, where they are, and where people drop off — then fix that step.',
      },
    ],
    capabilities: [
      'Visual funnel builder',
      'Triggers on lead, deal, message and time events',
      'Actions across WhatsApp, email, SMS, tasks and assignments',
      'Enrollment tracking with per-step drop-off',
      'Idle-deal and SLA-style escalations',
    ],
    related: ['whatsapp', 'email-campaigns', 'deals-pipeline'],
  },
  {
    slug: 'ai-chatbot',
    title: 'AI Chatbot',
    category: 'capture',
    tagline: 'Your website answers back — and takes down the number.',
    shortDescription:
      'An embeddable AI widget trained per company, with multiple configuration profiles, full conversation history, and lead capture straight into your queue.',
    problem:
      'Website visitors at 11pm don’t fill contact forms — they ask one question, get silence, and buy elsewhere. A static “we’ll get back to you” form is where after-hours demand goes to die.',
    howItWorks: [
      {
        step: 'Embed one snippet',
        detail: 'Drop the widget on your site. Styling and behavior come from config profiles — one per site or campaign.',
      },
      {
        step: 'It answers like your best telecaller',
        detail:
          'Product questions, pricing ranges, service areas — answered from your content, in your tone, at any hour.',
      },
      {
        step: 'It never forgets to ask for the number',
        detail:
          'Conversations convert into leads with full chat history attached, routed through round-robin like any other enquiry.',
      },
    ],
    capabilities: [
      'Embeddable widget, one snippet per site',
      'Multiple config profiles per company',
      'Full conversation history, searchable',
      'Lead capture from chat with context attached',
      'Handover to a human agent when needed',
    ],
    related: ['leads', 'whatsapp', 'automations'],
  },
  {
    slug: 'calendar',
    title: 'Activities, Calendar & Reminders',
    category: 'operate',
    tagline: 'Every promise your team makes, with a timestamp on it.',
    shortDescription:
      'Per-lead and per-deal activities, a meeting calendar and notification reminders, rolled into one upcoming-tasks view — so “I’ll call you Tuesday” actually happens on Tuesday.',
    problem:
      '“Call me next week” is where deals go to be forgotten. Promises live in personal reminder apps, if anywhere, and a manager has no way to see what fell through the cracks until the customer complains.',
    howItWorks: [
      {
        step: 'Log the promise where the deal lives',
        detail: 'Calls, meetings and follow-ups attach to the lead or deal, not to someone’s personal phone.',
      },
      {
        step: 'One view of everything due',
        detail:
          'The unified upcoming-tasks view shows today’s calls, this week’s meetings and everything overdue — per rep and for the whole team.',
      },
      {
        step: 'Reminders that reach you',
        detail: 'Notifications fire before the meeting, not after the customer has already called to ask where you are.',
      },
    ],
    capabilities: [
      'Activities on every lead and deal: calls, meetings, tasks, notes',
      'Team meeting calendar with day/week/month views',
      'Push and in-app reminders',
      'Unified upcoming-tasks view across the team',
      'Overdue flags a manager can actually act on',
    ],
    related: ['leads', 'deals-pipeline', 'dashboard'],
  },
  {
    slug: 'media-library',
    title: 'Media Library',
    category: 'operate',
    tagline: 'The right catalogue PDF, every time, from one place.',
    shortDescription:
      'A centralized asset manager for campaign creatives, quotation attachments and message templates — so the team stops WhatsApp-ing each other last year’s price list.',
    problem:
      'Brochures and price lists live in personal phone galleries. Customers routinely receive the old catalogue with the old prices — and that mistake costs real margin.',
    howItWorks: [
      {
        step: 'Upload once, organize by folder',
        detail: 'Catalogues, images, spec sheets and templates — versioned, searchable, in one library.',
      },
      {
        step: 'Attach from anywhere',
        detail:
          'Campaigns, WhatsApp replies and quotations pick assets from the same library, so everyone sends the current file.',
      },
      {
        step: 'Retire the stale stuff',
        detail: 'Replace an asset and every future send uses the new version. The old price list stops circulating.',
      },
    ],
    capabilities: [
      'Central library for images, PDFs and templates',
      'Folders, search and tagging',
      'Direct attachment into campaigns, chats and quotations',
      'Version replacement — one update fixes every future send',
    ],
    related: ['quotations', 'email-campaigns', 'whatsapp'],
  },
]

export function getModule(slug: string): ModuleContent | undefined {
  return modules.find((m) => m.slug === slug)
}
