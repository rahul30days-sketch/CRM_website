import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { trustPoints } from '@/content/site'

export function TrustStrip() {
  return (
    <section aria-labelledby="trust-heading" className="border-t border-line">
      <div className="shell py-14">
        <div className="mb-8 flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-won" aria-hidden />
          <h2 id="trust-heading" className="font-display text-2xl font-bold text-bright">
            Built like the system of record it is
          </h2>
        </div>
        <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map((point) => (
            <div key={point.title} className="border-l-2 border-line pl-4">
              <dt className="font-medium text-bright">{point.title}</dt>
              <dd className="mt-1 text-sm text-fog">{point.detail}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 text-sm text-fog">
          Full details — OWASP-aligned practices, data handling, access control —{' '}
          <Link href="/security" className="text-marigold underline-offset-4 hover:underline">
            on the security page
          </Link>
          .
        </p>
      </div>
    </section>
  )
}
