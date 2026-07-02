/** Case studies and blog posts — seed data + CMS fallback, same as modules.ts. */

export interface CaseStudyContent {
  slug: string
  client: string
  industry: string
  summary: string
  challenge: string
  solution: string
  results: string
  metrics: { value: string; label: string }[]
}

export const caseStudies: CaseStudyContent[] = [
  {
    slug: 'shakti-pumps-rajkot',
    client: 'Shakti Pumps & Motors',
    industry: 'Manufacturing — Rajkot, Gujarat',
    summary:
      'A 12-person pump manufacturer stopped losing paid IndiaMART leads to slow callbacks and cut enquiry-to-quote time from two days to two hours.',
    challenge:
      'Shakti paid for IndiaMART and JustDial subscriptions but enquiries arrived as emails that the office checked twice a day. Quotes were built in Word from a price list that lived on the owner’s laptop — engineers on the road quoted from memory, and two dealers received different prices for the same motor in the same week.',
    solution:
      'The Lead Integration Hub synced both portals so every buy-lead routed round-robin to a sales engineer with a push notification. The product catalog went into Quotations with HSN codes and slab-wise GST, so quotes became a pick-and-send job with version history. The owner’s dashboard tracked enquiry-to-first-call time per engineer — which made the metric a matter of team pride within a month.',
    results:
      'First-response time collapsed from around four hours to under five minutes. Quotation errors stopped entirely, and the versioned history settled two price disputes with dealers in EZCRM’s favor. The owner now reviews the pipeline every morning instead of calling each engineer for updates.',
    metrics: [
      { value: '3 min', label: 'median enquiry-to-call (was ~4 hrs)' },
      { value: '2 hrs', label: 'enquiry to GST quotation (was 2 days)' },
      { value: '+22%', label: 'portal-lead conversion in 2 quarters' },
    ],
  },
  {
    slug: 'vertex-realty-pune',
    client: 'Vertex Realty',
    industry: 'Real estate — Pune, Maharashtra',
    summary:
      'A three-project developer moved 40 telecallers and closers onto one pipeline and doubled site-visit show-up rates with WhatsApp automations.',
    challenge:
      'Vertex ran three projects with separate spreadsheets, and Facebook lead forms were downloaded as CSVs every evening. Site visits were confirmed by whichever telecaller remembered. Show-up rates hovered near 30%, and management reporting was a Sunday-night ritual of merging sheets.',
    solution:
      'Facebook Lead Ads connected directly, with one pipeline per project and round-robin routing to telecallers. An automation confirmed every site visit on WhatsApp the evening before and reminded the assigned closer the same morning. Role-scoped dashboards gave each project head their own numbers while the directors saw everything.',
    results:
      'Show-up rates rose from roughly 30% to 58% within two months — the WhatsApp confirmation did most of that work. Lead leakage between telecallers ended because ownership was unambiguous, and Sunday-night reporting disappeared.',
    metrics: [
      { value: '58%', label: 'site-visit show-up rate (was ~30%)' },
      { value: '0 CSVs', label: 'manual lead downloads per week (was ~20)' },
      { value: '40 users', label: 'on one pipeline across 3 projects' },
    ],
  },
  {
    slug: 'millat-electronics-bhopal',
    client: 'Millat Electronics',
    industry: 'Retail & distribution — Bhopal, Madhya Pradesh',
    summary:
      'A consumer-electronics dealer turned a dead customer database into ₹18L of festival-season revenue with segmented WhatsApp broadcasts.',
    challenge:
      'Eight years of customer bills meant nothing: names and numbers sat in a billing system that couldn’t message anyone. Festival offers went out as a single bulk SMS to everyone — including customers who had bought the same product the week before.',
    solution:
      'The billing export was imported into Contacts and segmented by purchase recency and category. Before Diwali, approved WhatsApp templates went to segments like “bought a TV 4+ years ago” with per-recipient delivery and read logs. A keyword-trigger drip answered “price?” replies instantly and handed hot conversations to the shop floor team’s shared inbox.',
    results:
      'The Diwali broadcast reached 3,000 customers with a 71% read rate; 240 replies were worked through the shared inbox, producing ₹18L in attributed sales — the store’s best festival season. The same segments now run quarterly with fresh offers.',
    metrics: [
      { value: '₹18L', label: 'attributed festival revenue' },
      { value: '71%', label: 'broadcast read rate' },
      { value: '240', label: 'conversations handled in the shared inbox' },
    ],
  },
]

export interface BlogPostContent {
  slug: string
  title: string
  excerpt: string
  category: 'playbooks' | 'product' | 'whatsapp' | 'customers'
  publishedAt: string
  paragraphs: string[]
}

export const blogPosts: BlogPostContent[] = [
  {
    slug: 'first-five-minutes',
    title: 'The first five minutes: why lead response time beats everything else you optimize',
    excerpt:
      'Most Indian SMBs lose deals before the first conversation — not on price, not on product, but on speed. Here is a routing setup that gets every portal lead a callback in minutes.',
    category: 'playbooks',
    publishedAt: '2026-05-14',
    paragraphs: [
      'Ask a buyer on IndiaMART how they chose a supplier and you will rarely hear “the best specification sheet”. You will hear “they called back first, and they kept following up”. Response speed is the cheapest competitive advantage in Indian B2B sales, and it is the one most teams throw away — a paid lead that sits in an inbox for four hours has already been called by three competitors.',
      'The failure is structural, not personal. Portal enquiries arrive as emails to one address. Someone has to notice, copy the details into a sheet, decide who should call, and hope that person is free. Each step adds minutes at best, hours in practice, and every handoff is a place where the lead can simply vanish.',
      'The fix is to remove every human step between “enquiry arrives” and “phone rings”. Connect the portal directly to your CRM so parsing happens by machine. Route by round-robin so “whose turn?” has an automatic answer. Notify the assigned rep on their phone, and start a timer a manager can see. When we watch teams switch this on in EZCRM, median first-response drops from hours to minutes in the first week — no training, no motivation posters, just the removal of dead time.',
      'One habit completes the loop: put response time on the dashboard where everyone sees it. Reps compete on it naturally once it is visible. The teams that win are not more disciplined than yours — their systems just refuse to let a lead wait.',
    ],
  },
  {
    slug: 'whatsapp-official-api-vs-grey-market',
    title: 'Official WhatsApp Business API vs grey-market tools: what “cheap” actually costs',
    excerpt:
      'Unofficial WhatsApp blasters are half the price until your number — the one on your shop board and visiting cards — gets banned. How the official API works and when it pays for itself.',
    category: 'whatsapp',
    publishedAt: '2026-04-02',
    paragraphs: [
      'Every week a business owner tells us about a tool that sends WhatsApp broadcasts for a few paise per message, no template approval needed. Every few weeks, one of them tells us their number was banned mid-season. The number on the shop board, printed on ten thousand visiting cards, saved by every customer — gone, along with the chat history.',
      'Grey-market tools work by automating consumer WhatsApp through browser sessions or modified apps, which violates WhatsApp’s terms. Meta’s detection looks for exactly the pattern these tools produce: identical messages fanning out from a consumer account at machine speed. Bans arrive without warning and are rarely reversed. The money saved on messaging fees is borrowed against your primary business identity.',
      'The official WhatsApp Business API costs more per message and asks more of you up front: business verification and pre-approved message templates for outbound campaigns. In exchange, broadcasts are sanctioned, multiple agents can work one number through a shared inbox, and delivery/read receipts come back per recipient — auditable numbers you can put in a review meeting.',
      'The template rule, which feels like friction, is actually the discipline that keeps read rates high: templates force you to send offers customers opted into, not spam. Millat Electronics ran their Diwali campaign this way and saw a 71% read rate — a number no SMS or email channel gets close to. If WhatsApp is where your customers answer, run it on rails that cannot be pulled out from under you.',
    ],
  },
  {
    slug: 'dlt-sms-checklist',
    title: 'DLT without tears: a working checklist for SMS campaigns that actually deliver',
    excerpt:
      'Half of failed SMS campaigns die at the operator because of DLT mismatches nobody sees. A practical checklist: entity, header, template, and the mistakes that silently kill delivery.',
    category: 'playbooks',
    publishedAt: '2026-03-10',
    paragraphs: [
      'DLT (Distributed Ledger Technology) registration was meant to curb SMS spam in India. For legitimate businesses it became a silent failure mode: campaigns that report “sent” but never reach a single phone, because a template variable ran longer than registered or a header didn’t match the route.',
      'The registration chain has three links: your entity (the business, verified once), your headers (the six-character sender IDs), and your templates (the exact message text with {#var#} placeholders). Every outbound SMS is checked against all three at the operator. Any mismatch — an extra space, a variable exceeding 30 characters, a promotional message on a transactional route — and the message is scrubbed without an error reaching you.',
      'The checklist that prevents this: register templates with generous variable placeholders; keep promotional and transactional headers strictly separate; never edit a template’s wording “just slightly” at send time; and reconcile delivery reports against sends weekly so scrubbing shows up as a number, not a mystery.',
      'EZCRM bakes this into the send path: templates and headers are stored as registered, campaigns validate against them before queuing, and per-campaign analytics show delivered versus scrubbed so a compliance problem surfaces on day one. Boring plumbing — which is exactly what compliance should be.',
    ],
  },
]
