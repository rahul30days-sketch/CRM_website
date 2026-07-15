import type { MetadataRoute } from 'next'
import { modules } from '@/content/modules'
import { industries } from '@/content/site'
import { getBlogPosts, getCaseStudies, getComparisons, getModules } from '@/lib/cms'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const now = new Date()

  const staticRoutes = [
    '',
    '/features',
    '/pricing',
    '/integrations',
    '/security',
    '/customers',
    '/blog',
    '/about',
    '/contact',
    '/demo',
    '/vs',
    '/legal/privacy',
    '/legal/terms',
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    priority: path === '' ? 1 : path === '/demo' ? 0.9 : 0.7,
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
    ...caseStudies.map((c) => ({ url: `${siteUrl}/customers/${c.slug}`, lastModified: now, priority: 0.6 })),
  ]
}
