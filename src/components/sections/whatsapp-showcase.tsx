import Link from 'next/link'
import { Check } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'

/**
 * WhatsApp inbox showcase — a two-way conversation on the official Meta API,
 * shown as a real shared-inbox thread. Static (always visible); the hero
 * already carries the animated WhatsApp micro-interaction.
 */

const THREAD = [
  { from: 'them', text: 'Do you deliver to Nashik? Need 4 submersible pumps.', time: '09:02' },
  { from: 'us', text: 'Namaste! Yes, we deliver across Maharashtra. Sharing the price list now 📎', time: '09:04', tag: 'Priya · agent' },
  { from: 'us', text: 'pricelist-jul.pdf', time: '09:04', file: true },
  { from: 'them', text: 'Bulk rate for 4 units?', time: '09:06' },
  { from: 'us', text: 'On 4+, ₹92,000/unit incl. panel. Quotation on the way ✅', time: '09:07', tag: 'Priya · agent' },
]

export function WhatsAppShowcase({
  kicker,
  heading,
  body,
  points,
}: {
  kicker: string
  heading: string
  body: string
  points: string[]
}) {
  return (
    <section className="shell py-24 lg:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="kicker mb-3">{kicker}</p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate">{body}</p>
          <ul className="mt-6 space-y-2.5">
            {points.map((p) => (
              <li key={p} className="flex gap-3 text-sm text-slate">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-won" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
          <Link href="/features/whatsapp" className={buttonVariants({ variant: 'secondary' }) + ' mt-7'}>
            See the WhatsApp module
          </Link>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-8 -z-10 rounded-full bg-brand/10 blur-3xl" />
          <div className="glass overflow-hidden p-0">
            <div className="flex items-center gap-3 border-b border-line bg-white/60 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-won/15 font-mono text-sm font-bold text-won">
                K
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">Kavita Mehta</p>
                <p className="font-mono text-[0.625rem] uppercase tracking-wider text-won">online · WhatsApp</p>
              </div>
            </div>
            <div className="space-y-2.5 bg-sky/40 p-4">
              {THREAD.map((m, i) => (
                <div
                  key={i}
                  className={
                    m.from === 'us'
                      ? 'ml-auto max-w-[82%] rounded-2xl rounded-tr-sm border border-won/30 bg-won/10 px-3 py-2'
                      : 'max-w-[82%] rounded-2xl rounded-tl-sm border border-line bg-white px-3 py-2'
                  }
                >
                  {m.file ? (
                    <p className="flex items-center gap-2 text-sm font-medium text-ink">
                      <span className="rounded bg-due/10 px-1.5 py-0.5 font-mono text-[0.5625rem] uppercase text-due">
                        PDF
                      </span>
                      {m.text}
                    </p>
                  ) : (
                    <p className="text-sm text-ink">{m.text}</p>
                  )}
                  <p className="mt-1 text-right font-mono text-[0.5625rem] text-slate">
                    {m.tag ? `${m.tag} · ` : ''}
                    {m.time}
                    {m.from === 'us' ? ' ✓✓' : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
