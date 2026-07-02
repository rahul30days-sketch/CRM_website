export function PageIntro({
  kicker,
  title,
  lede,
}: {
  kicker: string
  title: string
  lede?: string
}) {
  return (
    <div className="mesh noise relative overflow-hidden border-b border-line">
      <header className="shell relative z-10 max-w-3xl pb-16 pt-20 lg:pb-20 lg:pt-28">
        <p className="kicker mb-4">{kicker}</p>
        <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {lede ? <p className="mt-6 text-lg leading-relaxed text-slate">{lede}</p> : null}
      </header>
    </div>
  )
}
