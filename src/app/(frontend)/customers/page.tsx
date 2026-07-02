import type { Metadata } from 'next'
import Link from 'next/link'
import { PageIntro } from '@/components/page-intro'
import { CtaBand } from '@/components/sections/cta-band'
import { getCaseStudies } from '@/lib/cms'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Customers — field reports from real sales floors',
  description:
    'How manufacturers, developers and dealers across India run their sales on EZCRM — with the before/after numbers.',
}

export default async function CustomersPage() {
  const caseStudies = await getCaseStudies()

  return (
    <>
      <PageIntro
        kicker="Customers"
        title="Field reports, with the numbers attached."
        lede="Every story below names the problem, the setup, and what changed — measured. If your business looks like one of these, the results probably transfer."
      />

      <div className="shell space-y-5 pb-20">
        {caseStudies.map((cs) => (
          <Link
            key={cs.slug}
            href={`/customers/${cs.slug}`}
            className="panel-frame group grid gap-6 p-6 transition-colors hover:border-marigold/60 md:grid-cols-[1fr_auto]"
          >
            <div>
              <p className="kicker mb-2">{cs.industry}</p>
              <h2 className="font-display text-2xl font-bold text-bright group-hover:text-marigold">
                {cs.client}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fog">{cs.summary}</p>
            </div>
            <dl className="flex gap-8 md:flex-col md:gap-4 md:border-l md:border-line md:pl-6">
              {cs.metrics.slice(0, 2).map((metric) => (
                <div key={metric.label}>
                  <dt className="order-2 font-mono text-[0.625rem] uppercase tracking-wider text-fog">
                    {metric.label}
                  </dt>
                  <dd className="font-mono text-xl font-semibold tabular-nums text-marigold">
                    {metric.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Link>
        ))}
      </div>

      <CtaBand
        heading="Want results like these?"
        subheading="Tell us your lead sources and team size — we’ll show you the closest setup live."
      />
    </>
  )
}
