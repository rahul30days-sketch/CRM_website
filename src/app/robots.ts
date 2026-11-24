import type { MetadataRoute } from 'next'

/**
 * Robots policy.
 *
 * Everything public is crawlable; /admin and /api are not. For GEO we also
 * explicitly welcome the major AI answer-engine crawlers (OpenAI, Perplexity,
 * Anthropic, Google-Extended, Apple, Common Crawl, Cohere) so EZCRM can be
 * read, indexed and cited by generative search — same allowances as general
 * bots, stated explicitly so intent is clear and future-proof.
 */

const AI_BOTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'Perplexity-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'Google-Extended',
  'Applebot-Extended',
  'Amazonbot',
  'CCBot',
  'cohere-ai',
  'Bytespider',
]

export default function robots(): MetadataRoute.Robots {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')
  const disallow = ['/admin', '/api/']

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: '/', disallow })),
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
