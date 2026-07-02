import type { CollectionConfig } from 'payload'
import { isAdmin, isLoggedIn, nobody } from '@/access'

/**
 * Lead capture, not editorial content. Rows are created exclusively by the
 * /demo and /contact Server Actions through the Local API (after Zod
 * validation + rate limiting). The raw REST create endpoint stays closed —
 * `create: nobody` below is deliberate.
 *
 * PII retention: name/email/phone/company only — no IP, no user agent.
 * Abuse signals live in the in-memory rate limiter and never persist.
 */
export const DemoRequests: CollectionConfig = {
  slug: 'demo-requests',
  admin: {
    useAsTitle: 'workEmail',
    group: 'Leads',
    defaultColumns: ['name', 'workEmail', 'company', 'status', 'createdAt'],
  },
  access: {
    read: isLoggedIn,
    create: nobody,
    update: isLoggedIn,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'workEmail', type: 'email', required: true, index: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'company', type: 'text', required: true },
    {
      name: 'companySize',
      type: 'select',
      options: [
        { label: '1–5 people', value: '1-5' },
        { label: '6–20 people', value: '6-20' },
        { label: '21–50 people', value: '21-50' },
        { label: '51–200 people', value: '51-200' },
        { label: '200+ people', value: '200+' },
      ],
    },
    { name: 'moduleInterest', type: 'relationship', relationTo: 'modules', hasMany: true },
    { name: 'message', type: 'textarea', maxLength: 2000 },
    {
      name: 'source',
      type: 'text',
      admin: { description: 'Which page or campaign the request came from.' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Demo booked', value: 'demo-booked' },
        { label: 'Closed', value: 'closed' },
      ],
      index: true,
    },
  ],
  timestamps: true,
}
