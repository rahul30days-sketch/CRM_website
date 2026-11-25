'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { moduleCategories, type ModuleCategory, type ModuleContent } from '@/content/modules'
import { DirectoryControls, useDirectoryFilter } from './directory-filter'

const ORDER: ModuleCategory[] = ['capture', 'engage', 'close', 'support', 'operate']

/** Searchable, categorised module directory for /features. */
export function ModuleDirectory({ modules }: { modules: ModuleContent[] }) {
  const f = useDirectoryFilter(
    modules,
    (m) => `${m.title} ${m.tagline} ${m.shortDescription} ${m.capabilities.join(' ')}`,
    (m) => m.category,
  )

  return (
    <div className="space-y-10">
      <DirectoryControls
        label="Search modules and capabilities"
        query={f.query}
        onQuery={f.setQuery}
        categories={ORDER.map((c) => ({ id: c, label: moduleCategories[c].label }))}
        cat={f.cat}
        onCat={f.setCat}
        count={f.visible.length}
        total={modules.length}
      />

      {f.visible.length === 0 ? (
        <p className="rounded-card border border-line bg-sky/40 p-6 text-sm text-slate">
          No module matches “{f.query}”. Try a broader word like “WhatsApp”, “quotation” or “follow-up”.
        </p>
      ) : null}

      {ORDER.map((category) => {
        const items = f.visible.filter((m) => m.category === category)
        if (items.length === 0) return null
        const meta = moduleCategories[category]
        return (
          <section key={category} aria-labelledby={`registry-${category}`}>
            <div className="mb-4 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-line pb-2">
              <h2 id={`registry-${category}`} className="font-display text-xl font-bold text-ink">
                {meta.label}
              </h2>
              <p className="text-sm text-slate">{meta.blurb}</p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((m) => (
                <li key={m.slug}>
                  <Link
                    href={`/features/${m.slug}`}
                    className="group flex h-full flex-col rounded-card border border-line bg-white p-5 shadow-press transition-[border-color,box-shadow] duration-fast hover:border-brand/40 hover:shadow-soft"
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span className="font-display text-lg font-bold text-ink group-hover:text-brand">{m.title}</span>
                      <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-slate group-hover:text-brand" aria-hidden />
                    </span>
                    <span className="mt-1.5 text-sm leading-relaxed text-slate">{m.tagline}</span>
                    <span className="mt-4 flex flex-wrap gap-1.5">
                      {m.capabilities.slice(0, 3).map((c) => (
                        <span key={c} className="rounded-full bg-sky px-2.5 py-1 text-xs text-ink">
                          {c.length > 42 ? c.slice(0, 40) + '…' : c}
                        </span>
                      ))}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
