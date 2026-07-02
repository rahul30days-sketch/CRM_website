import type { Metadata } from 'next'
import { Check } from 'lucide-react'
import { PageIntro } from '@/components/page-intro'
import { DemoForm } from '@/components/forms/demo-form'

export const metadata: Metadata = {
  title: 'Book a demo — see EZCRM on your own lead flow',
  description:
    'A 30-minute working session: your lead sources connected, your pipeline stages, your WhatsApp number. No slides.',
}

const WHAT_TO_EXPECT = [
  'A 30-minute screen-share at a time you pick — no webinar, no recording of you',
  'We connect a sample lead source and run a lead through capture → WhatsApp → quote, live',
  'You bring the messy reality: Excel sheets, multiple numbers, odd processes — that’s the point',
  'Straight pricing at the end, and a trial tenant set up before we hang up if you want one',
]

export default function DemoPage() {
  return (
    <>
      <PageIntro
        kicker="Book a demo"
        title="Thirty minutes. Your leads. Live."
        lede="Fill this in and a product specialist — someone who can actually configure the system, not read a script — calls you within one working day."
      />

      <div className="shell grid gap-12 pb-20 lg:grid-cols-[3fr_2fr]">
        <div className="panel-frame p-6 sm:p-8">
          <DemoForm source="demo-page" />
        </div>

        <aside className="space-y-8">
          <section aria-labelledby="expect-heading">
            <h2 id="expect-heading" className="kicker mb-4">
              What actually happens
            </h2>
            <ul className="space-y-3">
              {WHAT_TO_EXPECT.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-fog">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-won" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="panel-frame p-5" aria-labelledby="prefer-heading">
            <h2 id="prefer-heading" className="font-medium text-bright">
              Prefer to talk first?
            </h2>
            <p className="mt-2 text-sm text-fog">
              Call <a href="tel:+919876543210" className="font-mono text-marigold">+91 98765 43210</a>{' '}
              (Mon–Sat, 10:00–19:00 IST) or write to{' '}
              <a href="mailto:hello@ezcrm.in" className="font-mono text-marigold">
                hello@ezcrm.in
              </a>
              .
            </p>
          </section>
        </aside>
      </div>
    </>
  )
}
