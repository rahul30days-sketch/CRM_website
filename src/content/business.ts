/**
 * Business facts the website states — ONE place, so every page agrees.
 *
 * Values marked UNCONFIRMED still need the business's sign-off. Change them
 * here; every page follows.
 */

export const BUSINESS = {
  /**
   * Free-trial length in days.
   * Confirmed 30 days by the owner's pricing screenshot (2026-11-25).
   */
  trialDays: 30,

  /**
   * Whether customer names, testimonials, case studies and usage statistics
   * ("500+ teams", "12,400+ leads/month", "99.9% uptime") are verified and
   * cleared for publication. While false: homepage stats, ratings and
   * testimonials are hidden, and case-study pages carry an "illustrative"
   * notice and are kept out of search.
   */
  socialProofVerified: false,

  /*
   * Company details — EZCRM is a product of 30Days Technologies Pvt. Ltd.
   * Taken from the footer of https://30days.in on 2026-11-25.
   */
  company: '30Days Technologies',
  companyUrl: 'https://30days.in',
  salesPhone: '+91 93553 21321' as string | null,
  salesPhoneHref: 'tel:+919355321321',
  salesEmail: 'info@30days.in',
  supportEmail: 'info@30days.in',
  legalName: '30Days Technologies Pvt. Ltd.',
  address: 'Second Floor, AKM Tower, Ganpati Dham Road, Udyog Vihar, Bahadurgarh, Sankhol, Haryana 124507, India',
  hours: 'Mon–Sat, 9:00 am–6:00 pm IST',
} as const

export const TRIAL_TEXT = `${BUSINESS.trialDays}-day free trial`
