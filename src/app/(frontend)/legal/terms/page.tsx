import type { Metadata } from 'next'
import { PageIntro } from '@/components/page-intro'

export const metadata: Metadata = {
  title: 'Terms of service',
  description: 'Terms governing the use of the EZCRM website and trial services.',
}

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: '1. Who we are',
    body: [
      'This website is operated by EZCRM Technologies Pvt. Ltd. (“EZCRM”, “we”), 4th Floor, Baner Road, Pune 411045, Maharashtra, India. Using this site or requesting a trial means you accept these terms.',
    ],
  },
  {
    title: '2. The website',
    body: [
      'Content on this site — copy, product descriptions, case-study figures — is provided in good faith for evaluation. Metrics quoted in customer stories are those customers’ reported results; yours will depend on your process and data. Nothing here is professional advice on tax, telecom compliance or data-protection law.',
    ],
  },
  {
    title: '3. Trials and demos',
    body: [
      'Trial tenants are provided free for 14 days for evaluation. Don’t upload data you have no right to process, don’t use the trial to send spam (WhatsApp, SMS or email), and don’t attempt to probe or disrupt the service. We may suspend trials that break these rules. Trial data is deleted 30 days after expiry unless you convert.',
    ],
  },
  {
    title: '4. The subscription product',
    body: [
      'Use of the EZCRM application under a paid plan is governed by the subscription agreement presented at signup — including uptime commitments, data-processing terms and payment terms — not by this page. Where the two differ, the subscription agreement wins.',
    ],
  },
  {
    title: '5. Intellectual property',
    body: [
      'EZCRM, the EZCRM logo and the contents of this site are our property or used with permission. You may quote reasonably with attribution; you may not scrape the site wholesale or pass off our materials as yours. Customer names and logos appear with those customers’ consent.',
    ],
  },
  {
    title: '6. Liability',
    body: [
      'This website is provided “as is”. To the extent permitted by law, we are not liable for indirect or consequential losses arising from reliance on website content. Our total liability in connection with the website is limited to ₹10,000. Liability under a paid subscription is set by the subscription agreement.',
    ],
  },
  {
    title: '7. Governing law',
    body: [
      'These terms are governed by the laws of India; courts at Pune, Maharashtra have exclusive jurisdiction.',
      'Last updated: 1 June 2026.',
    ],
  },
]

export default function TermsPage() {
  return (
    <>
      <PageIntro kicker="Legal" title="Terms of service" />
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
