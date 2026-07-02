import type { CollectionConfig } from 'payload'
import { isLoggedIn, isAdmin } from '@/access'
import { auditAfterChange, auditAfterDelete } from '@/hooks/audit'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'author',
    group: 'Content',
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
    { name: 'quote', type: 'textarea', required: true },
    { name: 'author', type: 'text', required: true },
    { name: 'role', type: 'text', required: true },
    { name: 'company', type: 'text', required: true },
    { name: 'headshot', type: 'upload', relationTo: 'media' },
    {
      name: 'metric',
      type: 'group',
      admin: { description: 'Optional hard number that backs the quote.' },
      fields: [
        { name: 'value', type: 'text' },
        { name: 'label', type: 'text' },
      ],
    },
    {
      name: 'module',
      type: 'relationship',
      relationTo: 'modules',
      admin: { description: 'Place this quote on the matching module page.' },
    },
  ],
  timestamps: true,
}
