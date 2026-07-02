import type { CollectionConfig } from 'payload'
import { isLoggedIn, isAdmin } from '@/access'
import { auditAfterChange, auditAfterDelete } from '@/hooks/audit'

export const PricingPlans: CollectionConfig = {
  slug: 'pricing-plans',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    defaultColumns: ['name', 'priceMonthly', 'mostPopular', 'order'],
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
    { name: 'name', type: 'text', required: true },
    { name: 'forWhom', type: 'text', required: true, admin: { description: 'e.g. “For a 3-person sales desk”' } },
    {
      name: 'priceMonthly',
      type: 'number',
      admin: { description: 'Per user per month, in ₹. Leave empty for “Talk to us”.' },
    },
    {
      name: 'priceYearly',
      type: 'number',
      admin: { description: 'Per user per month when billed yearly, in ₹.' },
    },
    {
      name: 'features',
      type: 'array',
      required: true,
      fields: [{ name: 'feature', type: 'text', required: true }],
    },
    { name: 'limitsNote', type: 'text', admin: { description: 'e.g. “Up to 25,000 contacts”' } },
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
