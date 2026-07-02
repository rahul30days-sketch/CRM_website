import { ImageResponse } from 'next/og'
import { getBlogPost } from '@/lib/cms'

export const runtime = 'nodejs'
export const alt = 'EZCRM blog post'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  const title = post?.title ?? 'Playbooks for the sales floor'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          backgroundColor: '#0A1417',
          color: '#EDF4F5',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, backgroundColor: '#3ECF6E' }} />
          <div style={{ fontSize: 28, letterSpacing: 4, color: '#9BB2BA' }}>
            EZCRM · BLOG
          </div>
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.15, maxWidth: 1000 }}>
          {title}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700 }}>
            EZ<span style={{ color: '#F2B33D' }}>CRM</span>
          </div>
          <div style={{ fontSize: 24, color: '#9BB2BA' }}>ezcrm.in</div>
        </div>
      </div>
    ),
    size,
  )
}
