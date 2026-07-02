import type { CollectionConfig } from 'payload'
import { isLoggedIn, isAdmin } from '@/access'
import { auditAfterChange, auditAfterDelete } from '@/hooks/audit'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'client',
    group: 'Content',
    defaultColumns: ['client', 'industry', 'publishedAt'],
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
    { name: 'client', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'industry', type: 'text', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'summary', type: 'textarea', required: true },
    { name: 'challenge', type: 'textarea', required: true },
    { name: 'solution', type: 'textarea', required: true },
    { name: 'results', type: 'textarea', required: true },
    {
      name: 'metrics',
      type: 'array',
      admin: { description: 'The numbers that make this story credible.' },
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
    { name: 'publishedAt', type: 'date' },
  ],
  timestamps: true,
}
