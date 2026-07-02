'use client'

import React from 'react'
import { PageIntro } from '@/components/page-intro'
import { SpinnerDemo, SpinnerInverted, SpinnerWithButton } from '@/components/ui/spinner-demo'

export default function SpinnerDemoPage() {
  return (
    <>
      <PageIntro
        kicker="Design System"
        title="Spinner Components"
        lede="Demo of the Spinner components integrated into the CRM website design system."
      />

      <div className="shell pb-20 space-y-12">
        <section className="panel-frame p-8 overflow-hidden" aria-labelledby="default-spinner">
          <h2 id="default-spinner" className="kicker mb-4">Default Spinner</h2>
          <div className="border border-line rounded-chip bg-white overflow-hidden max-h-[300px] relative">
            <div className="scale-75 -my-32">
              <SpinnerDemo />
            </div>
          </div>
        </section>

        <section className="panel-frame p-8 overflow-hidden bg-ink" aria-labelledby="inverted-spinner">
          <h2 id="inverted-spinner" className="kicker mb-4 text-brand-hi">Inverted Spinner (Dark Background)</h2>
          <div className="border border-white/10 rounded-chip bg-ink overflow-hidden max-h-[300px] relative">
            <div className="scale-75 -my-32">
              <SpinnerInverted />
            </div>
          </div>
        </section>

        <section className="panel-frame p-8 overflow-hidden" aria-labelledby="button-spinner">
          <h2 id="button-spinner" className="kicker mb-4">Button With Spinner</h2>
          <div className="border border-line rounded-chip bg-white overflow-hidden max-h-[300px] relative">
            <div className="scale-75 -my-32">
              <SpinnerWithButton />
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
