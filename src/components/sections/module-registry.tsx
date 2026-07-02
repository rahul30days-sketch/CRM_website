import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { ModuleContent } from '@/content/modules'
import { moduleCategories, type ModuleCategory } from '@/content/modules'

/**
 * The 14 modules as a dense operational directory — grouped by what they do
 * for the team, not a grid of icon cards. Density is the honest signal here:
 * this product does a lot, and the registry should feel like it.
 */
export function ModuleRegistry({ modules }: { modules: ModuleContent[] }) {
  const order: ModuleCategory[] = ['capture', 'engage', 'close', 'support', 'operate']

  return (
    <div className="space-y-10">
      {order.map((category) => {
        const items = modules.filter((m) => m.category === category)
        if (items.length === 0) return null
        const meta = moduleCategories[category]
        return (
          <section key={category} aria-labelledby={`registry-${category}`}>
            <div className="mb-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-line pb-2">
              <h3 id={`registry-${category}`} className="font-display text-lg font-bold text-bright">
                {meta.label}
              </h3>
              <p className="text-sm text-fog">{meta.blurb}</p>
            </div>
            <ul className="divide-y divide-line/60">
              {items.map((module) => (
                <li key={module.slug}>
                  <Link
                    href={`/features/${module.slug}`}
                    className="group grid gap-1 rounded-chip py-3 transition-colors hover:bg-sky sm:grid-cols-[13rem_1fr_auto] sm:items-baseline sm:gap-4 sm:px-3"
                  >
                    <span className="font-medium text-bright group-hover:text-marigold">
                      {module.title}
                    </span>
                    <span className="text-sm text-fog">{module.tagline}</span>
                    <span className="hidden items-center gap-1 font-mono text-[0.625rem] uppercase tracking-wider text-fog group-hover:text-marigold sm:inline-flex">
                      {module.capabilities.length} capabilities
                      <ArrowUpRight className="h-3 w-3" aria-hidden />
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
