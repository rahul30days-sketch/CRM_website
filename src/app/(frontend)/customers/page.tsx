import type { Metadata } from 'next'
import { BUSINESS } from '@/content/business'
import { UnverifiedNotice } from '@/components/unverified-notice'
import Link from 'next/link'
import { PageIntro } from '@/components/page-intro'
import { CtaBand } from '@/components/sections/cta-band'
import { getCaseStudies } from '@/lib/cms'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Customer stories — how sales teams run on EZCRM',
  description:
    'How manufacturers, developers and dealers across India run their sales on EZCRM — the problem, the setup and what changed.',
  alternates: { canonical: '/customers' },
  // Kept out of search until the stories are verified (see content/business.ts).
  ...(BUSINESS.socialProofVerified ? {} : { robots: { index: false, follow: true } }),
}

export default async function CustomersPage() {
  const caseStudies = await getCaseStudies()

  return (
    <>
      <PageIntro
        kicker="Customers"
        title="How sales teams run on EZCRM."
        lede="Each story names the problem, the setup, and what changed."
      />

      <div className="shell space-y-5 pb-20">
        {BUSINESS.socialProofVerified ? null : <UnverifiedNotice />}
        {caseStudies.map((cs) => (
          <Link
            key={cs.slug}
            href={`/customers/${cs.slug}`}
            className="panel-frame group grid gap-6 p-6 transition-colors hover:border-brand/60 md:grid-cols-[1fr_auto]"
          >
            <div>
              <p className="kicker mb-2">{cs.industry}</p>
              <h2 className="font-display text-2xl font-bold text-ink group-hover:text-brand">
                {cs.client}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate">{cs.summary}</p>
            </div>
            <dl className="flex gap-8 md:flex-col md:gap-4 md:border-l md:border-line md:pl-6">
              {cs.metrics.slice(0, 2).map((metric) => (
                <div key={metric.label}>
                  <dt className="order-2 font-mono text-[0.625rem] uppercase tracking-wider text-slate">
                    {metric.label}
                  </dt>
                  <dd className="font-mono text-xl font-semibold tabular-nums text-brand">
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
