import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export type Crumb = { label: string; href: string }

/**
 * Secondary-page title block. Optional visible breadcrumbs (Home is added
 * automatically); the current page is the title, marked aria-current.
 */
export function PageIntro({
  kicker,
  title,
  lede,
  breadcrumbs,
}: {
  kicker: string
  title: string
  lede?: string
  breadcrumbs?: Crumb[]
}) {
  return (
    <div className="mesh noise relative overflow-hidden border-b border-line">
      <header className="shell relative z-10 max-w-3xl pb-16 pt-14 lg:pb-20 lg:pt-20">
        {breadcrumbs ? (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate">
              {[{ label: 'Home', href: '/' }, ...breadcrumbs].map((c) => (
                <li key={c.href} className="flex items-center gap-1.5">
                  <Link href={c.href} className="hover:text-brand">
                    {c.label}
                  </Link>
                  <ChevronRight className="h-3.5 w-3.5 text-slate" aria-hidden />
                </li>
              ))}
              <li aria-current="page" className="font-medium text-ink">
                {title.length > 48 ? title.slice(0, 46) + '…' : title}
              </li>
            </ol>
          </nav>
        ) : null}
        <p className="kicker mb-4">{kicker}</p>
        <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {lede ? <p className="mt-6 text-lg leading-relaxed text-slate">{lede}</p> : null}
      </header>
    </div>
  )
}
