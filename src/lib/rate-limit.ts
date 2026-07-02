/**
 * In-memory token-bucket rate limiter, keyed by caller-supplied key
 * (typically `${bucket}:${ip}`).
 *
 * Suitable for a single-instance deployment. If you scale horizontally,
 * swap `consume` for a shared store (e.g. Upstash Redis token bucket) —
 * the call sites don't change.
 *
 * Nothing here persists: IPs live in process memory only and evaporate on
 * restart, which is the PII-retention posture we want for abuse signals.
 */

type Bucket = { tokens: number; lastRefill: number }

const buckets = new Map<string, Bucket>()
const MAX_BUCKETS = 10_000

export interface RateLimitOptions {
  /** Max burst size. */
  capacity: number
  /** Tokens restored per minute. */
  refillPerMinute: number
}

export function consume(
  key: string,
  { capacity, refillPerMinute }: RateLimitOptions,
): { allowed: boolean } {
  const now = Date.now()

  // Crude memory bound: reset the map rather than grow unbounded under a
  // spoofed-IP flood. Failing open here is acceptable — CAPTCHA/honeypot and
  // validation still stand in front of anything destructive.
  if (buckets.size > MAX_BUCKETS) buckets.clear()

  const bucket = buckets.get(key) ?? { tokens: capacity, lastRefill: now }
  const elapsedMinutes = (now - bucket.lastRefill) / 60_000
  bucket.tokens = Math.min(capacity, bucket.tokens + elapsedMinutes * refillPerMinute)
  bucket.lastRefill = now

  if (bucket.tokens < 1) {
    buckets.set(key, bucket)
    return { allowed: false }
  }

  bucket.tokens -= 1
  buckets.set(key, bucket)
  return { allowed: true }
}

/** First hop of x-forwarded-for, or a stable sentinel. Never trusted for auth. */
export function clientIpFrom(headers: Headers): string {
  return headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}
