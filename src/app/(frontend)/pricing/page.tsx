import type { Metadata } from 'next'
import { PageIntro } from '@/components/page-intro'
import { FaqList } from '@/components/sections/faq-list'
import { CtaBand } from '@/components/sections/cta-band'
import { JsonLd } from '@/components/json-ld'
import { getFaqs, getPricingAddons, getPricingPlans } from '@/lib/cms'
import { PricingExplorer } from '@/components/pricing/pricing-explorer'
import { BUSINESS } from '@/content/business'

const inr = (n: number) => new Intl.NumberFormat('en-IN').format(n)

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Pricing — plans in rupees, billed quarterly or yearly',
  description: `EZCRM pricing for Indian sales teams: Free, Starter, Pro and Enterprise plans in rupees, with included users, add-ons and a ${BUSINESS.trialDays}-day free trial. Estimate the cost for your team size.`,
  alternates: { canonical: '/pricing' },
}

export default async function PricingPage() {
  const [plans, pricingFaqs, addons] = await Promise.all([
    getPricingPlans(),
    getFaqs('pricing'),
    getPricingAddons(),
  ])

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: pricingFaqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }}
      />

      <PageIntro
        kicker="Pricing"
        title="Simple plans, in rupees."
        lede={`Each plan includes a set number of users — add more as your team grows. Start with a ${BUSINESS.trialDays}-day free trial of the full feature set.`}
      />

      <div className="shell pb-20 pt-12">
        <PricingExplorer plans={plans} addons={addons} />

        {/* Add-on pricing */}
        {addons.length > 0 ? (
          <section className="panel-frame mt-8 p-6 sm:p-8" aria-labelledby="addons-heading">
            <h2 id="addons-heading" className="kicker mb-5">
              Add-on Pricing
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {addons.map((a) => (
                <div
                  key={a.name}
                  className="flex items-baseline justify-between gap-3 rounded-chip border border-line bg-sky/40 px-4 py-3.5"
                >
                  <span className="text-sm font-medium text-ink">{a.name}</span>
                  <span className="shrink-0 font-mono text-sm font-semibold tabular-nums text-brand">
                    ₹{inr(a.price)}
                    <span className="font-normal text-slate"> {a.unit}</span>
                  </span>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <p className="mt-6 text-center text-sm text-slate">
          WhatsApp conversation charges and SMS/DLT costs depend on usage and are billed separately.
          Taxes as applicable.
        </p>

        <section className="mx-auto mt-16 max-w-3xl" aria-labelledby="pricing-faq">
          <h2 id="pricing-faq" className="kicker mb-4">
            Pricing questions
          </h2>
          <FaqList faqs={pricingFaqs} />
        </section>
      </div>

      <CtaBand
        heading="Running more than one branch?"
        subheading="Multi-branch and white-label set-ups are priced on your structure — branches, roles and branding. Twenty minutes with us beats a pricing page."
        primaryLabel="Talk to sales"
        primaryHref="/contact"
        secondaryLabel="Book a demo"
        secondaryHref="/demo"
      />
    </>
  )
}
