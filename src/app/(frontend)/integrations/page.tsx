import type { Metadata } from 'next'
import { PageIntro } from '@/components/page-intro'
import { CtaBand } from '@/components/sections/cta-band'
import { getIntegrations } from '@/lib/cms'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Integrations — IndiaMART, JustDial, Facebook, WhatsApp & more',
  description:
    'EZCRM connects to the places your leads already are: Facebook Lead Ads, IndiaMART, JustDial, the official Meta WhatsApp API, Razorpay, Cashfree, Slack and custom webhooks.',
}

const CATEGORY_LABELS: Record<string, string> = {
  'lead-sources': 'Lead sources',
  messaging: 'Messaging',
  payments: 'Payments',
  notifications: 'Notifications',
  developer: 'Developer',
}

export default async function IntegrationsPage() {
  const integrations = await getIntegrations()
  const categories = ['lead-sources', 'messaging', 'payments', 'notifications', 'developer']

  return (
    <>
      <PageIntro
        kicker="Integrations"
        title="Your leads are already somewhere we go get them."
        lede="Every connector below is one-click or one-key setup — no agency required. Multiple accounts per platform are supported, so three Facebook pages or two IndiaMART subscriptions are fine."
      />

      <div className="shell space-y-12 pb-20">
        {categories.map((category) => {
          const items = integrations.filter((i) => i.category === category)
          if (items.length === 0) return null
          return (
            <section key={category} aria-labelledby={`cat-${category}`}>
              <h2 id={`cat-${category}`} className="kicker mb-4 border-b border-line pb-2">
                {CATEGORY_LABELS[category]}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((integration) => (
                  <article key={integration.slug} className="panel-frame p-5">
                    <h3 className="font-medium text-bright">{integration.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-fog">
                      {integration.description}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          )
        })}

        <section className="panel-frame p-6" aria-labelledby="api-heading">
          <h2 id="api-heading" className="font-display text-xl font-bold text-bright">
            Something custom? There’s a REST API for that.
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fog">
            Token-authenticated REST endpoints cover leads, contacts, deals and activities, plus
            inbound webhooks that accept JSON from any system — your website backend, a landing
            page tool, or that internal ERP nobody wants to touch. Rate-limited, scoped per token,
            and logged in the audit trail like everything else.
          </p>
        </section>
      </div>

      <CtaBand
        heading="Don’t see your lead source?"
        subheading="If it can send an email or a webhook, we can capture it. Tell us what you use."
        primaryLabel="Ask us"
        primaryHref="/contact"
      />
    </>
  )
}
