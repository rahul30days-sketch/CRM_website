import type { GlobalConfig } from 'payload'
import { isLoggedIn } from '@/access'

export const DemoPage: GlobalConfig = {
  slug: 'demo-page',
  label: 'Demo Page',
  admin: { group: 'Content' },
  access: {
    read: isLoggedIn,
    update: isLoggedIn,
  },
  fields: [
    { name: 'kicker', type: 'text', defaultValue: 'Book a demo' },
    { name: 'heading', type: 'text', defaultValue: 'Thirty minutes Your leads live.' },
    {
      name: 'lede',
      type: 'textarea',
      defaultValue: 'Fill this in and a product specialist — someone who can configure the system, not read a script — calls you within one working day.',
    },
    {
      name: 'whatToExpect',
      type: 'array',
      admin: { description: 'What to expect list on the left side of the demo page.' },
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'preferToTalk',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Prefer to talk first?' },
        { name: 'phone', type: 'text', defaultValue: '+91 98765 43210' },
        { name: 'email', type: 'email', defaultValue: 'hello@ezcrm.in' },
      ],
    },
  ],
}
