import type { TestimonialContent } from '@/content/site'

/** Glass quote cards: the metric leads, the quote backs it. */
export function TestimonialWall({ testimonials }: { testimonials: TestimonialContent[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {testimonials.map((t) => (
        <figure key={t.author} className="glass flex flex-col p-6 sm:p-7">
          {t.metric ? (
            <p className="mb-4 border-b border-line pb-4">
              <span className="block font-mono text-3xl font-bold tabular-nums text-brand">
                {t.metric.value}
              </span>
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-slate">
                {t.metric.label}
              </span>
            </p>
          ) : null}
          <blockquote className="flex-1 text-[0.9375rem] leading-relaxed text-ink">
            “{t.quote}”
          </blockquote>
          <figcaption className="mt-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 font-mono text-sm font-bold text-brand">
              {t.author[0]}
            </span>
            <span className="text-xs text-slate">
              <span className="block font-semibold text-ink">{t.author}</span>
              {t.role}, {t.company}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
