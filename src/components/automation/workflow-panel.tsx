'use client'

/**
 * One example workflow: the node graph, run controls and execution log.
 *
 * The run auto-starts when the panel is selected and on screen (gated by
 * useActiveMotion); nodes move queued → running → done one at a time, and a
 * pulse travels each connector as the next node starts. For conditions the
 * visitor chooses which answer the sample takes; the other lane is marked
 * Skipped. Pause and Replay are always available while motion is allowed.
 *
 * Reduced motion: the completed run is shown immediately with its full log.
 * Without JS the server HTML already contains every node and log entry.
 * Only start, pause and completion are announced (polite), not every step.
 */

import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Pause, Play, RotateCcw } from 'lucide-react'
import type { Workflow } from '@/demo/sample-data'
import { useActiveMotion } from '@/hooks/use-active-motion'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/utils'
import { Connector, KIND_META, NodeCard, STATUS_META } from './flow-node'
import { buildPlan, runOrder, type Branch, type NodeStatus, type PlanNode } from './plan'

const STEP_MS = 1100
const WAIT_MS = 1800
const START_MS = 500

export function WorkflowPanel({ workflow, selected }: { workflow: Workflow; selected: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  // Read the preference only after mount so server and first client render agree.
  const prefersReduced = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const reduce = mounted && !!prefersReduced
  const onScreen = useActiveMotion(ref)
  const active = onScreen && selected

  const plan = useMemo(() => buildPlan(workflow), [workflow])
  const [branch, setBranch] = useState<Branch>('yes')
  const { sequence, skipped } = useMemo(() => runOrder(plan, branch), [plan, branch])

  const [cursor, setCursor] = useState(-1)
  const [playing, setPlaying] = useState(true)
  const tracked = useRef(false)

  const at = reduce ? sequence.length : cursor
  const complete = at >= sequence.length

  useEffect(() => {
    if (!active || !playing || reduce || cursor >= sequence.length) return
    const cur = sequence[cursor]
    const delay = cursor < 0 ? START_MS : cur.node.kind === 'wait' ? WAIT_MS : STEP_MS
    const t = setTimeout(() => setCursor((c) => c + 1), delay)
    return () => clearTimeout(t)
  }, [active, playing, reduce, cursor, sequence])

  useEffect(() => {
    if (cursor >= sequence.length && !tracked.current) {
      tracked.current = true
      track('demo_completed', { demo: `workflow-${workflow.id}` })
    }
  }, [cursor, sequence.length, workflow.id])

  const replay = () => {
    setCursor(-1)
    setPlaying(true)
  }

  const chooseBranch = (b: Branch) => {
    if (b === branch) return
    setBranch(b)
    replay()
  }

  const condIndex = plan.condition ? sequence.indexOf(plan.condition) : -1
  const skippedKeys = new Set(skipped.map((s) => s.key))
  const statusOf = (p: PlanNode): NodeStatus => {
    if (skippedKeys.has(p.key)) return condIndex >= 0 && at > condIndex ? 'skipped' : 'queued'
    const i = sequence.indexOf(p)
    if (i < at) return 'done'
    if (i === at) return 'running'
    return 'queued'
  }
  /** A connector into node p: lit once p has started; pulses as p starts. */
  const conn = (p: PlanNode) => {
    const s = statusOf(p)
    return { lit: s === 'running' || s === 'done', pulse: active && s === 'running', dashed: s === 'skipped' }
  }

  const renderRow = (items: PlanNode[], leadIn: boolean) =>
    items.map((p, i) => (
      <Fragment key={p.key}>
        {i > 0 || leadIn ? <Connector {...conn(p)} /> : null}
        <NodeCard item={p} status={statusOf(p)} animate={active} />
      </Fragment>
    ))

  // Log order: the run order, then the lane not taken.
  const logItems = [...sequence, ...skipped]

  const phase = complete ? 'complete' : cursor < 0 ? 'ready' : playing ? 'running' : 'paused'
  const doneCount = sequence.filter((p) => statusOf(p) === 'done').length
  const phaseText =
    phase === 'complete'
      ? `Run complete: ${sequence.length} steps done${skipped.length ? `, ${skipped.length} skipped` : ''}.`
      : phase === 'ready'
        ? 'Ready to run.'
        : phase === 'running'
          ? `Running: step ${Math.min(at + 1, sequence.length)} of ${sequence.length}.`
          : `Paused after ${doneCount} of ${sequence.length} steps.`
  const announce =
    phase === 'complete' ? phaseText : phase === 'running' ? `Running sample workflow: ${workflow.name}.` : phase === 'paused' ? 'Paused.' : ''

  return (
    <div ref={ref} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8">
      <div className="min-w-0">
        {/* controls */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          {reduce ? (
            <p className="text-sm text-white/75">Reduced motion is on, so the completed run is shown.</p>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => (complete ? replay() : setPlaying((p) => !p))}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-night transition-colors duration-fast hover:bg-white/90"
              >
                {complete ? (
                  <Play className="h-4 w-4" aria-hidden />
                ) : playing ? (
                  <Pause className="h-4 w-4" aria-hidden />
                ) : (
                  <Play className="h-4 w-4" aria-hidden />
                )}
                {complete ? 'Run again' : playing ? 'Pause' : cursor < 0 ? 'Run' : 'Resume'}
              </button>
              <button
                type="button"
                onClick={replay}
                aria-label="Replay from the trigger"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-night-line bg-night-raised text-white transition-colors duration-fast hover:bg-white/10"
              >
                <RotateCcw className="h-4 w-4" aria-hidden />
              </button>
            </div>
          )}
          <p className="font-mono text-xs text-white/70">{phaseText}</p>
        </div>

        {plan.condition ? (
          <div role="group" aria-label="Sample answer to the condition" className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-white/75">
              Sample answer to <span className="font-semibold text-white">“{plan.condition.node.title}”</span>
            </span>
            <span className="inline-flex rounded-full border border-night-line bg-night-raised p-1">
              {(['yes', 'no'] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  aria-pressed={branch === b}
                  onClick={() => chooseBranch(b)}
                  className={cn(
                    'inline-flex h-8 min-w-[52px] items-center justify-center rounded-full px-3 text-xs font-semibold transition-colors duration-fast',
                    branch === b ? 'bg-white text-night' : 'text-white/75 hover:text-white',
                  )}
                >
                  {b === 'yes' ? 'Yes' : 'No'}
                </button>
              ))}
            </span>
          </div>
        ) : null}

        {/* graph: vertical below xl, horizontal from xl */}
        <div className="mt-6 flex flex-col xl:flex-row xl:items-stretch" aria-label={`${workflow.name} steps`} role="group">
          {renderRow(plan.main, false)}
          {plan.condition ? (
            <>
              <Connector {...conn(plan.condition)} />
              <NodeCard item={plan.condition} status={statusOf(plan.condition)} animate={active} />
              <Connector
                lit={statusOf(plan.condition) === 'done'}
                pulse={active && condIndex >= 0 && at === condIndex + 1}
              />
              <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:flex-[2] xl:grid-cols-1">
                {(['yes', 'no'] as const).map((b) => {
                  const nodes = b === 'yes' ? plan.yes : plan.no
                  const taken = branch === b
                  const resolved = at > condIndex
                  const label = b === 'yes' ? plan.condition!.node.branches?.yes : plan.condition!.node.branches?.no
                  return (
                    <div
                      key={b}
                      className={cn(
                        'min-w-0 rounded-card border p-3',
                        taken ? 'border-night-line bg-white/[0.03]' : 'border-dashed border-night-line',
                      )}
                    >
                      <p className="mb-2 flex flex-wrap items-center gap-x-2 text-xs">
                        <span className="inline-flex h-6 items-center rounded-full bg-white/10 px-2 font-bold text-white">
                          If {b === 'yes' ? 'Yes' : 'No'}
                        </span>
                        <span className="text-white/75">{label}</span>
                        <span className={cn('ml-auto font-semibold', taken ? 'text-white' : 'text-white/70')}>
                          {resolved ? (taken ? 'Taken' : 'Skipped') : taken ? 'Sample path' : 'Not chosen'}
                        </span>
                      </p>
                      <div className="flex flex-col xl:flex-row xl:items-stretch">{renderRow(nodes, false)}</div>
                    </div>
                  )
                })}
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* execution log */}
      <div className="min-w-0 rounded-card border border-night-line bg-night-raised p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-semibold text-white">Execution log</h3>
          <span className="text-[11px] text-white/70">Simulated timings</span>
        </div>
        <ol className="mt-3 space-y-2">
          {logItems.map((p) => {
            const s = statusOf(p)
            const st = STATUS_META[s]
            const StIcon = st.icon
            return (
              <li
                key={p.key}
                className={cn(
                  'grid grid-cols-[auto_minmax(0,1fr)] gap-x-2 border-b border-night-line pb-2 text-xs last:border-0',
                  s === 'running' && 'text-white',
                )}
              >
                <StIcon className={cn('mt-0.5 h-3.5 w-3.5', st.iconClass, s === 'running' && active && 'animate-spin')} aria-hidden />
                <div className="min-w-0">
                  <p className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <span className="font-semibold text-white">{p.node.title}</span>
                    <span className="font-mono tabular-nums text-white/70">{p.timing}</span>
                  </p>
                  <p className="text-white/70">
                    {KIND_META[p.node.kind].label}
                    {p.lane !== 'main' ? ` · ${p.lane === 'yes' ? 'Yes' : 'No'} branch` : ''} ·{' '}
                    <span className={st.className}>{s === 'skipped' ? 'Skipped, branch not taken' : st.label}</span>
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>

      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </div>
  )
}
