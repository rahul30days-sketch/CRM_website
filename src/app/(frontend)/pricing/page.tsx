import type { Metadata } from 'next'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { PageIntro } from '@/components/page-intro'
import { FaqList } from '@/components/sections/faq-list'
import { CtaBand } from '@/components/sections/cta-band'
import { JsonLd } from '@/components/json-ld'
import { buttonVariants } from '@/components/ui/button'
import { getFaqs, getPricingPlans } from '@/lib/cms'
import { cn } from '@/lib/utils'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Pricing — per user, in rupees, no surprises',
  description:
    'EZCRM pricing for Indian sales teams. Per-user monthly plans, yearly discount, 14-day free trial on the full Floor plan. White-label reseller terms available.',
}

export default async function PricingPage() {
  const [plans, pricingFaqs] = await Promise.all([getPricingPlans(), getFaqs('pricing')])

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
        title="Per user, per month, in rupees."
        lede="Every plan includes the dashboard, mobile access, role-based permissions and data export. The trial runs on the full Floor plan for 14 days — no card required."
      />

      <div className="shell pb-20">
        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <section
              key={plan.name}
              aria-label={`${plan.name} plan`}
              className={cn(
                'panel-frame relative flex flex-col p-6',
                plan.mostPopular && 'border-marigold/60',
              )}
            >
              {plan.mostPopular ? (
                <p className="absolute -top-3 left-6 rounded-chip bg-marigold px-2.5 py-0.5 font-mono text-[0.625rem] font-semibold uppercase tracking-wider text-console">
                  Most teams pick this
                </p>
              ) : null}
              <h2 className="font-display text-2xl font-bold text-bright">{plan.name}</h2>
              <p className="mt-1 text-sm text-fog">{plan.forWhom}</p>

              <div className="mt-6 border-y border-line py-5">
                {plan.priceMonthly !== null ? (
                  <>
                    <p className="font-mono text-4xl font-semibold tabular-nums text-bright">
                      ₹{plan.priceMonthly}
                      <span className="text-base font-normal text-fog"> /user/mo</span>
                    </p>
                    {plan.priceYearly !== null ? (
                      <p className="mt-1.5 font-mono text-xs tabular-nums text-won">
                        ₹{plan.priceYearly}/user/mo billed yearly
                      </p>
                    ) : null}
                  </>
                ) : (
                  <p className="font-mono text-3xl font-semibold text-bright">Custom</p>
                )}
                <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-wider text-fog">
                  {plan.limitsNote}
                </p>
              </div>

              <ul className="my-6 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5 text-sm text-fog">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-won" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.cta.href}
                className={cn(
                  buttonVariants({ variant: plan.mostPopular ? 'primary' : 'secondary' }),
                  'w-full',
                )}
              >
                {plan.cta.label}
              </Link>
            </section>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-fog">
          WhatsApp conversation charges and SMS/DLT costs are billed at operator rates — we don’t
          mark them up.
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
        subheading="Command plans are priced on your structure — branches, roles and white-label needs. Twenty minutes with us beats a pricing page."
        primaryLabel="Talk to sales"
        primaryHref="/contact"
        secondaryLabel="Book a demo"
        secondaryHref="/demo"
      />
    </>
  )
}
