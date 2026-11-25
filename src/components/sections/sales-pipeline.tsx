'use client'

/**
 * Section 07: pipeline playground.
 *
 * The shared sample DEALS sit in the six PIPELINE_STAGES. Visitors move deals
 * and the whole sales picture recomputes from that one state: KPI cards
 * (open pipeline, weighted forecast, won revenue, win rate), a per-stage
 * funnel, and an activity timeline that logs each move. Stage probabilities
 * are editable and feed the weighted forecast (Σ open value × probability).
 *
 * Interaction and accessibility:
 *  - Desktop (lg+): a six-column board. Cards drag between columns with
 *    pointer events (mouse, pen, touch); the column under the pointer shows
 *    a drop indicator. Column rects are measured once at drag start, never
 *    per frame.
 *  - Every card also has a "Move to…" select, so nothing depends on dragging.
 *    After a move, focus follows the card to its new column.
 *  - Below lg: a stage selector plus that stage's list (no drag, no page
 *    overflow at 320px); moving a card switches the view to its new stage.
 *  - Selecting a card opens the detail panel. Moves, probability edits and
 *    resets are announced through one polite live region.
 *  - Reduced motion: numbers and bars jump to their final values, no pulse.
 *  - SSR: the full board, KPIs, funnel and detail render server-side.
 * Nothing here is saved or sent anywhere; Reset restores the sample data.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { DEALS, PIPELINE_STAGES, type Deal, type PipelineStageId } from '@/demo/sample-data'
import { AppWindow, SampleBadge, SectionHeader } from '@/components/demo/kit'
import { buttonVariants } from '@/components/ui/button'
import { track } from '@/lib/analytics'
import { formatINR, formatINRCompact } from '@/lib/gst'
import { cn } from '@/lib/utils'
import { ActivityLog } from '@/components/pipeline/activity-log'
import { DealCard } from '@/components/pipeline/deal-card'
import { DealDetail } from '@/components/pipeline/deal-detail'
import { KpiCards } from '@/components/pipeline/kpi-cards'
import { ProbabilityInput } from '@/components/pipeline/probability-input'
import { StageFunnel } from '@/components/pipeline/stage-funnel'
import {
  DEFAULT_PROBABILITIES,
  LOCKED_STAGES,
  pipelineKpis,
  stageCounts,
  stageLabel,
  type ActivityEntry,
  type Probabilities,
} from '@/components/pipeline/model'

const DETAIL_ID = 'pipeline-deal-detail'
type View = 'board' | 'list'
type FocusPart = 'card' | 'select'

export function SalesPipeline() {
  const [deals, setDeals] = useState<Deal[]>(DEALS)
  const [probs, setProbs] = useState<Probabilities>(DEFAULT_PROBABILITIES)
  const [selectedId, setSelectedId] = useState<string>(DEALS[0].id)
  const [log, setLog] = useState<ActivityEntry[]>([])
  const [announce, setAnnounce] = useState('')
  const [mobileStage, setMobileStage] = useState<PipelineStageId>(DEALS[0].stage)
  const [justWon, setJustWon] = useState<string | null>(null)
  const [arrived, setArrived] = useState<string | null>(null)
  const [dragging, setDragging] = useState<{ id: string; from: PipelineStageId } | null>(null)
  const [dropTarget, setDropTarget] = useState<PipelineStageId | null>(null)

  const seq = useRef(0)
  const completed = useRef(false)
  const columnRects = useRef<Map<PipelineStageId, DOMRect>>(new Map())
  const columnEls = useRef<Map<PipelineStageId, HTMLDivElement>>(new Map())
  const focusEls = useRef<Map<string, HTMLElement>>(new Map())
  const dropRef = useRef<PipelineStageId | null>(null)
  const pendingFocus = useRef<{ id: string; part: FocusPart } | null>(null)

  const kpis = useMemo(() => pipelineKpis(deals, probs), [deals, probs])
  const counts = useMemo(() => stageCounts(deals), [deals])
  const selected = deals.find((d) => d.id === selectedId)

  const registerFocus = (view: View, id: string, part: FocusPart) => (el: HTMLElement | null) => {
    const key = `${view}:${id}:${part}`
    if (el) focusEls.current.set(key, el)
    else focusEls.current.delete(key)
  }

  // Focus follows the card: after a move, focus the same control on the
  // card's new copy in whichever layout is visible.
  useEffect(() => {
    const target = pendingFocus.current
    if (!target) return
    pendingFocus.current = null
    for (const view of ['board', 'list'] as View[]) {
      const el = focusEls.current.get(`${view}:${target.id}:${target.part}`)
      if (el && el.getClientRects().length > 0) {
        el.focus()
        break
      }
    }
  }, [deals])

  const moveDeal = useCallback(
    (id: string, to: PipelineStageId, focusPart: FocusPart | null) => {
      const deal = deals.find((d) => d.id === id)
      if (!deal || deal.stage === to) return
      const from = deal.stage
      const next = deals.map((d) => (d.id === id ? { ...d, stage: to } : d))
      const nextKpis = pipelineKpis(next, probs)
      setDeals(next)
      setSelectedId(id)
      setMobileStage(to)
      setArrived(id)
      if (focusPart) pendingFocus.current = { id, part: focusPart }
      const time = new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
      seq.current += 1
      setLog((l) => [{ seq: seq.current, dealId: id, company: deal.company, from, to, time }, ...l].slice(0, 20))
      if (to === 'won') {
        setJustWon(id)
        if (!completed.current) {
          completed.current = true
          track('demo_completed', { demo: 'pipeline' })
        }
        setAnnounce(
          `${deal.company} moved to Won. Won revenue is now ${formatINR(nextKpis.wonValue)}, win rate ${nextKpis.winRate ?? 0}%.`,
        )
      } else {
        setAnnounce(
          `${deal.company} moved from ${stageLabel(from)} to ${stageLabel(to)}. Weighted forecast ${formatINR(nextKpis.weighted)}.`,
        )
      }
    },
    [deals, probs],
  )

  const setProbability = (stage: PipelineStageId, n: number) => {
    if (probs[stage] === n) return
    const next = { ...probs, [stage]: n }
    setProbs(next)
    setAnnounce(`${stageLabel(stage)} probability ${n}%. Weighted forecast ${formatINR(pipelineKpis(deals, next).weighted)}.`)
  }

  const reset = () => {
    setDeals(DEALS)
    setProbs(DEFAULT_PROBABILITIES)
    setSelectedId(DEALS[0].id)
    setMobileStage(DEALS[0].stage)
    setLog([])
    setJustWon(null)
    setArrived(null)
    setAnnounce('Pipeline reset to the sample deals.')
  }

  /* ── Drag and drop (board only) ─────────────────────────────────────── */

  const onDragStart = (deal: Deal) => {
    // Measure once per drag; onDrag only compares numbers.
    const rects = new Map<PipelineStageId, DOMRect>()
    columnEls.current.forEach((el, id) => rects.set(id, el.getBoundingClientRect()))
    columnRects.current = rects
    setDragging({ id: deal.id, from: deal.stage })
  }

  const onDrag = (p: { x: number; y: number }) => {
    let hit: PipelineStageId | null = null
    columnRects.current.forEach((r, id) => {
      if (p.x >= r.left && p.x <= r.right && p.y >= r.top - 24 && p.y <= r.bottom + 24) hit = id
    })
    dropRef.current = hit
    setDropTarget(hit)
  }

  const onDragEnd = () => {
    const to = dropRef.current
    if (dragging && to && to !== dragging.from) moveDeal(dragging.id, to, 'card')
    dropRef.current = null
    setDragging(null)
    setDropTarget(null)
  }

  const renderCard = (deal: Deal, view: View) => (
    <DealCard
      key={deal.id}
      deal={deal}
      idPrefix={view}
      draggable={view === 'board'}
      selected={deal.id === selectedId}
      justWon={justWon === deal.id}
      arrived={arrived === deal.id}
      detailId={DETAIL_ID}
      ref={registerFocus(view, deal.id, 'card')}
      selectRef={registerFocus(view, deal.id, 'select')}
      onSelect={() => setSelectedId(deal.id)}
      onMove={(to) => moveDeal(deal.id, to, 'select')}
      onDragStart={() => onDragStart(deal)}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      onPulseDone={() => setJustWon((w) => (w === deal.id ? null : w))}
    />
  )

  return (
    <section aria-labelledby="pipeline-title" className="shell py-16 lg:py-24">
      <SectionHeader
        id="pipeline-title"
        kicker="Sales pipeline"
        title="Your entire pipeline. Always moving forward."
        lede="Drag a deal to its next stage, or use Move to… on any card. Change a stage’s win probability and the weighted forecast recalculates."
      />

      <AppWindow
        title="Pipeline · all owners"
        className="mt-10 lg:mt-14"
        right={
          <div className="flex items-center gap-2">
            <SampleBadge className="hidden sm:inline-flex" />
            <button
              type="button"
              onClick={reset}
              className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'h-9 gap-1.5')}
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden />
              Reset
            </button>
          </div>
        }
      >
        <div className="space-y-5 bg-sky/30 p-3 sm:p-5">
          <SampleBadge className="sm:hidden" />
          <KpiCards kpis={kpis} />

          {/* ── Board: lg and up ─────────────────────────────────────────── */}
          <div className="hidden grid-cols-6 gap-2.5 lg:grid" role="group" aria-label="Pipeline board">
            {PIPELINE_STAGES.map((stage) => {
              const inStage = deals.filter((d) => d.stage === stage.id)
              const total = inStage.reduce((s, d) => s + d.value, 0)
              const isTarget = dragging !== null && dropTarget === stage.id && dragging.from !== stage.id
              return (
                <div
                  key={stage.id}
                  ref={(el) => {
                    if (el) columnEls.current.set(stage.id, el)
                    else columnEls.current.delete(stage.id)
                  }}
                  className={cn(
                    'flex min-h-[22rem] min-w-0 flex-col rounded-chip border p-2 transition-colors duration-fast',
                    isTarget ? 'border-brand bg-mist/70' : 'border-line bg-white/60',
                  )}
                >
                  <div className="mb-2 space-y-1.5 border-b border-line px-1 pb-2">
                    <div className="flex items-baseline justify-between gap-1">
                      <h3
                        className={cn(
                          'truncate text-xs font-bold',
                          stage.id === 'won' ? 'text-won' : 'text-ink',
                        )}
                      >
                        {stage.label}
                      </h3>
                      <span className="font-mono text-[0.6875rem] text-slate">
                        {inStage.length}
                        <span className="sr-only"> {inStage.length === 1 ? 'deal' : 'deals'}</span>
                      </span>
                    </div>
                    <p className="font-mono text-[0.6875rem] tabular-nums text-slate">{formatINRCompact(total)}</p>
                    <ProbabilityInput
                      stageName={stage.label}
                      value={probs[stage.id]}
                      locked={LOCKED_STAGES.includes(stage.id)}
                      onChange={(n) => setProbability(stage.id, n)}
                    />
                  </div>
                  <ul className="flex flex-1 flex-col gap-2" aria-label={`${stage.label} deals`}>
                    {inStage.map((d) => renderCard(d, 'board'))}
                  </ul>
                  {isTarget ? (
                    <p
                      aria-hidden
                      className="mt-2 rounded-md border-2 border-dashed border-brand/60 px-2 py-3 text-center text-[0.6875rem] font-semibold text-brand-deep"
                    >
                      Drop to move to {stage.label}
                    </p>
                  ) : inStage.length === 0 ? (
                    <p className="mt-1 px-1 text-[0.6875rem] text-slate">No deals</p>
                  ) : null}
                </div>
              )
            })}
          </div>

          {/* ── Stage selector + list: below lg ──────────────────────────── */}
          <div className="lg:hidden">
            <div role="group" aria-label="Choose a stage" className="grid grid-cols-3 gap-1.5">
              {counts.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={mobileStage === c.id}
                  onClick={() => setMobileStage(c.id)}
                  className={cn(
                    'flex min-h-11 min-w-0 flex-col items-start justify-center rounded-md border px-2 py-1.5 text-left transition-colors duration-fast',
                    mobileStage === c.id ? 'border-brand bg-brand text-white' : 'border-line bg-white text-ink',
                  )}
                >
                  <span className="w-full truncate text-[0.6875rem] font-semibold">{c.label}</span>
                  <span
                    className={cn(
                      'font-mono text-[0.6875rem]',
                      mobileStage === c.id ? 'text-white/85' : 'text-slate',
                    )}
                  >
                    {c.count}
                    <span className="sr-only"> {c.count === 1 ? 'deal' : 'deals'}</span>
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-3 rounded-chip border border-line bg-white/70 p-3">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-ink">{stageLabel(mobileStage)}</h3>
                <ProbabilityInput
                  roomy
                  stageName={stageLabel(mobileStage)}
                  value={probs[mobileStage]}
                  locked={LOCKED_STAGES.includes(mobileStage)}
                  onChange={(n) => setProbability(mobileStage, n)}
                />
              </div>
              <ul className="grid gap-2 sm:grid-cols-2" aria-label={`${stageLabel(mobileStage)} deals`}>
                {deals.filter((d) => d.stage === mobileStage).map((d) => renderCard(d, 'list'))}
              </ul>
              {deals.every((d) => d.stage !== mobileStage) ? (
                <p className="text-xs text-slate">No deals in this stage. Move one here from another stage.</p>
              ) : null}
            </div>
          </div>

          {/* ── Detail · funnel · activity ───────────────────────────────── */}
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-chip border border-line bg-white p-4">
              <p className="kicker mb-3">Deal</p>
              <DealDetail id={DETAIL_ID} deal={selected} probs={probs} />
            </div>
            <div className="rounded-chip border border-line bg-white p-4">
              <p className="kicker mb-3">Deals by stage</p>
              <StageFunnel rows={counts} />
            </div>
            <div className="rounded-chip border border-line bg-white p-4 md:col-span-2 lg:col-span-1">
              <p className="kicker mb-3">Activity</p>
              <ActivityLog entries={log} />
            </div>
          </div>

          <p className="text-xs text-slate">
            Interactive demo on sample data. Changes stay in this browser tab and are not saved or sent.
          </p>
        </div>
      </AppWindow>

      <p className="sr-only" aria-live="polite" role="status">
        {announce}
      </p>
    </section>
  )
}
