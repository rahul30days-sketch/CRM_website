'use client'

/**
 * Automation module: four rules the reducer actually consults (auto-assign,
 * follow-up task, quote → Proposal, notify manager on Won). Each toggle is a
 * real switch (role="switch", aria-checked). The execution log lists every
 * time a rule fired in this session.
 */

import { Workflow, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Empty, Hint, ModuleHeader, Panel } from './ui'
import { RULES, usePlayground } from './store'

export function AutomationModule() {
  const { state, dispatch } = usePlayground()
  const ruleName = (id: string) => RULES.find((r) => r.id === id)?.name ?? id

  return (
    <div>
      <ModuleHeader
        title="Automation"
        description="Rules run on events in this playground. Turn one off and the next matching action behaves differently."
      />
      <div className="grid gap-4 xl:grid-cols-[3fr_2fr]">
        <ul className="space-y-3" aria-label="Automation rules">
          {RULES.map((r) => {
            const on = state.rules[r.id]
            const runs = state.ruleRuns.filter((x) => x.rule === r.id).length
            const labelId = `pg-rule-${r.id}`
            return (
              <li key={r.id} className={cn('rounded-chip border bg-white p-4 shadow-press', on ? 'border-brand/40' : 'border-line')}>
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className={cn(
                      'mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-chip',
                      on ? 'bg-brand/10 text-brand' : 'bg-sky text-slate',
                    )}
                  >
                    <Workflow className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p id={labelId} className="text-sm font-semibold text-ink">
                      {r.name}
                    </p>
                    <p className="mt-1 text-xs text-slate">
                      <span className="font-semibold text-ink">{r.trigger}</span> → {r.action}
                    </p>
                    <p className="mt-1.5 text-xs text-slate">
                      Ran <span className="font-mono text-ink">{runs}</span> {runs === 1 ? 'time' : 'times'} this session
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={on}
                    aria-labelledby={labelId}
                    onClick={() => dispatch({ type: 'TOGGLE_RULE', rule: r.id })}
                    className="group inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-1"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full border transition-colors duration-fast',
                        on ? 'border-brand bg-brand' : 'border-line bg-sky',
                      )}
                    >
                      <span
                        className={cn(
                          'absolute left-0.5 h-5 w-5 rounded-full bg-white shadow-press transition-transform duration-fast ease-out motion-reduce:transition-none',
                          on ? 'translate-x-5' : 'translate-x-0',
                        )}
                      />
                    </span>
                    <span className={cn('w-7 text-left text-xs font-semibold', on ? 'text-brand-deep' : 'text-slate')} aria-hidden>
                      {on ? 'On' : 'Off'}
                    </span>
                  </button>
                </div>
              </li>
            )
          })}
        </ul>

        <div className="space-y-4">
          <Panel title="Execution log" right={<Zap className="h-4 w-4 text-slate" aria-hidden />}>
            {state.ruleRuns.length === 0 ? (
              <Empty>No rule has fired yet. Assign a lead or send a quotation to see one run.</Empty>
            ) : (
              <ol className="max-h-[24rem] space-y-2 overflow-y-auto pr-1" tabIndex={0} aria-label="Rule runs, newest first">
                {state.ruleRuns.map((run) => (
                  <li key={run.id} className="rounded-chip border border-line px-3 py-2">
                    <p className="flex items-center justify-between gap-2">
                      <span className="truncate text-xs font-semibold text-brand-deep">{ruleName(run.rule)}</span>
                      <time className="shrink-0 font-mono text-xs text-slate">{run.time}</time>
                    </p>
                    <p className="mt-0.5 text-sm text-ink">{run.text}</p>
                  </li>
                ))}
              </ol>
            )}
          </Panel>
          <Hint>Try it: switch on Auto-assign, then go to Leads and simulate an enquiry. The new lead arrives with an owner and a task.</Hint>
        </div>
      </div>
    </div>
  )
}
