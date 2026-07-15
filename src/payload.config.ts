import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'

import { env } from '@/env'
import { Users } from '@/collections/Users'
import { Media } from '@/collections/Media'
import { Pages } from '@/collections/Pages'
import { Modules } from '@/collections/Modules'
import { BlogPosts } from '@/collections/BlogPosts'
import { CaseStudies } from '@/collections/CaseStudies'
import { Testimonials } from '@/collections/Testimonials'
import { PricingPlans } from '@/collections/PricingPlans'
import { Faqs } from '@/collections/Faqs'
import { TeamMembers } from '@/collections/TeamMembers'
import { Integrations } from '@/collections/Integrations'
import { Comparisons } from '@/collections/Comparisons'
import { DemoRequests } from '@/collections/DemoRequests'
import { NewsletterSubscribers } from '@/collections/NewsletterSubscribers'
import { AuditLogs } from '@/collections/AuditLogs'
import { SiteSettings } from '@/globals/SiteSettings'
import { Navigation } from '@/globals/Navigation'
import { Pricing } from '@/globals/Pricing'
import { Homepage } from '@/globals/Homepage'
import { DemoPage } from '@/globals/DemoPage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    // Initials avatar — avoids an external Gravatar fetch that our strict
    // Content-Security-Policy (img-src 'self') would block.
    avatar: 'default',
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '· EZCRM CMS',
    },
  },
  collections: [
    Pages,
    Modules,
    BlogPosts,
    CaseStudies,
    Testimonials,
    PricingPlans,
    Faqs,
    TeamMembers,
    Integrations,
    Comparisons,
    Media,
    DemoRequests,
    NewsletterSubscribers,
    AuditLogs,
    Users,
  ],
  globals: [Homepage, Pricing, SiteSettings, Navigation, DemoPage],
  editor: lexicalEditor(),
  i18n: {
    translations: {
      en: {
        authentication: {
          // The admin UI hardcodes the password input without a placeholder,
          // so the requirement is surfaced in the field label instead.
          // Keep in sync with PASSWORD_MIN_LENGTH in collections/Users.ts.
          newPassword: 'New Password (at least 8 characters)',
        },
      },
    },
  },
  // One less exposed surface: the site only uses the Local API.
  graphQL: { disable: true },
  secret: env.PAYLOAD_SECRET,
  db: mongooseAdapter({
    url: env.DATABASE_URI,
    connectOptions: {
      // Fail fast if Atlas is unreachable instead of hanging requests.
      serverSelectionTimeoutMS: 5000,
    },
  }),
  sharp,
  // CORS/CSRF locked to our own origin — no wildcards, ever.
  cors: [env.SITE_URL],
  csrf: [env.SITE_URL],
  upload: {
    limits: {
      // Media uploads get their own explicit cap (8 MB); JSON bodies are
      // limited to 100 KB in middleware and Server Action config.
      fileSize: 8 * 1024 * 1024,
    },
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
