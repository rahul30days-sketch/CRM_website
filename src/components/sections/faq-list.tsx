import type { FaqContent } from '@/content/site'

/** Native <details> accordion — keyboard-accessible with zero JS. */
export function FaqList({ faqs }: { faqs: FaqContent[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {faqs.map((faq) => (
        <details key={faq.question} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-medium text-bright hover:text-marigold [&::-webkit-details-marker]:hidden">
            {faq.question}
            <span
              aria-hidden
              className="shrink-0 font-mono text-lg text-fog transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="pb-5 pr-8 text-sm leading-relaxed text-fog">{faq.answer}</p>
        </details>
      ))}
    </div>
  )
}
