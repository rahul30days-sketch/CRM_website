import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatINR } from '@/lib/gst'
import { BUSINESS } from '@/content/business'
import type { PricingPlanContent } from '@/content/site'

/**
 * Homepage pricing preview. Reads the same plan data as /pricing, so the two
 * can never disagree. Same presentation as the pricing page.
 */
export function PricingPreview({ plans }: { plans: PricingPlanContent[] }) {
  return (
    <section className="border-y border-line bg-sky/40" aria-labelledby="pricing-preview-heading">
      <div className="shell py-16 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="kicker mb-3">Pricing</p>
            <h2
              id="pricing-preview-heading"
              className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
            >
              Plans in rupees. Start free.
            </h2>
            <p className="mt-3 text-lg text-slate">
              Every plan includes a set number of users, with more added as you grow.{' '}
              {BUSINESS.trialDays}-day free trial of the full feature set.
            </p>
          </div>
          <Link href="/pricing" className={cn(buttonVariants({ variant: 'secondary' }))}>
            Compare plans
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => {
            const users = p.limits.find((l) => l.label.toLowerCase() === 'users')?.value
            return (
              <li
                key={p.name}
                className={cn(
                  'rounded-card border bg-white p-5',
                  p.mostPopular ? 'border-brand shadow-glass' : 'border-line shadow-soft',
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-display text-lg font-bold text-ink">{p.name}</p>
                  {p.mostPopular ? (
                    <span className="rounded-full bg-brand px-2.5 py-0.5 text-[0.6875rem] font-bold uppercase tracking-wider text-white">
                      Most teams pick this
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 font-mono text-2xl font-semibold tabular-nums text-ink">
                  {p.priceMonthly === 0 ? '₹0' : p.priceMonthly ? formatINR(p.priceMonthly) : 'Custom'}
                  {p.priceMonthly ? <span className="text-sm font-normal text-slate">/mo</span> : null}
                </p>
                <p className="mt-1 text-xs text-slate">
                  {p.priceMonthly === 0
                    ? `Forever free, ${BUSINESS.trialDays}-day full-feature trial`
                    : p.priceQuarterly && p.priceYearly
                      ? `${formatINR(p.priceQuarterly)}/qtr or ${formatINR(p.priceYearly)}/yr`
                      : ''}
                </p>
                {users ? (
                  <p className="mt-3 text-sm text-slate">
                    <span className="font-mono font-semibold text-ink">{users}</span>{' '}
                    {users === '1' ? 'user' : 'users'} included
                  </p>
                ) : null}
              </li>
            )
          })}
        </ul>
        <p className="mt-4 text-xs text-slate">Taxes as applicable. WhatsApp and SMS usage billed separately.</p>
      </div>
    </section>
  )
}
