import type { GlobalConfig } from 'payload'
import { isLoggedIn } from '@/access'

/** Header/footer menus, editable without a redeploy. */
export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: { group: 'System' },
  access: {
    read: isLoggedIn,
    update: isLoggedIn,
  },
  fields: [
    {
      name: 'header',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    {
      name: 'footer',
      type: 'array',
      fields: [
        { name: 'groupTitle', type: 'text', required: true },
        {
          name: 'links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
          ],
        },
      ],
    },
  ],
}
