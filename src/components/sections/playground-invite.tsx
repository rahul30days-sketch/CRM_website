import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Invitation to the /experience playground — a server component: plain
 * copy, a static preview of the guided steps, and the two CTAs. The steps
 * mirror the playground's onboarding checklist.
 */
const STEPS = ['Create a lead', 'Assign it to a rep', 'Reply on WhatsApp', 'Send a GST quotation', 'Win the deal']

export function PlaygroundInvite() {
  return (
    <section className="shell py-16 lg:py-24" aria-labelledby="playground-heading">
      <div className="grid items-center gap-10 overflow-hidden rounded-card border border-line bg-white p-6 shadow-glass sm:p-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="kicker mb-3">Interactive playground</p>
          <h2
            id="playground-heading"
            className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
          >
            Don’t just read about EZCRM. Run it.
          </h2>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-slate">
            A working sandbox with sample data — no sign-up. Create a lead, assign it, reply on WhatsApp, send a
            quotation and watch the dashboard respond.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/experience" className={buttonVariants({ size: 'lg' })}>
              Experience EZCRM
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/demo" className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }))}>
              Book a guided demo
            </Link>
          </div>
        </div>
        <ol className="space-y-2.5" aria-label="What you can do in the playground">
          {STEPS.map((s, i) => (
            <li
              key={s}
              className="flex items-center gap-3 rounded-chip border border-line bg-sky/40 px-4 py-3"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white font-mono text-xs font-semibold text-brand shadow-press">
                {i + 1}
              </span>
              <span className="text-sm font-medium text-ink">{s}</span>
              {i === STEPS.length - 1 ? (
                <Check className="ml-auto h-4 w-4 text-won" aria-hidden />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
