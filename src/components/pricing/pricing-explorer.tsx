'use client'

/**
 * Pricing explorer: billing-period toggle, plan cards, comparison table and
 * a team-size cost estimator. Every figure is derived from the published plan
 * data (CMS → src/content/site.ts fallback); nothing here invents a price.
 *
 * Billing model, as the plan data describes it: each plan is a price for the
 * account, billed quarterly or yearly, and includes a number of users.
 * Extra users are the "Additional User" add-on, per user per month.
 */

import * as React from 'react'
import Link from 'next/link'
import { Check, Minus } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatINR } from '@/lib/gst'
import { track } from '@/lib/analytics'
import type { PricingAddonContent, PricingPlanContent } from '@/content/site'

type Period = 'quarterly' | 'yearly'
const MONTHS: Record<Period, number> = { quarterly: 3, yearly: 12 }

function periodPrice(plan: PricingPlanContent, period: Period) {
  return period === 'quarterly' ? plan.priceQuarterly : plan.priceYearly
}

function includedUsers(plan: PricingPlanContent) {
  const v = plan.limits.find((l) => l.label.toLowerCase() === 'users')?.value
  const n = v ? parseInt(v.replace(/[^\d]/g, ''), 10) : NaN
  return Number.isFinite(n) ? n : null
}

/** Yearly saving vs four quarters, as a whole percentage. */
function yearlySaving(plan: PricingPlanContent) {
  if (!plan.priceQuarterly || !plan.priceYearly) return null
  const quarters = plan.priceQuarterly * 4
  const pct = Math.round(((quarters - plan.priceYearly) / quarters) * 100)
  return pct > 0 ? pct : null
}

export function PricingExplorer({
  plans,
  addons,
}: {
  plans: PricingPlanContent[]
  addons: PricingAddonContent[]
}) {
  const userAddon = addons.find((a) => /user/i.test(a.name))
  const paid = plans.filter((p) => p.priceQuarterly || p.priceYearly)

  return (
    <div>
      {/* Plan cards — same presentation as the EZCRM billing page */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => {
          const isFree = plan.priceMonthly === 0
          const saving = yearlySaving(plan)
          return (
            <section
              key={plan.name}
              aria-labelledby={`plan-${plan.name}`}
              className={cn(
                'relative flex flex-col rounded-card border bg-white p-6 shadow-soft',
                plan.mostPopular ? 'border-2 border-brand shadow-glass' : 'border-line',
              )}
            >
              {plan.mostPopular ? (
                <p className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-4 py-1 text-[0.6875rem] font-bold uppercase tracking-wider text-white">
                  Most teams pick this
                </p>
              ) : null}
              <h2 id={`plan-${plan.name}`} className="kicker">
                {plan.name}
              </h2>

              <div className="mt-3">
                {isFree ? (
                  <p className="font-display text-4xl font-extrabold text-ink">₹0</p>
                ) : plan.priceMonthly ? (
                  <p className="font-display text-4xl font-extrabold tabular-nums text-ink">
                    {formatINR(plan.priceMonthly)}
                    <span className="text-base font-medium text-slate">/mo</span>
                  </p>
                ) : (
                  <p className="font-display text-3xl font-extrabold text-ink">Custom</p>
                )}
                <p className="mt-2 text-sm text-slate">
                  {isFree
                    ? plan.limitsNote || plan.trialText
                    : plan.priceQuarterly && plan.priceYearly
                      ? `${formatINR(plan.priceQuarterly)}/qtr or ${formatINR(plan.priceYearly)}/yr`
                      : plan.forWhom}
                </p>
                {saving ? (
                  <p className="mt-1 text-xs font-semibold text-won">Save {saving}% with yearly billing</p>
                ) : null}
              </div>

              {plan.limits.length > 0 ? (
                <dl className="my-6 divide-y divide-line">
                  {plan.limits.map((l) => (
                    <div key={l.label} className="flex items-baseline justify-between gap-3 py-3">
                      <dt className="text-sm text-slate">{l.label}</dt>
                      <dd className="font-mono text-sm font-semibold tabular-nums text-ink">{l.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {plan.features.length > 0 ? (
                <ul className="mb-6 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2.5 text-sm text-slate">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-won" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-auto pt-2">
                <Link
                  href={plan.cta.href}
                  onClick={() => track('pricing_plan_selected', { plan: plan.name })}
                  className={cn(buttonVariants({ variant: plan.mostPopular ? 'primary' : 'secondary', size: 'lg' }), 'w-full rounded-full')}
                >
                  {plan.cta.label}
                </Link>
              </div>
            </section>
          )
        })}
      </div>

      {/* Comparison table */}
      <ComparisonTable plans={plans} />

      {/* Estimator */}
      {userAddon ? <TeamEstimator plans={paid} userAddon={userAddon} /> : null}
    </div>
  )
}

function ComparisonTable({ plans }: { plans: PricingPlanContent[] }) {
  const rows = Array.from(new Set(plans.flatMap((p) => p.limits.map((l) => l.label))))
  if (rows.length === 0) return null
  return (
    <section aria-labelledby="compare-heading" className="mt-16">
      <h2 id="compare-heading" className="font-display text-2xl font-bold text-ink">
        Compare plans
      </h2>
      <div className="mt-5 overflow-x-auto rounded-card border border-line bg-white">
        <table className="w-full min-w-[36rem] text-sm">
          <caption className="sr-only">What each plan includes</caption>
          <thead>
            <tr className="border-b border-line bg-sky/50">
              <th scope="col" className="px-4 py-3 text-left font-semibold text-ink">
                Included
              </th>
              {plans.map((p) => (
                <th key={p.name} scope="col" className="px-4 py-3 text-right font-semibold text-ink">
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r} className="border-b border-line last:border-0">
                <th scope="row" className="px-4 py-3 text-left font-medium text-slate">
                  {r}
                </th>
                {plans.map((p) => {
                  const v = p.limits.find((l) => l.label === r)?.value
                  return (
                    <td key={p.name} className="px-4 py-3 text-right font-mono tabular-nums text-ink">
                      {v === undefined || v === '0' ? (
                        <>
                          <Minus className="ml-auto h-4 w-4 text-slate" aria-hidden />
                          <span className="sr-only">Not included</span>
                        </>
                      ) : (
                        v
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

/**
 * Team-size estimator: for each paid plan, plan price + extra users beyond
 * the included count at the published per-user rate, for the chosen period.
 */
function TeamEstimator({
  plans,
  userAddon,
}: {
  plans: PricingPlanContent[]
  userAddon: PricingAddonContent
}) {
  const [period, setPeriod] = React.useState<Period>('yearly')
  const [team, setTeam] = React.useState(6)
  const usedOnce = React.useRef(false)
  const months = MONTHS[period]

  const rows = plans
    .map((p) => {
      const base = periodPrice(p, period)
      const inc = includedUsers(p)
      if (!base || inc === null) return null
      const extra = Math.max(0, team - inc)
      const extraCost = extra * userAddon.price * months
      return { plan: p, base, inc, extra, extraCost, total: base + extraCost }
    })
    .filter((r): r is NonNullable<typeof r> => r !== null)
  const cheapest = rows.reduce<(typeof rows)[number] | null>((m, r) => (!m || r.total < m.total ? r : m), null)

  const onChange = (v: number) => {
    setTeam(v)
    if (!usedOnce.current) {
      usedOnce.current = true
      track('pricing_calculator_used')
    }
  }

  return (
    <section aria-labelledby="estimate-heading" className="mt-16 rounded-card border border-line bg-sky/40 p-6 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 id="estimate-heading" className="font-display text-2xl font-bold text-ink">
            Estimate for your team
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate">
            Plans include a set number of users. Extra users are {formatINR(userAddon.price)} per user per month. Pick
            your team size to see the estimated cost per {period === 'quarterly' ? 'quarter' : 'year'}.
          </p>
          <label htmlFor="team-size" className="mt-6 block text-sm font-semibold text-ink">
            Team size: <span className="font-mono tabular-nums">{team}</span> {team === 1 ? 'user' : 'users'}
          </label>
          <input
            id="team-size"
            type="range"
            min={1}
            max={50}
            value={team}
            onChange={(e) => onChange(Number(e.target.value))}
            className="mt-3 h-6 w-full cursor-pointer accent-brand"
          />
          <div className="mt-1 flex justify-between font-mono text-xs text-slate">
            <span>1</span>
            <span>50</span>
          </div>
          <div role="radiogroup" aria-label="Billing period" className="mt-6 inline-flex rounded-full border border-line bg-white p-1">
            {(['quarterly', 'yearly'] as Period[]).map((p) => (
              <button
                key={p}
                type="button"
                role="radio"
                aria-checked={period === p}
                onClick={() => setPeriod(p)}
                className={cn(
                  'h-9 rounded-full px-4 text-sm font-semibold transition-colors duration-fast',
                  period === p ? 'bg-btn-ink text-white' : 'text-slate hover:text-ink',
                )}
              >
                {p === 'quarterly' ? 'Quarterly' : 'Yearly'}
              </button>
            ))}
          </div>
        </div>
        <div>
          <ul className="space-y-2" aria-live="polite">
            {rows.map((r) => (
              <li
                key={r.plan.name}
                className={cn(
                  'flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-chip border bg-white px-4 py-3',
                  cheapest?.plan.name === r.plan.name ? 'border-brand' : 'border-line',
                )}
              >
                <span className="text-sm font-semibold text-ink">
                  {r.plan.name}
                  {cheapest?.plan.name === r.plan.name ? (
                    <span className="ml-2 rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
                      Lowest estimate
                    </span>
                  ) : null}
                </span>
                <span className="font-mono text-base font-semibold tabular-nums text-ink">
                  {formatINR(r.total)}
                  <span className="text-xs font-normal text-slate">/{period === 'quarterly' ? 'quarter' : 'year'}</span>
                </span>
                <span className="w-full font-mono text-xs tabular-nums text-slate">
                  {formatINR(r.base)} plan · {r.inc} {r.inc === 1 ? 'user' : 'users'} included
                  {r.extra > 0 ? ` · ${r.extra} extra × ${formatINR(userAddon.price)} × ${months} mo = ${formatINR(r.extraCost)}` : ''}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-slate">
            An estimate from the published prices. Taxes as applicable. Contact and storage add-ons, and WhatsApp/SMS
            usage, are extra. Your final quote comes from our team.
          </p>
        </div>
      </div>
    </section>
  )
}
