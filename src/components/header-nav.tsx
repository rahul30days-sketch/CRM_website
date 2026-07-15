'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, X } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type NavItem = { label: string; href: string }

/**
 * White header that gains a glass blur + soft shadow once the page scrolls —
 * one of the site's three motion moments. Nav items whose href appears in
 * `dropdowns` render a hover/focus dropdown of sub-links.
 */
export function HeaderNav({
  items,
  brand,
  dropdowns = {},
}: {
  items: NavItem[]
  brand: React.ReactNode
  dropdowns?: Record<string, NavItem[]>
}) {
  const [open, setOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => setOpen(false), [pathname])

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        // Background is ALWAYS an opaque white glass so page content can never
        // bleed through — `bg-white/90` is a plain color, independent of scroll
        // detection or backdrop-filter support. Scroll only deepens the shadow.
        'sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur-xl transition-shadow duration-300',
        scrolled ? 'shadow-soft' : 'shadow-none',
      )}
    >
      <div className="shell flex h-16 items-center justify-between gap-4">
        {brand}

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {items.map((item) => {
            // Exact match for the "/" home link; prefix match for the rest —
            // otherwise "/" would highlight on every page.
            const active =
              item.href === '/' ? pathname === '/' : Boolean(pathname?.startsWith(item.href))
            const submenu = dropdowns[item.href]

            if (submenu && submenu.length > 0) {
              return (
                <div key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    aria-haspopup="menu"
                    className={cn(
                      'inline-flex items-center gap-1 rounded-chip px-3 py-2 text-sm font-medium transition-colors',
                      active ? 'text-brand' : 'text-slate hover:bg-sky hover:text-ink',
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180"
                      aria-hidden
                    />
                  </Link>
                  {/* pt-2 bridges the gap so the panel doesn't close on the move */}
                  <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <div
                      role="menu"
                      className="min-w-[15rem] rounded-card border border-line bg-white/95 p-2 shadow-glass backdrop-blur-xl"
                    >
                      {submenu.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          role="menuitem"
                          className={cn(
                            'block rounded-chip px-3 py-2 text-sm transition-colors',
                            pathname === sub.href
                              ? 'bg-sky text-brand'
                              : 'text-slate hover:bg-sky hover:text-ink',
                          )}
                        >
                          {sub.label}
                        </Link>
                      ))}
                      <Link
                        href={item.href}
                        className="mt-1 block border-t border-line px-3 pt-2.5 text-xs font-semibold uppercase tracking-wider text-brand hover:underline"
                      >
                        All comparisons →
                      </Link>
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-chip px-3 py-2 text-sm font-medium transition-colors',
                  active ? 'text-brand' : 'text-slate hover:bg-sky hover:text-ink',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href="https://premium.ezcrm.in/login"
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
          >
            Log in
          </a>
          <Link href="/demo" className={buttonVariants({ size: 'sm' })}>
            Get started
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="inline-flex h-10 w-10 items-center justify-center rounded-chip border border-line bg-white/70 text-slate hover:text-ink lg:hidden"
        >
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="absolute inset-x-0 top-16 border-b border-line bg-white/95 p-4 shadow-glass backdrop-blur-xl lg:hidden"
        >
          <ul className="space-y-1">
            {items.map((item) => {
              const submenu = dropdowns[item.href]
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-chip px-3 py-2.5 font-medium text-slate hover:bg-sky hover:text-ink"
                  >
                    {item.label}
                  </Link>
                  {submenu && submenu.length > 0 ? (
                    <ul className="ml-3 mt-1 space-y-0.5 border-l border-line pl-3">
                      {submenu.map((sub) => (
                        <li key={sub.href}>
                          <Link
                            href={sub.href}
                            className="block rounded-chip px-3 py-2 text-sm text-slate hover:bg-sky hover:text-ink"
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              )
            })}
             <li className="grid grid-cols-2 gap-2 pt-2">
              <a
                href="https://premium.ezcrm.in/login"
                className={cn(buttonVariants({ variant: 'secondary' }), 'w-full text-center')}
              >
                Log in
              </a>
              <Link
                href="/demo"
                className={cn(buttonVariants(), 'w-full text-center')}
              >
                Get started
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
