import { tickerEvents } from '@/content/site'
import { cn } from '@/lib/utils'

const signalDot: Record<string, string> = {
  won: 'bg-won',
  info: 'bg-info',
  due: 'bg-due',
}

/**
 * Live-events strip: the kind of feed a manager watches all day.
 * Pure CSS marquee (paused on hover, disabled under reduced motion, where
 * it degrades to a scrollable row). Duplicated list is aria-hidden.
 */
export function Ticker() {
  const items = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-8 pr-8"
    >
      {tickerEvents.map((event, i) => (
        <li key={i} className="flex items-center gap-2 whitespace-nowrap font-mono text-xs text-fog">
          <span className={cn('h-1.5 w-1.5 rounded-full', signalDot[event.signal])} aria-hidden />
          {event.text}
        </li>
      ))}
    </ul>
  )

  return (
    <div
      className="overflow-x-auto border-y border-line bg-sky/60 py-3 [scrollbar-width:none]"
      role="marquee"
      aria-label="Sample of live events inside EZCRM"
    >
      <div className="ticker-track flex w-max">
        {items(false)}
        {items(true)}
      </div>
    </div>
  )
}
