/**
 * Site origin and indexing policy — one place, so canonicals, sitemap,
 * robots and JSON-LD can never disagree.
 */

/** Canonical origin, no trailing slash. Set NEXT_PUBLIC_SITE_URL in production. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(
  /\/$/,
  '',
)

const isLocalOrigin = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(SITE_URL)

/**
 * Whether search engines may index this deployment. All must hold:
 *  - a production build;
 *  - on Vercel, the production environment (preview / development branch
 *    URLs are never indexed);
 *  - a real public SITE_URL — if it's missing, canonicals would point at
 *    localhost, so we refuse to index rather than publish broken canonicals;
 *  - not explicitly switched off with NEXT_PUBLIC_NOINDEX=1 (use that on any
 *    non-Vercel staging host).
 */
export const INDEXABLE =
  process.env.NODE_ENV === 'production' &&
  (process.env.VERCEL_ENV === undefined || process.env.VERCEL_ENV === 'production') &&
  !isLocalOrigin &&
  process.env.NEXT_PUBLIC_NOINDEX !== '1'
