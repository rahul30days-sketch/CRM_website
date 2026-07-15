import type { CollectionConfig } from 'payload'
import { isLoggedIn, isAdmin } from '@/access'
import { auditAfterChange, auditAfterDelete } from '@/hooks/audit'

/**
 * Billing plans, mirroring the live EZCRM plans (product Admin → Plans).
 * Pricing is flat per plan (not per seat). Quotas are label/value pairs so a
 * new quota can be added here without a schema change.
 */
export const PricingPlans: CollectionConfig = {
  slug: 'pricing-plans',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    defaultColumns: ['name', 'priceMonthly', 'priceYearly', 'mostPopular', 'order'],
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
    { name: 'name', type: 'text', required: true, admin: { description: 'e.g. “Pro”' } },
    {
      name: 'forWhom',
      type: 'text',
      required: true,
      admin: { description: 'e.g. “Full-featured CRM for professional teams”' },
    },
    {
      name: 'priceMonthly',
      type: 'number',
      admin: { description: 'Flat ₹ per month. Use 0 for a Free plan; leave empty for “Custom”.' },
    },
    {
      name: 'priceQuarterly',
      type: 'number',
      admin: { description: 'Flat ₹ billed quarterly (optional).' },
    },
    {
      name: 'priceYearly',
      type: 'number',
      admin: { description: 'Flat ₹ billed yearly — the annual total (optional).' },
    },
    {
      name: 'trialText',
      type: 'text',
      admin: { description: 'e.g. “30-day free trial”. Leave empty to hide.' },
    },
    {
      name: 'limits',
      type: 'array',
      label: 'Plan limits / quotas',
      admin: { description: 'Shown as a list on the card, e.g. Users → 5, Storage → 5 GB.' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    {
      name: 'features',
      type: 'array',
      label: 'Extra feature bullets (optional)',
      fields: [{ name: 'feature', type: 'text', required: true }],
    },
    { name: 'limitsNote', type: 'text', admin: { description: 'Small print under the price.' } },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', required: true, defaultValue: 'Start free trial' },
        { name: 'href', type: 'text', required: true, defaultValue: '/demo' },
      ],
    },
    { name: 'mostPopular', type: 'checkbox', defaultValue: false },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
  timestamps: true,
}
