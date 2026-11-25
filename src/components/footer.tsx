import Link from 'next/link'
import { BUSINESS } from '@/content/business'
import { getNavigation, getSiteSettings } from '@/lib/cms'
import { NewsletterForm } from '@/components/forms/newsletter-form'
import EZPZTypeCube from '@/components/ui/ezpz-type-cube'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export async function Footer() {
  const [{ footer }, settings] = await Promise.all([getNavigation(), getSiteSettings()])
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line bg-sky">
      {/* Branded CTA band with the EZCRM typographic cube */}
      <div className="border-b border-line">
        <div className="shell grid items-center gap-10 py-14 lg:grid-cols-2">
          <div>
            <p className="kicker mb-3">Ready when you are</p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Run your entire sales floor from one screen.
            </h2>
            <p className="mt-3 max-w-md text-slate">
              Book a demo and watch your leads, WhatsApp, quotations and pipeline come together in
              one EZCRM.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/demo" className={buttonVariants({ size: 'lg' })}>
                Book a demo
              </Link>
              <Link
                href="/features"
                className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }))}
              >
                Explore features
              </Link>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[18rem]">
            <EZPZTypeCube
              words={['EZCRM', 'EZCRM', 'EZCRM', 'EZCRM']}
              background="transparent"
              topColor="rgb(var(--c-brand))"
              leftColor="rgb(var(--c-brand-deep))"
              rightColor="rgb(var(--c-brand-hi))"
              fontFamily='var(--font-display), "Helvetica Neue", Arial, sans-serif'
              label="EZCRM"
            />
          </div>
        </div>
      </div>

      <div className="shell grid gap-10 py-16 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div className="space-y-4">
          <Link href="/" aria-label={`${settings.siteName} home`} className="inline-block">
            {settings.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.logo.url}
                alt={settings.logo.alt}
                className="h-10 w-auto max-w-[200px] object-contain"
              />
            ) : (
              <span className="font-display text-lg font-extrabold text-ink">
                EZ<span className="text-brand">CRM</span>
              </span>
            )}
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-slate">
            The sales command center for Indian teams — leads, WhatsApp, quotations and pipelines
            on one screen.
          </p>
          <p className="text-sm text-slate">
            A product of{' '}
            <a
              href={BUSINESS.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-ink underline-offset-4 hover:text-brand hover:underline"
            >
              {BUSINESS.company}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
          <NewsletterForm />
        </div>

        {footer.map((group) => (
          <nav key={group.groupTitle} aria-label={group.groupTitle}>
            <p className="kicker mb-3">{group.groupTitle}</p>
            <ul className="space-y-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="shell flex flex-col gap-2 py-5 text-xs text-slate sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {BUSINESS.legalName}. EZCRM is a product of{' '}
            <a
              href={BUSINESS.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 hover:text-ink hover:underline"
            >
              {BUSINESS.company}
            </a>
            .
          </p>
          <p className="font-mono uppercase tracking-wider">
            Made for the Indian sales floor · Data stays yours
          </p>
        </div>
      </div>
    </footer>
  )
}
