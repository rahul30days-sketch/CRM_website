import Link from 'next/link'
import { getComparisons, getNavigation, getSiteSettings } from '@/lib/cms'
import { HeaderNav } from '@/components/header-nav'

export async function Header() {
  const [{ header }, settings, comparisons] = await Promise.all([
    getNavigation(),
    getSiteSettings(),
    getComparisons(),
  ])

  // Nav items whose href matches a key get a hover dropdown. Compare lists
  // every "EZCRM vs …" matchup, straight from the comparisons collection.
  const dropdowns: Record<string, { label: string; href: string }[]> = {
    '/vs': comparisons.map((c) => ({ label: c.competitor, href: `/vs/${c.slug}` })),
  }

  return (
    <HeaderNav
      items={header}
      dropdowns={dropdowns}
      brand={
        <Link href="/" className="flex items-baseline gap-2" aria-label={`${settings.siteName} home`}>
          {settings.logo ? (
            // Plain <img>: renders at the logo's true aspect ratio scaled to a
            // fixed height — next/image would force width/height and can box or
            // stretch a logo of unknown dimensions (e.g. SVGs with no size).
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.logo.url}
              alt={settings.logo.alt}
              className="h-9 w-auto max-w-[180px] object-contain"
            />
          ) : (
            <>
              <span className="font-display text-xl font-extrabold tracking-tight text-ink">
                EZ<span className="text-brand">CRM</span>
              </span>
              <span className="hidden font-mono text-[0.625rem] uppercase tracking-[0.2em] text-slate sm:inline">
                v3.0
              </span>
            </>
          )}
        </Link>
      }
    />
  )
}
