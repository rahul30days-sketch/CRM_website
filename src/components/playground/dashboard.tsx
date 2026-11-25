'use client'

/**
 * Dashboard module: KPIs computed live from the shared store, follow-up tasks
 * (created by the automation rule) and the activity feed every action writes to.
 */

import { ArrowRightLeft, CheckCircle2, FileText, MessageCircle, Sparkles, Target, UserPlus, Workflow } from 'lucide-react'
import { formatINR, formatINRCompact } from '@/lib/gst'
import { cn } from '@/lib/utils'
import { Empty, Hint, ModuleHeader, Panel, smallBtn } from './ui'
import { SEED_WON, kpis, usePlayground, type ActivityKind } from './store'

const KIND_ICON: Record<ActivityKind, typeof UserPlus> = {
  lead: UserPlus,
  assign: ArrowRightLeft,
  message: MessageCircle,
  deal: Target,
  quote: FileText,
  automation: Workflow,
  task: CheckCircle2,
}

export function DashboardModule() {
  const { state, dispatch, navigate } = usePlayground()
  const k = kpis(state)
  const wonDelta = k.won - SEED_WON
  const openTasks = state.tasks.filter((t) => !t.done)

  const tiles = [
    { label: 'Open pipeline', value: formatINRCompact(k.openPipeline), full: formatINR(k.openPipeline), sub: `${k.openCount} open deals` },
    {
      label: 'Won revenue',
      value: formatINRCompact(k.won),
      full: formatINR(k.won),
      sub: wonDelta > 0 ? `+${formatINR(wonDelta)} this session` : `${k.wonCount} won deals`,
      won: true,
    },
    { label: 'Weighted forecast', value: formatINRCompact(k.weighted), full: formatINR(k.weighted), sub: 'Value × stage probability' },
    { label: 'Leads today', value: String(k.leadsToday), full: String(k.leadsToday), sub: `${k.unassigned} unassigned` },
    { label: 'Follow-ups due', value: String(k.followUpsDue), full: String(k.followUpsDue), sub: 'Open call tasks' },
  ]

  return (
    <div>
      <ModuleHeader
        title="Dashboard"
        description="Every number here is calculated from the playground's own leads, deals and tasks, so it changes as you work."
      />
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {tiles.map((t, i) => (
          <div
            key={t.label}
            className={cn(
              'min-w-0 rounded-chip border border-line bg-white p-3.5 shadow-press',
              i === 0 && 'col-span-2 sm:col-span-1',
            )}
          >
            <dt className="text-xs font-semibold text-slate">{t.label}</dt>
            <dd className="mt-1.5">
              <span className={cn('font-mono text-xl font-semibold tabular-nums sm:text-2xl', t.won ? 'text-won' : 'text-ink')}>
                <span aria-hidden>{t.value}</span>
                <span className="sr-only">{t.full}</span>
              </span>
              <span className={cn('mt-1 block truncate text-xs', t.won && wonDelta > 0 ? 'font-semibold text-won' : 'text-slate')}>
                {t.sub}
              </span>
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 grid gap-4 xl:grid-cols-[3fr_2fr]">
        <Panel title="Recent activity" right={<span className="font-mono text-xs text-slate">{state.activity.length}</span>}>
          <ol className="max-h-[22rem] overflow-y-auto pr-1" aria-label="Activity, newest first" tabIndex={0}>
            {state.activity.map((a) => {
              const Icon = KIND_ICON[a.kind]
              return (
                <li key={a.id} className="flex gap-3 border-b border-line/70 py-2 last:border-0">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky text-brand">
                    <Icon className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1 text-sm text-ink">{a.text}</span>
                  <time className="shrink-0 font-mono text-xs text-slate">{a.time}</time>
                </li>
              )
            })}
          </ol>
        </Panel>

        <div className="space-y-4">
          <Panel title="Follow-ups due" right={<span className="font-mono text-xs text-slate">{openTasks.length}</span>}>
            {openTasks.length === 0 ? (
              <Empty>No follow-ups due. Assign a lead and the follow-up rule adds one.</Empty>
            ) : (
              <ul className="space-y-2">
                {openTasks.slice(0, 6).map((t) => {
                  const lead = state.leads.find((l) => l.id === t.leadId)
                  return (
                    <li key={t.id} className="flex items-center gap-3 rounded-chip border border-line px-3 py-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">{t.title}</p>
                        <p className="truncate text-xs text-slate">
                          {lead?.company} · due <span className="font-mono">{t.due}</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        className={cn(smallBtn, 'h-9 shrink-0 px-2.5 text-xs')}
                        onClick={() => dispatch({ type: 'COMPLETE_TASK', taskId: t.id })}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                        Done<span className="sr-only">: {t.title}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </Panel>
          <Panel title="Try the full flow">
            <p className="text-sm text-slate">
              Create a lead, assign it, reply on WhatsApp, send a quotation and mark it accepted. Won revenue above goes up by the
              quotation total.
            </p>
            <button type="button" className={cn(smallBtn, 'mt-3')} onClick={() => navigate('leads')}>
              <Sparkles className="h-4 w-4" aria-hidden />
              Start in Leads
            </button>
          </Panel>
          <Hint>Figures are fictional sample data. Reset restores the starting numbers.</Hint>
        </div>
      </div>
    </div>
  )
}
