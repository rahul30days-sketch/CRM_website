# EZCRM 3.0 — Marketing Website

The public marketing site for EZCRM: Next.js 15 (App Router, RSC, Server Actions) +
Payload CMS 3 + MongoDB Atlas, in a single Node process (Payload's Local API — no
network hop between frontend and CMS).

## Design rationale

EZCRM's real hero moment is a screen full of live numbers, so the site is built as an
**operations console** rather than a startup landing page: the homepage hero is a working
dashboard component (KPIs counting up, a pipeline card closing, a WhatsApp thread answering
itself), followed by a live-events ticker and a dense module *registry* instead of icon-card
grids. The palette — deep blue-green console ink with a plural, functional signal system
(marigold for CTAs/headline KPIs, green = won, sky = info, rose = overdue) — mirrors how the
product itself uses color, deliberately avoiding both the cream-and-terracotta and the
near-black-plus-one-acid-accent clichés. Type is Bricolage Grotesque (display, sparingly),
IBM Plex Sans (body) and IBM Plex Mono for every number on the site, because the value
proposition is numbers you can trust and tabular figures are how you show that. Motion is
limited to three deliberate moments (hero boot sequence, scroll-driven "follow one lead"
journey, WhatsApp micro-interaction), all gated on `prefers-reduced-motion`.

## Stack

| Layer      | Choice                                              |
| ---------- | --------------------------------------------------- |
| Frontend   | Next.js 15, TypeScript strict, Tailwind CSS, Framer Motion |
| Components | shadcn-style primitives (cva), re-tokened to the console theme |
| CMS        | Payload 3 (Lexical rich text, Local API), mounted at `/admin` |
| Database   | MongoDB Atlas (Mongoose adapter)                     |

## Local setup

1. **Prereqs:** Node ≥ 18.20, a MongoDB connection (Atlas free tier or local `mongod`).

2. **Configure env:**
   ```bash
   cp .env.example .env
   # set DATABASE_URI (Atlas: Database → Connect → Drivers)
   # set PAYLOAD_SECRET: openssl rand -hex 32
   ```
   The env schema is validated at boot (`src/env.ts`) — a missing/short secret fails
   immediately with a readable error.

3. **Install & run:**
   ```bash
   npm install
   npm run dev          # site on http://localhost:3000, admin on /admin
   ```

4. **Seed content** (modules, pricing, FAQs, testimonials, case studies, blog, nav):
   ```bash
   npm run seed
   ```
   Creates `admin@ezcrm.in` with a generated password printed once to the console
   (or set `SEED_ADMIN_PASSWORD` first). Seeding is idempotent — it skips any
   collection that already has documents.

   > **No database yet?** The site still runs and builds: every CMS read falls back
   > to the factory content in `src/content/*`. Once seeded, editors own the copy
   > in Payload.

5. **Other scripts:** `npm run build` / `start` / `typecheck` / `generate:types`.

## Content model (Payload)

Collections: `pages` (block-based landing pages, rendered by the `[slug]` catch-all),
`modules`, `blog-posts`, `case-studies`, `testimonials`, `pricing-plans`, `faqs`,
`team-members`, `integrations`, `media`, plus lead capture (`demo-requests`,
`newsletter-subscribers`) and the system-written `audit-logs`. Globals: `site-settings`,
`navigation` (menus editable without a deploy).

Access policy: anonymous API users have **zero** read/update/delete access to every
collection (media files excepted — they're the site's own imagery). Public forms write
through Server Actions + the Local API only; the REST `create` endpoints for lead
collections are closed. GraphQL is disabled entirely.

## Security controls (implemented, not aspirational)

- **Headers** (`src/middleware.ts`): CSP, `X-Frame-Options: DENY`, `nosniff`,
  `Referrer-Policy`, `Permissions-Policy`, HSTS in production. CSP keeps
  `script-src 'unsafe-inline'` only because the pages are statically generated and a
  nonce CSP would force full dynamic rendering — the trade-off and the switch point
  are documented in the middleware.
- **Forms** (`src/lib/actions.ts`): Server Actions with origin/referer verification,
  honeypot + minimum-fill-time bot checks, per-IP token-bucket rate limiting, Zod
  schemas with validator.js for email/phone (no custom regex anywhere), 100 KB body
  limit. API JSON bodies are capped in middleware; uploads capped at 8 MB in Payload.
- **Auth**: Payload bcrypt hashing; password policy 8–128 chars rejected before
  hashing (no silent truncation), with the minimum shown on the admin password
  field label; `maxLoginAttempts: 5` + 10-minute lockout; 2-hour
  tokens; `Secure`/`HttpOnly`/`SameSite=Strict` cookies; MFA-ready user shape
  (`mfa` group reserved, no launch behavior depends on it).
- **Audit trail**: `afterLogin`/`afterLogout`/login-attempt/`afterChange`/`afterDelete`
  hooks write who/what/when/where to the append-only `audit-logs` collection
  (admin-read-only, no API write path).
- **Secrets**: zero `NEXT_PUBLIC_*` secrets; full env schema Zod-validated at boot;
  `.env.example` ships placeholders only.
- **Rich text**: Lexical JSON rendered via Payload's official React serializer —
  no `dangerouslySetInnerHTML` on CMS strings, no eval/Function/vm anywhere.

## Performance & SEO

SSG/ISR everywhere (`revalidate` 300–3600s) with a secured revalidation webhook at
`POST /api/revalidate` (Bearer `REVALIDATION_SECRET`); `next/font` with three
self-hosted families; Metadata API per page; dynamic OG images for blog posts;
JSON-LD (`Organization`, `SoftwareApplication`, `FAQPage`, `BreadcrumbList`,
`BlogPosting`); `sitemap.xml`/`robots.txt` generated from content.

## Deployment notes

- **Host**: any Node host (Vercel, Railway, a VPS behind nginx). Single process serves
  both site and CMS. Inject secrets via the platform's secret manager — never commit `.env`.
- **Admin isolation**: for a separate CMS origin (e.g. `cms.ezcrm.in`), deploy a second
  instance of this app serving only `/admin` + `/api` and point DNS at it; set `SITE_URL`
  accordingly so CORS/CSRF allowlists stay correct.
- **Rate limiting** is in-memory (fine for one instance). Scaling horizontally? Swap
  `src/lib/rate-limit.ts` internals for Upstash Redis — call sites don't change.
- **Media** is stored on local disk (`/media`); use a volume, or add a Payload storage
  adapter (S3/R2) for multi-instance deployments.
- **Webhook**: add a Payload `afterChange` hook or CI step to POST to `/api/revalidate`
  after publishing so ISR pages refresh immediately.
