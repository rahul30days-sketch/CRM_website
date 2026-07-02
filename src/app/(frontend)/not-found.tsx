import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="shell flex flex-col items-start justify-center py-32">
      <p className="kicker mb-3">Error 404</p>
      <h1 className="font-display text-4xl font-bold text-bright">
        This lead went cold.
      </h1>
      <p className="mt-4 max-w-md text-fog">
        The page you’re after doesn’t exist — maybe it moved, maybe the link had a typo. Either
        way, the follow-up is easy:
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className={buttonVariants()}>
          Back to home
        </Link>
        <Link href="/features" className={buttonVariants({ variant: 'secondary' })}>
          Browse features
        </Link>
      </div>
    </div>
  )
}
