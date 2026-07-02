import type { GlobalConfig } from 'payload'
import { isLoggedIn } from '@/access'

/**
 * Editable content for the homepage sections whose copy isn't already driven
 * by a collection. The data-heavy sections stay collection-driven:
 *  - Module rows  → `modules` collection
 *  - Testimonials → `testimonials` collection
 *  - Logo cloud   → `integrations` collection
 * This global covers the hero, stat strip, section headings, the WhatsApp
 * showcase, and the closing CTA. Every field falls back to a sensible default
 * in `getHomepage()`, so the page renders fully before anything is edited.
 */
export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage',
  admin: { group: 'Content' },
  access: {
    read: isLoggedIn,
    update: isLoggedIn,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            { name: 'heroKicker', type: 'text', label: 'Kicker (small line above heading)' },
            { name: 'heroHeading', type: 'text' },
            { name: 'heroSubheading', type: 'textarea' },
            {
              name: 'heroPrimaryCta',
              type: 'group',
              fields: [
                { name: 'label', type: 'text' },
                { name: 'href', type: 'text' },
              ],
            },
            {
              name: 'heroSecondaryCta',
              type: 'group',
              fields: [
                { name: 'label', type: 'text' },
                { name: 'href', type: 'text' },
              ],
            },
            {
              name: 'heroTrustText',
              type: 'text',
              admin: { description: 'e.g. “500+ teams” — the bold part; rendered before “across India”.' },
            },
          ],
        },
        {
          label: 'Stat strip',
          fields: [
            {
              name: 'stats',
              type: 'array',
              maxRows: 4,
              admin: { description: 'The glass strip under the hero. Up to 4 stats.' },
              fields: [
                { name: 'value', type: 'text', required: true },
                { name: 'label', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Sections',
          fields: [
            { name: 'logoCloudHeading', type: 'text' },
            {
              name: 'modulesSection',
              type: 'group',
              fields: [
                { name: 'kicker', type: 'text' },
                { name: 'heading', type: 'text' },
                { name: 'subheading', type: 'textarea' },
              ],
            },
            {
              name: 'testimonialsSection',
              type: 'group',
              fields: [
                { name: 'kicker', type: 'text' },
                { name: 'heading', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'WhatsApp showcase',
          fields: [
            { name: 'whatsappKicker', type: 'text' },
            { name: 'whatsappHeading', type: 'text' },
            { name: 'whatsappBody', type: 'textarea' },
            {
              name: 'whatsappPoints',
              type: 'array',
              fields: [{ name: 'point', type: 'text', required: true }],
            },
          ],
        },
        {
          label: 'Closing CTA',
          fields: [
            { name: 'ctaHeading', type: 'text' },
            { name: 'ctaSubheading', type: 'textarea' },
            {
              name: 'ctaPrimary',
              type: 'group',
              fields: [
                { name: 'label', type: 'text' },
                { name: 'href', type: 'text' },
              ],
            },
            {
              name: 'ctaSecondary',
              type: 'group',
              fields: [
                { name: 'label', type: 'text' },
                { name: 'href', type: 'text' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
