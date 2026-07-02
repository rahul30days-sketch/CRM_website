import type { Block, CollectionConfig } from 'payload'
import { isLoggedIn, isAdmin } from '@/access'
import { auditAfterChange, auditAfterDelete } from '@/hooks/audit'

/**
 * Block library for marketing/campaign landing pages, so the marketing team
 * can assemble new pages without a deploy. Rendered by
 * src/components/blocks/RenderBlocks.tsx — keep the two in sync.
 */

const HeroBlock: Block = {
  slug: 'hero',
  fields: [
    { name: 'kicker', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'subheading', type: 'textarea' },
    {
      name: 'ctas',
      type: 'array',
      maxRows: 2,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
  ],
}

const FeatureGridBlock: Block = {
  slug: 'featureGrid',
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'href', type: 'text' },
      ],
    },
  ],
}

const TestimonialBlock: Block = {
  slug: 'testimonialWall',
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'testimonials', type: 'relationship', relationTo: 'testimonials', hasMany: true },
  ],
}

const CtaBlock: Block = {
  slug: 'cta',
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'subheading', type: 'textarea' },
    { name: 'buttonLabel', type: 'text', required: true, defaultValue: 'Book a demo' },
    { name: 'buttonHref', type: 'text', required: true, defaultValue: '/demo' },
  ],
}

const FaqBlock: Block = {
  slug: 'faqBlock',
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'category',
      type: 'select',
      options: ['general', 'pricing', 'whatsapp', 'security', 'onboarding'],
      admin: { description: 'Pulls published FAQs from this category.' },
    },
  ],
}

const LogoCloudBlock: Block = {
  slug: 'logoCloud',
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'logos', type: 'relationship', relationTo: 'integrations', hasMany: true },
  ],
}

const RichTextBlock: Block = {
  slug: 'richText',
  fields: [{ name: 'content', type: 'richText', required: true }],
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'slug', 'updatedAt'],
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
      name: 'layout',
      type: 'blocks',
      blocks: [
        HeroBlock,
        FeatureGridBlock,
        TestimonialBlock,
        CtaBlock,
        FaqBlock,
        LogoCloudBlock,
        RichTextBlock,
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
  timestamps: true,
}
