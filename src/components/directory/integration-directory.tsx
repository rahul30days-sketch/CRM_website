'use client'

import { BrandLogo } from '@/components/brand-logo'
import type { IntegrationContent } from '@/content/site'
import { DirectoryControls, useDirectoryFilter } from './directory-filter'

const CATEGORY_LABELS: Record<string, string> = {
  'lead-sources': 'Lead sources',
  messaging: 'Messaging',
  payments: 'Payments',
  notifications: 'Notifications',
  developer: 'Developer',
}
const ORDER = ['lead-sources', 'messaging', 'payments', 'notifications', 'developer']

/** Searchable integrations directory for /integrations. */
export function IntegrationDirectory({ integrations }: { integrations: IntegrationContent[] }) {
  const f = useDirectoryFilter(
    integrations,
    (i) => `${i.name} ${i.description} ${CATEGORY_LABELS[i.category] ?? ''}`,
    (i) => i.category,
  )
  const cats = ORDER.filter((c) => integrations.some((i) => i.category === c))

  return (
    <div className="space-y-10">
      <DirectoryControls
        label="Search integrations"
        query={f.query}
        onQuery={f.setQuery}
        categories={cats.map((c) => ({ id: c, label: CATEGORY_LABELS[c] ?? c }))}
        cat={f.cat}
        onCat={f.setCat}
        count={f.visible.length}
        total={integrations.length}
      />
      {f.visible.length === 0 ? (
        <p className="rounded-card border border-line bg-sky/40 p-6 text-sm text-slate">
          Nothing matches “{f.query}”. If your tool can send an email or a webhook, EZCRM can usually capture it —
          ask us.
        </p>
      ) : null}
      {cats.map((category) => {
        const items = f.visible.filter((i) => i.category === category)
        if (items.length === 0) return null
        return (
          <section key={category} aria-labelledby={`cat-${category}`}>
            <h2 id={`cat-${category}`} className="kicker mb-4 border-b border-line pb-2">
              {CATEGORY_LABELS[category] ?? category}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((integration) => (
                <article key={integration.slug} className="panel-frame p-5">
                  <div className="flex items-center gap-3">
                    <BrandLogo slug={integration.slug} name={integration.name} />
                    <h3 className="font-medium text-ink">{integration.name}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate">{integration.description}</p>
                </article>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
