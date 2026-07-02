import type { GlobalConfig } from 'payload'
import { isLoggedIn } from '@/access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: { group: 'System' },
  access: {
    read: isLoggedIn,
    update: isLoggedIn,
  },
  fields: [
    { name: 'siteName', type: 'text', required: true, defaultValue: 'EZCRM' },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'The sales command center for Indian teams',
    },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Favicon for the website. Recommended size: 32x32px or 48x48px in PNG or SVG format.',
      },
    },
    {
      name: 'heroDashboard',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Homepage hero image — a screenshot of your live dashboard. When set, it replaces the built-in animated demo. Use a wide (e.g. 1600×1000) PNG/JPG; remember to fill the alt text.',
      },
    },
    { name: 'defaultOgImage', type: 'upload', relationTo: 'media' },
    {
      name: 'social',
      type: 'array',
      fields: [
        { name: 'platform', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    { name: 'footerNote', type: 'textarea' },
    { name: 'supportEmail', type: 'email', defaultValue: 'support@ezcrm.in' },
    { name: 'salesPhone', type: 'text' },
  ],
}
