import type { Metadata, Viewport } from 'next'
import { Inter, Inter_Tight, JetBrains_Mono } from 'next/font/google'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { RouteTransitionProvider } from '@/components/route-transition-provider'
import { getSiteSettings } from '@/lib/cms'
import './globals.css'

// Display: bold, slightly geometric, tight tracking on large sizes.
const display = Inter_Tight({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const body = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

// Numerals: tabular, precise — the product's whole promise.
const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  // Point at the stable dynamic endpoint (src/app/site-favicon) rather than the
  // media URL directly, so favicon changes in the admin take effect without a
  // rebuild and a cached fallback render can't pin the wrong icon into static HTML.
  const faviconUrl = '/site-favicon'

  const title = `${settings.siteName} — ${settings.tagline}`
  const description =
    'Leads, WhatsApp, quotations and pipelines on one screen. EZCRM pulls enquiries from IndiaMART, JustDial and Facebook, routes them in seconds, and shows you the numbers all day.'

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s · ${settings.siteName}`,
    },
    description,
    applicationName: settings.siteName,
    authors: [{ name: settings.siteName }],
    creator: settings.siteName,
    publisher: settings.siteName,
    category: 'business software',
    keywords: [
      'CRM',
      'CRM software India',
      'sales CRM',
      'WhatsApp CRM',
      'IndiaMART CRM integration',
      'JustDial leads',
      'lead management software',
      'GST quotation software',
      'sales pipeline',
      'sales automation',
      'CRM for small business',
    ],
    // Per-page self-referencing canonical (resolved against metadataBase + path).
    alternates: { canonical: './' },
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
    openGraph: {
      type: 'website',
      siteName: settings.siteName,
      title,
      description,
      url: './',
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
  }
}

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="flex min-h-screen flex-col">
        <RouteTransitionProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-chip focus:bg-brand focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-white"
          >
            Skip to content
          </a>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </RouteTransitionProvider>
      </body>
    </html>
  )
}
