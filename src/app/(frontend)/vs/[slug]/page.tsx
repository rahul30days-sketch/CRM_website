import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Check, Minus, X } from 'lucide-react'
import { PageIntro } from '@/components/page-intro'
import { CtaBand } from '@/components/sections/cta-band'
import { JsonLd } from '@/components/json-ld'
import { buttonVariants } from '@/components/ui/button'
import { comparisons as factoryComparisons, type CompareValue } from '@/content/comparisons'
import { getComparison } from '@/lib/cms'
import { cn } from '@/lib/utils'

export const revalidate = 300

export function generateStaticParams() {
  return factoryComparisons.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const c = await getComparison(slug)
  if (!c) return {}
  return {
    title: `${c.heading} — an honest comparison`,
    description: c.lede,
  }
}

function Cell({ value }: { value: CompareValue }) {
  if (value === 'yes')
    return (
      <span className="inline-flex items-center justify-center rounded-full bg-won/10 p-1 text-won">
        <Check className="h-4 w-4" aria-label="Yes" />
      </span>
    )
  if (value === 'partial')
    return (
      <span className="inline-flex items-center justify-center rounded-full bg-slate/10 p-1 text-slate">
        <Minus className="h-4 w-4" aria-label="Partial" />
      </span>
    )
  return (
    <span className="inline-flex items-center justify-center rounded-full bg-due/10 p-1 text-due">
      <X className="h-4 w-4" aria-label="No" />
    </span>
  )
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const c = await getComparison(slug)
  if (!c) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Compare', item: `${siteUrl}/vs` },
            { '@type': 'ListItem', position: 2, name: c.heading, item: `${siteUrl}/vs/${c.slug}` },
          ],
        }}
      />
      {c.faqs.length > 0 ? (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: c.faqs.map((f) => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: { '@type': 'Answer', text: f.answer },
            })),
          }}
        />
      ) : null}

      <PageIntro kicker={c.kicker} title={c.heading} lede={c.lede} />

      <div className="shell max-w-5xl space-y-16 pb-20">
        {/* Verdict */}
        {c.verdict ? (
          <section className="panel-frame p-6 sm:p-8" aria-label="Verdict">
            <p className="kicker mb-3">The short version</p>
            <p className="text-lg leading-relaxed text-ink">{c.verdict}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/demo" className={buttonVariants({ size: 'lg' })}>
                Book a demo
              </Link>
              <Link
                href="/pricing"
                className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }))}
              >
                See pricing
              </Link>
            </div>
          </section>
        ) : null}

        {/* Who each is for */}
        <section className="grid gap-5 md:grid-cols-2" aria-label="Who each is for">
          <div className="panel-frame border-brand/30 p-6">
            <h2 className="kicker mb-4">Choose EZCRM when</h2>
            <ul className="space-y-2.5">
              {c.ezcrmWinsWhen.map((p) => (
                <li key={p} className="flex gap-3 text-sm text-slate">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-won" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="panel-frame p-6">
            <h2 className="kicker mb-4">{c.competitor} may fit when</h2>
            <ul className="space-y-2.5">
              {c.competitorFitsWhen.map((p) => (
                <li key={p} className="flex gap-3 text-sm text-slate">
                  <Minus className="mt-0.5 h-4 w-4 shrink-0 text-slate" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Feature comparison table */}
        <section aria-labelledby="table-heading">
          <h2 id="table-heading" className="mb-5 font-display text-2xl font-bold text-ink">
            Feature by feature
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-line">
                  <th className="py-3 pr-4 text-sm font-semibold text-slate">Capability</th>
                  <th className="w-24 py-3 text-center font-display text-sm font-bold text-brand">
                    EZCRM
                  </th>
                  <th className="w-32 py-3 text-center text-sm font-semibold text-slate">
                    {c.competitor}
                  </th>
                </tr>
              </thead>
              <tbody>
                {c.rows.map((row) => (
                  <tr key={row.feature} className="border-b border-line/60 align-top">
                    <td className="py-3 pr-4 text-sm text-ink">
                      {row.feature}
                      {row.note ? (
                        <span className="mt-0.5 block text-xs text-slate">{row.note}</span>
                      ) : null}
                    </td>
                    <td className="py-3 text-center">
                      <Cell value={row.ezcrm} />
                    </td>
                    <td className="py-3 text-center">
                      <Cell value={row.competitor} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate">
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-won" /> Built in
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Minus className="h-3.5 w-3.5 text-slate" /> Partial / via add-on
            </span>
            <span className="inline-flex items-center gap-1.5">
              <X className="h-3.5 w-3.5 text-due" /> Not available
            </span>
          </p>
        </section>

        {/* Differentiators */}
        {c.differentiators.length > 0 ? (
          <section aria-labelledby="diff-heading">
            <h2 id="diff-heading" className="mb-6 font-display text-2xl font-bold text-ink">
              Why Indian sales teams pick EZCRM
            </h2>
            <div className="grid gap-5 sm:grid-cols-3">
              {c.differentiators.map((d) => (
                <div key={d.title} className="panel-frame p-6">
                  <h3 className="font-display text-lg font-bold text-ink">{d.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate">{d.detail}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* Migration */}
        {c.migration ? (
          <section className="panel-frame p-6 sm:p-8" aria-label="Migration">
            <h2 className="kicker mb-3">Switching from {c.competitor}?</h2>
            <p className="text-lg leading-relaxed text-ink">{c.migration}</p>
          </section>
        ) : null}

        {/* FAQ */}
        {c.faqs.length > 0 ? (
          <section aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="mb-4 font-display text-2xl font-bold text-ink">
              Common questions
            </h2>
            <div className="divide-y divide-line border-y border-line">
              {c.faqs.map((f) => (
                <details key={f.question} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-medium text-ink hover:text-brand [&::-webkit-details-marker]:hidden">
                    {f.question}
                    <span
                      aria-hidden
                      className="shrink-0 font-mono text-lg text-slate transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="pb-5 pr-8 text-sm leading-relaxed text-slate">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <CtaBand
        heading={`See EZCRM do what ${c.competitor} makes hard.`}
        subheading="A 30-minute demo on your own lead sources, WhatsApp number and pipeline stages."
      />
    </>
  )
}
