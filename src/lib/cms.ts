import { getPayload } from 'payload'
import config from '@payload-config'

import { modules as fallbackModules, type ModuleContent } from '@/content/modules'
import {
  nav as fallbackNav,
  faqs as fallbackFaqs,
  integrations as fallbackIntegrations,
  pricingPlans as fallbackPricing,
  testimonials as fallbackTestimonials,
  type FaqContent,
  type IntegrationContent,
  type PricingPlanContent,
  type TestimonialContent,
} from '@/content/site'
import {
  blogPosts as fallbackPosts,
  caseStudies as fallbackCaseStudies,
  type BlogPostContent,
  type CaseStudyContent,
} from '@/content/stories'

/**
 * All CMS reads go through the Local API (same Node process — no network
 * hop, no exposed REST surface). Every read degrades gracefully to the
 * factory content in src/content/* so the site builds and runs before
 * MongoDB is configured, and stays up if the database blips.
 */

const CMS_TIMEOUT_MS = 6000

async function withFallback<T>(fetcher: () => Promise<T | null>, fallback: T): Promise<T> {
  try {
    const result = await Promise.race([
      fetcher(),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), CMS_TIMEOUT_MS)),
    ])
    return result ?? fallback
  } catch {
    return fallback
  }
}

async function payloadClient() {
  return getPayload({ config })
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyDoc = Record<string, any>

function docToModule(doc: AnyDoc): ModuleContent {
  return {
    slug: doc.slug,
    title: doc.title,
    category: doc.category,
    tagline: doc.tagline ?? '',
    shortDescription: doc.shortDescription ?? '',
    problem: doc.problem ?? '',
    howItWorks: (doc.howItWorks ?? []).map((s: AnyDoc) => ({
      step: s.step,
      detail: s.detail ?? '',
    })),
    capabilities: (doc.capabilities ?? []).map((c: AnyDoc) => c.capability),
    metric:
      doc.metric?.before && doc.metric?.after
        ? { before: doc.metric.before, after: doc.metric.after, caption: doc.metric.caption ?? '' }
        : undefined,
    related: (doc.relatedModules ?? [])
      .map((r: AnyDoc) => (typeof r === 'object' ? r?.slug : null))
      .filter(Boolean),
  }
}

export async function getModules(): Promise<ModuleContent[]> {
  return withFallback(async () => {
    const payload = await payloadClient()
    const { docs } = await payload.find({
      collection: 'modules',
      limit: 50,
      sort: 'order',
      depth: 1,
    })
    return docs.length > 0 ? docs.map(docToModule) : null
  }, fallbackModules)
}

export async function getModuleBySlug(slug: string): Promise<ModuleContent | undefined> {
  const all = await getModules()
  return all.find((m) => m.slug === slug)
}

export async function getPricingPlans(): Promise<PricingPlanContent[]> {
  return withFallback(async () => {
    const payload = await payloadClient()
    const { docs } = await payload.find({ collection: 'pricing-plans', limit: 10, sort: 'order' })
    if (docs.length === 0) return null
    return docs.map((doc: AnyDoc) => ({
      name: doc.name,
      forWhom: doc.forWhom ?? '',
      priceMonthly: doc.priceMonthly ?? null,
      priceYearly: doc.priceYearly ?? null,
      features: (doc.features ?? []).map((f: AnyDoc) => f.feature),
      limitsNote: doc.limitsNote ?? '',
      cta: { label: doc.cta?.label ?? 'Start free trial', href: doc.cta?.href ?? '/demo' },
      mostPopular: Boolean(doc.mostPopular),
    }))
  }, fallbackPricing)
}

export async function getTestimonials(): Promise<TestimonialContent[]> {
  return withFallback<TestimonialContent[]>(async () => {
    const payload = await payloadClient()
    const { docs } = await payload.find({ collection: 'testimonials', limit: 20, depth: 1 })
    if (docs.length === 0) return null
    return docs.map((doc: AnyDoc) => ({
      quote: doc.quote,
      author: doc.author,
      role: doc.role,
      company: doc.company,
      metric: doc.metric?.value ? { value: doc.metric.value, label: doc.metric.label ?? '' } : undefined,
      moduleSlug: typeof doc.module === 'object' ? doc.module?.slug : undefined,
    }))
  }, fallbackTestimonials)
}

export async function getFaqs(category?: FaqContent['category']): Promise<FaqContent[]> {
  const all = await withFallback(async () => {
    const payload = await payloadClient()
    const { docs } = await payload.find({ collection: 'faqs', limit: 100, sort: 'order' })
    if (docs.length === 0) return null
    return docs.map((doc: AnyDoc) => ({
      question: doc.question,
      answer: doc.answer,
      category: doc.category,
    }))
  }, fallbackFaqs)
  return category ? all.filter((f) => f.category === category) : all
}

export async function getIntegrations(): Promise<IntegrationContent[]> {
  return withFallback(async () => {
    const payload = await payloadClient()
    const { docs } = await payload.find({ collection: 'integrations', limit: 50, sort: 'order' })
    if (docs.length === 0) return null
    return docs.map((doc: AnyDoc) => ({
      slug: doc.slug,
      name: doc.name,
      category: doc.category,
      description: doc.description,
    }))
  }, fallbackIntegrations)
}

export async function getCaseStudies(): Promise<CaseStudyContent[]> {
  return withFallback(async () => {
    const payload = await payloadClient()
    const { docs } = await payload.find({ collection: 'case-studies', limit: 50, sort: '-publishedAt' })
    if (docs.length === 0) return null
    return docs.map((doc: AnyDoc) => ({
      slug: doc.slug,
      client: doc.client,
      industry: doc.industry,
      summary: doc.summary,
      challenge: doc.challenge,
      solution: doc.solution,
      results: doc.results,
      metrics: (doc.metrics ?? []).map((m: AnyDoc) => ({ value: m.value, label: m.label })),
    }))
  }, fallbackCaseStudies)
}

export async function getCaseStudy(slug: string): Promise<CaseStudyContent | undefined> {
  const all = await getCaseStudies()
  return all.find((c) => c.slug === slug)
}

/**
 * Blog posts: CMS entries carry Lexical rich text (`content`); factory posts
 * carry plain paragraphs. The page renders whichever is present — Lexical
 * always goes through Payload's official React serializer, never raw HTML.
 */
export type BlogPostView = BlogPostContent & { lexicalContent?: unknown }

export async function getBlogPosts(): Promise<BlogPostView[]> {
  return withFallback<BlogPostView[]>(async () => {
    const payload = await payloadClient()
    const { docs } = await payload.find({ collection: 'blog-posts', limit: 50, sort: '-publishedAt' })
    if (docs.length === 0) return null
    return docs.map((doc: AnyDoc) => ({
      slug: doc.slug,
      title: doc.title,
      excerpt: doc.excerpt,
      category: doc.category ?? 'playbooks',
      publishedAt: doc.publishedAt ?? doc.createdAt,
      paragraphs: [],
      lexicalContent: doc.content,
    }))
  }, fallbackPosts)
}

export async function getBlogPost(slug: string): Promise<BlogPostView | undefined> {
  const all = await getBlogPosts()
  return all.find((p) => p.slug === slug)
}

type MediaRef = { url: string; alt: string; width?: number; height?: number } | null

export interface SiteSettings {
  siteName: string
  tagline: string
  logo: MediaRef
  heroDashboard: MediaRef
  favicon: MediaRef
}

const fallbackSiteSettings: SiteSettings = {
  siteName: 'EZCRM',
  tagline: 'The sales command center for Indian teams',
  logo: null,
  heroDashboard: null,
  favicon: null,
}

function toMediaRef(m: unknown, fallbackAlt: string): MediaRef {
  const media = m as AnyDoc
  if (media && typeof media === 'object' && media.url) {
    return {
      url: media.url,
      alt: media.alt || fallbackAlt,
      width: media.width ?? undefined,
      height: media.height ?? undefined,
    }
  }
  return null
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return withFallback<SiteSettings>(async () => {
    const payload = await payloadClient()
    // depth: 1 populates the `logo` upload relation with its url/dimensions.
    const settings = (await payload.findGlobal({ slug: 'site-settings', depth: 1 })) as AnyDoc
    const name = settings?.siteName || fallbackSiteSettings.siteName
    return {
      siteName: name,
      tagline: settings?.tagline || fallbackSiteSettings.tagline,
      logo: toMediaRef(settings?.logo, name),
      heroDashboard: toMediaRef(settings?.heroDashboard, `${name} dashboard`),
      favicon: toMediaRef(settings?.favicon, `${name} favicon`),
    }
  }, fallbackSiteSettings)
}

export interface HomepageContent {
  hero: {
    kicker: string
    heading: string
    subheading: string
    primaryCta: { label: string; href: string }
    secondaryCta: { label: string; href: string }
    trustText: string
  }
  stats: { value: string; label: string }[]
  logoCloudHeading: string
  modulesSection: { kicker: string; heading: string; subheading: string }
  testimonialsSection: { kicker: string; heading: string }
  whatsapp: { kicker: string; heading: string; body: string; points: string[] }
  cta: {
    heading: string
    subheading: string
    primary: { label: string; href: string }
    secondary: { label: string; href: string }
  }
}

const fallbackHomepage: HomepageContent = {
  hero: {
    kicker: 'EZCRM · CRM for Indian sales teams',
    heading: 'Run your entire sales floor from one screen.',
    subheading:
      'IndiaMART, JustDial, Facebook and WhatsApp leads — captured in seconds, routed round-robin, followed up on time, and quoted with correct GST.',
    primaryCta: { label: 'Book a demo', href: '/demo' },
    secondaryCta: { label: 'See it live', href: '#live' },
    trustText: '500+ teams',
  },
  stats: [
    { value: '12,400+', label: 'leads captured monthly' },
    { value: '40%', label: 'faster first response' },
    { value: '₹8.4Cr', label: 'pipeline tracked' },
    { value: '99.9%', label: 'uptime, 12 months' },
  ],
  logoCloudHeading: 'Plugged into the tools Indian sales teams already run on',
  modulesSection: {
    kicker: 'The product, working',
    heading: 'Not a list of features. The actual screens your team lives in.',
    subheading:
      'Fourteen modules ship in EZCRM. Here are four you’ll open every day — the rest are one click away.',
  },
  testimonialsSection: {
    kicker: 'Field reports',
    heading: 'Numbers first. Then the story behind them.',
  },
  whatsapp: {
    kicker: 'The channel customers actually answer',
    heading: 'One WhatsApp number. Your whole team. Every chat on record.',
    body: 'Move off personal phones and onto a shared inbox on Meta’s official API. Conversations stay with the business when staff leave, managers see who answered whom, and broadcasts go out on approved templates — safely.',
    points: [
      'Official Meta WhatsApp Business API — no ban risk',
      'Shared team inbox with round-robin agent assignment',
      'Approved-template broadcasts with per-recipient read logs',
    ],
  },
  cta: {
    heading: 'See your own pipeline on this screen.',
    subheading:
      'A 30-minute demo with your lead sources, your stages and your WhatsApp number. No slideware.',
    primary: { label: 'Book a demo', href: '/demo' },
    secondary: { label: 'See pricing', href: '/pricing' },
  },
}

/** Merge helper: use the CMS value when it's a non-empty string, else fallback. */
function pick(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() !== '' ? value : fallback
}

export async function getHomepage(): Promise<HomepageContent> {
  return withFallback<HomepageContent>(async () => {
    const payload = await payloadClient()
    const h = (await payload.findGlobal({ slug: 'homepage', depth: 0 })) as AnyDoc
    if (!h) return null
    const fb = fallbackHomepage
    const stats = (h.stats ?? [])
      .map((s: AnyDoc) => ({ value: s.value, label: s.label }))
      .filter((s: AnyDoc) => s.value && s.label)
    const points = (h.whatsappPoints ?? [])
      .map((p: AnyDoc) => p.point)
      .filter(Boolean)
    return {
      hero: {
        kicker: pick(h.heroKicker, fb.hero.kicker),
        heading: pick(h.heroHeading, fb.hero.heading),
        subheading: pick(h.heroSubheading, fb.hero.subheading),
        primaryCta: {
          label: pick(h.heroPrimaryCta?.label, fb.hero.primaryCta.label),
          href: pick(h.heroPrimaryCta?.href, fb.hero.primaryCta.href),
        },
        secondaryCta: {
          label: pick(h.heroSecondaryCta?.label, fb.hero.secondaryCta.label),
          href: pick(h.heroSecondaryCta?.href, fb.hero.secondaryCta.href),
        },
        trustText: pick(h.heroTrustText, fb.hero.trustText),
      },
      stats: stats.length > 0 ? stats : fb.stats,
      logoCloudHeading: pick(h.logoCloudHeading, fb.logoCloudHeading),
      modulesSection: {
        kicker: pick(h.modulesSection?.kicker, fb.modulesSection.kicker),
        heading: pick(h.modulesSection?.heading, fb.modulesSection.heading),
        subheading: pick(h.modulesSection?.subheading, fb.modulesSection.subheading),
      },
      testimonialsSection: {
        kicker: pick(h.testimonialsSection?.kicker, fb.testimonialsSection.kicker),
        heading: pick(h.testimonialsSection?.heading, fb.testimonialsSection.heading),
      },
      whatsapp: {
        kicker: pick(h.whatsappKicker, fb.whatsapp.kicker),
        heading: pick(h.whatsappHeading, fb.whatsapp.heading),
        body: pick(h.whatsappBody, fb.whatsapp.body),
        points: points.length > 0 ? points : fb.whatsapp.points,
      },
      cta: {
        heading: pick(h.ctaHeading, fb.cta.heading),
        subheading: pick(h.ctaSubheading, fb.cta.subheading),
        primary: {
          label: pick(h.ctaPrimary?.label, fb.cta.primary.label),
          href: pick(h.ctaPrimary?.href, fb.cta.primary.href),
        },
        secondary: {
          label: pick(h.ctaSecondary?.label, fb.cta.secondary.label),
          href: pick(h.ctaSecondary?.href, fb.cta.secondary.href),
        },
      },
    }
  }, fallbackHomepage)
}

export async function getNavigation(): Promise<typeof fallbackNav> {
  return withFallback(async () => {
    const payload = await payloadClient()
    const navGlobal = (await payload.findGlobal({ slug: 'navigation' })) as AnyDoc
    const header = (navGlobal?.header ?? []).map((i: AnyDoc) => ({ label: i.label, href: i.href }))
    const footer = (navGlobal?.footer ?? []).map((g: AnyDoc) => ({
      groupTitle: g.groupTitle,
      links: (g.links ?? []).map((l: AnyDoc) => ({ label: l.label, href: l.href })),
    }))
    if (header.length === 0 && footer.length === 0) return null
    return {
      header: header.length > 0 ? header : fallbackNav.header,
      footer: footer.length > 0 ? footer : fallbackNav.footer,
    }
  }, fallbackNav)
}
