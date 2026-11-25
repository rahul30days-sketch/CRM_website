'use client'

/**
 * Assignment module: rep workload, the round-robin pointer and a per-lead
 * owner select. Every assignment raises a notification (announced through the
 * shell's live region) and, if the rule is on, a follow-up task.
 */

import { Repeat, Users } from 'lucide-react'
import { formatINR } from '@/lib/gst'
import { cn } from '@/lib/utils'
import { REPS } from '@/demo/sample-data'
import { Avatar, Hint, ModuleHeader, Panel, SourceChip, brandBtn, fieldClass, smallBtn } from './ui'
import { SALES_EXECS, isOpenStage, kpis, usePlayground } from './store'

export function AssignmentModule() {
  const { state, dispatch } = usePlayground()
  const k = kpis(state)
  const nextRep = SALES_EXECS[state.rr % SALES_EXECS.length]
  const ordered = [...state.leads].sort((a, b) => Number(Boolean(a.repId)) - Number(Boolean(b.repId)))

  return (
    <div>
      <ModuleHeader
        title="Assignment"
        description="Give every lead an owner. Round-robin rotates through the sales executives; you can also pick someone by hand."
        actions={
          <button
            type="button"
            className={brandBtn}
            disabled={k.unassigned === 0}
            onClick={() => dispatch({ type: 'ASSIGN_ALL_UNASSIGNED' })}
          >
            <Repeat className="h-4 w-4" aria-hidden />
            Assign all unassigned ({k.unassigned})
          </button>
        }
      />

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Team workload">
        {REPS.map((r) => {
          const open = state.deals.filter((d) => d.repId === r.id && isOpenStage(d.stage))
          const isNext = r.id === nextRep.id
          return (
            <li
              key={r.id}
              className={cn('min-w-0 rounded-chip border bg-white p-3 shadow-press', isNext ? 'border-brand/50' : 'border-line')}
            >
              <div className="flex items-center gap-2.5">
                <Avatar repId={r.id} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{r.name}</p>
                  <p className="truncate text-xs text-slate">{r.role}</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate">
                <span className="font-mono text-sm font-semibold text-ink">{open.length}</span> open ·{' '}
                <span className="font-mono">{formatINR(open.reduce((s, d) => s + d.value, 0))}</span>
              </p>
              {isNext ? (
                <p className="mt-1.5 text-[0.6875rem] font-bold uppercase tracking-wide text-brand">Next in round-robin</p>
              ) : null}
            </li>
          )
        })}
      </ul>

      <Panel title="Lead owners" className="mt-4" right={<Users className="h-4 w-4 text-slate" aria-hidden />} bodyClassName="p-0">
        <ul className="divide-y divide-line">
          {ordered.map((l) => (
            <li key={l.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-ink">{l.company}</span>
                  <SourceChip source={l.source} />
                </p>
                <p className="truncate text-xs text-slate">
                  {l.name} · {l.city} · <span className="font-mono">{formatINR(l.value)}</span>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Avatar repId={l.repId} size="sm" />
                <label htmlFor={`pg-owner-${l.id}`} className="sr-only">
                  Owner for {l.company}
                </label>
                <select
                  id={`pg-owner-${l.id}`}
                  className={cn(fieldClass, 'min-w-[9rem] flex-1 sm:w-48 sm:flex-none', !l.repId && 'border-due/60')}
                  value={l.repId}
                  onChange={(e) => dispatch({ type: 'ASSIGN', leadId: l.id, repId: e.target.value })}
                >
                  {!l.repId ? (
                    <option value="" disabled>
                      Unassigned
                    </option>
                  ) : null}
                  {REPS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
                {!l.repId ? (
                  <button
                    type="button"
                    className={cn(smallBtn, 'shrink-0 px-2.5')}
                    onClick={() => dispatch({ type: 'ASSIGN', leadId: l.id, repId: 'round-robin' })}
                  >
                    <Repeat className="h-4 w-4" aria-hidden />
                    <span>
                      Round-robin<span className="sr-only"> assign {l.company}</span>
                    </span>
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </Panel>
      <Hint className="mt-4">
        Each assignment notifies the new owner. With the follow-up rule on, EZCRM also adds a call task due 30 minutes later; you
        will see it on the Dashboard.
      </Hint>
    </div>
  )
}
