import Link from 'next/link'
import { Star } from 'lucide-react'
import { ConsoleHero } from '@/components/console/console-hero'
import { HeroDashboardImage } from '@/components/console/hero-dashboard-image'
import { HeroVisuals } from '@/components/console/hero-visuals'
import { StatStrip } from '@/components/sections/stat-strip'
import { LogoCloud } from '@/components/sections/logo-cloud'
import { ModuleRows } from '@/components/sections/module-rows'
import { WhatsAppShowcase } from '@/components/sections/whatsapp-showcase'
import { TestimonialWall } from '@/components/sections/testimonial-wall'
import { CtaBand } from '@/components/sections/cta-band'
import { JsonLd } from '@/components/json-ld'
import { buttonVariants } from '@/components/ui/button'
import {
  getHomepage,
  getIntegrations,
  getModules,
  getSiteSettings,
  getTestimonials,
} from '@/lib/cms'
import { cn } from '@/lib/utils'

export const revalidate = 300

export default async function HomePage() {
  const [modules, testimonials, integrations, settings, home] = await Promise.all([
    getModules(),
    getTestimonials(),
    getIntegrations(),
    getSiteSettings(),
    getHomepage(),
  ])

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const avatars = [
    { initial: 'R', bg: 'bg-brand' },
    { initial: 'D', bg: 'bg-won' },
    { initial: 'F', bg: 'bg-[rgb(var(--c-brand-hi))]' },
    { initial: 'S', bg: 'bg-due' },
  ]

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'EZCRM',
          url: siteUrl,
          description: 'The sales command center for Indian teams.',
          contactPoint: { '@type': 'ContactPoint', email: 'hello@ezcrm.in', contactType: 'sales' },
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'EZCRM 3.0',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '599', priceCurrency: 'INR' },
        }}
      />

      {/* Hero — atmospheric mesh, copy rail + floating glass dashboard */}
      <section className="mesh noise relative overflow-hidden">
        <HeroVisuals />
        <div className="shell relative z-10 pb-16 pt-16 lg:pb-24 lg:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="kicker mb-5 text-sm font-bold !text-[rgb(var(--c-brand-deep))] sm:text-base">
              {home.hero.kicker}
            </p>
            <h1 className="font-display text-4xl font-extrabold leading-[1.03] tracking-tight text-ink sm:text-5xl lg:text-[4.25rem]">
              {home.hero.heading}
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate">
              {home.hero.subheading}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href={home.hero.primaryCta.href} className={buttonVariants({ size: 'lg' })}>
                {home.hero.primaryCta.label}
              </Link>
              <Link
                href={home.hero.secondaryCta.href}
                className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }))}
              >
                {home.hero.secondaryCta.label}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-slate">
              <div className="flex -space-x-2">
                {avatars.map((a) => (
                  <span
                    key={a.initial}
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full border-2 border-white font-mono text-xs font-bold text-white',
                      a.bg,
                    )}
                  >
                    {a.initial}
                  </span>
                ))}
              </div>
              <span className="flex items-center gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-brand text-brand" aria-hidden />
                ))}
              </span>
              <span>
                <strong className="font-semibold text-ink">{home.hero.trustText}</strong> across India
              </span>
            </div>
          </div>

          <div id="live" className="mx-auto mt-14 max-w-5xl scroll-mt-24">
            {settings.heroDashboard ? (
              <HeroDashboardImage image={settings.heroDashboard} />
            ) : (
              <ConsoleHero />
            )}
          </div>
        </div>
      </section>

      {/* Glass stat strip */}
      <section className="shell -mt-8 pb-8">
        <StatStrip stats={home.stats} />
      </section>

      {/* Integrations logo cloud */}
      <LogoCloud integrations={integrations} heading={home.logoCloudHeading} />

      {/* Modules — alternating rows */}
      <section className="shell py-16 lg:py-24" aria-labelledby="modules-heading">
        <div className="mx-auto mb-16 max-w-2xl text-center lg:mb-24">
          <p className="kicker mb-3">{home.modulesSection.kicker}</p>
          <h2
            id="modules-heading"
            className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl"
          >
            {home.modulesSection.heading}
          </h2>
          <p className="mt-4 text-lg text-slate">{home.modulesSection.subheading}</p>
        </div>
        <ModuleRows modules={modules} />
        <div className="mt-16 text-center">
          <Link href="/features" className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }))}>
            See all 14 modules
          </Link>
        </div>
      </section>

      {/* WhatsApp showcase */}
      <div className="border-y border-line bg-sky/40">
        <WhatsAppShowcase
          kicker={home.whatsapp.kicker}
          heading={home.whatsapp.heading}
          body={home.whatsapp.body}
          points={home.whatsapp.points}
        />
      </div>

      {/* Testimonials */}
      <section className="shell py-24 lg:py-32" aria-labelledby="testimonials-heading">
        <div className="mb-12 max-w-2xl">
          <p className="kicker mb-3">{home.testimonialsSection.kicker}</p>
          <h2
            id="testimonials-heading"
            className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl"
          >
            {home.testimonialsSection.heading}
          </h2>
        </div>
        <TestimonialWall testimonials={testimonials} />
      </section>

      <CtaBand
        heading={home.cta.heading}
        subheading={home.cta.subheading}
        primaryLabel={home.cta.primary.label}
        primaryHref={home.cta.primary.href}
        secondaryLabel={home.cta.secondary.label}
        secondaryHref={home.cta.secondary.href}
      />
    </>
  )
}
