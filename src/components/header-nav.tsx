'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type NavItem = { label: string; href: string }

/**
 * Premium header.
 *
 * - Scrolls into a compact floating "dock" (rounded, detached, deeper glass).
 * - Animated active-state indicator: a shared-layout pill slides between the
 *   active / hovered item instead of a static color swap.
 * - Hover/focus dropdowns for items present in `dropdowns`.
 * - Animated mobile sheet.
 *
 * The background is always opaque white glass so page content can never bleed
 * through, independent of backdrop-filter support.
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
  const [hovered, setHovered] = React.useState<string | null>(null)
  const [openMenu, setOpenMenu] = React.useState<string | null>(null)
  const pathname = usePathname()
  const reduce = useReducedMotion()

  React.useEffect(() => {
    setOpen(false)
    setOpenMenu(null)
  }, [pathname])

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : Boolean(pathname?.startsWith(href))

  // Which item shows the sliding pill: hovered wins, else the active route.
  const pillHref = hovered ?? items.find((i) => isActive(i.href))?.href ?? null

  return (
    <header className="sticky top-0 z-50">
      <motion.div
        animate={
          reduce
            ? undefined
            : {
                marginTop: scrolled ? 10 : 0,
                paddingLeft: scrolled ? 10 : 0,
                paddingRight: scrolled ? 10 : 0,
              }
        }
        transition={{ type: 'spring', stiffness: 380, damping: 34 }}
        className="mx-auto w-full"
      >
        <motion.div
          onMouseLeave={() => setHovered(null)}
          animate={
            reduce
              ? undefined
              : { maxWidth: scrolled ? 1120 : 1280, borderRadius: scrolled ? 999 : 0 }
          }
          transition={{ type: 'spring', stiffness: 380, damping: 34 }}
          className={cn(
            'mx-auto flex max-w-[1280px] items-center justify-between gap-4 border-line bg-white/85 px-4 backdrop-blur-xl transition-shadow duration-300 sm:px-6',
            scrolled ? 'h-14 border shadow-float' : 'h-16 border-b shadow-none',
          )}
        >
          {brand}

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
            {items.map((item) => {
              const active = isActive(item.href)
              const submenu = dropdowns[item.href]
              const showPill = pillHref === item.href
              const menuOpen = openMenu === item.href

              const inner = (
                <>
                  {showPill && !reduce && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-chip bg-sky"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 inline-flex items-center gap-1">
                    {item.label}
                    {submenu && submenu.length > 0 && (
                      <ChevronDown
                        className={cn(
                          'h-3.5 w-3.5 transition-transform duration-200',
                          menuOpen && 'rotate-180',
                        )}
                        aria-hidden
                      />
                    )}
                  </span>
                </>
              )

              const base = cn(
                'relative inline-flex items-center rounded-chip px-3 py-2 text-sm font-medium transition-colors',
                active || showPill ? 'text-brand' : 'text-slate hover:text-ink',
              )

              if (submenu && submenu.length > 0) {
                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => {
                      setHovered(item.href)
                      setOpenMenu(item.href)
                    }}
                    onMouseLeave={() => setOpenMenu(null)}
                    onFocus={() => setOpenMenu(item.href)}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpenMenu(null)
                    }}
                  >
                    <Link
                      href={item.href}
                      aria-haspopup="menu"
                      aria-expanded={menuOpen}
                      className={base}
                      onClick={() => setOpenMenu(null)}
                    >
                      {inner}
                    </Link>
                    <div
                      className={cn(
                        'absolute left-0 top-full z-50 pt-2 transition-all duration-150',
                        menuOpen ? 'visible opacity-100' : 'invisible opacity-0',
                      )}
                    >
                      <div
                        role="menu"
                        className="min-w-[15rem] rounded-card border border-line bg-white/95 p-2 shadow-glass backdrop-blur-xl"
                      >
                        {submenu.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            role="menuitem"
                            onClick={() => setOpenMenu(null)}
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
                          onClick={() => setOpenMenu(null)}
                          className="mt-1 block border-t border-line px-3 pt-2.5 text-xs font-semibold uppercase tracking-wider text-brand hover:underline"
                        >
                          View all →
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
                  className={cn(base, 'group')}
                  onMouseEnter={() => setHovered(item.href)}
                >
                  {inner}
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
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Main"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-3 top-[4.5rem] rounded-card border border-line bg-white/95 p-4 shadow-glass backdrop-blur-xl lg:hidden"
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
                <Link href="/demo" className={cn(buttonVariants(), 'w-full text-center')}>
                  Get started
                </Link>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
