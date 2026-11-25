'use client'

/**
 * One deal in the pipeline. Three ways to move it:
 *  - drag the card (pointer events via framer-motion: mouse, pen and touch);
 *  - the "Move to…" select on the card (keyboard and screen readers);
 *  - the same select in the stacked mobile layout, where dragging is off.
 * The card's main button selects the deal and opens it in the detail panel.
 * A deal that has just been won gets one soft green pulse (no confetti);
 * with reduced motion it simply shows the Won tick.
 */

import { forwardRef, useRef } from 'react'
import { motion, useDragControls, useReducedMotion, type PanInfo } from 'framer-motion'
import { Check, GripVertical } from 'lucide-react'
import { PIPELINE_STAGES, repById, sourceById, type Deal, type PipelineStageId } from '@/demo/sample-data'
import { formatINR } from '@/lib/gst'
import { cn } from '@/lib/utils'

export interface DealCardProps {
  deal: Deal
  selected: boolean
  draggable: boolean
  /** Unique per rendered view, so the desktop and mobile copies don't share ids. */
  idPrefix: string
  justWon: boolean
  /** True only for a card that just moved here, so SSR markup never starts hidden. */
  arrived: boolean
  detailId: string
  onSelect: () => void
  onMove: (to: PipelineStageId) => void
  onDragStart?: () => void
  onDrag?: (point: { x: number; y: number }) => void
  onDragEnd?: () => void
  onPulseDone?: () => void
  selectRef?: (el: HTMLSelectElement | null) => void
}

export const DealCard = forwardRef<HTMLButtonElement, DealCardProps>(function DealCard(
  {
    deal,
    selected,
    draggable,
    idPrefix,
    justWon,
    arrived,
    detailId,
    onSelect,
    onMove,
    onDragStart,
    onDrag,
    onDragEnd,
    onPulseDone,
    selectRef,
  },
  buttonRef,
) {
  const reduce = useReducedMotion()
  const controls = useDragControls()
  const dragged = useRef(false)
  const rep = repById(deal.repId)
  const selectId = `${idPrefix}-move-${deal.id}`
  const isWon = deal.stage === 'won'
  const isLost = deal.stage === 'lost'

  return (
    <motion.li
      drag={draggable}
      dragControls={controls}
      dragListener={false}
      dragSnapToOrigin
      dragMomentum={false}
      whileDrag={{ scale: 1.03, zIndex: 40, cursor: 'grabbing' }}
      initial={arrived && !reduce ? { opacity: 0, scale: 0.96 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      onPointerDown={(e) => {
        dragged.current = false
        if (!draggable) return
        // Let the select open normally; everything else on the card starts a drag.
        if ((e.target as HTMLElement).closest('select')) return
        controls.start(e)
      }}
      onDragStart={() => {
        dragged.current = true
        onDragStart?.()
      }}
      onDrag={(e: MouseEvent | TouchEvent | PointerEvent, _info: PanInfo) => {
        const p = 'clientX' in e ? e : e.touches[0] ?? e.changedTouches[0]
        if (p) onDrag?.({ x: p.clientX, y: p.clientY })
      }}
      onDragEnd={() => onDragEnd?.()}
      className={cn(
        'group relative list-none rounded-chip border bg-white p-2.5 shadow-soft transition-colors duration-fast',
        draggable && 'touch-none',
        selected ? 'border-brand ring-1 ring-brand/40' : 'border-line hover:border-brand/40',
        isLost && 'bg-sky/40',
      )}
    >
      {justWon && !reduce ? (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -inset-1 rounded-[0.875rem] border-2 border-won"
          initial={{ opacity: 0.9, scale: 0.97 }}
          animate={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          onAnimationComplete={onPulseDone}
        />
      ) : null}

      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          if (dragged.current) {
            dragged.current = false
            return
          }
          onSelect()
        }}
        aria-pressed={selected}
        aria-controls={detailId}
        className={cn('block w-full rounded-md text-left', draggable && 'cursor-grab')}
      >
        <span className="flex items-start justify-between gap-1.5">
          <span className="min-w-0 text-[0.8125rem] font-semibold leading-snug text-ink">{deal.company}</span>
          {draggable ? (
            <GripVertical aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate/60 group-hover:text-slate" />
          ) : null}
        </span>
        <span className="mt-0.5 block truncate text-[0.6875rem] text-slate">
          {deal.contact} · {deal.city}
        </span>
        <span className="mt-2 flex items-center justify-between gap-1.5">
          <span
            className={cn(
              'font-mono text-xs font-semibold tabular-nums',
              isWon ? 'text-won' : isLost ? 'text-slate line-through' : 'text-ink',
            )}
          >
            {formatINR(deal.value)}
          </span>
          <span className="flex items-center gap-1">
            {isWon ? (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-won text-white">
                <Check className="h-3 w-3" aria-hidden />
              </span>
            ) : null}
            <span
              className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky font-mono text-[0.5625rem] font-semibold text-brand"
              title={rep.name}
            >
              <span aria-hidden>{rep.initials}</span>
              <span className="sr-only">Owner {rep.name}</span>
            </span>
          </span>
        </span>
        <span className="sr-only">
          , {sourceById(deal.source).name} lead, stage {PIPELINE_STAGES.find((s) => s.id === deal.stage)?.label}
        </span>
      </button>

      <label htmlFor={selectId} className="sr-only">
        Move {deal.company} to another stage
      </label>
      <select
        id={selectId}
        ref={selectRef}
        value=""
        onChange={(e) => {
          const to = e.target.value as PipelineStageId
          if (to) onMove(to)
        }}
        className="mt-2 h-8 w-full cursor-pointer rounded-md border border-line bg-white px-1.5 text-[0.6875rem] font-semibold text-slate hover:border-brand/40 max-lg:h-10 max-lg:text-xs"
      >
        <option value="" disabled>
          Move to…
        </option>
        {PIPELINE_STAGES.filter((s) => s.id !== deal.stage).map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>
    </motion.li>
  )
})
