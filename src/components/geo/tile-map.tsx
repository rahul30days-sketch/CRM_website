'use client'

/**
 * India as a tile map: every state / UT is one equal square at its
 * INDIA_STATES row/col. Not a geographic map, and labelled as such.
 *
 * Accessibility: the tiles are one tab stop (roving tabindex). Arrow keys move
 * between neighbouring tiles, Home/End jump to the first/last, Enter or Space
 * selects. Each tile's accessible name carries the state and its metric, and
 * a tooltip shows the same on hover or focus. Label colour per heat step is
 * computed for contrast (see geo-model). Cells are aspect-square fractions of
 * the grid, so the map fits a 320px screen.
 */

import { useState, type KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'
import { HEAT_STEPS, heatLevel, metricById, metricValue, type GeoMetric, type StateRow } from './geo-model'

const COLS = 8
const ROWS = 7

export function TileMap({
  states,
  metric,
  selected,
  onSelect,
}: {
  states: StateRow[]
  metric: GeoMetric
  selected: string | null
  onSelect: (code: string) => void
}) {
  const m = metricById(metric)
  const max = Math.max(0, ...states.map((s) => metricValue(s.stats, metric)))
  const [cursor, setCursor] = useState<string>(selected ?? states[0].code)
  const [hover, setHover] = useState<string | null>(null)
  const [focused, setFocused] = useState<string | null>(null)
  const tip = states.find((s) => s.code === (hover ?? focused))
  const tabStop = states.some((s) => s.code === cursor) ? cursor : states[0].code

  const moveTo = (code: string) => {
    setCursor(code)
    document.getElementById(`tile-${code}`)?.focus()
  }

  const onKey = (e: KeyboardEvent, s: StateRow) => {
    const pick = (cands: StateRow[], score: (c: StateRow) => number) =>
      cands.sort((a, b) => score(a) - score(b))[0]
    let next: StateRow | undefined
    if (e.key === 'ArrowRight')
      next = pick(states.filter((c) => c.row === s.row && c.col > s.col), (c) => c.col)
    else if (e.key === 'ArrowLeft')
      next = pick(states.filter((c) => c.row === s.row && c.col < s.col), (c) => -c.col)
    else if (e.key === 'ArrowDown')
      next = pick(states.filter((c) => c.row > s.row), (c) => (c.row - s.row) * 10 + Math.abs(c.col - s.col))
    else if (e.key === 'ArrowUp')
      next = pick(states.filter((c) => c.row < s.row), (c) => (s.row - c.row) * 10 + Math.abs(c.col - s.col))
    else if (e.key === 'Home') next = states[0]
    else if (e.key === 'End') next = states[states.length - 1]
    else return
    e.preventDefault()
    if (next) moveTo(next.code)
  }

  return (
    <div className="relative">
      <div
        role="group"
        aria-label={`Tile map of Indian states and union territories, not to scale, coloured by ${m.label.toLowerCase()}. Arrow keys move between tiles; Enter selects.`}
        className="grid gap-[3px] sm:gap-1.5"
        style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${ROWS}, auto)` }}
        onMouseLeave={() => setHover(null)}
      >
        {states.map((s) => {
          const v = metricValue(s.stats, metric)
          const step = HEAT_STEPS[heatLevel(v, max)]
          const isSel = selected === s.code
          return (
            <button
              key={s.code}
              id={`tile-${s.code}`}
              type="button"
              tabIndex={tabStop === s.code ? 0 : -1}
              aria-pressed={isSel}
              aria-label={`${s.name}: ${m.long(v)}, ${s.stats.leads} leads`}
              onClick={() => {
                setCursor(s.code)
                onSelect(s.code)
              }}
              onKeyDown={(e) => onKey(e, s)}
              onMouseEnter={() => setHover(s.code)}
              onFocus={() => {
                setFocused(s.code)
                setCursor(s.code)
              }}
              onBlur={() => setFocused((f) => (f === s.code ? null : f))}
              style={{ gridRow: s.row + 1, gridColumn: s.col + 1 }}
              className={cn(
                'relative flex aspect-square min-w-0 flex-col items-center justify-center rounded-[4px] border transition-[transform,background-color] duration-fast sm:rounded-md',
                step.bg,
                step.text,
                isSel ? 'z-10 scale-[1.06] border-white ring-2 ring-white/70' : 'border-white/10 hover:border-white/50',
              )}
            >
              <span className="font-mono text-[0.625rem] font-bold leading-none sm:text-xs">{s.code}</span>
              <span aria-hidden className="mt-1 hidden font-mono text-[0.625rem] leading-none sm:block">
                {m.short(v)}
              </span>
            </button>
          )
        })}
      </div>

      {tip ? (
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute z-20 w-max max-w-[12rem] rounded-md border border-night-line bg-night-raised px-2.5 py-2 text-xs text-white shadow-float',
            tip.col <= 1 ? 'translate-x-0' : tip.col >= COLS - 2 ? '-translate-x-full' : '-translate-x-1/2',
            '-translate-y-full',
          )}
          style={{
            left: `${tip.col <= 1 ? (tip.col / COLS) * 100 : tip.col >= COLS - 2 ? ((tip.col + 1) / COLS) * 100 : ((tip.col + 0.5) / COLS) * 100}%`,
            top: `calc(${(tip.row / ROWS) * 100}% - 6px)`,
          }}
        >
          <p className="font-semibold">{tip.name}</p>
          <p className="mt-0.5 font-mono text-white/80">{m.long(metricValue(tip.stats, metric))}</p>
          <p className="font-mono text-white/70">
            {tip.stats.leads} leads · {tip.stats.won} won
          </p>
        </div>
      ) : null}
    </div>
  )
}
