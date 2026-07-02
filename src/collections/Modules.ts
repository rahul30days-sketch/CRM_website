import type { CollectionConfig } from 'payload'
import { isLoggedIn, isAdmin } from '@/access'
import { auditAfterChange, auditAfterDelete } from '@/hooks/audit'

/** One entry per CRM module — powers /features and /features/[module]. */
export const Modules: CollectionConfig = {
  slug: 'modules',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'slug', 'category', 'order'],
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
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Capture', value: 'capture' },
        { label: 'Engage', value: 'engage' },
        { label: 'Close', value: 'close' },
        { label: 'Support', value: 'support' },
        { label: 'Run the floor', value: 'operate' },
      ],
    },
    { name: 'tagline', type: 'text', required: true },
    { name: 'shortDescription', type: 'textarea', required: true },
    {
      name: 'problem',
      type: 'textarea',
      admin: { description: 'The day-to-day pain this module removes, in the buyer’s words.' },
    },
    {
      name: 'howItWorks',
      type: 'array',
      fields: [
        { name: 'step', type: 'text', required: true },
        { name: 'detail', type: 'textarea' },
      ],
    },
    {
      name: 'capabilities',
      type: 'array',
      fields: [{ name: 'capability', type: 'text', required: true }],
    },
    {
      name: 'metric',
      type: 'group',
      admin: { description: 'One concrete before/after, if plausible for this module.' },
      fields: [
        { name: 'before', type: 'text' },
        { name: 'after', type: 'text' },
        { name: 'caption', type: 'text' },
      ],
    },
    { name: 'longDescription', type: 'richText' },
    { name: 'screenshot', type: 'upload', relationTo: 'media' },
    { name: 'relatedModules', type: 'relationship', relationTo: 'modules', hasMany: true },
    { name: 'order', type: 'number', defaultValue: 0, admin: { description: 'Sort order on /features.' } },
  ],
  timestamps: true,
}
