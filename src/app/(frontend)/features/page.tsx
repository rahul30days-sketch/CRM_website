import type { Metadata } from 'next'
import { PageIntro } from '@/components/page-intro'
import { ModuleRegistry } from '@/components/sections/module-registry'
import { CtaBand } from '@/components/sections/cta-band'
import { getModules } from '@/lib/cms'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Features — every module in EZCRM',
  description:
    'Fourteen modules across capture, engagement, closing, support and operations: leads, WhatsApp, quotations, pipelines, ticketing, automations and more.',
}

export default async function FeaturesPage() {
  const modules = await getModules()

  return (
    <>
      <PageIntro
        kicker="Features"
        title="Everything a sales floor runs on, in one registry."
        lede="No module here is a mockup or a roadmap item. Each one links to how it works day-to-day, what it replaces, and the numbers teams see after switching it on."
      />
      <div className="shell pb-20">
        <ModuleRegistry modules={modules} />
      </div>
      <CtaBand
        heading="Not sure where to start?"
        subheading="Most teams switch on Leads + WhatsApp + the Integration Hub in week one. We’ll map your process in the demo."
      />
    </>
  )
}
