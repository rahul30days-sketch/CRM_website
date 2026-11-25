import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { HeroStage } from '@/components/hero-stage'
import { StatStrip } from '@/components/sections/stat-strip'
import { LogoCloud } from '@/components/sections/logo-cloud'
import { TestimonialWall } from '@/components/sections/testimonial-wall'
import { ChaosToControl } from '@/components/sections/chaos-to-control'
import { LeadJourneyCinematic } from '@/components/sections/lead-journey-cinematic'
import { LeadMagnet } from '@/components/sections/lead-magnet'
import { SalesPipeline } from '@/components/sections/sales-pipeline'
import { ExplodedDashboard } from '@/components/sections/exploded-dashboard'
import { QuotationAssembly } from '@/components/sections/quotation-assembly'
import { AutomationWorkflow } from '@/components/sections/automation-workflow'
import { FeatureBento } from '@/components/sections/feature-bento'
import { IndustryExperiences } from '@/components/sections/industry-experiences'
import { FinalCtaCinematic } from '@/components/sections/final-cta-cinematic'
import { FaqList } from '@/components/sections/faq-list'
import { PlaygroundInvite } from '@/components/sections/playground-invite'
import { PricingPreview } from '@/components/sections/pricing-preview'
import { JsonLd } from '@/components/json-ld'
import { buttonVariants } from '@/components/ui/button'
import {
  getFaqs,
  getHomepage,
  getIntegrations,
  getModules,
  getPricingPlans,
  getTestimonials,
} from '@/lib/cms'
import { BUSINESS } from '@/content/business'
import { cn } from '@/lib/utils'
import { SITE_URL } from '@/lib/site'

export const revalidate = 300

/**
 * Homepage — "The Living Sales Command Center".
 *
 * Narrative: the problem (chaos → control) → one enquiry's whole journey →
 * each part of the system up close (capture, pipeline, dashboard,
 * quotation, automation) → try it yourself → the whole platform
 * → your industry → proof (only once verified) → price → questions → CTA.
 *
 * Unverified social proof (stats, ratings, testimonials) renders only when
 * BUSINESS.socialProofVerified is true — see src/content/business.ts.
 */
export default async function HomePage() {
  const [modules, testimonials, integrations, home, plans, allFaqs] = await Promise.all([
    getModules(),
    getTestimonials(),
    getIntegrations(),
    getHomepage(),
    getPricingPlans(),
    getFaqs(),
  ])
  const faqs = allFaqs.filter((f) => f.category !== 'pricing').slice(0, 8)
  const proof = BUSINESS.socialProofVerified

  const kickerParts = home.hero.kicker.split('·').map((s) => s.trim())
  const brandPart = kickerParts[0] && kickerParts[1] ? kickerParts[0] : 'EZCRM'
  const textPart = kickerParts[1] ? kickerParts.slice(1).join(' · ') : home.hero.kicker

  const siteUrl = SITE_URL

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
              email: 'info@30days.in',
              areaServed: { '@type': 'Country', name: 'India' },
              parentOrganization: {
                '@type': 'Organization',
                name: BUSINESS.legalName,
                url: BUSINESS.companyUrl,
                telephone: BUSINESS.salesPhone ?? undefined,
                address: { '@type': 'PostalAddress', streetAddress: BUSINESS.address, addressCountry: 'IN' },
              },
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'info@30days.in',
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
              operatingSystem: 'Web',
              url: siteUrl,
              description:
                'Capture leads from IndiaMART, JustDial, Facebook and your website, engage on the official WhatsApp API, send GST-compliant quotations, and track every deal from first touch to payment.',
              publisher: { '@id': `${siteUrl}/#organization` },
              featureList: modules.map((m) => m.title),
              offers: {
                '@type': 'AggregateOffer',
                priceCurrency: 'INR',
                lowPrice: '0',
                highPrice: String(Math.max(0, ...plans.map((p) => p.priceYearly ?? p.priceMonthly ?? 0))),
                offerCount: plans.length,
              },
            },
          ],
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }}
      />

      {/* 01 — Hero: the command center */}
      <section className="mesh noise relative overflow-hidden">
        <div className="shell relative z-10 grid items-center gap-10 pb-16 pt-14 lg:grid-cols-[1.1fr_1fr] lg:gap-8 lg:pb-24 lg:pt-20">
          {/* Copy: centred on small screens, left-aligned beside the visual on lg+ */}
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <div className="mb-6 flex justify-center lg:justify-start">
              <Link
                href="/features"
                className="group inline-flex items-center gap-2.5 rounded-full border border-brand/20 bg-white/70 p-1.5 pr-4 text-xs font-semibold text-brand transition-colors duration-fast hover:border-brand/40"
              >
                <span className="flex h-6 items-center rounded-full bg-brand px-2.5 text-[0.6875rem] font-extrabold uppercase tracking-[0.08em] text-white">
                  {brandPart}
                </span>
                <span className="font-mono text-[0.6875rem] font-semibold uppercase tracking-wider text-slate transition-colors duration-fast group-hover:text-brand">
                  {textPart}
                </span>
                <ArrowRight
                  aria-hidden
                  className="h-3 w-3 transition-transform duration-fast ease-out group-hover:translate-x-0.5"
                />
              </Link>
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-[1.03] tracking-tight text-ink sm:text-5xl lg:text-[3.75rem] xl:text-[4.25rem]">
              {home.hero.heading}
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate lg:mx-0">
              {home.hero.subheading}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
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
            {proof && home.hero.trustText ? (
              <p className="mt-6 text-sm text-slate">
                <strong className="font-semibold text-ink">{home.hero.trustText}</strong> across India
              </p>
            ) : null}
          </div>

          {/* Visual: the EZCRM sales universe, on the right from lg */}
          <div id="live" className="w-full scroll-mt-24">
            <HeroStage />
          </div>
        </div>
      </section>

      {/* 02 — Trust: what EZCRM connects to (+ verified stats, once confirmed) */}
      {proof ? (
        <section className="shell pt-12">
          <StatStrip stats={home.stats} />
        </section>
      ) : null}
      <LogoCloud integrations={integrations} heading={home.logoCloudHeading} />

      {/* 03 — The problem, and the turn */}
      <ChaosToControl />

      {/* 04 — Signature: one enquiry, start to finish */}
      <LeadJourneyCinematic />

      {/* 05 — Capture from every source */}
      <LeadMagnet />

      {/* 07 — Pipeline playground */}
      <SalesPipeline />

      {/* 08 — Dashboard & analytics */}
      <ExplodedDashboard />

      {/* 10 — GST quotation */}
      <QuotationAssembly />

      {/* 11 — Automation */}
      <AutomationWorkflow />

      {/* 12 — Try it yourself */}
      <PlaygroundInvite />

      {/* 13 — The whole platform */}
      <FeatureBento modules={modules} />

      {/* 14 — Industries */}
      <IndustryExperiences />

      {/* 15 — Customer stories (only once verified) */}
      {proof && testimonials.length > 0 ? (
        <section className="shell py-16 lg:py-24" aria-labelledby="testimonials-heading">
          <div className="mb-12 max-w-2xl">
            <p className="kicker mb-3">{home.testimonialsSection.kicker}</p>
            <h2
              id="testimonials-heading"
              className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
            >
              {home.testimonialsSection.heading}
            </h2>
          </div>
          <TestimonialWall testimonials={testimonials} />
        </section>
      ) : null}

      {/* 16 — Pricing preview */}
      <PricingPreview plans={plans} />

      {/* 17 — FAQ */}
      <section className="shell py-16 lg:py-24" aria-labelledby="faq-heading">
        <div className="mx-auto max-w-3xl">
          <header className="mb-8 text-center">
            <p className="kicker mb-3">FAQ</p>
            <h2 id="faq-heading" className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Questions, answered.
            </h2>
          </header>
          <FaqList faqs={faqs} />
        </div>
      </section>

      {/* 18 — Final conversion */}
      <FinalCtaCinematic
        primary={{ label: home.cta.primary.label, href: home.cta.primary.href }}
        secondary={{ label: home.cta.secondary.label, href: home.cta.secondary.href }}
      />
    </>
  )
}
