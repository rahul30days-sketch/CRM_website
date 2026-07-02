'use server'

import { headers } from 'next/headers'
import { z } from 'zod'
import isEmail from 'validator/lib/isEmail'
import isMobilePhone from 'validator/lib/isMobilePhone'
import { getPayload } from 'payload'
import config from '@payload-config'

import { env } from '@/env'
import { clientIpFrom, consume } from '@/lib/rate-limit'
import { modules } from '@/content/modules'

const moduleSlugs = modules.map((m) => m.slug) as [string, ...string[]]

/**
 * Public form handlers. Defense layers, in order:
 * 1. Next.js Server Actions' built-in same-origin enforcement
 * 2. Explicit origin/referer verification against SITE_URL (below)
 * 3. Honeypot field + minimum-fill-time bot check
 * 4. Token-bucket rate limit per IP per form
 * 5. Zod schema validation with validator.js for structured formats
 * 6. Writes go through the Payload Local API — the REST create endpoints
 *    for these collections are closed (`create: nobody`).
 *
 * No custom regex anywhere in this file — structured checks use
 * validator.js, everything else is length/enum constraints.
 */

export type FormState = {
  status: 'idle' | 'success' | 'error'
  message: string
  fieldErrors?: Record<string, string>
}

const GENERIC_ERROR: FormState = {
  status: 'error',
  message: 'Something went wrong on our side. Please try again, or email hello@ezcrm.in.',
}

async function verifyOrigin(): Promise<boolean> {
  const h = await headers()
  const expected = new URL(env.SITE_URL).host
  const origin = h.get('origin')
  const referer = h.get('referer')
  const check = (value: string | null) => {
    if (!value) return false
    try {
      return new URL(value).host === expected
    } catch {
      return false
    }
  }
  // Dev convenience: localhost origins vary by port.
  if (env.NODE_ENV !== 'production') return true
  return check(origin) || check(referer)
}

function botChecks(formData: FormData): boolean {
  // Honeypot: real users never see or fill "website".
  if (String(formData.get('website') ?? '') !== '') return false
  // Time trap: humans don't complete a demo form in under 3 seconds.
  const renderedAt = Number(formData.get('renderedAt') ?? 0)
  if (renderedAt > 0 && Date.now() - renderedAt < 3000) return false
  return true
}

const demoRequestSchema = z.object({
  name: z.string().trim().min(2, 'Please tell us your name.').max(120),
  workEmail: z
    .string()
    .trim()
    .max(254)
    .refine((v) => isEmail(v), 'That email doesn’t look right.'),
  phone: z
    .string()
    .trim()
    .max(20)
    .refine((v) => isMobilePhone(v, 'en-IN', { strictMode: false }), 'Please enter a valid Indian mobile number.'),
  company: z.string().trim().min(2, 'Please tell us your company name.').max(160),
  companySize: z.enum(['1-5', '6-20', '21-50', '51-200', '200+']).optional(),
  interest: z.enum(moduleSlugs).optional(),
  message: z.string().trim().max(2000).optional(),
  source: z.string().trim().max(120).optional(),
})

export async function submitDemoRequest(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    if (!(await verifyOrigin())) return GENERIC_ERROR
    if (!botChecks(formData)) {
      // Don't tip off bots — pretend success.
      return { status: 'success', message: 'Thanks! We’ll be in touch shortly.' }
    }

    const h = await headers()
    const { allowed } = consume(`demo:${clientIpFrom(h)}`, { capacity: 5, refillPerMinute: 0.5 })
    if (!allowed) {
      return {
        status: 'error',
        message: 'Too many requests from this connection. Please try again in a few minutes.',
      }
    }

    const parsed = demoRequestSchema.safeParse({
      name: formData.get('name'),
      workEmail: formData.get('workEmail'),
      phone: formData.get('phone'),
      company: formData.get('company'),
      companySize: formData.get('companySize') || undefined,
      interest: formData.get('interest') || undefined,
      message: formData.get('message') || undefined,
      source: formData.get('source') || undefined,
    })

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? 'form')
        if (!fieldErrors[key]) fieldErrors[key] = issue.message
      }
      return { status: 'error', message: 'Please fix the highlighted fields.', fieldErrors }
    }

    const payload = await getPayload({ config })

    // Resolve the interest slug to a module document, if one is seeded.
    const { interest, ...data } = parsed.data
    let moduleInterest: string[] | undefined
    if (interest) {
      const found = await payload.find({
        collection: 'modules',
        where: { slug: { equals: interest } },
        limit: 1,
        overrideAccess: true,
      })
      moduleInterest = found.docs[0] ? [String(found.docs[0].id)] : undefined
    }

    await payload.create({
      collection: 'demo-requests',
      overrideAccess: true, // sole write path; REST create is closed
      data: {
        ...data,
        moduleInterest,
        source: [data.source, interest ? `interest:${interest}` : null].filter(Boolean).join(' · ') || undefined,
        status: 'new',
      },
    })

    return {
      status: 'success',
      message: 'Thanks! A product specialist will call you within one working day.',
    }
  } catch (error) {
    console.error('demo-request submission failed:', error)
    return GENERIC_ERROR
  }
}

const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .max(254)
    .refine((v) => isEmail(v), 'That email doesn’t look right.'),
})

export async function subscribeNewsletter(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    if (!(await verifyOrigin())) return GENERIC_ERROR
    if (!botChecks(formData)) return { status: 'success', message: 'You’re on the list.' }

    const h = await headers()
    const { allowed } = consume(`newsletter:${clientIpFrom(h)}`, { capacity: 3, refillPerMinute: 0.2 })
    if (!allowed) {
      return { status: 'error', message: 'Too many attempts. Please try again later.' }
    }

    const parsed = newsletterSchema.safeParse({ email: formData.get('email') })
    if (!parsed.success) {
      return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Invalid email.' }
    }

    const payload = await getPayload({ config })
    const existing = await payload.find({
      collection: 'newsletter-subscribers',
      where: { email: { equals: parsed.data.email } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'newsletter-subscribers',
        overrideAccess: true,
        data: { email: parsed.data.email, status: 'subscribed', source: 'site-footer' },
      })
    }

    return { status: 'success', message: 'You’re on the list — one useful email a month, no spam.' }
  } catch (error) {
    console.error('newsletter subscription failed:', error)
    return GENERIC_ERROR
  }
}
