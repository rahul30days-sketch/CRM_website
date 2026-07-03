import type { Metadata } from 'next'
import { Check } from 'lucide-react'
import { DemoForm } from '@/components/forms/demo-form'
import { getDemoPage } from '@/lib/cms'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Book a demo — see EZCRM on your own lead flow',
  description:
    'A 30-minute working session: your lead sources connected, your pipeline stages, your WhatsApp number. No slides.',
}

// Expectation items loaded dynamically from Payload CMS

export default async function DemoPage() {
  const content = await getDemoPage()

  return (
    <section className="mesh noise relative overflow-hidden pb-20 pt-10 lg:pt-16">
      <div className="shell relative z-10 grid gap-12 lg:grid-cols-[10fr_11fr] lg:items-start xl:gap-20">

        {/* Left Column: Copy & expectations */}
        <div className="space-y-8 lg:sticky lg:top-24">
          <div>
            <span className="kicker mb-3 inline-block font-mono text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-brand">
              {content.kicker}
            </span>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-5xl xl:text-6xl">
              {content.heading}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate lg:text-lg">
              {content.lede}
            </p>
          </div>

          <hr className="border-line" />

          <section aria-labelledby="expect-heading" className="space-y-4">
            <h2 id="expect-heading" className="kicker font-mono text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-brand">
              What actually happens
            </h2>
            <ul className="space-y-3.5">
              {content.whatToExpect.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-won" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel-frame p-5 bg-white/50 backdrop-blur-sm" aria-labelledby="prefer-heading">
            <h2 id="prefer-heading" className="font-semibold text-ink text-sm uppercase tracking-wider font-mono">
              {content.preferToTalk.heading}
            </h2>
            <p className="mt-2 text-sm text-slate">
              Call <a href={`tel:${content.preferToTalk.phone.replace(/\s+/g, '')}`} className="font-mono text-brand font-semibold hover:underline">{content.preferToTalk.phone}</a>{' '}
              (Mon–Sat, 10:00–19:00 IST) or write to{' '}
              <a href={`mailto:${content.preferToTalk.email}`} className="font-mono text-brand font-semibold hover:underline">
                {content.preferToTalk.email}
              </a>
              .
            </p>
          </section>
        </div>

        {/* Right Column: Highlighted Form Card */}
        <div className="relative overflow-hidden rounded-card border border-brand/20 bg-white p-6 shadow-float sm:p-8">
          {/* Top accent gradient bar */}
          <div className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-brand to-brand/85" />
          {/* Subtle ambient internal blur */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-brand/5 blur-3xl" />

          <DemoForm source="demo-page" />
        </div>

      </div>
    </section>
  )
}
