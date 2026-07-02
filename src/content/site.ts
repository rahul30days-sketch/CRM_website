/**
 * Sitewide fallback/seed content: navigation, integrations, pricing,
 * testimonials, FAQs, ticker events and platform trust points.
 * Same contract as modules.ts — seeded into Payload, used as fallback.
 */

export const nav = {
  header: [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/features' },
    { label: 'Integrations', href: '/integrations' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Customers', href: '/customers' },
    { label: 'Security', href: '/security' },
    { label: 'Blog', href: '/blog' },
  ],
  footer: [
    {
      groupTitle: 'Product',
      links: [
        { label: 'All features', href: '/features' },
        { label: 'WhatsApp Business', href: '/features/whatsapp' },
        { label: 'Lead Integration Hub', href: '/features/lead-integrations' },
        { label: 'Quotations', href: '/features/quotations' },
        { label: 'Pricing', href: '/pricing' },
      ],
    },
    {
      groupTitle: 'Solutions',
      links: [
        { label: 'Real estate', href: '/solutions/real-estate' },
        { label: 'Manufacturing', href: '/solutions/manufacturing' },
        { label: 'Service businesses', href: '/solutions/services' },
      ],
    },
    {
      groupTitle: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Customers', href: '/customers' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      groupTitle: 'Trust',
      links: [
        { label: 'Security', href: '/security' },
        { label: 'Privacy policy', href: '/legal/privacy' },
        { label: 'Terms of service', href: '/legal/terms' },
      ],
    },
  ],
}

export interface IntegrationContent {
  slug: string
  name: string
  category: 'lead-sources' | 'messaging' | 'payments' | 'notifications' | 'developer'
  description: string
}

export const integrations: IntegrationContent[] = [
  {
    slug: 'facebook-lead-ads',
    name: 'Facebook Lead Ads',
    category: 'lead-sources',
    description:
      'Every form fill from your Facebook and Instagram campaigns lands in EZCRM the moment it happens — parsed, sourced and routed to a rep.',
  },
  {
    slug: 'indiamart',
    name: 'IndiaMART',
    category: 'lead-sources',
    description:
      'Buy-leads and enquiries sync automatically. You paid for these leads — stop letting them age in an inbox.',
  },
  {
    slug: 'justdial',
    name: 'JustDial',
    category: 'lead-sources',
    description:
      'JustDial enquiries arrive with caller details mapped to your fields, ready for the first call while the customer is still searching.',
  },
  {
    slug: 'meta-whatsapp',
    name: 'Meta WhatsApp Business API',
    category: 'messaging',
    description:
      'The official API — approved templates, multi-number support, and none of the grey-market ban risk.',
  },
  {
    slug: 'google',
    name: 'Google',
    category: 'lead-sources',
    description:
      'Sign in with Google Workspace and pull enquiries from Google lead forms into the same queue as everything else.',
  },
  {
    slug: 'razorpay',
    name: 'Razorpay',
    category: 'payments',
    description: 'Collect advances and invoice payments against deals and quotations.',
  },
  {
    slug: 'cashfree',
    name: 'Cashfree',
    category: 'payments',
    description: 'Alternative payment rails for collections — use one gateway or both.',
  },
  {
    slug: 'fcm',
    name: 'Firebase Cloud Messaging',
    category: 'notifications',
    description: 'Push notifications to your team’s devices for assignments, reminders and escalations.',
  },
  {
    slug: 'slack',
    name: 'Slack',
    category: 'notifications',
    description: 'Deal-won announcements and escalations posted where your team already talks.',
  },
  {
    slug: 'webhooks',
    name: 'Custom webhooks',
    category: 'developer',
    description:
      'Inbound webhooks accept leads from any system that can send JSON; outbound webhooks notify yours. Token-authenticated REST API included.',
  },
]

export interface PricingPlanContent {
  name: string
  forWhom: string
  priceMonthly: number | null
  priceYearly: number | null
  features: string[]
  limitsNote: string
  cta: { label: string; href: string }
  mostPopular: boolean
}

export const pricingPlans: PricingPlanContent[] = [
  {
    name: 'Desk',
    forWhom: 'For a small sales desk getting off spreadsheets',
    priceMonthly: 599,
    priceYearly: 499,
    features: [
      'Leads, contacts, deals & one pipeline',
      'Dashboard with live KPIs',
      'Activities, calendar & reminders',
      'Bulk XLSX import/export',
      'Email support',
    ],
    limitsNote: 'Up to 5 users · 10,000 contacts',
    cta: { label: 'Start free trial', href: '/demo' },
    mostPopular: false,
  },
  {
    name: 'Floor',
    forWhom: 'For teams running multi-channel follow-up',
    priceMonthly: 1199,
    priceYearly: 999,
    features: [
      'Everything in Desk',
      'WhatsApp Business inbox (official API)',
      'Email & SMS campaigns with DLT templates',
      'Lead Integration Hub: Facebook, IndiaMART, JustDial',
      'Quotations with product catalog & GST',
      'Funnels & automations',
      'Round-robin routing',
    ],
    limitsNote: 'Up to 25 users · 50,000 contacts',
    cta: { label: 'Start free trial', href: '/demo' },
    mostPopular: true,
  },
  {
    name: 'Command',
    forWhom: 'For multi-branch operations and resellers',
    priceMonthly: null,
    priceYearly: null,
    features: [
      'Everything in Floor',
      'Multi-tenant white-label & reseller branding',
      'Data-scoped roles across branches',
      'AI chatbot & AI insights',
      'Ticketing with SLA policies',
      'REST API & custom webhooks',
      'Priority support & onboarding',
    ],
    limitsNote: 'Unlimited users · custom limits',
    cta: { label: 'Talk to us', href: '/contact' },
    mostPopular: false,
  },
]

export interface TestimonialContent {
  quote: string
  author: string
  role: string
  company: string
  metric?: { value: string; label: string }
  moduleSlug?: string
}

export const testimonials: TestimonialContent[] = [
  {
    quote:
      'Earlier, IndiaMART leads sat in email till evening. Now my telecaller’s phone rings the second an enquiry comes. We closed two orders last month purely because we called first.',
    author: 'Nitin Agarwal',
    role: 'Owner',
    company: 'Shakti Pumps & Motors, Rajkot',
    metric: { value: '4 hrs → 3 min', label: 'enquiry to first call' },
    moduleSlug: 'lead-integrations',
  },
  {
    quote:
      'Three salesmen left in one year. Not one customer was lost, because every conversation and every quotation was in the system, not in their phones.',
    author: 'Deepa Krishnan',
    role: 'Director',
    company: 'Chennai Interior Studio',
    metric: { value: '0', label: 'customers lost to staff churn' },
    moduleSlug: 'leads',
  },
  {
    quote:
      'The WhatsApp inbox changed how we sell. Broadcast to 3,000 old customers before Diwali, per-recipient read receipts, and the drip answered price queries at midnight. Best season we have had.',
    author: 'Farhan Sheikh',
    role: 'Sales Head',
    company: 'Millat Electronics, Bhopal',
    metric: { value: '₹18L', label: 'from one festival broadcast' },
    moduleSlug: 'whatsapp',
  },
  {
    quote:
      'I open the dashboard with my morning tea. Pipeline value, follow-ups due, which branch is slipping — five minutes and I know where to push. My monthly Excel ritual is gone.',
    author: 'Sunita Rao',
    role: 'Managing Partner',
    company: 'Vertex Realty, Pune',
    metric: { value: '1 day → 5 min', label: 'monthly review' },
    moduleSlug: 'dashboard',
  },
]

export interface FaqContent {
  question: string
  answer: string
  category: 'general' | 'pricing' | 'whatsapp' | 'security' | 'onboarding'
}

export const faqs: FaqContent[] = [
  {
    question: 'We run everything on Excel and WhatsApp today. How hard is the switch?',
    answer:
      'That is exactly where most of our customers start. Your existing sheets import via XLSX with field mapping, your WhatsApp number connects through the official Meta API, and most teams are working fully inside EZCRM within a week. Your data stays yours — export everything, any time.',
    category: 'onboarding',
  },
  {
    question: 'Is the WhatsApp integration official? Will my number get banned?',
    answer:
      'EZCRM uses the official Meta WhatsApp Business API — not a browser hack or grey-market gateway. Broadcasts go out on Meta-approved templates, which is what keeps your number safe. Grey-market tools are precisely how numbers get banned.',
    category: 'whatsapp',
  },
  {
    question: 'Do you support DLT compliance for SMS?',
    answer:
      'Yes. You register your headers and templates with your DLT operator once, store them in EZCRM, and every campaign is validated against them before sending — so messages don’t silently vanish at the operator.',
    category: 'whatsapp',
  },
  {
    question: 'Can I control what each employee sees?',
    answer:
      'Yes — roles plus data scoping. A telecaller sees only their assigned leads; a branch manager sees their branch; you see everything. Exports and bulk actions can be restricted per role, and every sensitive action lands in the audit trail.',
    category: 'security',
  },
  {
    question: 'Where is my data stored, and can I take it out?',
    answer:
      'Your data lives in an isolated tenant on MongoDB Atlas, encrypted in transit and at rest. Full export (XLSX/CSV) is available to admins at any time. Details are on our Security page.',
    category: 'security',
  },
  {
    question: 'Is there a per-user price? What about the trial?',
    answer:
      'Plans are priced per user per month, billed monthly or yearly (yearly saves roughly 17%). The 14-day trial includes the full Floor plan — no card required to start.',
    category: 'pricing',
  },
  {
    question: 'We are a reseller / agency. Can we offer EZCRM under our own brand?',
    answer:
      'Yes — the Command plan is multi-tenant and white-label: your logo, your domain, your pricing, with each client in an isolated tenant. Talk to us about reseller terms.',
    category: 'pricing',
  },
  {
    question: 'Does EZCRM work on mobile?',
    answer:
      'The whole product is mobile-responsive, and field reps get the day’s follow-ups, lead timelines and WhatsApp inbox on their phones. Push notifications cover assignments and reminders.',
    category: 'general',
  },
]

/** Feed for the live-events ticker under the hero. Fictional but plausible. */
export const tickerEvents = [
  { signal: 'info' as const, text: 'Lead #4821 from IndiaMART → auto-assigned to Priya (round-robin)' },
  { signal: 'won' as const, text: 'Deal won: Sharma Traders — ₹2,40,000 · Pipeline: Distribution' },
  { signal: 'info' as const, text: 'WhatsApp broadcast “Diwali price list” — 2,847/3,000 delivered' },
  { signal: 'due' as const, text: 'Follow-up overdue: Kavita M. (Vertex Realty enquiry, 2 days)' },
  { signal: 'info' as const, text: 'Quotation QT-1094 v3 accepted · digital signature received' },
  { signal: 'won' as const, text: 'Ticket #883 resolved within SLA — Service dept, 3h 12m' },
  { signal: 'info' as const, text: 'Facebook Lead Ads: 14 new leads from campaign “Monsoon Offer”' },
  { signal: 'info' as const, text: 'Drip step 3/5 sent to 412 contacts — segment “North zone dealers”' },
]

export const trustPoints = [
  {
    title: 'Role-based, data-scoped access',
    detail: 'A telecaller sees their leads. A branch head sees their branch. You see everything.',
  },
  {
    title: 'Full audit trail',
    detail: 'Every login, edit, export and delete — who, what, when, from where.',
  },
  {
    title: 'Multi-tenant isolation',
    detail: 'Each company is an isolated tenant. White-label resellers keep clients fully separated.',
  },
  {
    title: 'Official APIs only',
    detail: 'Meta WhatsApp Business API, DLT-compliant SMS routes, token-authenticated REST.',
  },
]

export interface IndustryContent {
  slug: string
  name: string
  headline: string
  intro: string
  pains: { pain: string; fix: string }[]
  modules: string[]
}

export const industries: IndustryContent[] = [
  {
    slug: 'real-estate',
    name: 'Real estate',
    headline: 'Every site visit booked, every portal lead called back.',
    intro:
      'Real-estate sales run on speed and follow-up: the buyer who enquired on three portals buys from whoever calls first and keeps calling. EZCRM pulls portal and Facebook leads in instantly, routes them round-robin to your closers, and keeps every site-visit promise on a timer.',
    pains: [
      {
        pain: 'Portal leads (99acres, MagicBricks, Facebook) reach the office next morning',
        fix: 'Lead Integration Hub assigns them to a rep in seconds, with source stamped',
      },
      {
        pain: '“Will visit on Sunday” — and then nobody confirms on Saturday',
        fix: 'Automations send the WhatsApp confirmation and remind the rep automatically',
      },
      {
        pain: 'Team members leave and take their buyer conversations with them',
        fix: 'Every call, chat and negotiation lives on the lead timeline, not in personal phones',
      },
    ],
    modules: ['lead-integrations', 'whatsapp', 'calendar', 'deals-pipeline'],
  },
  {
    slug: 'manufacturing',
    name: 'Manufacturing & distribution',
    headline: 'From IndiaMART enquiry to GST quotation without touching Excel.',
    intro:
      'B2B manufacturers sell on enquiry response and paperwork accuracy. EZCRM syncs IndiaMART and JustDial buy-leads, tracks multi-round negotiations as versioned quotations with HSN codes and tax slabs, and shows the owner exactly how much is sitting at each pipeline stage.',
    pains: [
      {
        pain: 'Paid IndiaMART leads age in an inbox while competitors respond',
        fix: 'Enquiries sync and route to sales engineers the moment they arrive',
      },
      {
        pain: 'Quotes in Word with wrong HSN codes and last month’s prices',
        fix: 'Catalog-driven quotations with taxes, UOM conversions and version history',
      },
      {
        pain: 'No idea which dealer hasn’t reordered this quarter',
        fix: 'Segments like “dealers, no order in 90 days” update themselves and feed campaigns',
      },
    ],
    modules: ['lead-integrations', 'quotations', 'contacts', 'dashboard'],
  },
  {
    slug: 'services',
    name: 'Service businesses',
    headline: 'Enquiry → quote → job → support ticket, one thread per customer.',
    intro:
      'Agencies, clinics, institutes and repair businesses live on repeat customers. EZCRM keeps the whole relationship — first enquiry, quotation, payments, complaints — on one timeline, with a no-login ticket portal so after-sales stops leaking through personal numbers.',
    pains: [
      {
        pain: 'Complaints go to whoever the customer has on WhatsApp',
        fix: 'A public ticket portal with SLA timers, visible to the whole service desk',
      },
      {
        pain: 'Follow-ups for renewals and AMCs slip every single month',
        fix: 'Automations enroll every contract into a renewal sequence with reminders',
      },
      {
        pain: 'The owner can’t see today’s bookings across branches',
        fix: 'A role-aware dashboard with branch-scoped calendars and KPIs',
      },
    ],
    modules: ['ticketing', 'automations', 'calendar', 'whatsapp'],
  },
]
