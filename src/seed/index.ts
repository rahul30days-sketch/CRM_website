import { getPayload } from 'payload'
import config from '@payload-config'
import crypto from 'crypto'

import { modules } from '@/content/modules'
import { faqs, integrations, nav, pricingPlans, testimonials } from '@/content/site'
import { blogPosts, caseStudies } from '@/content/stories'

/**
 * Seeds Payload with the factory content from src/content/*.
 * Idempotent: skips any collection that already has documents.
 * Run with: npm run seed
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

function lexicalFromParagraphs(paragraphs: string[]): any {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        textFormat: 0,
        children: [
          { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 },
        ],
      })),
    },
  }
}

async function isEmpty(payload: any, collection: string): Promise<boolean> {
  const { totalDocs } = await payload.count({ collection })
  return totalDocs === 0
}

async function seed() {
  const payload = await getPayload({ config })
  const log = (msg: string) => payload.logger.info(`[seed] ${msg}`)

  // ── Admin user ─────────────────────────────────────────────────────────
  if (await isEmpty(payload, 'users')) {
    const password = process.env.SEED_ADMIN_PASSWORD ?? crypto.randomBytes(12).toString('base64url')
    await payload.create({
      collection: 'users',
      data: { email: 'admin@ezcrm.in', name: 'EZCRM Admin', role: 'admin', password },
    })
    log('Created admin user: admin@ezcrm.in')
    if (!process.env.SEED_ADMIN_PASSWORD) {
      log(`Generated admin password (save it now, it is not stored in plain text): ${password}`)
    }
  }

  // ── Modules (two passes: create, then wire relations) ─────────────────
  if (await isEmpty(payload, 'modules')) {
    const idBySlug = new Map<string, string>()
    for (const m of modules) {
      const doc = await payload.create({
        collection: 'modules',
        data: {
          title: m.title,
          slug: m.slug,
          category: m.category,
          tagline: m.tagline,
          shortDescription: m.shortDescription,
          problem: m.problem,
          howItWorks: m.howItWorks,
          capabilities: m.capabilities.map((capability) => ({ capability })),
          metric: m.metric,
          order: modules.indexOf(m),
        },
      })
      idBySlug.set(m.slug, String(doc.id))
    }
    for (const m of modules) {
      const relatedIds = m.related.map((slug) => idBySlug.get(slug)).filter(Boolean)
      if (relatedIds.length > 0) {
        await payload.update({
          collection: 'modules',
          id: idBySlug.get(m.slug)!,
          data: { relatedModules: relatedIds as string[] },
        })
      }
    }
    log(`Seeded ${modules.length} modules`)
  }

  // ── Integrations ───────────────────────────────────────────────────────
  if (await isEmpty(payload, 'integrations')) {
    for (const [i, item] of integrations.entries()) {
      await payload.create({ collection: 'integrations', data: { ...item, order: i } })
    }
    log(`Seeded ${integrations.length} integrations`)
  }

  // ── Pricing plans ──────────────────────────────────────────────────────
  if (await isEmpty(payload, 'pricing-plans')) {
    for (const [i, plan] of pricingPlans.entries()) {
      await payload.create({
        collection: 'pricing-plans',
        data: {
          name: plan.name,
          forWhom: plan.forWhom,
          priceMonthly: plan.priceMonthly ?? undefined,
          priceYearly: plan.priceYearly ?? undefined,
          features: plan.features.map((feature) => ({ feature })),
          limitsNote: plan.limitsNote,
          cta: plan.cta,
          mostPopular: plan.mostPopular,
          order: i,
        },
      })
    }
    log(`Seeded ${pricingPlans.length} pricing plans`)
  }

  // ── FAQs ───────────────────────────────────────────────────────────────
  if (await isEmpty(payload, 'faqs')) {
    for (const [i, faq] of faqs.entries()) {
      await payload.create({ collection: 'faqs', data: { ...faq, order: i } })
    }
    log(`Seeded ${faqs.length} FAQs`)
  }

  // ── Testimonials ───────────────────────────────────────────────────────
  if (await isEmpty(payload, 'testimonials')) {
    for (const t of testimonials) {
      let moduleId: string | undefined
      if (t.moduleSlug) {
        const found = await payload.find({
          collection: 'modules',
          where: { slug: { equals: t.moduleSlug } },
          limit: 1,
        })
        moduleId = found.docs[0] ? String(found.docs[0].id) : undefined
      }
      await payload.create({
        collection: 'testimonials',
        data: {
          quote: t.quote,
          author: t.author,
          role: t.role,
          company: t.company,
          metric: t.metric,
          module: moduleId,
        },
      })
    }
    log(`Seeded ${testimonials.length} testimonials`)
  }

  // ── Case studies ───────────────────────────────────────────────────────
  if (await isEmpty(payload, 'case-studies')) {
    for (const cs of caseStudies) {
      await payload.create({
        collection: 'case-studies',
        data: { ...cs, publishedAt: new Date().toISOString() },
      })
    }
    log(`Seeded ${caseStudies.length} case studies`)
  }

  // ── Blog posts ─────────────────────────────────────────────────────────
  if (await isEmpty(payload, 'blog-posts')) {
    for (const post of blogPosts) {
      await payload.create({
        collection: 'blog-posts',
        data: {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          category: post.category,
          publishedAt: post.publishedAt,
          content: lexicalFromParagraphs(post.paragraphs),
        },
      })
    }
    log(`Seeded ${blogPosts.length} blog posts`)
  }

  // ── Globals ────────────────────────────────────────────────────────────
  await payload.updateGlobal({ slug: 'navigation', data: nav })
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'EZCRM',
      tagline: 'The sales command center for Indian teams',
      supportEmail: 'support@ezcrm.in',
      footerNote: 'Made for the Indian sales floor.',
    },
  })

  // Homepage global: only populate when empty, so re-seeding never clobbers
  // edits made in the admin. Pre-filling lets editors see the live copy.
  const homepage = (await payload.findGlobal({ slug: 'homepage' })) as unknown as Record<string, unknown>
  if (!homepage?.heroHeading) {
    await payload.updateGlobal({
      slug: 'homepage',
      data: {
        heroKicker: 'EZCRM · CRM for Indian sales teams',
        heroHeading: 'Run your entire sales floor from one screen.',
        heroSubheading:
          'IndiaMART, JustDial, Facebook and WhatsApp leads — captured in seconds, routed round-robin, followed up on time, and quoted with correct GST.',
        heroPrimaryCta: { label: 'Book a demo', href: '/demo' },
        heroSecondaryCta: { label: 'See it live', href: '#live' },
        heroTrustText: '500+ teams',
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
        whatsappKicker: 'The channel customers actually answer',
        whatsappHeading: 'One WhatsApp number. Your whole team. Every chat on record.',
        whatsappBody:
          'Move off personal phones and onto a shared inbox on Meta’s official API. Conversations stay with the business when staff leave, managers see who answered whom, and broadcasts go out on approved templates — safely.',
        whatsappPoints: [
          { point: 'Official Meta WhatsApp Business API — no ban risk' },
          { point: 'Shared team inbox with round-robin agent assignment' },
          { point: 'Approved-template broadcasts with per-recipient read logs' },
        ],
        ctaHeading: 'See your own pipeline on this screen.',
        ctaSubheading:
          'A 30-minute demo with your lead sources, your stages and your WhatsApp number. No slideware.',
        ctaPrimary: { label: 'Book a demo', href: '/demo' },
        ctaSecondary: { label: 'See pricing', href: '/pricing' },
      },
    })
    log('Seeded homepage content')
  }
  log('Updated globals')

  log('Seed complete.')
}

// Top-level await keeps module evaluation alive until seeding finishes.
// Without it, `payload run` exits the moment this module finishes evaluating
// and kills the async work before any document is written.
try {
  await seed()
  process.exit(0)
} catch (error) {
  console.error('[seed] failed:', error)
  process.exit(1)
}
