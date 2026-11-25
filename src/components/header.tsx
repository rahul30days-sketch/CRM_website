import Link from 'next/link'
import { getComparisons, getModules, getSiteSettings } from '@/lib/cms'
import { industries } from '@/content/site'
import { HeaderNav } from '@/components/header-nav'
import { buildMenu } from '@/components/nav/menu'

export async function Header() {
  const [settings, modules, comparisons] = await Promise.all([
    getSiteSettings(),
    getModules(),
    getComparisons(),
  ])

  const menu = buildMenu({
    modules: modules.map(({ slug, title, tagline }) => ({ slug, title, tagline })),
    industries: industries.map(({ slug, name, headline }) => ({ slug, name, headline })),
    comparisons: comparisons.map(({ slug, competitor }) => ({ slug, competitor })),
  })

  return (
    <HeaderNav
      menu={menu}
      brand={
        <Link href="/" className="flex shrink-0 items-center" aria-label={`${settings.siteName} home`}>
          {/* Plain <img>: keeps the logo's true aspect ratio at a fixed height;
              width/height attributes reserve space (no layout shift). */}
          {settings.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.logo.url}
              alt={settings.logo.alt}
              width={settings.logo.width}
              height={settings.logo.height}
              className="h-8 w-auto max-w-[160px] object-contain sm:h-9"
            />
          ) : (
            <span className="font-display text-xl font-extrabold tracking-tight text-ink">
              EZ<span className="text-brand">CRM</span>
            </span>
          )}
        </Link>
      }
    />
  )
}
