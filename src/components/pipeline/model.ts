/**
 * Pure pipeline maths for the homepage pipeline playground. No React here, so
 * the KPI cards, funnel and forecast all read from one function and always
 * agree with each other.
 */

import { PIPELINE_STAGES, type Deal, type PipelineStageId } from '@/demo/sample-data'

export type Probabilities = Record<PipelineStageId, number>

export const DEFAULT_PROBABILITIES = Object.fromEntries(
  PIPELINE_STAGES.map((s) => [s.id, s.probability]),
) as Probabilities

/** Won and Lost are outcomes, so their probability is fixed at 100% and 0%. */
export const LOCKED_STAGES: readonly PipelineStageId[] = ['won', 'lost']

export const isOpenStage = (s: PipelineStageId) => s !== 'won' && s !== 'lost'

export const stageLabel = (id: PipelineStageId) =>
  PIPELINE_STAGES.find((s) => s.id === id)?.label ?? id

export const clampProbability = (n: number) => Math.max(0, Math.min(100, Math.round(n)))

export function pipelineKpis(deals: Deal[], probs: Probabilities) {
  const open = deals.filter((d) => isOpenStage(d.stage))
  const won = deals.filter((d) => d.stage === 'won')
  const lost = deals.filter((d) => d.stage === 'lost')
  const decided = won.length + lost.length
  return {
    openCount: open.length,
    openValue: open.reduce((s, d) => s + d.value, 0),
    /** Σ value × stage probability, over open deals. */
    weighted: Math.round(open.reduce((s, d) => s + (d.value * probs[d.stage]) / 100, 0)),
    wonCount: won.length,
    wonValue: won.reduce((s, d) => s + d.value, 0),
    lostCount: lost.length,
    /** Won ÷ (won + lost) as a whole percentage, or null before anything is decided. */
    winRate: decided ? Math.round((won.length / decided) * 100) : null,
  }
}

export type PipelineKpis = ReturnType<typeof pipelineKpis>

export function stageCounts(deals: Deal[]) {
  return PIPELINE_STAGES.map((s) => {
    const inStage = deals.filter((d) => d.stage === s.id)
    return { id: s.id, label: s.label, count: inStage.length, value: inStage.reduce((t, d) => t + d.value, 0) }
  })
}

export interface ActivityEntry {
  /** Monotonic counter, unique per session. */
  seq: number
  dealId: string
  company: string
  from: PipelineStageId
  to: PipelineStageId
  /** Clock time captured in the event handler (client only, never during SSR). */
  time: string
}
