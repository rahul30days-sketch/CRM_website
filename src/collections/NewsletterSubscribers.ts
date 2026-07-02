import type { CollectionConfig } from 'payload'
import { isAdmin, isLoggedIn, nobody } from '@/access'

/** Created only by the newsletter Server Action — see DemoRequests for the pattern. */
export const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',
  admin: {
    useAsTitle: 'email',
    group: 'Leads',
    defaultColumns: ['email', 'status', 'createdAt'],
  },
  access: {
    read: isLoggedIn,
    create: nobody,
    update: isLoggedIn,
    delete: isAdmin,
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true, index: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'subscribed',
      options: [
        { label: 'Subscribed', value: 'subscribed' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
      ],
    },
    { name: 'source', type: 'text' },
  ],
  timestamps: true,
}
