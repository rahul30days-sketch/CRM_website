import type { MetadataRoute } from 'next'
import { INDEXABLE, SITE_URL } from '@/lib/site'

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
  // Preview / development deployments: block everything so branch URLs never
  // compete with production in search results.
  if (!INDEXABLE) {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }

  const disallow = ['/admin', '/api/']

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: '/', disallow })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
