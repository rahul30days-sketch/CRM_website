'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Bot,
  Briefcase,
  Building2,
  CalendarClock,
  ChevronDown,
  Contact,
  Factory,
  FileText,
  Filter,
  Image as ImageIcon,
  Info,
  KanbanSquare,
  LifeBuoy,
  Mail,
  Menu,
  MessageCircle,
  MessageSquareText,
  Plug,
  Scale,
  ShieldCheck,
  Trophy,
  Users,
  Workflow,
  X,
  type LucideIcon,
} from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { DURATION, EASE } from '@/lib/motion'
import { track } from '@/lib/analytics'
import type { MenuIcon, MenuItem, MenuLink, MenuPanel } from '@/components/nav/menu'

const ICONS: Record<MenuIcon, LucideIcon> = {
  leads: Filter,
  pipeline: KanbanSquare,
  contacts: Users,
  calendar: CalendarClock,
  integrations: Plug,
  whatsapp: MessageCircle,
  email: Mail,
  sms: MessageSquareText,
  chatbot: Bot,
  quotations: FileText,
  automations: Workflow,
  ticketing: LifeBuoy,
  media: ImageIcon,
  dashboard: BarChart3,
  building: Building2,
  factory: Factory,
  briefcase: Briefcase,
  stories: Trophy,
  blog: BookOpen,
  compare: Scale,
  security: ShieldCheck,
  about: Info,
  contact: Contact,
}

const LOGIN_URL = 'https://premium.ezcrm.in/login'

/** Hover intent: open after a short pause, close after a slightly longer one. */
const OPEN_DELAY = 80
const CLOSE_DELAY = 160

/**
 * Site header.
 *
 * - Sticky; transparent over the hero, white glass with blur once scrolled.
 *   The blur sits on a background layer, never on <header> itself: a
 *   backdrop-filter on an ancestor would trap the fixed mobile drawer inside
 *   the 64px bar.
 * - Product / Solutions / Resources are disclosure buttons. Each panel is
 *   rendered right after its trigger, so Tab goes trigger → panel links →
 *   next trigger, all inside the "Main" landmark.
 * - Hover opens with intent; a click on a hover-opened trigger keeps it open
 *   (it doesn't toggle shut). Hover-opened panels close when the pointer
 *   leaves; click-opened ones stay until Escape, outside click, focus leaving
 *   or navigation.
 * - Below lg: a full-height drawer with accordions, focus trap and scroll lock.
 */
export function HeaderNav({ menu, brand }: { menu: MenuItem[]; brand: React.ReactNode }) {
  const pathname = usePathname()
  const reduce = useReducedMotion()
  const [scrolled, setScrolled] = React.useState(false)
  const [openId, setOpenId] = React.useState<string | null>(null)
  const [drawer, setDrawer] = React.useState(false)
  const headerRef = React.useRef<HTMLElement>(null)
  const triggerRefs = React.useRef<Record<string, HTMLButtonElement | null>>({})
  const hoverTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  // How the open panel was opened, and when — to resolve hover/click races.
  const openedBy = React.useRef<{ via: 'hover' | 'click'; at: number } | null>(null)

  const closeAll = React.useCallback(() => {
    setOpenId(null)
    setDrawer(false)
  }, [])
  const closeDrawer = React.useCallback(() => setDrawer(false), [])

  // Close everything on navigation (path changes)…
  React.useEffect(() => {
    closeAll()
  }, [pathname, closeAll])

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // The drawer only exists below lg: close it if the window grows past that.
  React.useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => mq.matches && setDrawer(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Escape + outside click for the desktop panel.
  React.useEffect(() => {
    if (!openId) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      const id = openId
      const focusInHeader = headerRef.current?.contains(document.activeElement)
      setOpenId(null)
      // Return focus only if it was in the header — never steal it from a
      // form field elsewhere on the page.
      if (focusInHeader) triggerRefs.current[id]?.focus()
    }
    const onPointer = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpenId(null)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [openId])

  const clearHover = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    hoverTimer.current = null
  }
  const hoverOpen = (id: string) => {
    clearHover()
    // Already open (e.g. by click): leave it, and how it was opened, alone.
    if (openId === id) return
    hoverTimer.current = setTimeout(
      () => {
        openedBy.current = { via: 'hover', at: Date.now() }
        setOpenId(id)
      },
      openId ? 0 : OPEN_DELAY,
    )
  }
  const hoverClose = () => {
    clearHover()
    if (openedBy.current?.via !== 'hover') return
    hoverTimer.current = setTimeout(() => setOpenId(null), CLOSE_DELAY)
  }
  React.useEffect(() => clearHover, [])

  const onTriggerClick = (id: string) => {
    clearHover()
    const recentHover =
      openId === id && openedBy.current?.via === 'hover' && Date.now() - openedBy.current.at < 600
    openedBy.current = { via: 'click', at: Date.now() }
    // A click right after hover-intent opened this panel means "open", not "toggle".
    setOpenId((cur) => (cur === id && !recentHover ? null : id))
  }

  // …and on any link activation inside a menu, including same-page links.
  const onMenuClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('a')) closeAll()
  }

  const isCurrent = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || Boolean(pathname?.startsWith(href + '/'))
  const panelHasCurrent = (p: MenuPanel) => p.groups.some((g) => g.links.some((l) => isCurrent(l.href)))

  const solid = scrolled || openId !== null

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50"
      onMouseEnter={clearHover}
      onMouseLeave={hoverClose}
    >
      {/* Background layer (blur lives here, see the note above). */}
      <div
        aria-hidden
        className={cn(
          'absolute inset-0 -z-10 border-b transition-[background-color,box-shadow,border-color] duration-base ease-out',
          solid
            ? 'border-line bg-white/85 shadow-soft backdrop-blur-xl'
            : 'border-transparent bg-white/0',
        )}
      />
      <div className="shell flex h-16 items-center justify-between gap-6">
        <div className="flex shrink-0 items-center">{brand}</div>

        {/* Desktop navigation */}
        <nav aria-label="Main" className="hidden lg:block" onClick={onMenuClick}>
          <ul className="flex items-center gap-0.5">
            {menu.map((item) =>
              item.kind === 'link' ? (
                <li key={item.link.href}>
                  <Link
                    href={item.link.href}
                    aria-current={isCurrent(item.link.href) ? 'page' : undefined}
                    onMouseEnter={hoverClose}
                    className={cn(
                      'inline-flex h-10 items-center rounded-chip px-3 text-sm font-medium transition-colors duration-fast',
                      isCurrent(item.link.href) ? 'text-brand' : 'text-slate hover:bg-sky hover:text-ink',
                    )}
                  >
                    {item.link.label}
                  </Link>
                </li>
              ) : (
                <li
                  key={item.panel.id}
                  onBlur={(e) => {
                    // Close when keyboard focus leaves this trigger + panel.
                    if (
                      openId === item.panel.id &&
                      e.relatedTarget &&
                      !e.currentTarget.contains(e.relatedTarget as Node)
                    ) {
                      setOpenId(null)
                    }
                  }}
                >
                  <button
                    ref={(el) => {
                      triggerRefs.current[item.panel.id] = el
                    }}
                    type="button"
                    aria-expanded={openId === item.panel.id}
                    aria-controls={openId === item.panel.id ? `nav-panel-${item.panel.id}` : undefined}
                    onClick={() => onTriggerClick(item.panel.id)}
                    onMouseEnter={() => hoverOpen(item.panel.id)}
                    className={cn(
                      'inline-flex h-10 items-center gap-1 rounded-chip px-3 text-sm font-medium transition-colors duration-fast',
                      openId === item.panel.id
                        ? 'bg-sky text-ink'
                        : panelHasCurrent(item.panel)
                          ? 'text-brand hover:bg-sky'
                          : 'text-slate hover:bg-sky hover:text-ink',
                    )}
                  >
                    {item.panel.label}
                    <ChevronDown
                      aria-hidden
                      className={cn(
                        'h-3.5 w-3.5 transition-transform duration-base ease-out',
                        openId === item.panel.id && 'rotate-180',
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {openId === item.panel.id && (
                      <motion.div
                        id={`nav-panel-${item.panel.id}`}
                        initial={reduce ? false : { opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, y: -6 }}
                        transition={{ duration: DURATION.base, ease: EASE }}
                        className="absolute inset-x-0 top-full border-b border-line bg-white shadow-float"
                      >
                        <MegaPanel panel={item.panel} isCurrent={isCurrent} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a href={LOGIN_URL} className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
            Log in
          </a>
          <Link
            href="/experience"
            className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'hidden xl:inline-flex')}
          >
            Try it live
          </Link>
          <Link
            href="/demo"
            onClick={() => track('demo_cta_clicked', { from: 'header' })}
            className={buttonVariants({ size: 'sm' })}
          >
            Book a demo
          </Link>
        </div>

        <MobileMenuButton open={drawer} onToggle={() => setDrawer((v) => !v)} />
      </div>

      <MobileDrawer
        open={drawer}
        onClose={closeDrawer}
        onLinkClick={onMenuClick}
        menu={menu}
        isCurrent={isCurrent}
        reduce={reduce}
      />
    </header>
  )
}

/* ─── Desktop panel ─────────────────────────────────────────────────────── */

function MegaPanel({ panel, isCurrent }: { panel: MenuPanel; isCurrent: (h: string) => boolean }) {
  const wide = panel.groups.length >= 3
  return (
    <div className="shell grid gap-10 py-8 xl:grid-cols-[1fr_17rem]">
      <div>
        <div
          className={cn(
            'grid gap-x-8 gap-y-6',
            wide ? 'grid-cols-2 xl:grid-cols-4' : panel.groups.length === 2 ? 'grid-cols-2' : 'grid-cols-1',
            panel.id === 'resources' && 'grid-cols-3 xl:grid-cols-3',
          )}
        >
          {panel.groups.map((group) => (
            <div key={group.label}>
              <p className="kicker mb-3">{group.label}</p>
              <ul className={cn('space-y-1', panel.id === 'solutions' && 'grid grid-cols-3 gap-3 space-y-0')}>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <PanelLink link={link} current={isCurrent(link.href)} roomy={panel.id === 'solutions'} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-4">
          {panel.footer.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isCurrent(l.href) ? 'page' : undefined}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand"
            >
              {l.label}
              <ArrowRight
                aria-hidden
                className="h-3.5 w-3.5 transition-transform duration-fast ease-out group-hover:translate-x-0.5"
              />
            </Link>
          ))}
        </div>
      </div>
      <FeatureCard kind={panel.feature} />
    </div>
  )
}

function PanelLink({ link, current, roomy }: { link: MenuLink; current: boolean; roomy?: boolean }) {
  const Icon = link.icon ? ICONS[link.icon] : null
  return (
    <Link
      href={link.href}
      aria-current={current ? 'page' : undefined}
      className={cn(
        'group flex gap-3 rounded-chip p-2 transition-colors duration-fast',
        roomy && 'h-full flex-col border border-line p-4 hover:border-brand/30',
        current ? 'bg-sky' : 'hover:bg-sky',
      )}
    >
      {Icon ? (
        <span
          className={cn(
            'grid h-9 w-9 shrink-0 place-items-center rounded-chip border border-line bg-white text-brand shadow-press transition-colors duration-fast group-hover:border-brand/30',
          )}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      ) : null}
      <span className="min-w-0">
        <span className={cn('block text-sm font-semibold', current ? 'text-brand' : 'text-ink')}>
          {link.label}
        </span>
        {link.description ? (
          <span className={cn('mt-0.5 block text-xs leading-snug text-slate', !roomy && 'line-clamp-1')}>
            {link.description}
          </span>
        ) : null}
      </span>
    </Link>
  )
}

/**
 * The panel's featured card: a small, static preview of the product drawn
 * in code. Illustrative only — the copy says so.
 */
function FeatureCard({ kind }: { kind: MenuPanel['feature'] }) {
  return (
    <div className="hidden flex-col justify-between rounded-card bg-night p-5 text-white xl:flex">
      {kind === 'pipeline' && <MiniPipeline />}
      {kind === 'industries' && <MiniFlow />}
      {kind === 'proof' && <MiniTimeline />}
      <div className="mt-5">
        <p className="font-display text-base font-bold leading-snug">
          {kind === 'industries'
            ? 'Your sales process, mapped in the first call.'
            : 'See your own leads flow through EZCRM.'}
        </p>
        <p className="mt-1 text-xs text-white/70">30-minute walkthrough with our team.</p>
        <Link href="/demo" className={cn(buttonVariants({ variant: 'brand', size: 'sm' }), 'mt-4 w-full')}>
          Book a demo
        </Link>
      </div>
    </div>
  )
}

function MiniPipeline() {
  const cols = [
    { name: 'New', cards: 3 },
    { name: 'Quote', cards: 2 },
    { name: 'Won', cards: 1 },
  ]
  return (
    <div aria-hidden className="grid grid-cols-3 gap-2">
      {cols.map((c) => (
        <div key={c.name} className="rounded-chip border border-night-line bg-night-raised p-2">
          <p className="mb-2 font-mono text-[0.625rem] uppercase tracking-wider text-white/60">{c.name}</p>
          <div className="space-y-1.5">
            {Array.from({ length: c.cards }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-6 rounded-md border',
                  c.name === 'Won' ? 'border-won/50 bg-won/25' : 'border-night-line bg-white/5',
                )}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function MiniFlow() {
  const steps = ['Enquiry', 'Quote', 'Follow-up', 'Won']
  return (
    <ol aria-hidden className="space-y-2">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-2.5">
          <span
            className={cn(
              'grid h-6 w-6 place-items-center rounded-full border font-mono text-[0.625rem]',
              i === steps.length - 1
                ? 'border-won/60 bg-won/25 text-white'
                : 'border-night-line bg-night-raised text-white/70',
            )}
          >
            {i + 1}
          </span>
          <span className="text-xs text-white/80">{s}</span>
        </li>
      ))}
    </ol>
  )
}

function MiniTimeline() {
  const rows = ['Lead captured from IndiaMART', 'Assigned to a sales rep', 'Quotation sent on WhatsApp']
  return (
    <ul aria-hidden className="space-y-2.5">
      {rows.map((r, i) => (
        <li key={r} className="flex items-start gap-2.5">
          <span className={cn('mt-1 h-2 w-2 shrink-0 rounded-full', i === 2 ? 'bg-won' : 'bg-cyan')} />
          <span className="text-xs leading-snug text-white/80">{r}</span>
        </li>
      ))}
    </ul>
  )
}

/* ─── Mobile ────────────────────────────────────────────────────────────── */

function MobileMenuButton({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={open ? 'mobile-nav' : undefined}
      data-mobile-nav-toggle
      aria-label={open ? 'Close menu' : 'Open menu'}
      className="inline-flex h-10 w-10 items-center justify-center rounded-chip border border-line bg-white text-ink lg:hidden"
    >
      {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
    </button>
  )
}

function MobileDrawer({
  open,
  onClose,
  onLinkClick,
  menu,
  isCurrent,
  reduce,
}: {
  open: boolean
  onClose: () => void
  onLinkClick: (e: React.MouseEvent) => void
  menu: MenuItem[]
  isCurrent: (h: string) => boolean
  reduce: boolean | null
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [section, setSection] = React.useState<string | null>(null)

  // Scroll lock, Escape, focus trap; focus returns to the toggle on close.
  React.useEffect(() => {
    if (!open) return
    const toggle = document.querySelector<HTMLButtonElement>('[data-mobile-nav-toggle]')
    const root = document.documentElement
    const prevOverflow = root.style.overflow
    root.style.overflow = 'hidden'

    // The toggle sits before the drawer in the page, so it leads the cycle.
    const focusables = () =>
      ((toggle ? [toggle] : []) as HTMLElement[]).concat(
        Array.from(ref.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []),
      )

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const items = focusables()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    ref.current?.querySelector<HTMLElement>('a[href], button')?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      root.style.overflow = prevOverflow
      toggle?.focus()
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          id="mobile-nav"
          onClick={onLinkClick}
          // Slide only, no fade: a half-transparent drawer shows the page through it.
          initial={reduce ? false : { y: -8 }}
          animate={{ y: 0 }}
          exit={reduce ? undefined : { y: -8 }}
          transition={{ duration: DURATION.base, ease: EASE }}
          className="fixed inset-x-0 bottom-0 top-16 z-50 flex flex-col overflow-y-auto border-t border-line bg-white lg:hidden"
        >
          <nav aria-label="Main" className="shell flex-1 py-4">
            <ul className="divide-y divide-line">
              {menu.map((item) =>
                item.kind === 'link' ? (
                  <li key={item.link.href}>
                    <Link
                      href={item.link.href}
                      aria-current={isCurrent(item.link.href) ? 'page' : undefined}
                      className={cn(
                        'flex h-13 items-center text-base font-semibold',
                        isCurrent(item.link.href) ? 'text-brand' : 'text-ink',
                      )}
                    >
                      {item.link.label}
                    </Link>
                  </li>
                ) : (
                  <li key={item.panel.id}>
                    <button
                      type="button"
                      aria-expanded={section === item.panel.id}
                      aria-controls={section === item.panel.id ? `mobile-section-${item.panel.id}` : undefined}
                      onClick={() => setSection((s) => (s === item.panel.id ? null : item.panel.id))}
                      className="flex h-13 w-full items-center justify-between text-left text-base font-semibold text-ink"
                    >
                      {item.panel.label}
                      <ChevronDown
                        aria-hidden
                        className={cn(
                          'h-4 w-4 text-slate transition-transform duration-base ease-out',
                          section === item.panel.id && 'rotate-180',
                        )}
                      />
                    </button>
                    {section === item.panel.id && (
                      <div id={`mobile-section-${item.panel.id}`} className="space-y-5 pb-5">
                        {item.panel.groups.map((g) => (
                          <div key={g.label}>
                            <p className="kicker mb-2">{g.label}</p>
                            <ul className="space-y-0.5">
                              {g.links.map((l) => (
                                <li key={l.href}>
                                  <PanelLink link={l} current={isCurrent(l.href)} />
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        {item.panel.footer.map((l) => (
                          <Link
                            key={l.href}
                            href={l.href}
                            aria-current={isCurrent(l.href) ? 'page' : undefined}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand"
                          >
                            {l.label}
                            <ArrowRight aria-hidden className="h-3.5 w-3.5" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                ),
              )}
            </ul>
          </nav>
          <div className="shell sticky bottom-0 grid grid-cols-2 gap-3 border-t border-line bg-white py-4">
            <a href={LOGIN_URL} className={cn(buttonVariants({ variant: 'secondary' }), 'w-full')}>
              Log in
            </a>
            <Link href="/demo" className={cn(buttonVariants(), 'w-full')}>
              Book a demo
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
