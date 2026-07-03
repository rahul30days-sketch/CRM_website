import type { Metadata } from 'next'
import { PageIntro } from '@/components/page-intro'
import { FaqList } from '@/components/sections/faq-list'
import { CtaBand } from '@/components/sections/cta-band'
import { getFaqs } from '@/lib/cms'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Security — how EZCRM protects your customer data',
  description:
    'OWASP-aligned engineering, tenant isolation, role-based and data-scoped access, full audit trails, encryption in transit and at rest, and honest answers about data handling.',
}

const SECTIONS: { title: string; body: string[]; points?: string[] }[] = [
  {
    title: 'Tenant isolation',
    body: [
      'EZCRM is multi-tenant by architecture: every company’s data lives in an isolated tenant, and every query is scoped to it at the platform layer — not by application code remembering to add a filter. White-label reseller deployments inherit the same isolation, so an agency’s clients can never see each other.',
    ],
  },
  {
    title: 'Access control that matches an org chart',
    body: [
      'Roles decide what a person can do; data scopes decide what they can see. A telecaller works only their assigned leads. A branch manager sees one branch. Exports, bulk deletes and API tokens can be limited to specific roles, because the biggest data risk in a sales team is rarely a hacker — it’s an outgoing employee with an export button.',
    ],
    points: [
      'Role-based permissions with per-module granularity',
      'Data scoping by branch, team and assignment',
      'Export and bulk-action restrictions per role',
      'Session expiry and account lockout after repeated failed logins',
    ],
  },
  {
    title: 'A full audit trail',
    body: [
      'Every login and login attempt, every record change, every export and every deletion is written to an append-only audit log with who, what, when and from where. Admins can read it; nobody can edit it. When a dispute comes down to “who changed this quotation?”, the answer takes a minute, not a forensic project.',
    ],
  },
  {
    title: 'OWASP-aligned engineering',
    body: [
      'The platform and this website are built against the OWASP Application Security Verification Standard and Top 10. In practice, that means the boring, load-bearing controls are on by default:',
    ],
    points: [
      'Encryption in transit (TLS 1.2+, HSTS) and at rest (MongoDB Atlas encrypted storage)',
      'Passwords hashed with bcrypt; 8-character minimum, 128 maximum — never truncated',
      'Every input validated server-side with strict schemas; no query built from raw user input',
      'Strict security headers: CSP, frame-ancestors none, nosniff, referrer and permissions policies',
      'Rate limiting on authentication and public form endpoints',
      'CSRF protection on all state-changing requests; cookies are Secure, HttpOnly, SameSite',
      'No secrets in client-side code — configuration is validated server-side at boot',
    ],
  },
  {
    title: 'Your data is yours',
    body: [
      'Admins can export every collection — leads, contacts, deals, quotations, message logs — as XLSX/CSV at any time, without asking us. If you leave EZCRM, your data leaves with you. Demo-request and contact-form data on this website is kept only for handling your enquiry and is never sold or shared; the details are in our privacy policy.',
    ],
  },
  {
    title: 'Official channels only',
    body: [
      'WhatsApp runs exclusively on Meta’s official Business API — we do not and will not ship grey-market gateways, because your primary business number is not an acceptable thing to gamble. SMS routes are DLT-registered. Payment collection uses Razorpay and Cashfree’s hosted, PCI-DSS-compliant flows; card data never touches EZCRM servers.',
    ],
  },
  {
    title: 'Availability & operations',
    body: [
      'EZCRM runs on managed, replicated infrastructure with MongoDB Atlas multi-node clusters, automated daily backups with point-in-time recovery, and monitored error budgets. Maintenance windows are announced in advance and scheduled outside Indian business hours.',
    ],
  },
  {
    title: 'Responsible disclosure',
    body: [
      'Found a vulnerability? Email security@ezcrm.in with reproduction steps. We acknowledge within 48 hours, keep you updated while we fix, and credit researchers who report responsibly. Please avoid testing against tenants you don’t own.',
    ],
  },
]

export default async function SecurityPage() {
  const securityFaqs = await getFaqs('security')

  return (
    <>
      <PageIntro
        kicker="Security & trust"
        title="Your customer list is your business, We treat it that way."
        lede="A CRM holds the most commercially sensitive data an SMB owns. This page explains — specifically, not in badges — how EZCRM protects it."
      />

      <div className="shell max-w-4xl space-y-12 pb-20">
        {SECTIONS.map((section) => (
          <section key={section.title} aria-label={section.title} className="border-t border-line pt-8">
            <h2 className="font-display text-2xl font-bold text-bright">{section.title}</h2>
            {section.body.map((paragraph, i) => (
              <p key={i} className="mt-3 leading-relaxed text-fog">
                {paragraph}
              </p>
            ))}
            {section.points ? (
              <ul className="mt-4 space-y-2">
                {section.points.map((point) => (
                  <li key={point} className="flex gap-3 text-sm text-fog">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-won" aria-hidden />
                    {point}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        {securityFaqs.length > 0 ? (
          <section aria-labelledby="security-faq" className="border-t border-line pt-8">
            <h2 id="security-faq" className="mb-4 font-display text-2xl font-bold text-bright">
              Common questions
            </h2>
            <FaqList faqs={securityFaqs} />
          </section>
        ) : null}
      </div>

      <CtaBand
        heading="Have a security questionnaire?"
        subheading="Send it over — we answer vendor assessments quickly, in writing."
        primaryLabel="Contact us"
        primaryHref="/contact"
        secondaryLabel="Privacy policy"
        secondaryHref="/legal/privacy"
      />
    </>
  )
}
