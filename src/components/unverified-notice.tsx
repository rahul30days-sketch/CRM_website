import { Info } from 'lucide-react'

/**
 * Shown on customer stories while BUSINESS.socialProofVerified is false, so
 * no visitor mistakes an unconfirmed story for a published reference.
 */
export function UnverifiedNotice({ className = '' }: { className?: string }) {
  return (
    <div
      role="note"
      className={
        'flex gap-3 rounded-card border border-line bg-sky/60 p-4 text-sm leading-relaxed text-ink ' + className
      }
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
      <p>
        <strong className="font-semibold">Illustrative scenario.</strong> This story shows how teams like this use
        EZCRM. Names and figures are being verified with the customer and may change before it is published as a
        reference.
      </p>
    </div>
  )
}
