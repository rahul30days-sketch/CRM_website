import Link from 'next/link'
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
              topColor="#2B5CE6"
              leftColor="#1E42B4"
              rightColor="#5B84F0"
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
          <p className="max-w-xs text-sm leading-relaxed text-fog">
            The sales command center for Indian teams — leads, WhatsApp, quotations and pipelines
            on one screen.
          </p>
          <NewsletterForm />
        </div>

        {footer.map((group) => (
          <nav key={group.groupTitle} aria-label={group.groupTitle}>
            <p className="kicker mb-3">{group.groupTitle}</p>
            <ul className="space-y-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-fog hover:text-bright">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="shell flex flex-col gap-2 py-5 text-xs text-fog sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} EZCRM Technologies Pvt. Ltd. All rights reserved.</p>
          <p className="font-mono uppercase tracking-wider">
            Made for the Indian sales floor · Data stays yours
          </p>
        </div>
      </div>
    </footer>
  )
}
