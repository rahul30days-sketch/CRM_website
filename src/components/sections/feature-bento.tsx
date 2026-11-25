'use client'

/**
 * Homepage "The platform" — an asymmetric bento of every EZCRM module.
 *
 * Idea: instead of icon cards, each module shows a miniature of itself doing
 * its job (a lead arriving, a deal changing column, a GST total recalculating).
 * Titles and taglines come from the CMS `modules` prop; the order and size of
 * cards come from LAYOUT below, and any module not listed there still renders
 * as a medium card with a generic preview.
 *
 * Layout: 12-column grid with fixed row height at lg (two 2-row hero cards,
 * mediums and smalls, `grid-flow-dense` so unknown modules fill gaps), two
 * columns at md (heroes span both), one column on phones.
 *
 * Motion & a11y: previews loop slowly only while on screen; a section-level
 * Pause button stops every loop (WCAG 2.2.2). Each card is one link named by
 * its module title. Reduced motion shows static final states. All figures and
 * names are sample data, flagged with one SampleBadge for the grid.
 */

import Link from 'next/link'
import { useState, type ComponentType } from 'react'
import { ArrowRight, Pause, Play } from 'lucide-react'
import { moduleCategories, type ModuleContent } from '@/content/modules'
import { SampleBadge, SectionHeader } from '@/components/demo/kit'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { BentoCard, type BentoSize } from '@/components/bento/bento-card'
import {
  AutomationsPreview,
  CalendarPreview,
  ChatbotPreview,
  ContactsPreview,
  DashboardPreview,
  EmailPreview,
  GenericPreview,
  IntegrationsPreview,
  LeadsPreview,
  MediaPreview,
  PipelinePreview,
  QuotationsPreview,
  SmsPreview,
  TicketingPreview,
  WhatsAppPreview,
  type PreviewProps,
} from '@/components/bento/previews'

type Preview = ComponentType<PreviewProps & { uid: string }>

interface Slot {
  span: string
  size: BentoSize
  Preview: Preview
  tone?: 'light' | 'night'
}

const HERO = 'md:col-span-2 lg:row-span-2'

/** Spans are tuned so the default 14-module order tiles 12 columns exactly. */
const LAYOUT: Record<string, Slot> = {
  dashboard: { span: cn(HERO, 'lg:col-span-7'), size: 'hero', Preview: DashboardPreview, tone: 'night' },
  leads: { span: 'lg:col-span-5', size: 'medium', Preview: LeadsPreview },
  'deals-pipeline': { span: 'lg:col-span-5', size: 'medium', Preview: PipelinePreview },
  contacts: { span: 'lg:col-span-4', size: 'medium', Preview: ContactsPreview },
  ticketing: { span: 'lg:col-span-4', size: 'medium', Preview: TicketingPreview },
  'email-campaigns': { span: 'lg:col-span-4', size: 'medium', Preview: EmailPreview },
  'sms-campaigns': { span: 'lg:col-span-3', size: 'small', Preview: SmsPreview },
  whatsapp: { span: cn(HERO, 'lg:col-span-5'), size: 'hero', Preview: WhatsAppPreview },
  'lead-integrations': { span: 'lg:col-span-4', size: 'medium', Preview: IntegrationsPreview },
  quotations: { span: 'lg:col-span-3', size: 'small', Preview: QuotationsPreview },
  automations: { span: 'lg:col-span-4', size: 'medium', Preview: AutomationsPreview },
  'ai-chatbot': { span: 'lg:col-span-5', size: 'medium', Preview: ChatbotPreview },
  calendar: { span: 'lg:col-span-4', size: 'medium', Preview: CalendarPreview },
  'media-library': { span: 'lg:col-span-3', size: 'small', Preview: MediaPreview },
}

const FALLBACK: Slot = { span: 'lg:col-span-4', size: 'medium', Preview: GenericPreview }

/**
 * The homepage shows only these six as cards (dashboard hero + five), in a
 * clean 12-column, 3-row layout. Every other module is listed as a text link
 * underneath, and all of them are on /features.
 */
const FEATURED: { slug: string; span: string; size: BentoSize }[] = [
  { slug: 'dashboard', span: cn(HERO, 'lg:col-span-7'), size: 'hero' },
  { slug: 'leads', span: 'lg:col-span-5', size: 'medium' },
  { slug: 'deals-pipeline', span: 'lg:col-span-5', size: 'medium' },
  { slug: 'whatsapp', span: 'lg:col-span-4', size: 'medium' },
  { slug: 'quotations', span: 'lg:col-span-4', size: 'medium' },
  { slug: 'automations', span: 'lg:col-span-4', size: 'medium' },
]

export function FeatureBento({ modules }: { modules: ModuleContent[] }) {
  const [paused, setPaused] = useState(false)
  const bySlug = new Map(modules.map((m) => [m.slug, m]))
  const featured = FEATURED.flatMap((f) => {
    const m = bySlug.get(f.slug)
    return m ? [{ m, f }] : []
  })
  const featuredSlugs = new Set(featured.map(({ m }) => m.slug))
  const others = modules.filter((m) => !featuredSlugs.has(m.slug))

  return (
    <section className="py-16 lg:py-24" aria-labelledby="feature-bento-title">
      <div className="shell">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            id="feature-bento-title"
            align="left"
            kicker="The platform"
            title="One platform. Every part of the sale."
            lede="From first enquiry to final payment. Hover or focus a module to watch it work, then open it for the full tour."
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-pressed={paused}
              className={buttonVariants({ variant: 'ghost', size: 'sm' })}
            >
              {paused ? <Play className="h-4 w-4" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}
              {paused ? 'Play previews' : 'Pause previews'}
            </button>
            <Link href="/features" className={buttonVariants({ variant: 'secondary', size: 'sm' })}>
              Explore all modules
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>

        <div className="mt-6 flex justify-start">
          <SampleBadge label="Previews use sample data · illustrative" />
        </div>

        <ul
          className="mt-6 grid grid-cols-1 gap-3 md:grid-flow-dense md:grid-cols-2 lg:auto-rows-[17rem] lg:grid-cols-12 lg:gap-4"
          aria-label="EZCRM modules"
        >
          {featured.map(({ m, f }, i) => {
            const slot = LAYOUT[m.slug] ?? FALLBACK
            return (
              <BentoCard
                key={m.slug}
                slug={m.slug}
                title={m.title}
                tagline={m.tagline}
                category={moduleCategories[m.category]?.label}
                Preview={slot.Preview}
                span={f.span}
                size={f.size}
                tone={slot.tone}
                index={i}
                paused={paused}
              />
            )
          })}
        </ul>

        {others.length > 0 ? (
          <div className="mt-8 flex flex-wrap items-baseline gap-x-2 gap-y-2 text-sm">
            <span className="font-semibold text-ink">Plus {others.length} more:</span>
            {others.map((m, i) => (
              <span key={m.slug} className="text-slate">
                <Link href={`/features/${m.slug}`} className="text-slate underline-offset-4 hover:text-brand hover:underline">
                  {m.title}
                </Link>
                {i < others.length - 1 ? ',' : ''}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
