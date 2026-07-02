import type { Metadata } from 'next'
import Link from 'next/link'
import { PageIntro } from '@/components/page-intro'
import { getBlogPosts } from '@/lib/cms'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Blog — playbooks for Indian sales teams',
  description:
    'Practical writing on lead response, WhatsApp selling, DLT compliance and running a disciplined sales floor. No growth-hacking fluff.',
}

const CATEGORY_LABELS: Record<string, string> = {
  playbooks: 'Playbook',
  product: 'Product update',
  whatsapp: 'WhatsApp & compliance',
  customers: 'Customer story',
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <>
      <PageIntro
        kicker="Blog"
        title="Playbooks for the sales floor."
        lede="What we learn watching hundreds of Indian sales teams work — written up so yours can skip the expensive lessons."
      />

      <div className="shell max-w-4xl space-y-1 pb-20">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block border-t border-line py-6 transition-colors last:border-b hover:bg-panel/50 sm:px-3"
          >
            <p className="kicker mb-2">
              {CATEGORY_LABELS[post.category] ?? post.category} ·{' '}
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </time>
            </p>
            <h2 className="font-display text-2xl font-bold leading-snug text-bright group-hover:text-marigold">
              {post.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fog">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </>
  )
}
