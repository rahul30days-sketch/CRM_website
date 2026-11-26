'use client'

/**
 * Homepage section: Dashboard & analytics — the dark "product moment".
 *
 * A night section holding a working sales dashboard (filters, eight KPIs,
 * trend, funnel, source and salesperson performance, recent activity), all
 * computed live from the shared sample dataset. The window assembles once
 * on scroll; after that it is a usable dashboard, not decoration.
 * Accessibility and motion behaviour are documented in
 * src/components/dashboard/sales-dashboard.tsx.
 */

import { SampleBadge, SectionHeader } from '@/components/demo/kit'
import { SalesDashboard } from '@/components/dashboard/sales-dashboard'

export function ExplodedDashboard() {
  return (
    <section aria-labelledby="dashboard-title" className="relative isolate overflow-hidden bg-sky py-16 lg:py-24">
      {/* One very soft brand wash behind the window, for depth. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[32rem] w-[56rem] max-w-[140%] -translate-x-1/2 rounded-full bg-brand/5 blur-3xl"
      />
      <div className="shell">
        <SectionHeader
          tone="light"
          id="dashboard-title"
          kicker="Dashboard & analytics"
          title={<>Don&rsquo;t just see your numbers. See your business moving.</>}
          lede="Pick a period, a salesperson, a lead source or a region. Every tile and chart below recalculates from the same sample leads."
        />
        <div className="mt-6 flex justify-center">
          <SampleBadge tone="light" />
        </div>

        <div className="mt-10 lg:mt-14">
          <SalesDashboard />
        </div>

        <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-slate">
          Conversion rate is won ÷ decided (won + lost) leads in the selected view. Weighted forecast multiplies each open
          deal by its stage probability (New 10%, Qualified 25%, Proposal 50%, Negotiation 75%).
        </p>
      </div>
    </section>
  )
}
