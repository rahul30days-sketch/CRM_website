import { z } from 'zod'

/**
 * Full env schema, validated once at boot. A missing secret fails the process
 * immediately instead of surfacing as a 500 at request time.
 *
 * Nothing in this file may ever be NEXT_PUBLIC_*: every value here is
 * server-only. The single public value the frontend needs (the site URL for
 * canonical/OG tags) is intentionally duplicated as NEXT_PUBLIC_SITE_URL and
 * contains no secret.
 */
const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URI: z
    .string()
    .min(1, 'DATABASE_URI is required (MongoDB Atlas connection string)'),
  PAYLOAD_SECRET: z
    .string()
    .min(32, 'PAYLOAD_SECRET must be at least 32 characters — generate with `openssl rand -hex 32`'),
  SITE_URL: z.string().url().default('http://localhost:3000'),
  // Optional integrations — validated when present so a typo fails fast.
  REVALIDATION_SECRET: z.string().min(16).optional(),
  // CRM incoming-webhook URL — demo/contact leads are forwarded here.
  // Contains a secret token, so it is server-only (never NEXT_PUBLIC_).
  CRM_WEBHOOK_URL: z.string().url().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
})

const parsed = serverEnvSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URI: process.env.DATABASE_URI,
  PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
  SITE_URL: process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL,
  REVALIDATION_SECRET: process.env.REVALIDATION_SECRET,
  CRM_WEBHOOK_URL: process.env.CRM_WEBHOOK_URL,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
})

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
    .join('\n')
  throw new Error(`Invalid environment configuration:\n${issues}`)
}

export const env = parsed.data
