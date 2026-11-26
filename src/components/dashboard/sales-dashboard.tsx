'use client'

/**
 * The interactive sales dashboard: one filter state drives every KPI and
 * chart, all recomputed from DEMO_LEADS (see ./data.ts).
 *
 * Composition: a night-toned AppWindow that assembles once as it scrolls
 * into view (window tilts flat, then filter bar, KPI tiles and chart panels
 * settle in with a short stagger; transform/opacity only). Reduced motion
 * snaps straight to the final layout.
 *
 * Accessibility: filters are native buttons/selects; every change is
 * announced in a polite live region ("Showing This month · IndiaMART:
 * 82 leads, ₹12.4L revenue"); each chart has a text summary and a hidden
 * data table; an empty filter combination shows an explicit empty state.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { AppWindow } from '@/components/demo/kit'
import { SELLER } from '@/demo/sample-data'
import { EASE } from '@/lib/motion'
import { FilterBar } from './filters'
import { KpiGrid } from './kpis'
import { EmptyState, FunnelChart, RecentActivity, RepChart, SourceChart, TrendChart } from './charts'
import { DEFAULT_FILTER, buildDashboard, describeFilter, money, type DashboardFilter } from './data'

export function SalesDashboard() {
  const reduce = useReducedMotion()
  const [filter, setFilter] = useState<DashboardFilter>(DEFAULT_FILTER)
  const [interacted, setInteracted] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const data = useMemo(() => buildDashboard(filter), [filter])
  const description = describeFilter(filter)
  const empty = data.summary.leads === 0
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setAnnouncement(
      empty
        ? `Showing ${description}: no leads match these filters.`
        : `Showing ${description}: ${data.summary.leads} lead${data.summary.leads === 1 ? '' : 's'}, ${money(data.summary.revenue)} revenue.`,
    )
  }, [description, empty, data.summary.leads, data.summary.revenue])

  const update = (next: DashboardFilter) => {
    setInteracted(true)
    setFilter(next)
  }

  const { win, group, item } = useMemo(() => assembly(!!reduce), [reduce])

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.12 }}
      variants={win}
      style={{ transformPerspective: 1600 }}
    >
      <AppWindow
        tone="light"
        title="EZCRM · Sales dashboard"
        right={<span className="hidden truncate text-xs text-slate sm:inline">{SELLER.name}</span>}
        className="ring-1 ring-line"
      >
        <motion.div variants={group} className="space-y-3 p-3 sm:space-y-4 sm:p-5">
          <motion.div variants={item}>
            <FilterBar filter={filter} onChange={update} />
          </motion.div>

          <motion.p variants={item} className="text-xs text-slate">
            Showing <span className="font-semibold text-ink">{description}</span>
            <span aria-hidden> · </span>
            <span className="font-mono tabular-nums text-ink">{data.summary.leads}</span> lead
            {data.summary.leads === 1 ? '' : 's'}
          </motion.p>
          <p className="sr-only" aria-live="polite" aria-atomic="true">
            {announcement}
          </p>

          <motion.div variants={item}>
            <KpiGrid data={data} animate={interacted} />
          </motion.div>

          {empty ? (
            <EmptyState
              description={description}
              onWiden={filter.period !== 'quarter' ? () => update({ ...filter, period: 'quarter' }) : undefined}
              onReset={() => update(DEFAULT_FILTER)}
            />
          ) : (
            <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
              <motion.div variants={item} className="min-w-0 lg:col-span-2 [&>section]:h-full">
                <TrendChart trend={data.trend} period={filter.period} morph={interacted} />
              </motion.div>
              <motion.div variants={item} className="min-w-0 [&>section]:h-full">
                <FunnelChart funnel={data.funnel} />
              </motion.div>
              <motion.div variants={item} className="min-w-0 [&>section]:h-full">
                <SourceChart sources={data.sources} selected={filter.source} />
              </motion.div>
              <motion.div variants={item} className="min-w-0 [&>section]:h-full">
                <RepChart reps={data.reps} selected={filter.repId} />
              </motion.div>
              <motion.div variants={item} className="min-w-0 [&>section]:h-full">
                <RecentActivity recent={data.recent} total={data.summary.leads} />
              </motion.div>
            </div>
          )}
        </motion.div>
      </AppWindow>
    </motion.div>
  )
}

function assembly(reduce: boolean) {
  const snap = { duration: 0 }
  const win: Variants = {
    // Same hidden pose on server and client (no hydration mismatch); reduced
    // motion only removes the travel time.
    hidden: { opacity: 0, y: 48, rotateX: 10, scale: 0.97 },
    show: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: reduce ? snap : { duration: 0.9, ease: EASE },
    },
  }
  const group: Variants = {
    hidden: {},
    show: { transition: reduce ? snap : { staggerChildren: 0.07, delayChildren: 0.3 } },
  }
  const item: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.985 },
    show: { opacity: 1, y: 0, scale: 1, transition: reduce ? snap : { duration: 0.55, ease: EASE } },
  }
  return { win, group, item }
}
