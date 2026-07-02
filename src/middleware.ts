import { NextResponse, type NextRequest } from 'next/server'

/**
 * Security headers + API body-size guard.
 *
 * CSP note: marketing pages are statically generated (SSG/ISR), and a
 * nonce-based CSP would force every page dynamic — so `script-src` carries
 * 'unsafe-inline' for Next.js's bootstrap inline script, with everything
 * else locked down ('self' only, no eval, no remote script hosts, no
 * framing, forms post only to ourselves). If the site later runs fully
 * dynamic, switch to the nonce pattern in one place here.
 */

const isProd = process.env.NODE_ENV === 'production'

const CSP = [
  "default-src 'self'",
  // Next.js dev tooling (HMR / React Refresh) and the Payload admin bundle
  // use eval in development; production is built without it and stays strict.
  `script-src 'self' 'unsafe-inline'${isProd ? '' : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isProd ? ['upgrade-insecure-requests'] : []),
].join('; ')

// JSON API bodies are small; media uploads (multipart to /api/media) get
// their own 8 MB cap inside Payload's upload config.
const API_JSON_BODY_LIMIT = 100 * 1024

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/api/') &&
    !pathname.startsWith('/api/media') &&
    ['POST', 'PUT', 'PATCH'].includes(request.method)
  ) {
    const contentLength = Number(request.headers.get('content-length') ?? 0)
    if (contentLength > API_JSON_BODY_LIMIT) {
      return new NextResponse(JSON.stringify({ error: 'Payload too large' }), {
        status: 413,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }

  const response = NextResponse.next()

  response.headers.set('Content-Security-Policy', CSP)
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  )
  if (isProd) {
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
