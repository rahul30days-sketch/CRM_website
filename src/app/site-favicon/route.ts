import { NextResponse } from 'next/server'
import { getSiteSettings } from '@/lib/cms'

/**
 * Stable favicon endpoint. The site's <head> always points here
 * (`<link rel="icon" href="/site-favicon">`), so the static HTML never goes
 * stale. This handler resolves the *current* Site Settings favicon on every
 * request and redirects to it — so changing the favicon in the admin takes
 * effect immediately, with no rebuild. Falls back to the bundled /icon.svg
 * when no favicon is set or the DB is briefly unreachable (never cached wrong,
 * because the resolution happens per-request).
 */
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const origin = new URL(request.url).origin
  let target = '/icon.svg'
  try {
    const settings = await getSiteSettings()
    if (settings.favicon?.url) target = settings.favicon.url
  } catch {
    // keep the /icon.svg default
  }
  const res = NextResponse.redirect(new URL(target, origin), 307)
  // Short cache so a favicon change propagates quickly but we don't hit the DB
  // on every single request.
  res.headers.set('Cache-Control', 'public, max-age=300, must-revalidate')
  return res
}
