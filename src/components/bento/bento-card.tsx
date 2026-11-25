'use client'

/**
 * One bento card: a whole-card link to /features/<slug> with a live mini
 * preview of the module above its title and tagline.
 *
 * Motion: the preview advances on a slow loop only while the card is on
 * screen (useActiveMotion) and the section isn't paused; hovering or focusing
 * the card speeds it up (and runs it even when paused, since the visitor
 * asked for it). Reduced motion renders the preview's final state, static.
 *
 * Accessibility: exactly one focusable element per card. Its name is the
 * module title (aria-labelledby) and its description is the tagline; the
 * preview is decorative and aria-hidden.
 */

import Link from 'next/link'
import { useId, useRef, useState, type ComponentType } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useActiveMotion } from '@/hooks/use-active-motion'
import { useLoop } from './use-loop'
import { useStill } from './use-still'
import type { PreviewProps } from './previews'

export type BentoSize = 'hero' | 'medium' | 'small'

export function BentoCard({
  slug,
  title,
  tagline,
  category,
  Preview,
  span,
  size,
  tone = 'light',
  index,
  paused,
}: {
  slug: string
  title: string
  tagline: string
  category?: string
  Preview: ComponentType<PreviewProps & { uid: string }>
  span: string
  size: BentoSize
  tone?: 'light' | 'night'
  index: number
  paused: boolean
}) {
  const ref = useRef<HTMLLIElement>(null)
  const uid = useId()
  const titleId = `${uid}-title`
  const tagId = `${uid}-tag`
  const still = useStill()
  const onScreen = useActiveMotion(ref)
  const [engaged, setEngaged] = useState(false)
  const running = onScreen && (engaged || !paused)
  const step = useLoop(running, engaged ? 1300 : 3200, engaged ? 250 : (index * 410) % 2600)
  const night = tone === 'night'

  return (
    <li ref={ref} className={cn('min-w-0', span)}>
      <Link
        href={`/features/${slug}`}
        aria-labelledby={titleId}
        aria-describedby={tagId}
        onPointerEnter={() => setEngaged(true)}
        onPointerLeave={() => setEngaged(false)}
        onFocus={() => setEngaged(true)}
        onBlur={() => setEngaged(false)}
        className={cn(
          'group relative flex h-full flex-col overflow-hidden rounded-card border p-4 transition-[transform,box-shadow,border-color] duration-base ease-out hover:-translate-y-0.5 sm:p-5',
          size === 'hero' ? 'min-h-[26rem] lg:min-h-0' : 'min-h-[17rem] lg:min-h-0',
          night
            ? 'border-night-line bg-night shadow-float hover:border-brand-hi/60'
            : 'border-line bg-white shadow-soft hover:border-brand/30 hover:shadow-float',
        )}
      >
        <div aria-hidden className="relative min-h-0 flex-1 overflow-hidden">
          <Preview step={step} still={still} uid={uid} />
        </div>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            {category ? (
              <p className={cn('kicker mb-1 text-[0.625rem]', night && 'text-cyan')}>{category}</p>
            ) : null}
            <h3
              id={titleId}
              className={cn(
                'font-display font-bold tracking-tight',
                size === 'hero' ? 'text-xl sm:text-2xl' : 'text-base',
                night ? 'text-white' : 'text-ink',
              )}
            >
              {title}
            </h3>
            <p
              id={tagId}
              className={cn(
                'mt-1 text-sm leading-snug',
                size !== 'hero' && 'line-clamp-2',
                night ? 'text-white/75' : 'text-slate',
              )}
            >
              {tagline}
            </p>
          </div>
          <span
            aria-hidden
            className={cn(
              'grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-transform duration-base ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-focus-visible:-translate-y-0.5 group-focus-visible:translate-x-0.5',
              night ? 'border-night-line text-white' : 'border-line text-brand',
            )}
          >
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </li>
  )
}
