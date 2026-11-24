import Link from 'next/link'
import { Star } from 'lucide-react'
import { HeroVisuals } from '@/components/console/hero-visuals'
import { HeroStage } from '@/components/hero-stage'
import { StatStrip } from '@/components/sections/stat-strip'
import { LogoCloud } from '@/components/sections/logo-cloud'
import { WhatsAppShowcase } from '@/components/sections/whatsapp-showcase'
import { TestimonialWall } from '@/components/sections/testimonial-wall'
import { ChaosToControl } from '@/components/sections/chaos-to-control'
import { LeadJourneyCinematic } from '@/components/sections/lead-journey-cinematic'
import { LeadMagnet } from '@/components/sections/lead-magnet'
import { SalesPipeline } from '@/components/sections/sales-pipeline'
import { ExplodedDashboard } from '@/components/sections/exploded-dashboard'
import { IndiaIntelligence } from '@/components/sections/india-intelligence'
import { QuotationAssembly } from '@/components/sections/quotation-assembly'
import { AutomationWorkflow } from '@/components/sections/automation-workflow'
import { FeatureBento } from '@/components/sections/feature-bento'
import { IndustryExperiences } from '@/components/sections/industry-experiences'
import { FinalCtaCinematic } from '@/components/sections/final-cta-cinematic'
import { JsonLd } from '@/components/json-ld'
import { buttonVariants } from '@/components/ui/button'
import { getHomepage, getIntegrations, getModules, getTestimonials } from '@/lib/cms'
import { faqs } from '@/content/site'
import { cn } from '@/lib/utils'

export const revalidate = 300

export default async function HomePage() {
  const [modules, testimonials, integrations, home] = await Promise.all([
    getModules(),
    getTestimonials(),
    getIntegrations(),
    getHomepage(),
  ])

  const kickerParts = home.hero.kicker.split('·').map((s) => s.trim())
  const brandPart = kickerParts[0] && kickerParts[1] ? kickerParts[0] : 'EZCRM'
  const textPart = kickerParts[1] ? kickerParts.slice(1).join(' · ') : home.hero.kicker

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
          '@graph': [
            {
              '@type': 'Organization',
              '@id': `${siteUrl}/#organization`,
              name: 'EZCRM',
              url: siteUrl,
              logo: `${siteUrl}/icon.svg`,
              description:
                'EZCRM is a sales CRM and business-automation platform for Indian SMBs — lead capture, WhatsApp, GST quotations, pipeline, automations and analytics on one screen.',
              email: 'hello@ezcrm.in',
              areaServed: { '@type': 'Country', name: 'India' },
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'hello@ezcrm.in',
                contactType: 'sales',
                areaServed: 'IN',
                availableLanguage: ['English', 'Hindi'],
              },
            },
            {
              '@type': 'WebSite',
              '@id': `${siteUrl}/#website`,
              url: siteUrl,
              name: 'EZCRM',
              description: `${home.hero.heading}`,
              publisher: { '@id': `${siteUrl}/#organization` },
              inLanguage: 'en-IN',
            },
            {
              '@type': 'SoftwareApplication',
              name: 'EZCRM',
              applicationCategory: 'BusinessApplication',
              applicationSubCategory: 'CRM',
              operatingSystem: 'Web, Android, iOS',
              url: siteUrl,
              description:
                'Capture leads from IndiaMART, JustDial, Facebook and your website, engage on the official WhatsApp API, send GST-compliant quotations, and track every deal from first touch to payment.',
              publisher: { '@id': `${siteUrl}/#organization` },
              featureList: modules.map((m) => m.title),
              offers: {
                '@type': 'AggregateOffer',
                priceCurrency: 'INR',
                lowPrice: '0',
                highPrice: '50000',
                offerCount: 4,
              },
            },
          ],
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.slice(0, 8).map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }}
      />

      {/* Hero — atmospheric mesh, copy rail + floating glass dashboard */}
      <section className="mesh noise relative overflow-hidden">
        <HeroVisuals />
        <div className="shell relative z-10 pb-16 pt-16 lg:pb-24 lg:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex justify-center">
              <Link
                href="/features"
                className="group relative inline-flex items-center gap-2.5 rounded-full border border-brand/20 bg-brand/[0.03] p-1.5 pr-4 text-xs font-semibold text-brand transition-all duration-300 hover:border-brand/40 hover:bg-brand/[0.06] hover:shadow-[0_0_20px_rgba(43,92,230,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {/* Brand Pill with subtle glow */}
                <span className="relative flex h-6 items-center gap-1.5 rounded-full bg-gradient-to-r from-brand to-brand/80 px-2.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-white shadow-[0_2px_4px_rgba(43,92,230,0.2)]">
                  {/* Micro pulsing active indicator */}
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                  </span>
                  {brandPart}
                </span>

                {/* Kicker Text */}
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate group-hover:text-brand transition-colors duration-300">
                  {textPart}
                </span>

                {/* Dynamic Arrow Indicator */}
                <svg
                  className="h-3 w-3 translate-x-0 transition-transform duration-300 group-hover:translate-x-1 text-brand/70 group-hover:text-brand"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
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

          {/*
            Hero centerpiece: the EZCRM "sales universe" — a rotating cloud of
            the lead sources and CRM functions the product covers. Pure DOM +
            lucide icons (no WebGL, CSP-safe), billboarded to always face the
            viewer, and static under reduced motion. The hero copy/CTAs above
            are server-rendered, so this is purely decorative enhancement.
          */}
          <div id="live" className="mx-auto mt-4 max-w-6xl scroll-mt-24">
            <HeroStage />
          </div>
        </div>
      </section>

      {/* 02 — Trust: animated stats + integrations */}
      <section className="shell -mt-8 pb-8">
        <StatStrip stats={home.stats} />
      </section>
      <LogoCloud integrations={integrations} heading={home.logoCloudHeading} />

      {/* 03 — From chaos to control */}
      <ChaosToControl />

      {/* 04 — The cinematic lead-to-revenue journey */}
      <LeadJourneyCinematic />

      {/* 05 — Lead integration hub */}
      <LeadMagnet />

      {/* 06 — WhatsApp communication */}
      <div className="overflow-hidden border-y border-line bg-sky/40">
        <WhatsAppShowcase
          kicker={home.whatsapp.kicker}
          heading={home.whatsapp.heading}
          body={home.whatsapp.body}
          points={home.whatsapp.points}
        />
      </div>

      {/* 07 — Interactive sales pipeline */}
      <SalesPipeline />

      {/* 08 — Exploding dashboard */}
      <ExplodedDashboard />

      {/* 09 — India sales intelligence */}
      <IndiaIntelligence />

      {/* 10 — GST quotation assembly */}
      <QuotationAssembly />

      {/* 11 — Automation workflow */}
      <AutomationWorkflow />

      {/* 12 — Interactive feature bento */}
      <FeatureBento modules={modules} />

      {/* 13 — Industry experiences */}
      <IndustryExperiences />

      {/* 14 — Customer success */}
      <section className="shell py-14 lg:py-20" aria-labelledby="testimonials-heading">
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

      {/* 14b — FAQ (AEO: answer-engine content + FAQPage schema) */}
      <section className="shell py-14 lg:py-20" aria-labelledby="faq-heading">
        <div className="mx-auto max-w-3xl">
          <header className="mb-8 text-center">
            <p className="kicker mb-3">FAQ</p>
            <h2
              id="faq-heading"
              className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
            >
              Questions, answered.
            </h2>
          </header>
          <div className="divide-y divide-line overflow-hidden rounded-card border border-line bg-white">
            {faqs.slice(0, 8).map((faq) => (
              <details key={faq.question} className="group px-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <span
                    aria-hidden
                    className="shrink-0 font-mono text-xl text-brand transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-5 pr-6 text-sm leading-relaxed text-slate">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 15 — Cinematic final CTA */}
      <FinalCtaCinematic
        primary={{ label: home.cta.primary.label, href: home.cta.primary.href }}
        secondary={{ label: home.cta.secondary.label, href: home.cta.secondary.href }}
      />
    </>
  )
}
