import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { PageIntro } from '@/components/page-intro'
import { CtaBand } from '@/components/sections/cta-band'
import { JsonLd } from '@/components/json-ld'
import { blogPosts as factoryPosts } from '@/content/stories'
import Link from 'next/link'
import { getBlogPost, getBlogPosts } from '@/lib/cms'
import { SITE_URL } from '@/lib/site'

export const revalidate = 300

export function generateStaticParams() {
  return factoryPosts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { type: 'article', publishedTime: post.publishedAt },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) notFound()
  // Related: same category first, then the newest others.
  const related = (await getBlogPosts())
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category))
    .slice(0, 2)

  const siteUrl = SITE_URL

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          url: `${siteUrl}/blog/${post.slug}`,
          publisher: { '@type': 'Organization', name: 'EZCRM' },
        }}
      />

      <article>
        <PageIntro
        breadcrumbs={[{ label: 'Blog', href: '/blog' }]}
          kicker={`Blog · ${new Date(post.publishedAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}`}
          title={post.title}
          lede={post.excerpt}
        />
        <div className="shell max-w-3xl space-y-6 pb-20 text-[1.0625rem] leading-relaxed text-ink/90">
          {post.lexicalContent ? (
            // CMS content is structured Lexical JSON rendered through
            // Payload's official serializer — never raw HTML.
            <RichText
              data={post.lexicalContent as SerializedEditorState}
              className="space-y-6 [&_a]:text-brand [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold"
            />
          ) : (
            post.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)
          )}
        </div>
      </article>

      {related.length > 0 ? (
        <aside className="border-t border-line bg-sky/40" aria-labelledby="related-heading">
          <div className="shell max-w-3xl py-14">
            <h2 id="related-heading" className="kicker mb-5">
              Keep reading
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/blog/${r.slug}`}
                    className="group block h-full rounded-card border border-line bg-white p-5 shadow-press transition-colors duration-fast hover:border-brand/40"
                  >
                    <span className="font-display text-lg font-bold leading-snug text-ink group-hover:text-brand">
                      {r.title}
                    </span>
                    <span className="mt-2 line-clamp-2 block text-sm text-slate">{r.excerpt}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      ) : null}

      <CtaBand
        heading="Reading about it is slower than seeing it."
        subheading="Thirty minutes, your lead sources, live on screen."
      />
    </>
  )
}
