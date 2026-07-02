import type { Metadata } from 'next'
import { PageIntro } from '@/components/page-intro'
import { CtaBand } from '@/components/sections/cta-band'

export const metadata: Metadata = {
  title: 'About — why EZCRM exists',
  description:
    'EZCRM was built for the Indian sales floor: portal leads, WhatsApp-first customers, GST paperwork and teams that live on their phones.',
}

const PRINCIPLES = [
  {
    title: 'Build for the floor, not the boardroom',
    body: 'The person who decides whether a CRM survives is the telecaller with 40 follow-ups due, not the consultant who chose it. Every screen is designed for that person first.',
  },
  {
    title: 'India is the spec, not a locale setting',
    body: 'IndiaMART and JustDial connectors, DLT-compliant SMS, official WhatsApp API, GST-correct quotations with HSN codes, lakhs and crores in the formatting. These aren’t integrations bolted on for a market — they’re the reason the product exists.',
  },
  {
    title: 'Numbers you can trust beat features you can list',
    body: 'A dashboard is only useful if nobody argues with it. Data-scoped access, an append-only audit trail and one source of record mean the Monday meeting starts from the same numbers for everyone.',
  },
  {
    title: 'No hostages',
    body: 'Full data export for every customer, always. We’d rather keep you with a product that works than with data you can’t take out.',
  },
]

export default function AboutPage() {
  return (
    <>
      <PageIntro
        kicker="About"
        title="Built by people who’ve sat on the sales floor."
        lede="EZCRM started when we watched a Rajkot manufacturer lose a ₹4 lakh order because the IndiaMART enquiry email was read a day late. The global CRMs weren’t built for that problem. So we built one that was."
      />

      <div className="shell max-w-4xl space-y-12 pb-20">
        <section aria-label="Our story" className="space-y-4 text-lg leading-relaxed text-bright/90">
          <p>
            Indian SMB sales runs on a stack the big CRM vendors have never seen: portal
            subscriptions that cost real money, customers who reply on WhatsApp within minutes but
            never open email, GST paperwork on every quotation, and teams where the owner is also
            the sales head, the collections department and the after-sales desk.
          </p>
          <p>
            EZCRM 3.0 is our answer: fourteen modules that behave like one product, priced in
            rupees per user, fast on a mid-range phone over patchy 4G. Today it runs sales floors
            in manufacturing, real estate, distribution and services across India — from
            three-person desks to multi-branch operations under white-label reseller brands.
          </p>
        </section>

        <section aria-labelledby="principles-heading">
          <h2 id="principles-heading" className="kicker mb-6">
            What we optimize for
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {PRINCIPLES.map((principle) => (
              <div key={principle.title} className="panel-frame p-6">
                <h3 className="font-display text-lg font-bold text-bright">{principle.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fog">{principle.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <CtaBand
        heading="See what we mean."
        subheading="The fastest way to judge us is to watch your own leads move through the product."
      />
    </>
  )
}
