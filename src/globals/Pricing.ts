import type { GlobalConfig } from 'payload'
import { isLoggedIn } from '@/access'

/** Add-on pricing shown under the plan cards on /pricing. */
export const Pricing: GlobalConfig = {
  slug: 'pricing',
  label: 'Pricing page',
  admin: { group: 'Content' },
  access: {
    read: isLoggedIn,
    update: isLoggedIn,
  },
  fields: [
    { name: 'addonsHeading', type: 'text', defaultValue: 'Add-on Pricing' },
    {
      name: 'addons',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { description: 'e.g. “Additional User”' } },
        { name: 'price', type: 'number', required: true, admin: { description: '₹ amount, e.g. 999' } },
        { name: 'unit', type: 'text', required: true, admin: { description: 'e.g. “/user/month”' } },
      ],
    },
  ],
}
