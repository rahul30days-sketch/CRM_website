'use client'

/**
 * CrmIconCloud — the hero centerpiece.
 *
 * A rotating 3D sphere of the things an EZCRM customer actually works with:
 * lead sources (WhatsApp, Facebook, website) and CRM functions (leads,
 * pipeline, quotations, dashboard, payments, support, automations…). Icons are
 * billboarded (always face the viewer) by projecting each sphere point to 2D
 * every frame and only translating — never rotating — the badge.
 *
 * Pure DOM + lucide icons: no WebGL, no external fetches (CSP-safe), crisp on
 * any device, and it degrades to a static sphere under reduced motion. The
 * hero copy/CTAs are server-rendered separately, so this stays purely
 * decorative progressive enhancement.
 */

import { useEffect, useMemo, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import {
  Users, UserCheck, Target, TrendingUp, FileText, LayoutDashboard, MessageCircle,
  Mail, MessageSquare, Phone, Ticket, Bell, CalendarClock, Contact, IndianRupee,
  Workflow, BarChart3, PieChart, Facebook, Bot, Megaphone, Filter, Globe,
  Headset, Handshake, Receipt, Zap, ClipboardList, type LucideIcon,
} from 'lucide-react'

const BRAND = 'rgb(43,92,230)'
const WON = 'rgb(16,138,74)'
const WA = '#25D366'
const FB = '#1877F2'
const ORANGE = '#E8850C'
const AMBER = '#F5A623'

type Item = { icon: LucideIcon; color: string; label: string }

const ITEMS: Item[] = [
  { icon: Users, color: BRAND, label: 'Leads' },
  { icon: MessageCircle, color: WA, label: 'WhatsApp' },
  { icon: Target, color: WON, label: 'Deals & pipeline' },
  { icon: FileText, color: BRAND, label: 'Quotations' },
  { icon: LayoutDashboard, color: BRAND, label: 'Dashboard' },
  { icon: Facebook, color: FB, label: 'Facebook leads' },
  { icon: IndianRupee, color: WON, label: 'Payments' },
  { icon: Ticket, color: ORANGE, label: 'Support tickets' },
  { icon: Workflow, color: BRAND, label: 'Automations' },
  { icon: Mail, color: BRAND, label: 'Email campaigns' },
  { icon: MessageSquare, color: '#6D5EF0', label: 'SMS' },
  { icon: Bell, color: AMBER, label: 'Reminders' },
  { icon: CalendarClock, color: BRAND, label: 'Calendar' },
  { icon: Contact, color: '#54607A', label: 'Contacts' },
  { icon: BarChart3, color: BRAND, label: 'Analytics' },
  { icon: PieChart, color: WON, label: 'Reports' },
  { icon: Bot, color: BRAND, label: 'AI chatbot' },
  { icon: Megaphone, color: ORANGE, label: 'Broadcasts' },
  { icon: UserCheck, color: BRAND, label: 'Lead assignment' },
  { icon: Filter, color: '#54607A', label: 'Segments' },
  { icon: Globe, color: BRAND, label: 'Website enquiries' },
  { icon: Headset, color: ORANGE, label: 'Service desk' },
  { icon: Handshake, color: WON, label: 'Conversions' },
  { icon: Receipt, color: BRAND, label: 'GST invoices' },
  { icon: TrendingUp, color: WON, label: 'Revenue' },
  { icon: Phone, color: '#0E9F8E', label: 'Calls' },
  { icon: Zap, color: AMBER, label: 'Instant capture' },
  { icon: ClipboardList, color: BRAND, label: 'Activities' },
]

// Even point distribution on a unit sphere (Fibonacci spiral).
function fibonacciSphere(n: number): [number, number, number][] {
  const pts: [number, number, number][] = []
  const inc = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const phi = i * inc
    pts.push([Math.cos(phi) * r, y, Math.sin(phi) * r])
  }
  return pts
}

export function CrmIconCloud() {
  const reduce = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const iconRefs = useRef<(HTMLDivElement | null)[]>([])
  const base = useMemo(() => fibonacciSphere(ITEMS.length), [])
  const rot = useRef({ x: -0.3, y: 0 })
  const vel = useRef({ x: 0, y: 0.0022 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let raf = 0

    const project = () => {
      const rect = container.getBoundingClientRect()
      const R = Math.min(rect.width, rect.height) * 0.42
      const { x: rx, y: ry } = rot.current
      const cosX = Math.cos(rx), sinX = Math.sin(rx)
      const cosY = Math.cos(ry), sinY = Math.sin(ry)

      for (let i = 0; i < base.length; i++) {
        const [bx, by, bz] = base[i]
        // rotate around Y then X
        const x1 = bx * cosY - bz * sinY
        const z1 = bx * sinY + bz * cosY
        const y2 = by * cosX - z1 * sinX
        const z2 = by * sinX + z1 * cosX
        const depth = (z2 + 1) / 2 // 0 (back) → 1 (front)
        const scale = 0.55 + depth * 0.6
        const el = iconRefs.current[i]
        if (!el) continue
        el.style.transform = `translate(-50%, -50%) translate(${(x1 * R).toFixed(1)}px, ${(y2 * R).toFixed(1)}px) scale(${scale.toFixed(3)})`
        el.style.opacity = (0.3 + depth * 0.7).toFixed(3)
        el.style.zIndex = String(Math.round(depth * 100))
        el.style.filter = `blur(${((1 - depth) * 1.2).toFixed(2)}px)`
      }
    }

    const tick = () => {
      if (!reduce) {
        rot.current.x += vel.current.x
        rot.current.y += vel.current.y
        // ease idle spin back toward baseline after pointer nudges
        vel.current.x += (0 - vel.current.x) * 0.02
        vel.current.y += (0.0022 - vel.current.y) * 0.02
      }
      project()
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [base, reduce])

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduce) return
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const dx = (e.clientX - rect.left) / rect.width - 0.5
    const dy = (e.clientY - rect.top) / rect.height - 0.5
    vel.current.y = dx * 0.06
    vel.current.x = -dy * 0.05
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={onPointerMove}
      className="relative h-full w-full touch-none"
      role="img"
      aria-label="The EZCRM sales universe — leads, conversations, quotations, pipeline, payments and analytics in one platform."
    >
      {/* soft center glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-3xl" />
      {ITEMS.map((item, i) => {
        const Icon = item.icon
        return (
          <div
            key={item.label}
            ref={(el) => { iconRefs.current[i] = el }}
            title={item.label}
            className="absolute left-1/2 top-1/2 will-change-transform"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl border border-line bg-white shadow-float">
              <Icon className="h-5 w-5" style={{ color: item.color }} aria-hidden />
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default CrmIconCloud
