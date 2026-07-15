import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageIntro } from '@/components/page-intro'
import { CtaBand } from '@/components/sections/cta-band'
import { getComparisons } from '@/lib/cms'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'EZCRM compared — honest alternatives for Indian sales teams',
  description:
    'How EZCRM compares to Zoho CRM, Freshsales, Kylas and the classic Excel + WhatsApp setup — feature by feature, with the honest trade-offs.',
}

export default async function ComparisonsIndexPage() {
  const comparisons = await getComparisons()

  return (
    <>
      <PageIntro
        kicker="Compare"
        title="EZCRM vs the alternatives."
        lede="No strawmen. Here's where EZCRM wins for an Indian sales team, and where another tool might fit you better — feature by feature."
      />

      <div className="shell max-w-4xl space-y-4 pb-20">
        {comparisons.map((c) => (
          <Link
            key={c.slug}
            href={`/vs/${c.slug}`}
            className="panel-frame group flex items-center justify-between gap-6 p-6 transition-colors hover:border-brand/60"
          >
            <div>
              <h2 className="font-display text-xl font-bold text-ink group-hover:text-brand">
                {c.heading}
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate">{c.lede}</p>
            </div>
            <ArrowRight
              className="hidden h-5 w-5 shrink-0 text-slate transition-transform group-hover:translate-x-1 group-hover:text-brand sm:block"
              aria-hidden
            />
          </Link>
        ))}
      </div>

      <CtaBand
        heading="The fastest comparison is a live one."
        subheading="Book a 30-minute demo and judge EZCRM on your own leads, not a table."
      />
    </>
  )
}
