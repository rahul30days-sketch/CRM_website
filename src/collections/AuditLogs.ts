import type { CollectionConfig } from 'payload'
import { isAdmin, nobody } from '@/access'

/**
 * System-written accountability trail. No API surface can write to it —
 * rows are inserted only by server-side hooks via the Local API with
 * overrideAccess. Admin-read-only, immutable.
 */
export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  admin: {
    group: 'System',
    defaultColumns: ['action', 'collectionSlug', 'userEmail', 'ip', 'createdAt'],
    description: 'Who did what, when, from where. Written by hooks; read-only.',
  },
  access: {
    read: isAdmin,
    create: nobody,
    update: nobody,
    delete: nobody,
  },
  fields: [
    {
      name: 'action',
      type: 'select',
      required: true,
      options: ['login', 'login-attempt', 'logout', 'create', 'update', 'delete'],
      index: true,
    },
    { name: 'collectionSlug', type: 'text', index: true },
    { name: 'documentId', type: 'text' },
    { name: 'userEmail', type: 'text', index: true },
    { name: 'ip', type: 'text' },
    { name: 'userAgent', type: 'text' },
    { name: 'summary', type: 'text' },
  ],
  timestamps: true,
}
