import type { Metadata } from 'next'
import { BUSINESS } from '@/content/business'
import { PageIntro } from '@/components/page-intro'
import { DemoForm } from '@/components/forms/demo-form'

export const metadata: Metadata = {
  title: 'Contact — sales, support and partnerships',
  description:
    'Reach the EZCRM team: sales enquiries, support for existing customers, reseller and white-label partnerships.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <>
      <PageIntro
        kicker="Contact"
        title="Talk to a human who knows the product."
        lede="Sales questions, reseller terms, security questionnaires or just “will this work for my business?” — send it through and we reply within one working day."
      />

      <div className="shell grid gap-12 pb-20 lg:grid-cols-[3fr_2fr]">
        <div className="panel-frame p-6 sm:p-8">
          <DemoForm source="contact-page" />
        </div>

        <aside className="space-y-5">
          {[
            {
              title: 'Sales & partnerships',
              lines: [
                BUSINESS.salesEmail,
                ...(BUSINESS.salesPhone ? [BUSINESS.salesPhone] : []),
                BUSINESS.hours,
              ],
            },
            {
              title: 'Existing customers',
              lines: [BUSINESS.supportEmail, 'Or raise a ticket from inside EZCRM.'],
            },
            {
              title: 'Security reports',
              lines: [BUSINESS.salesEmail, 'Responsible disclosure — see the security page.'],
            },
            {
              title: 'Office',
              lines: [BUSINESS.legalName, BUSINESS.address],
            },
          ].map((block) => (
            <section key={block.title} className="panel-frame p-5">
              <h2 className="kicker mb-2">{block.title}</h2>
              {block.lines.map((line) => (
                <p key={line} className="text-sm leading-relaxed text-ink">
                  {line}
                </p>
              ))}
            </section>
          ))}
        </aside>
      </div>
    </>
  )
}
