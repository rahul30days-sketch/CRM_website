import type { MetadataRoute } from 'next'
import { modules } from '@/content/modules'
import { industries } from '@/content/site'
import { getBlogPosts, getCaseStudies, getComparisons, getModules } from '@/lib/cms'
import { SITE_URL } from '@/lib/site'
import { BUSINESS } from '@/content/business'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = SITE_URL
  const now = new Date()

  const staticRoutes = [
    '',
    '/features',
    '/pricing',
    '/integrations',
    '/security',
    '/blog',
    '/about',
    '/contact',
    '/demo',
    '/experience',
    '/vs',
    '/legal/privacy',
    '/legal/terms',
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    priority: path === '' ? 1 : path === '/demo' || path === '/experience' ? 0.9 : 0.7,
  }))

  const [cmsModules, posts, caseStudies, cmsComparisons] = await Promise.all([
    getModules().catch(() => modules),
    getBlogPosts().catch(() => []),
    getCaseStudies().catch(() => []),
    getComparisons().catch(() => []),
  ])

  return [
    ...staticRoutes,
    ...cmsModules.map((m) => ({ url: `${siteUrl}/features/${m.slug}`, lastModified: now, priority: 0.8 })),
    ...industries.map((i) => ({ url: `${siteUrl}/solutions/${i.slug}`, lastModified: now, priority: 0.7 })),
    // Comparison pages are high-intent — prioritise them for crawlers.
    ...cmsComparisons.map((c) => ({ url: `${siteUrl}/vs/${c.slug}`, lastModified: now, priority: 0.8 })),
    ...posts.map((p) => ({ url: `${siteUrl}/blog/${p.slug}`, lastModified: new Date(p.publishedAt), priority: 0.6 })),
    // Customer stories are listed only once verified (content/business.ts);
    // until then those pages are noindex.
    ...(BUSINESS.socialProofVerified
      ? [
          { url: `${siteUrl}/customers`, lastModified: now, priority: 0.7 },
          ...caseStudies.map((c) => ({ url: `${siteUrl}/customers/${c.slug}`, lastModified: now, priority: 0.6 })),
        ]
      : []),
  ]
}
