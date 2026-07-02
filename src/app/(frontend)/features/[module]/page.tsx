import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Check } from 'lucide-react'
import { PageIntro } from '@/components/page-intro'
import { CtaBand } from '@/components/sections/cta-band'
import { TestimonialWall } from '@/components/sections/testimonial-wall'
import { JsonLd } from '@/components/json-ld'
import { modules as factoryModules, moduleCategories } from '@/content/modules'
import { getModuleBySlug, getModules, getTestimonials } from '@/lib/cms'

export const revalidate = 300

export function generateStaticParams() {
  return factoryModules.map((m) => ({ module: m.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ module: string }>
}): Promise<Metadata> {
  const { module: slug } = await params
  const module_ = await getModuleBySlug(slug)
  if (!module_) return {}
  return {
    title: `${module_.title} — ${module_.tagline}`,
    description: module_.shortDescription,
  }
}

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module: slug } = await params
  const [module_, allModules, testimonials] = await Promise.all([
    getModuleBySlug(slug),
    getModules(),
    getTestimonials(),
  ])
  if (!module_) notFound()

  const related = allModules.filter((m) => module_.related.includes(m.slug))
  const moduleTestimonials = testimonials.filter((t) => t.moduleSlug === module_.slug)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Features', item: `${siteUrl}/features` },
            {
              '@type': 'ListItem',
              position: 2,
              name: module_.title,
              item: `${siteUrl}/features/${module_.slug}`,
            },
          ],
        }}
      />

      <PageIntro
        kicker={`Features · ${moduleCategories[module_.category].label}`}
        title={module_.tagline}
        lede={module_.shortDescription}
      />

      <div className="shell grid gap-12 pb-20 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-12">
          {module_.problem ? (
            <section aria-labelledby="problem-heading">
              <h2 id="problem-heading" className="kicker mb-3">
                The problem it removes
              </h2>
              <p className="max-w-2xl border-l-2 border-due/60 pl-5 text-lg leading-relaxed text-bright">
                {module_.problem}
              </p>
            </section>
          ) : null}

          {module_.howItWorks.length > 0 ? (
            <section aria-labelledby="how-heading">
              <h2 id="how-heading" className="kicker mb-5">
                How it works, day to day
              </h2>
              <ol className="space-y-4">
                {module_.howItWorks.map((step, i) => (
                  <li key={i} className="panel-frame flex gap-4 p-5">
                    <span className="font-mono text-sm font-semibold tabular-nums text-marigold" aria-hidden>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="font-medium text-bright">{step.step}</h3>
                      {step.detail ? (
                        <p className="mt-1 text-sm leading-relaxed text-fog">{step.detail}</p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {module_.metric ? (
            <section aria-labelledby="metric-heading" className="panel-frame p-6">
              <h2 id="metric-heading" className="kicker mb-4">
                {module_.metric.caption}
              </h2>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <p className="font-mono text-lg tabular-nums text-fog line-through decoration-due/70">
                  {module_.metric.before}
                </p>
                <ArrowRight className="h-4 w-4 text-fog" aria-hidden />
                <p className="font-mono text-lg font-semibold tabular-nums text-won">
                  {module_.metric.after}
                </p>
              </div>
            </section>
          ) : null}

          {moduleTestimonials.length > 0 ? (
            <section aria-label="What customers say">
              <TestimonialWall testimonials={moduleTestimonials} />
            </section>
          ) : null}
        </div>

        <aside className="space-y-8 lg:pt-2">
          <section aria-labelledby="capabilities-heading" className="panel-frame p-5">
            <h2 id="capabilities-heading" className="kicker mb-4">
              Everything included
            </h2>
            <ul className="space-y-2.5">
              {module_.capabilities.map((capability) => (
                <li key={capability} className="flex gap-2.5 text-sm text-fog">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-won" aria-hidden />
                  {capability}
                </li>
              ))}
            </ul>
          </section>

          {related.length > 0 ? (
            <section aria-labelledby="related-heading">
              <h2 id="related-heading" className="kicker mb-3">
                Works together with
              </h2>
              <ul className="space-y-2">
                {related.map((m) => (
                  <li key={m.slug}>
                    <Link
                      href={`/features/${m.slug}`}
                      className="block rounded-chip border border-line px-4 py-3 text-sm text-bright transition-colors hover:border-marigold/60 hover:text-marigold"
                    >
                      {m.title}
                      <span className="mt-0.5 block text-xs text-fog">{m.tagline}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </aside>
      </div>

      <CtaBand
        heading={`See ${module_.title} on your own data.`}
        subheading="Bring a real lead list to the demo — we’ll run it through live."
      />
    </>
  )
}
