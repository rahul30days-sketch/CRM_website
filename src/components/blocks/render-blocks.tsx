import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { PageIntro } from '@/components/page-intro'
import { CtaBand } from '@/components/sections/cta-band'
import { FaqList } from '@/components/sections/faq-list'
import { TestimonialWall } from '@/components/sections/testimonial-wall'
import { buttonVariants } from '@/components/ui/button'
import { getFaqs } from '@/lib/cms'
import { cn } from '@/lib/utils'

/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyBlock = Record<string, any>

/**
 * Renders the block layout of a `pages` document. Mirrors the block set in
 * src/collections/Pages.ts — add a block there, add a case here.
 */
export async function RenderBlocks({ blocks }: { blocks: AnyBlock[] }) {
  // Hoist async data needs out of the render loop.
  const needsFaqs = blocks.some((b) => b.blockType === 'faqBlock')
  const allFaqs = needsFaqs ? await getFaqs() : []

  return (
    <>
      {blocks.map((block, i) => {
        switch (block.blockType) {
          case 'hero':
            return (
              <div key={i}>
                <PageIntro
                  kicker={block.kicker ?? 'EZCRM'}
                  title={block.heading}
                  lede={block.subheading}
                />
                {block.ctas?.length ? (
                  <div className="shell flex gap-3 pb-12">
                    {block.ctas.map((cta: AnyBlock, j: number) => (
                      <Link
                        key={j}
                        href={cta.href}
                        className={cn(buttonVariants({ variant: j === 0 ? 'primary' : 'secondary', size: 'lg' }))}
                      >
                        {cta.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            )
          case 'featureGrid':
            return (
              <section key={i} className="shell py-12">
                {block.heading ? (
                  <h2 className="mb-8 font-display text-3xl font-bold text-bright">{block.heading}</h2>
                ) : null}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {(block.items ?? []).map((item: AnyBlock, j: number) => (
                    <article key={j} className="panel-frame p-5">
                      <h3 className="font-medium text-bright">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-fog">{item.description}</p>
                      {item.href ? (
                        <Link href={item.href} className="mt-3 inline-block font-mono text-xs uppercase tracking-wider text-marigold hover:underline">
                          Learn more →
                        </Link>
                      ) : null}
                    </article>
                  ))}
                </div>
              </section>
            )
          case 'testimonialWall': {
            const docs = (block.testimonials ?? []).filter((t: AnyBlock) => typeof t === 'object')
            return (
              <section key={i} className="shell py-12">
                {block.heading ? (
                  <h2 className="mb-8 font-display text-3xl font-bold text-bright">{block.heading}</h2>
                ) : null}
                <TestimonialWall
                  testimonials={docs.map((t: AnyBlock) => ({
                    quote: t.quote,
                    author: t.author,
                    role: t.role,
                    company: t.company,
                    metric: t.metric?.value ? { value: t.metric.value, label: t.metric.label ?? '' } : undefined,
                  }))}
                />
              </section>
            )
          }
          case 'cta':
            return (
              <CtaBand
                key={i}
                heading={block.heading}
                subheading={block.subheading}
                primaryLabel={block.buttonLabel}
                primaryHref={block.buttonHref}
              />
            )
          case 'faqBlock': {
            const faqs = block.category
              ? allFaqs.filter((f) => f.category === block.category)
              : allFaqs
            return (
              <section key={i} className="shell max-w-3xl py-12">
                {block.heading ? (
                  <h2 className="mb-6 font-display text-3xl font-bold text-bright">{block.heading}</h2>
                ) : null}
                <FaqList faqs={faqs} />
              </section>
            )
          }
          case 'logoCloud': {
            const logos = (block.logos ?? []).filter((l: AnyBlock) => typeof l === 'object')
            return (
              <section key={i} className="shell py-12">
                {block.heading ? <p className="kicker mb-4">{block.heading}</p> : null}
                <ul className="flex flex-wrap gap-2">
                  {logos.map((logo: AnyBlock) => (
                    <li key={logo.slug} className="rounded-chip border border-line bg-panel px-3 py-1.5 font-mono text-xs text-fog">
                      {logo.name}
                    </li>
                  ))}
                </ul>
              </section>
            )
          }
          case 'richText':
            return (
              <section key={i} className="shell max-w-3xl space-y-6 py-12 leading-relaxed text-bright/90">
                <RichText
                  data={block.content as SerializedEditorState}
                  className="space-y-6 [&_a]:text-marigold [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold"
                />
              </section>
            )
          default:
            return null
        }
      })}
    </>
  )
}
