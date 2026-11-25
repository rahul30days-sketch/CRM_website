'use client'

/**
 * Pipeline module: one column per PIPELINE_STAGES entry. Deals move with
 * previous/next buttons or a labelled stage select (no drag needed, so it
 * works the same by keyboard, touch and mouse). Three stage columns per row
 * on desktop, two on tablets, one stacked list on phones.
 */

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatINR, formatINRCompact } from '@/lib/gst'
import { cn } from '@/lib/utils'
import { PIPELINE_STAGES, type PipelineStageId } from '@/demo/sample-data'
import { Avatar, Hint, ModuleHeader, SourceChip, fieldClass } from './ui'
import { STAGE_LABEL, kpis, usePlayground } from './store'

const ORDER = PIPELINE_STAGES.map((s) => s.id)

export function PipelineModule() {
  const { state, dispatch } = usePlayground()
  const k = kpis(state)
  const move = (dealId: string, stage: PipelineStageId) => dispatch({ type: 'MOVE_DEAL', dealId, stage })

  return (
    <div>
      <ModuleHeader
        title="Pipeline"
        description="Every lead becomes a deal in “New lead”. Move deals through the stages; the forecast weights each by its stage probability."
        actions={
          <p className="rounded-chip border border-line bg-white px-3 py-2 text-xs text-slate">
            Open <span className="font-mono font-semibold text-ink">{formatINR(k.openPipeline)}</span> · Weighted{' '}
            <span className="font-mono font-semibold text-ink">{formatINR(k.weighted)}</span>
          </p>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PIPELINE_STAGES.map((stage) => {
          const deals = state.deals.filter((d) => d.stage === stage.id)
          const total = deals.reduce((s, d) => s + d.value, 0)
          return (
            <section
              key={stage.id}
              aria-labelledby={`pg-col-${stage.id}`}
              className={cn(
                'min-w-0 rounded-chip border border-line p-2',
                stage.id === 'won' ? 'bg-won/5' : stage.id === 'lost' ? 'bg-due/5' : 'bg-sky/40',
              )}
            >
              <header className="mb-2 px-1">
                <h3 id={`pg-col-${stage.id}`} className="flex items-center justify-between gap-2 text-xs font-bold uppercase tracking-wide text-ink">
                  <span className="truncate">{stage.label}</span>
                  <span className="font-mono font-semibold text-slate">{deals.length}</span>
                </h3>
                <p className="font-mono text-xs text-slate">
                  {formatINRCompact(total)} · {stage.probability}%
                </p>
              </header>
              <ul className="space-y-2">
                {deals.map((d) => {
                  const i = ORDER.indexOf(d.stage)
                  const prev = ORDER[i - 1]
                  const next = ORDER[i + 1]
                  const active = d.leadId === state.selectedLeadId
                  return (
                    <li
                      key={d.id}
                      className={cn('rounded-chip border bg-white p-2.5 shadow-press', active ? 'border-brand/60' : 'border-line')}
                    >
                      <button
                        type="button"
                        className="block w-full min-w-0 text-left"
                        onClick={() => dispatch({ type: 'SELECT_LEAD', leadId: d.leadId })}
                        aria-pressed={active}
                      >
                        <span className="block truncate text-sm font-semibold text-ink">{d.company}</span>
                        <span className="block truncate text-xs text-slate">{d.contact}</span>
                      </button>
                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <span className="font-mono text-sm font-semibold text-ink">{formatINRCompact(d.value)}</span>
                        <span className="flex items-center gap-1">
                          <SourceChip source={d.source} />
                          <Avatar repId={d.repId} size="sm" />
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        <button
                          type="button"
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-chip border border-line text-ink hover:border-brand/40 hover:text-brand disabled:opacity-40"
                          disabled={!prev}
                          onClick={() => prev && move(d.id, prev)}
                          aria-label={prev ? `Move ${d.company} back to ${STAGE_LABEL[prev]}` : `${d.company} is in the first stage`}
                        >
                          <ChevronLeft className="h-4 w-4" aria-hidden />
                        </button>
                        <label htmlFor={`pg-stage-${d.id}`} className="sr-only">
                          Stage for {d.company}
                        </label>
                        <select
                          id={`pg-stage-${d.id}`}
                          className={cn(fieldClass, 'h-10 flex-1 px-2 text-xs')}
                          value={d.stage}
                          onChange={(e) => move(d.id, e.target.value as PipelineStageId)}
                        >
                          {PIPELINE_STAGES.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-chip border border-line text-ink hover:border-brand/40 hover:text-brand disabled:opacity-40"
                          disabled={!next}
                          onClick={() => next && move(d.id, next)}
                          aria-label={next ? `Move ${d.company} to ${STAGE_LABEL[next]}` : `${d.company} is in the last stage`}
                        >
                          <ChevronRight className="h-4 w-4" aria-hidden />
                        </button>
                      </div>
                    </li>
                  )
                })}
                {deals.length === 0 ? <li className="px-1 py-3 text-center text-xs text-slate">No deals</li> : null}
              </ul>
            </section>
          )
        })}
      </div>
      <Hint className="mt-4">
        Winning through a quotation sets the deal value to the quotation’s grand total. Moving a card to Won here keeps its estimated
        value.
      </Hint>
    </div>
  )
}
