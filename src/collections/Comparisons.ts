import type { CollectionConfig } from 'payload'
import { isLoggedIn, isAdmin } from '@/access'
import { auditAfterChange, auditAfterDelete } from '@/hooks/audit'

/**
 * "EZCRM vs …" comparison pages — bottom-funnel SEO, editable by marketing.
 * Powers /vs and /vs/[slug]. Factory defaults live in src/content/comparisons.ts.
 */
const compareValue = {
  type: 'select' as const,
  required: true,
  defaultValue: 'yes',
  options: [
    { label: '✓ Yes', value: 'yes' },
    { label: '~ Partial', value: 'partial' },
    { label: '✗ No', value: 'no' },
  ],
}

export const Comparisons: CollectionConfig = {
  slug: 'comparisons',
  admin: {
    useAsTitle: 'competitor',
    group: 'Content',
    defaultColumns: ['competitor', 'slug', 'order'],
  },
  access: {
    read: isLoggedIn,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [auditAfterChange],
    afterDelete: [auditAfterDelete],
  },
  fields: [
    { name: 'competitor', type: 'text', required: true, admin: { description: 'e.g. “Zoho CRM”' } },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'URL segment → /vs/<slug>. e.g. “zoho”' },
    },
    { name: 'kicker', type: 'text', admin: { description: 'e.g. “EZCRM vs Zoho CRM”' } },
    { name: 'heading', type: 'text', required: true },
    { name: 'lede', type: 'textarea', required: true },
    { name: 'verdict', type: 'textarea', admin: { description: 'One-paragraph honest positioning summary.' } },
    {
      name: 'ezcrmWinsWhen',
      type: 'array',
      labels: { singular: 'Reason', plural: 'EZCRM wins when' },
      fields: [{ name: 'point', type: 'text', required: true }],
    },
    {
      name: 'competitorFitsWhen',
      type: 'array',
      labels: { singular: 'Reason', plural: 'Competitor fits when' },
      fields: [{ name: 'point', type: 'text', required: true }],
    },
    {
      name: 'rows',
      type: 'array',
      label: 'Feature comparison rows',
      fields: [
        { name: 'feature', type: 'text', required: true },
        { name: 'ezcrm', label: 'EZCRM', ...compareValue },
        { name: 'competitor', label: 'Competitor', ...compareValue },
        { name: 'note', type: 'text', admin: { description: 'Optional caveat shown under the row.' } },
      ],
    },
    {
      name: 'differentiators',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'detail', type: 'textarea', required: true },
      ],
    },
    { name: 'migration', type: 'textarea', admin: { description: 'How to switch from this competitor.' } },
    {
      name: 'faqs',
      type: 'array',
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
  timestamps: true,
}
