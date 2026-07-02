import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageIntro } from '@/components/page-intro'
import { CtaBand } from '@/components/sections/cta-band'
import { JsonLd } from '@/components/json-ld'
import { caseStudies as factoryCaseStudies } from '@/content/stories'
import { getCaseStudy } from '@/lib/cms'

export const revalidate = 300

export function generateStaticParams() {
  return factoryCaseStudies.map((cs) => ({ slug: cs.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const cs = await getCaseStudy(slug)
  if (!cs) return {}
  return { title: `${cs.client} — customer story`, description: cs.summary }
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cs = await getCaseStudy(slug)
  if (!cs) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Customers', item: `${siteUrl}/customers` },
            { '@type': 'ListItem', position: 2, name: cs.client, item: `${siteUrl}/customers/${cs.slug}` },
          ],
        }}
      />

      <PageIntro kicker={cs.industry} title={cs.client} lede={cs.summary} />

      <div className="shell max-w-4xl pb-20">
        <dl className="mb-12 grid gap-4 border-y border-line py-6 sm:grid-cols-3">
          {cs.metrics.map((metric) => (
            <div key={metric.label}>
              <dd className="font-mono text-2xl font-semibold tabular-nums text-marigold">
                {metric.value}
              </dd>
              <dt className="mt-1 font-mono text-[0.625rem] uppercase tracking-wider text-fog">
                {metric.label}
              </dt>
            </div>
          ))}
        </dl>

        <div className="space-y-10">
          {[
            { heading: 'The situation', text: cs.challenge },
            { heading: 'The setup', text: cs.solution },
            { heading: 'What changed', text: cs.results },
          ].map((section) => (
            <section key={section.heading} aria-label={section.heading}>
              <h2 className="kicker mb-3">{section.heading}</h2>
              <p className="text-lg leading-relaxed text-bright">{section.text}</p>
            </section>
          ))}
        </div>
      </div>

      <CtaBand heading={`Run your floor like ${cs.client.split(' ')[0]} does.`} />
    </>
  )
}
