/**
 * Header menu structure (information architecture).
 *
 * The *structure* lives here in code; the *content* (module names and
 * taglines, comparisons) still comes from the CMS via lib/cms, so editors
 * keep control of copy. Everything here is plain data — icons are keys that
 * the client header maps to lucide components.
 */

import type { ModuleContent } from '@/content/modules'

export type MenuIcon =
  | 'leads'
  | 'pipeline'
  | 'contacts'
  | 'calendar'
  | 'integrations'
  | 'whatsapp'
  | 'email'
  | 'sms'
  | 'chatbot'
  | 'quotations'
  | 'automations'
  | 'ticketing'
  | 'media'
  | 'dashboard'
  | 'building'
  | 'factory'
  | 'briefcase'
  | 'stories'
  | 'blog'
  | 'compare'
  | 'security'
  | 'about'
  | 'contact'

export interface MenuLink {
  label: string
  href: string
  description?: string
  icon?: MenuIcon
}

export interface MenuGroup {
  label: string
  links: MenuLink[]
}

export interface MenuPanel {
  id: string
  label: string
  groups: MenuGroup[]
  /** Footer links under the panel ("All 14 modules →"). */
  footer: MenuLink[]
  /** Which preview the featured card shows. */
  feature: 'pipeline' | 'industries' | 'proof'
}

export type MenuItem = { kind: 'panel'; panel: MenuPanel } | { kind: 'link'; link: MenuLink }

const MODULE_ICON: Record<string, MenuIcon> = {
  leads: 'leads',
  'deals-pipeline': 'pipeline',
  contacts: 'contacts',
  calendar: 'calendar',
  'lead-integrations': 'integrations',
  whatsapp: 'whatsapp',
  'email-campaigns': 'email',
  'sms-campaigns': 'sms',
  'ai-chatbot': 'chatbot',
  quotations: 'quotations',
  automations: 'automations',
  ticketing: 'ticketing',
  'media-library': 'media',
  dashboard: 'dashboard',
}

/**
 * How the product menu groups the modules. Slugs not listed fall into
 * "Business operations" so a module added in the CMS never disappears.
 */
const PRODUCT_GROUPS: { label: string; slugs: string[] }[] = [
  {
    label: 'Sales management',
    slugs: ['leads', 'deals-pipeline', 'contacts', 'calendar', 'lead-integrations'],
  },
  { label: 'Communication', slugs: ['whatsapp', 'email-campaigns', 'sms-campaigns', 'ai-chatbot'] },
  { label: 'Business operations', slugs: ['quotations', 'automations', 'ticketing', 'media-library'] },
  { label: 'Intelligence', slugs: ['dashboard'] },
]

export function buildMenu({
  modules,
  industries,
  comparisons,
}: {
  modules: Pick<ModuleContent, 'slug' | 'title' | 'tagline'>[]
  industries: { slug: string; name: string; headline: string }[]
  comparisons: { slug: string; competitor: string }[]
}): MenuItem[] {
  const bySlug = new Map(modules.map((m) => [m.slug, m]))
  const placed = new Set<string>()

  const productGroups: MenuGroup[] = PRODUCT_GROUPS.map((g) => ({
    label: g.label,
    links: g.slugs
      .map((slug) => bySlug.get(slug))
      .filter((m): m is NonNullable<typeof m> => Boolean(m))
      .map((m) => {
        placed.add(m.slug)
        return toModuleLink(m)
      }),
  }))
  const unplaced = modules.filter((m) => !placed.has(m.slug)).map(toModuleLink)
  if (unplaced.length) productGroups[2].links.push(...unplaced)

  const industryIcon: Record<string, MenuIcon> = {
    'real-estate': 'building',
    manufacturing: 'factory',
    services: 'briefcase',
  }

  return [
    {
      kind: 'panel',
      panel: {
        id: 'product',
        label: 'Product',
        groups: productGroups.filter((g) => g.links.length > 0),
        footer: [
          { label: `All ${modules.length} modules`, href: '/features' },
          { label: 'Try the interactive playground', href: '/experience' },
        ],
        feature: 'pipeline',
      },
    },
    {
      kind: 'panel',
      panel: {
        id: 'solutions',
        label: 'Solutions',
        groups: [
          {
            label: 'By industry',
            links: industries.map((i) => ({
              label: i.name,
              href: `/solutions/${i.slug}`,
              description: i.headline,
              icon: industryIcon[i.slug] ?? 'briefcase',
            })),
          },
        ],
        footer: [{ label: 'Talk to us about your workflow', href: '/contact' }],
        feature: 'industries',
      },
    },
    { kind: 'link', link: { label: 'Integrations', href: '/integrations' } },
    { kind: 'link', link: { label: 'Pricing', href: '/pricing' } },
    {
      kind: 'panel',
      panel: {
        id: 'resources',
        label: 'Resources',
        groups: [
          {
            label: 'Learn',
            links: [
              {
                label: 'Customer stories',
                href: '/customers',
                description: 'How teams run their sales floor on EZCRM.',
                icon: 'stories',
              },
              {
                label: 'Blog',
                href: '/blog',
                description: 'Field notes on leads, WhatsApp and follow-up.',
                icon: 'blog',
              },
              {
                label: 'Security',
                href: '/security',
                description: 'How your data is protected and who can see it.',
                icon: 'security',
              },
            ],
          },
          {
            label: 'Compare',
            links: comparisons.map((c) => ({
              label: `EZCRM vs ${c.competitor}`,
              href: `/vs/${c.slug}`,
              icon: 'compare' as const,
            })),
          },
          {
            label: 'Company',
            links: [
              { label: 'About', href: '/about', icon: 'about' },
              { label: 'Contact', href: '/contact', icon: 'contact' },
            ],
          },
        ],
        footer: [{ label: 'All comparisons', href: '/vs' }],
        feature: 'proof',
      },
    },
  ]
}

function toModuleLink(m: Pick<ModuleContent, 'slug' | 'title' | 'tagline'>): MenuLink {
  return {
    label: m.title,
    href: `/features/${m.slug}`,
    description: m.tagline,
    icon: MODULE_ICON[m.slug] ?? 'dashboard',
  }
}
