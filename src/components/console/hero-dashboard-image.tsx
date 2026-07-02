import Image from 'next/image'

/**
 * CMS-managed hero: an uploaded dashboard screenshot in the same glass frame
 * as the live demo, so a real product shot slots in without losing the
 * "floating in a lit blue room" treatment. Rendered instead of ConsoleHero
 * when site-settings.heroDashboard is set.
 */
export function HeroDashboardImage({
  image,
}: {
  image: { url: string; alt: string; width?: number; height?: number }
}) {
  return (
    <div className="glass overflow-hidden p-0 !shadow-float">
      <div className="flex items-center gap-3 border-b border-line bg-white/60 px-4 py-2.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-won opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-won" />
        </span>
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-slate">
          EZCRM · Live dashboard
        </p>
      </div>
      <Image
        src={image.url}
        alt={image.alt}
        width={image.width ?? 1600}
        height={image.height ?? 1000}
        priority
        unoptimized
        sizes="(min-width: 1024px) 64rem, 100vw"
        className="h-auto w-full"
      />
    </div>
  )
}
