'use client'

/**
 * The /experience playground shell: app toolbar (Reset, guide toggle, Book a
 * demo), isolation banner, module navigation (sidebar on desktop, scrollable
 * top bar on mobile), the guided tour and the active module.
 *
 * Accessibility: module buttons are a labelled <nav> with aria-current;
 * switching modules moves focus to the new module heading. Notifications go
 * to a persistent polite live region (and stay in the Dashboard activity
 * feed after the toast hides). Everything is reachable by keyboard.
 */

import * as React from 'react'
import Link from 'next/link'
import {
  Bell,
  ChartColumn,
  FileText,
  Inbox,
  LayoutDashboard,
  ListChecks,
  MessageCircle,
  ShieldCheck,
  SquareKanban,
  UserCheck,
  Workflow,
  X,
} from 'lucide-react'
import { SampleBadge } from '@/components/demo/kit'
import { buttonVariants } from '@/components/ui/button'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/utils'
import { PlaygroundProvider, kpis, usePlayground, type ModuleId } from './store'
import { smallBtn } from './ui'
import { Onboarding } from './onboarding'
import { ResetButton } from './reset-dialog'
import { DashboardModule } from './dashboard'
import { LeadsModule } from './leads'
import { AssignmentModule } from './assignment'
import { ConversationModule } from './conversation'
import { PipelineModule } from './pipeline'
import { QuotationModule } from './quotation'
import { AutomationModule } from './automation'
import { AnalyticsModule } from './analytics'

const MODULES: { id: ModuleId; label: string; icon: typeof Inbox; render: () => React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, render: () => <DashboardModule /> },
  { id: 'leads', label: 'Leads', icon: Inbox, render: () => <LeadsModule /> },
  { id: 'assignment', label: 'Assignment', icon: UserCheck, render: () => <AssignmentModule /> },
  { id: 'conversation', label: 'Conversation', icon: MessageCircle, render: () => <ConversationModule /> },
  { id: 'pipeline', label: 'Pipeline', icon: SquareKanban, render: () => <PipelineModule /> },
  { id: 'quotation', label: 'Quotation', icon: FileText, render: () => <QuotationModule /> },
  { id: 'automation', label: 'Automation', icon: Workflow, render: () => <AutomationModule /> },
  { id: 'analytics', label: 'Analytics', icon: ChartColumn, render: () => <AnalyticsModule /> },
]

function Toast() {
  const { state, dispatch } = usePlayground()
  const latest = state.notices.at(-1)
  const [paused, setPaused] = React.useState(false)

  React.useEffect(() => {
    if (!latest || paused) return
    const t = window.setTimeout(() => dispatch({ type: 'DISMISS_NOTICE', id: latest.id }), 6000)
    return () => window.clearTimeout(t)
  }, [latest, paused, dispatch])

  return (
    <div
      className="pointer-events-none fixed inset-x-3 bottom-3 z-40 flex justify-center sm:inset-x-auto sm:bottom-5 sm:right-5 sm:justify-end"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Always rendered so screen readers register the live region before it changes. */}
      <div role="status" aria-live="polite" aria-atomic="true" className="pointer-events-auto max-w-sm">
        {latest ? (
          <div
            key={latest.id}
            className={cn(
              'flex animate-rise-in items-start gap-2.5 rounded-chip border bg-white px-3 py-2.5 shadow-float motion-reduce:animate-none',
              latest.tone === 'won' ? 'border-won/40' : 'border-line',
            )}
          >
            <Bell className={cn('mt-0.5 h-4 w-4 shrink-0', latest.tone === 'won' ? 'text-won' : 'text-brand')} aria-hidden />
            <p className="min-w-0 flex-1 text-sm text-ink">{latest.text}</p>
            <button
              type="button"
              className="-m-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate hover:bg-sky hover:text-ink"
              onClick={() => dispatch({ type: 'DISMISS_NOTICE', id: latest.id })}
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function Shell() {
  const { state, dispatch, navigate } = usePlayground()
  const k = kpis(state)
  const active = MODULES.find((m) => m.id === state.module) ?? MODULES[0]

  React.useEffect(() => {
    track('playground_opened')
  }, [])

  const badge: Partial<Record<ModuleId, number>> = {
    assignment: k.unassigned,
    dashboard: k.followUpsDue,
  }

  return (
    <div className="relative overflow-hidden rounded-card border border-line bg-white shadow-float">
      {/* App toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-white px-3 py-2.5 sm:px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span aria-hidden className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-chip bg-night font-display text-xs font-extrabold text-white">
            EZ
          </span>
          <p className="min-w-0 leading-tight">
            <span className="block font-display text-sm font-bold text-ink">EZCRM</span>
            <span className="block truncate text-xs text-slate">Sample Pumps Pvt. Ltd. · Playground</span>
          </p>
          <SampleBadge className="hidden md:inline-flex" label="Sample data · fictional" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {state.guideDismissed ? (
            <button type="button" className={cn(smallBtn, 'h-9')} onClick={() => dispatch({ type: 'SET_GUIDE', dismissed: false })}>
              <ListChecks className="h-4 w-4" aria-hidden />
              Show guide
            </button>
          ) : null}
          <ResetButton />
          <Link
            href="/demo"
            className={buttonVariants({ variant: 'primary', size: 'sm' })}
            onClick={() => track('demo_cta_clicked', { from: 'playground' })}
          >
            Book a demo
          </Link>
        </div>
      </div>

      {/* Isolation banner */}
      <p className="flex items-start gap-2 border-b border-line bg-sky/60 px-3 py-2 text-xs text-ink sm:items-center sm:px-4">
        <ShieldCheck className="mt-px h-4 w-4 shrink-0 text-brand sm:mt-0" aria-hidden />
        <span>
          Playground with fictional sample data. Nothing here touches real customer records, WhatsApp, or payments.
        </span>
        <SampleBadge className="ml-auto hidden shrink-0 sm:inline-flex md:hidden" />
      </p>

      <div className="grid lg:grid-cols-[13rem_1fr]">
        <nav aria-label="Playground modules" className="min-w-0 border-b border-line bg-mist/40 lg:border-b-0 lg:border-r">
          <ul className="flex gap-1 overflow-x-auto p-2 lg:flex-col lg:overflow-visible lg:p-3">
            {MODULES.map((m) => {
              const Icon = m.icon
              const current = m.id === active.id
              const count = badge[m.id]
              return (
                <li key={m.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => navigate(m.id)}
                    aria-current={current ? 'page' : undefined}
                    className={cn(
                      'flex h-10 w-full items-center gap-2 whitespace-nowrap rounded-chip px-3 text-sm font-medium transition-colors duration-fast',
                      current ? 'bg-white text-brand-deep shadow-press' : 'text-slate hover:bg-white/70 hover:text-ink',
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    <span className="flex-1 text-left">{m.label}</span>
                    {count ? (
                      <span className="rounded-full bg-brand/10 px-1.5 font-mono text-[0.6875rem] font-semibold text-brand-deep">
                        {count}
                        <span className="sr-only">{m.id === 'assignment' ? ' unassigned' : ' follow-ups due'}</span>
                      </span>
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ul>
          <p className="hidden px-4 pb-4 pt-2 text-[0.6875rem] leading-relaxed text-slate lg:block">
            Changes stay in this browser tab. Reset any time.
          </p>
        </nav>

        <section className="min-w-0 bg-base p-3 sm:p-5 lg:p-6" aria-label={`${active.label} module`}>
          {!state.guideDismissed ? <Onboarding /> : null}
          {active.render()}
        </section>
      </div>

      <Toast />
    </div>
  )
}

export function Playground() {
  return (
    <PlaygroundProvider>
      <Shell />
    </PlaygroundProvider>
  )
}
