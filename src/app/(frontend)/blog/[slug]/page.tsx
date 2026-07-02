import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { PageIntro } from '@/components/page-intro'
import { CtaBand } from '@/components/sections/cta-band'
import { JsonLd } from '@/components/json-ld'
import { blogPosts as factoryPosts } from '@/content/stories'
import { getBlogPost } from '@/lib/cms'

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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

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
          kicker={`Blog · ${new Date(post.publishedAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}`}
          title={post.title}
          lede={post.excerpt}
        />
        <div className="shell max-w-3xl space-y-6 pb-20 text-[1.0625rem] leading-relaxed text-bright/90">
          {post.lexicalContent ? (
            // CMS content is structured Lexical JSON rendered through
            // Payload's official serializer — never raw HTML.
            <RichText
              data={post.lexicalContent as SerializedEditorState}
              className="space-y-6 [&_a]:text-marigold [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold"
            />
          ) : (
            post.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)
          )}
        </div>
      </article>

      <CtaBand
        heading="Reading about it is slower than seeing it."
        subheading="Thirty minutes, your lead sources, live on screen."
      />
    </>
  )
}
