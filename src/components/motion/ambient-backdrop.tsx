/**
 * Soft ambient background for the full-height pinned story sections, so the
 * empty space around the content reads as an intentional, premium backdrop
 * rather than blank white. Pure markup (no motion) — sits behind content at
 * -z-10. The parent must be `relative`.
 */
export function AmbientBackdrop({ className = '' }: { className?: string }) {
  return (
    <div className={'pointer-events-none absolute inset-0 -z-10 overflow-hidden ' + className} aria-hidden>
      <div className="absolute -left-24 top-[12%] h-80 w-80 rounded-full bg-brand/10 blur-[120px]" />
      <div className="absolute -right-20 bottom-[10%] h-96 w-96 rounded-full bg-[rgb(var(--c-brand-hi))]/12 blur-[130px]" />
      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgb(var(--c-won))]/5 blur-[120px]" />
      {/* faint dotted grid, masked so it fades toward the edges */}
      <div className="absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,rgba(43,92,230,0.09)_1px,transparent_0)] [background-size:30px_30px] [mask-image:radial-gradient(ellipse_60%_60%_at_center,black,transparent_80%)]" />
    </div>
  )
}
