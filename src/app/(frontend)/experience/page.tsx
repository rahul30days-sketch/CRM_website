/**
 * /experience — the interactive EZCRM playground.
 *
 * The intro (heading, what you can do, the isolation note) is server-rendered;
 * the playground itself is a client component seeded from src/demo/sample-data,
 * so its starting screen is also in the server HTML.
 */

import type { Metadata } from 'next'
import { Playground } from '@/components/playground/playground'

export const metadata: Metadata = {
  title: 'Experience EZCRM — interactive demo',
  description:
    'Try EZCRM in your browser, no account needed: capture a lead, assign it, reply on WhatsApp, send a GST quotation and win the deal, all with fictional sample data.',
  alternates: { canonical: '/experience' },
}

const FLOW = ['Create a lead', 'Assign it', 'Reply on WhatsApp', 'Send a GST quotation', 'Win the deal']

export default function ExperiencePage() {
  return (
    <>
      <div className="mesh noise relative overflow-hidden border-b border-line">
        <header className="shell relative z-10 pb-10 pt-14 lg:pb-12 lg:pt-20">
          <p className="kicker mb-4">Interactive demo</p>
          <h1 className="max-w-3xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Run a sales day in EZCRM
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate">
            A working copy of EZCRM with fictional data, right here in your browser. No account, no sign-up. Every module shares
            one dataset, so a lead you add shows up in the pipeline, the WhatsApp inbox, the quotation and the dashboard.
          </p>
          <ol className="mt-6 flex flex-wrap gap-2" aria-label="Suggested flow">
            {FLOW.map((step, i) => (
              <li
                key={step}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-3 py-1.5 text-sm text-ink"
              >
                <span className="font-mono text-xs font-semibold text-brand">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <p className="mt-5 max-w-2xl text-sm text-slate">
            Modules: Dashboard, Leads, Assignment, Conversation, Pipeline, Quotation, Automation and Analytics. Nothing you do here
            sends a message, contacts a customer or takes a payment.
          </p>
        </header>
      </div>

      <section aria-label="EZCRM playground" className="py-8 lg:py-12">
        <div className="shell">
          <Playground />
        </div>
      </section>
    </>
  )
}
