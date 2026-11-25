import type { Metadata } from 'next'
import { PageIntro } from '@/components/page-intro'
import { ModuleDirectory } from '@/components/directory/module-directory'
import { CtaBand } from '@/components/sections/cta-band'
import { getModules } from '@/lib/cms'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Features — every module in EZCRM',
  description:
    'Every EZCRM module across capture, engagement, closing, support and operations: leads, WhatsApp, quotations, pipelines, ticketing, automations and more.',
  alternates: { canonical: '/features' },
}

export default async function FeaturesPage() {
  const modules = await getModules()

  return (
    <>
      <PageIntro
        kicker="Features"
        title="Everything a sales floor runs on."
        lede={`${modules.length} modules across capture, engagement, closing, support and operations. Search for what you need, or open any module to see how it works day to day.`}
      />
      <div className="shell pb-20">
        <ModuleDirectory modules={modules} />
      </div>
      <CtaBand
        heading="Not sure where to start?"
        subheading="Most teams switch on Leads + WhatsApp + the Integration Hub in week one. We’ll map your process in the demo."
      />
    </>
  )
}
