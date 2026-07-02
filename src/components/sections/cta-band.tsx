import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * Closing CTA on a deep powder-blue gradient — the one place color goes bold.
 * White heading, white primary button (inverse of the page's ink CTA), glassy
 * secondary. Noise over the gradient kills banding.
 */
export function CtaBand({
  heading = 'See your own pipeline on this screen.',
  subheading = 'A 30-minute demo with your lead sources, your stages and your WhatsApp number. No slideware.',
  primaryLabel = 'Book a demo',
  primaryHref = '/demo',
  secondaryLabel = 'See pricing',
  secondaryHref = '/pricing',
}: {
  heading?: string
  subheading?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
}) {
  return (
    <section className="shell py-16 lg:py-24">
      <div className="mesh-deep noise relative overflow-hidden rounded-[2rem] px-8 py-16 shadow-float sm:px-16">
        <div className="relative z-10 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="max-w-2xl font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {heading}
            </h2>
            <p className="mt-3 max-w-xl text-lg text-ink/70">{subheading}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              href={primaryHref}
              className="inline-flex h-13 items-center justify-center rounded-chip bg-[rgb(var(--btn-ink))] px-7 text-base font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
            >
              {primaryLabel}
            </Link>
            <Link
              href={secondaryHref}
              className={cn(
                'inline-flex h-13 items-center justify-center rounded-chip border border-white/70 bg-white/60 px-7 text-base font-semibold text-ink shadow-soft backdrop-blur transition-transform hover:-translate-y-0.5',
              )}
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
