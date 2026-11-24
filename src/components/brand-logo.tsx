import { Facebook, MessageCircle, Slack, Flame, Webhook, type LucideIcon } from 'lucide-react'

/**
 * Brand badge for integration cards.
 *
 * CSP is `img-src 'self'` (no external logo fetches) and reproducing exact
 * trademarked logos is risky, so each integration gets a brand-coloured badge:
 * a recognisable icon for the platforms that have a clean glyph, and a crisp
 * monogram in the brand's real colour for the rest. Consistent and on-theme.
 */

type IconMark = { bg: string; fg?: string; icon: LucideIcon }
type MonoMark = { bg: string; fg?: string; mono: string }
type Mark = IconMark | MonoMark

const MARKS: Record<string, Mark> = {
  'facebook-lead-ads': { bg: '#1877F2', icon: Facebook },
  'meta-whatsapp': { bg: '#25D366', icon: MessageCircle },
  slack: { bg: '#4A154B', icon: Slack },
  fcm: { bg: '#FFA000', icon: Flame },
  webhooks: { bg: '#2B5CE6', icon: Webhook },
  google: { bg: '#FFFFFF', fg: '#4285F4', mono: 'G' },
  indiamart: { bg: '#199B8E', mono: 'IM' },
  justdial: { bg: '#2B6CB0', mono: 'JD' },
  razorpay: { bg: '#0B2447', mono: 'R' },
  cashfree: { bg: '#16A34A', mono: 'C' },
}

export function BrandLogo({ slug, name }: { slug: string; name: string }) {
  const base = 'grid h-11 w-11 shrink-0 place-items-center rounded-xl shadow-soft'
  const mark = MARKS[slug]

  if (!mark) {
    return (
      <div className={`${base} bg-sky text-brand`} aria-hidden>
        <span className="font-display text-sm font-extrabold">
          {name.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase()}
        </span>
      </div>
    )
  }

  const border = mark.bg.toUpperCase() === '#FFFFFF' ? ' border border-line' : ''
  const fg = mark.fg ?? '#FFFFFF'

  if ('icon' in mark) {
    const Icon = mark.icon
    return (
      <div className={base + border} style={{ background: mark.bg }} aria-hidden>
        <Icon className="h-5 w-5" style={{ color: fg }} aria-hidden />
      </div>
    )
  }

  return (
    <div className={base + border} style={{ background: mark.bg }} aria-hidden>
      <span className="font-display text-sm font-extrabold" style={{ color: fg }}>
        {mark.mono}
      </span>
    </div>
  )
}
