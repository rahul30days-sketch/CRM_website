import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { PageIntro } from '@/components/page-intro'
import { CtaBand } from '@/components/sections/cta-band'
import { industries } from '@/content/site'
import { getModules } from '@/lib/cms'

export const revalidate = 3600

export function generateStaticParams() {
  return industries.map((i) => ({ industry: i.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ industry: string }>
}): Promise<Metadata> {
  const { industry: slug } = await params
  const industry = industries.find((i) => i.slug === slug)
  if (!industry) return {}
  return { title: `EZCRM for ${industry.name.toLowerCase()}`, description: industry.intro }
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ industry: string }>
}) {
  const { industry: slug } = await params
  const industry = industries.find((i) => i.slug === slug)
  if (!industry) notFound()

  const allModules = await getModules()
  const featured = allModules.filter((m) => industry.modules.includes(m.slug))

  return (
    <>
      <PageIntro
        kicker={`Solutions · ${industry.name}`}
        title={industry.headline}
        lede={industry.intro}
      />

      <div className="shell max-w-4xl space-y-14 pb-20">
        <section aria-labelledby="pains-heading">
          <h2 id="pains-heading" className="kicker mb-5">
            The leaks, and where they stop
          </h2>
          <ul className="space-y-4">
            {industry.pains.map((item) => (
              <li key={item.pain} className="panel-frame grid gap-3 p-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                <p className="text-sm leading-relaxed text-due">{item.pain}</p>
                <ArrowRight className="hidden h-4 w-4 text-fog sm:block" aria-hidden />
                <p className="text-sm leading-relaxed text-won">{item.fix}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="stack-heading">
          <h2 id="stack-heading" className="kicker mb-5">
            The modules doing the work
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {featured.map((module) => (
              <Link
                key={module.slug}
                href={`/features/${module.slug}`}
                className="panel-frame group block p-5 transition-colors hover:border-marigold/60"
              >
                <h3 className="font-medium text-bright group-hover:text-marigold">{module.title}</h3>
                <p className="mt-1.5 text-sm text-fog">{module.tagline}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <CtaBand
        heading={`Show us your ${industry.name.toLowerCase()} process.`}
        subheading="We’ll configure a demo tenant that matches it — stages, sources and all."
      />
    </>
  )
}
