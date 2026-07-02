/**
 * JSON-LD structured data. Data originates from our own code/CMS; the `<`
 * escape below is belt-and-braces against script-context injection if any
 * value ever becomes user-influenced.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
