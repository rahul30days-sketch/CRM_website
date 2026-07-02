import { revalidatePath } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'
import { env } from '@/env'

/**
 * Payload → Next.js revalidation webhook. Configure a Payload afterChange
 * hook (or your CMS deploy pipeline) to POST here after publishing:
 *
 *   POST /api/revalidate  Authorization: Bearer <REVALIDATION_SECRET>
 *
 * Constant behavior on failure (404) so the endpoint doesn't advertise
 * itself. Requires REVALIDATION_SECRET to be configured at all.
 */
export async function POST(request: NextRequest) {
  const secret = env.REVALIDATION_SECRET
  const provided = request.headers.get('authorization')?.replace('Bearer ', '')

  if (!secret || !provided || provided !== secret) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Marketing content is interlinked (nav, registry, related modules) —
  // revalidate the whole frontend layout tree in one shot.
  revalidatePath('/', 'layout')
  return NextResponse.json({ revalidated: true })
}
