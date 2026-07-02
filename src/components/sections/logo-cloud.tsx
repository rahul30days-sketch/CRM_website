import type { IntegrationContent } from '@/content/site'

/**
 * "Integrate with what you use" — greyscale wordmarks, quiet by design.
 * Uses integration names from the CMS so it stays in sync with /integrations.
 */
export function LogoCloud({
  integrations,
  heading,
}: {
  integrations: IntegrationContent[]
  heading: string
}) {
  const featured = integrations
    .filter((i) => ['lead-sources', 'messaging', 'payments', 'notifications'].includes(i.category))
    .slice(0, 8)

  return (
    <section aria-labelledby="logo-cloud-heading" className="shell py-16">
      <p id="logo-cloud-heading" className="text-center text-sm font-medium text-slate">
        {heading}
      </p>
      <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
        {featured.map((integration) => (
          <li
            key={integration.slug}
            className="font-display text-lg font-semibold text-slate/50 grayscale transition-colors hover:text-slate"
          >
            {integration.name}
          </li>
        ))}
      </ul>
    </section>
  )
}
