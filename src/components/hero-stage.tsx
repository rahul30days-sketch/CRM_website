'use client'

/**
 * HeroStage — the EZCRM "sales universe": a slowly rotating cloud of the lead
 * sources and CRM functions the product covers. Kept deliberately light: no
 * dashboard, cards or connection paths around it, so the headline and CTAs
 * above stay the focus.
 *
 * The richer command-center composition built in Phase 3 is preserved at
 * audit/removed-files/src/components/hero-stage.command-center.tsx.
 */

import { CrmIconCloud } from './crm-icon-cloud'

export function HeroStage() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-sm sm:max-w-md lg:max-w-none">
      <CrmIconCloud />
    </div>
  )
}

export default HeroStage
