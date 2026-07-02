import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RenderBlocks } from '@/components/blocks/render-blocks'

/**
 * Catch-all for CMS-composed landing/campaign pages (`pages` collection).
 * Marketing can ship a new page from the admin panel without a deploy.
 * Static routes defined elsewhere in the app always win over this route.
 */

export const revalidate = 300

/* eslint-disable @typescript-eslint/no-explicit-any */

async function findPage(slug: string): Promise<Record<string, any> | null> {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    })
    return docs[0] ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await findPage(slug)
  if (!page) return {}
  return {
    title: page.seo?.title ?? page.title,
    description: page.seo?.description ?? undefined,
  }
}

export default async function CmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await findPage(slug)
  if (!page) notFound()

  return <RenderBlocks blocks={page.layout ?? []} />
}
