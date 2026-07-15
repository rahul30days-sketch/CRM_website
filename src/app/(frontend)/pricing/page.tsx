import type { Metadata } from 'next'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { PageIntro } from '@/components/page-intro'
import { FaqList } from '@/components/sections/faq-list'
import { CtaBand } from '@/components/sections/cta-band'
import { JsonLd } from '@/components/json-ld'
import { buttonVariants } from '@/components/ui/button'
import { getFaqs, getPricingAddons, getPricingPlans } from '@/lib/cms'
import { cn } from '@/lib/utils'

const inr = (n: number) => new Intl.NumberFormat('en-IN').format(n)

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Pricing — per user, in rupees, no surprises',
  description:
    'EZCRM pricing for Indian sales teams. Per-user monthly plans, yearly discount, 14-day free trial on the full Floor plan. White-label reseller terms available.',
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
        title="Per user, per month, in rupees."
        lede="Every plan includes the dashboard, mobile access, role-based permissions and data export. The trial runs on the full Floor plan for 14 days — no card required."
      />

      <div className="shell pb-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => {
            const isFree = plan.priceMonthly === 0
            const hasPrice = plan.priceMonthly !== null && plan.priceMonthly !== undefined
            return (
              <section
                key={plan.name}
                aria-label={`${plan.name} plan`}
                className={cn(
                  'panel-frame relative flex flex-col p-6',
                  plan.mostPopular && 'border-brand/60',
                )}
              >
                {plan.mostPopular ? (
                  <p className="absolute -top-3 left-6 rounded-chip bg-brand px-2.5 py-0.5 font-mono text-[0.625rem] font-semibold uppercase tracking-wider text-white">
                    Most teams pick this
                  </p>
                ) : null}
                <h2 className="font-display text-2xl font-bold text-ink">{plan.name}</h2>
                <p className="mt-1 text-sm text-slate">{plan.forWhom}</p>

                <div className="mt-6 border-y border-line py-5">
                  {isFree ? (
                    <p className="font-display text-3xl font-bold text-ink">Free</p>
                  ) : hasPrice ? (
                    <p className="font-mono text-4xl font-semibold tabular-nums text-ink">
                      ₹{inr(plan.priceMonthly as number)}
                      <span className="text-base font-normal text-slate"> /mo</span>
                    </p>
                  ) : (
                    <p className="font-mono text-3xl font-semibold text-ink">Custom</p>
                  )}

                  {plan.priceYearly ? (
                    <p className="mt-1.5 font-mono text-xs tabular-nums text-slate">
                      or ₹{inr(plan.priceYearly)}/year
                    </p>
                  ) : null}
                  {plan.trialText ? (
                    <p className="mt-1.5 font-mono text-xs font-semibold text-brand">
                      {plan.trialText}
                    </p>
                  ) : null}
                  {plan.limitsNote ? (
                    <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-wider text-slate">
                      {plan.limitsNote}
                    </p>
                  ) : null}
                </div>

                {/* Quotas — tabular so the numbers line up across cards */}
                {plan.limits.length > 0 ? (
                  <dl className="my-5 space-y-2">
                    {plan.limits.map((l) => (
                      <div key={l.label} className="flex items-baseline justify-between gap-3">
                        <dt className="text-sm text-slate">{l.label}</dt>
                        <dd className="font-mono text-sm font-semibold tabular-nums text-ink">
                          {l.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}

                <ul className="mb-6 flex-1 space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2.5 text-sm text-slate">
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
            )
          })}
        </div>

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
