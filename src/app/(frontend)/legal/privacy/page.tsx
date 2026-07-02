import type { Metadata } from 'next'
import { PageIntro } from '@/components/page-intro'

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'What data the EZCRM website collects, why, and how long we keep it.',
}

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: 'What this policy covers',
    body: [
      'This policy covers ezcrm.in — the marketing website — including the demo-request, contact and newsletter forms. Data you store inside the EZCRM product as a customer is governed by your subscription agreement and the in-product data policy, where you are the data controller and we are the processor.',
    ],
  },
  {
    title: 'What we collect, and why',
    body: [
      'Demo and contact forms: name, work email, phone number, company name, team size and anything you write in the message field. We collect this for exactly one purpose — responding to your enquiry and arranging the demo you asked for.',
      'Newsletter: your email address, used to send the newsletter you subscribed to. Every issue contains a working unsubscribe link.',
      'Technical logs: our servers keep short-lived request logs (IP address, user agent) for security and abuse prevention — for example, rate-limiting repeated form submissions. Form submissions themselves are stored without your IP address.',
    ],
  },
  {
    title: 'What we don’t do',
    body: [
      'We do not sell, rent or trade your personal data. We do not enrich it against third-party databases. We do not run third-party advertising trackers on this site.',
    ],
  },
  {
    title: 'Retention',
    body: [
      'Demo and contact enquiries are kept while the conversation is live and for up to 24 months afterwards, then deleted. Newsletter addresses are kept until you unsubscribe. Security logs rotate within 30 days.',
    ],
  },
  {
    title: 'Your rights',
    body: [
      'Under the Digital Personal Data Protection Act, 2023, you may request access to, correction of, or deletion of your personal data. Email privacy@ezcrm.in from the address in question and we will act within 30 days. You can also simply ask us, in any form conversation, to delete your enquiry — same result.',
    ],
  },
  {
    title: 'Where data lives',
    body: [
      'Website data is stored in MongoDB Atlas with encryption at rest, in cloud regions serving India. Access is limited to named EZCRM staff with role-based permissions, and every access is recorded in an audit log.',
    ],
  },
  {
    title: 'Changes and contact',
    body: [
      'If this policy changes materially, the change is dated here and announced to newsletter subscribers. Questions: privacy@ezcrm.in.',
      'Last updated: 1 June 2026.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <>
      <PageIntro
        kicker="Legal"
        title="Privacy policy"
        lede="The short version: we collect what you type into our forms, use it only to respond to you, never sell it, and delete it on request."
      />
      <div className="shell max-w-3xl space-y-10 pb-20">
        {SECTIONS.map((section) => (
          <section key={section.title} aria-label={section.title}>
            <h2 className="mb-3 font-display text-xl font-bold text-bright">{section.title}</h2>
            {section.body.map((paragraph, i) => (
              <p key={i} className="mt-2 text-sm leading-relaxed text-fog">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </>
  )
}
