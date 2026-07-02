import type { Metadata } from 'next'
import { PageIntro } from '@/components/page-intro'
import { DemoForm } from '@/components/forms/demo-form'

export const metadata: Metadata = {
  title: 'Contact — sales, support and partnerships',
  description:
    'Reach the EZCRM team: sales enquiries, support for existing customers, reseller and white-label partnerships.',
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
              lines: ['hello@ezcrm.in', '+91 98765 43210 · Mon–Sat, 10:00–19:00 IST'],
            },
            {
              title: 'Existing customers',
              lines: ['support@ezcrm.in', 'Or raise a ticket from inside EZCRM — SLA timers apply to us too.'],
            },
            {
              title: 'Security reports',
              lines: ['security@ezcrm.in', 'Responsible disclosure — see the security page.'],
            },
            {
              title: 'Office',
              lines: ['EZCRM Technologies Pvt. Ltd.', '4th Floor, Baner Road, Pune 411045, Maharashtra'],
            },
          ].map((block) => (
            <section key={block.title} className="panel-frame p-5">
              <h2 className="kicker mb-2">{block.title}</h2>
              {block.lines.map((line) => (
                <p key={line} className="text-sm leading-relaxed text-bright/90">
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
