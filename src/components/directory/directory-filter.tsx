'use client'

import * as React from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Search box + category chips shared by the Features and Integrations
 * directories. The full list is server-rendered; filtering only hides items,
 * so the page is complete without JavaScript.
 */
export function useDirectoryFilter<T>(
  items: T[],
  text: (item: T) => string,
  category: (item: T) => string,
) {
  const [query, setQuery] = React.useState('')
  const [cat, setCat] = React.useState<string | null>(null)
  const q = query.trim().toLowerCase()
  const visible = items.filter(
    (i) => (!cat || category(i) === cat) && (!q || text(i).toLowerCase().includes(q)),
  )
  return { query, setQuery, cat, setCat, visible }
}

export function DirectoryControls({
  label,
  query,
  onQuery,
  categories,
  cat,
  onCat,
  count,
  total,
}: {
  label: string
  query: string
  onQuery: (q: string) => void
  categories: { id: string; label: string }[]
  cat: string | null
  onCat: (c: string | null) => void
  count: number
  total: number
}) {
  const id = React.useId()
  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" aria-hidden />
        <input
          id={id}
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder={label}
          className="h-11 w-full rounded-chip border border-line bg-white pl-10 pr-10 text-sm text-ink shadow-press placeholder:text-slate focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        />
        {query ? (
          <button
            type="button"
            onClick={() => onQuery('')}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-slate hover:bg-sky hover:text-ink"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
      </div>
      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
        {[{ id: '', label: 'All' }, ...categories].map((c) => {
          const active = (cat ?? '') === c.id
          return (
            <button
              key={c.id || 'all'}
              type="button"
              aria-pressed={active}
              onClick={() => onCat(c.id || null)}
              className={cn(
                'h-9 rounded-full border px-4 text-sm font-medium transition-colors duration-fast',
                active ? 'border-brand bg-brand text-white' : 'border-line bg-white text-slate hover:border-brand/40 hover:text-ink',
              )}
            >
              {c.label}
            </button>
          )
        })}
      </div>
      <p className="text-sm text-slate" aria-live="polite">
        Showing {count} of {total}
      </p>
    </div>
  )
}
