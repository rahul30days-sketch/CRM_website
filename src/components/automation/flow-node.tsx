'use client'

/**
 * Building blocks of the workflow graph: a node card and an SVG connector.
 *
 * Node kind is shown by icon AND a text label (Trigger / Action / Condition /
 * Wait), and run status by icon AND text (Queued / Running / Done / Skipped),
 * so nothing relies on colour alone. The connector draws a vertical line on
 * small screens and a horizontal one from xl; while the next node starts, a
 * pulse travels along it once (transform only, rendered only when motion is
 * active).
 */

import { motion } from 'framer-motion'
import { Ban, CircleCheck, Clock, Cog, GitBranch, Hourglass, LoaderCircle, Zap } from 'lucide-react'
import type { FlowNodeKind } from '@/demo/sample-data'
import { EASE } from '@/lib/motion'
import { cn } from '@/lib/utils'
import type { NodeStatus, PlanNode } from './plan'

export const KIND_META: Record<FlowNodeKind, { label: string; icon: typeof Zap }> = {
  trigger: { label: 'Trigger', icon: Zap },
  action: { label: 'Action', icon: Cog },
  condition: { label: 'Condition', icon: GitBranch },
  wait: { label: 'Wait', icon: Hourglass },
}

/** `className` colours the text label (always 4.5:1+ on white); `iconClass` the icon beside it. */
export const STATUS_META: Record<NodeStatus, { label: string; icon: typeof Zap; className: string; iconClass: string }> = {
  queued: { label: 'Queued', icon: Clock, className: 'text-slate', iconClass: 'text-slate' },
  running: { label: 'Running', icon: LoaderCircle, className: 'text-ink', iconClass: 'text-brand' },
  done: { label: 'Done', icon: CircleCheck, className: 'text-ink', iconClass: 'text-won' },
  skipped: { label: 'Skipped', icon: Ban, className: 'text-slate', iconClass: 'text-slate' },
}

export function NodeCard({ item, status, animate }: { item: PlanNode; status: NodeStatus; animate: boolean }) {
  const kind = KIND_META[item.node.kind]
  const st = STATUS_META[status]
  const KindIcon = kind.icon
  const StIcon = st.icon
  return (
    <div
      className={cn(
        'relative min-w-0 rounded-chip xl:flex-1 border bg-white p-3 transition-[border-color,box-shadow,transform] duration-base ease-out',
        status === 'running' && 'border-brand shadow-glass xl:-translate-y-0.5',
        status === 'done' && 'border-won/40',
        status === 'queued' && 'border-line',
        status === 'skipped' && 'border-dashed border-line bg-sky',
      )}
    >
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className={cn(
            'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
            item.node.kind === 'trigger' && 'bg-brand text-white',
            item.node.kind === 'action' && 'bg-sky text-ink',
            item.node.kind === 'condition' && 'bg-brand/15 text-brand',
            item.node.kind === 'wait' && 'bg-sky text-ink',
          )}
        >
          <KindIcon className="h-3.5 w-3.5" />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate">{kind.label}</span>
      </div>
      <p className={cn('mt-2 text-sm font-semibold leading-snug', status === 'skipped' ? 'text-slate line-through decoration-slate/40' : 'text-ink')}>
        {item.node.title}
      </p>
      <p className="mt-0.5 text-xs leading-snug text-slate">{item.node.detail}</p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 border-t border-line pt-2">
        <span className={cn('inline-flex items-center gap-1 text-[11px] font-semibold', st.className)}>
          <StIcon className={cn('h-3.5 w-3.5', st.iconClass, status === 'running' && animate && 'animate-spin')} aria-hidden />
          {st.label}
        </span>
        <span className="font-mono text-[11px] tabular-nums text-slate">{item.timing}</span>
      </div>
    </div>
  )
}

export function Connector({ lit, pulse, dashed }: { lit: boolean; pulse: boolean; dashed?: boolean }) {
  const stroke = lit ? 'stroke-brand' : 'stroke-line'
  return (
    <div aria-hidden className="relative flex h-8 w-full shrink-0 justify-center xl:h-auto xl:w-10 xl:items-center">
      <svg className="h-8 w-2 xl:hidden" viewBox="0 0 8 32" preserveAspectRatio="none">
        <line x1="4" y1="0" x2="4" y2="32" strokeWidth="2" className={stroke} strokeDasharray={dashed ? '3 4' : undefined} />
      </svg>
      <svg className="hidden h-2 w-10 xl:block" viewBox="0 0 40 8" preserveAspectRatio="none">
        <line x1="0" y1="4" x2="40" y2="4" strokeWidth="2" className={stroke} strokeDasharray={dashed ? '3 4' : undefined} />
      </svg>
      {pulse ? (
        <>
          <motion.span
            className="absolute left-1/2 top-0 -ml-1 h-2 w-2 rounded-full bg-brand shadow-glass xl:hidden"
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: 24, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.7, ease: EASE }}
          />
          <motion.span
            className="absolute left-0 top-1/2 -mt-1 hidden h-2 w-2 rounded-full bg-brand shadow-glass xl:block"
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: 32, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.7, ease: EASE }}
          />
        </>
      ) : null}
    </div>
  )
}
