'use client'

/**
 * HeroStage — the CRM icon cloud centered, framed by floating "proof" cards in
 * the side gutters so the wide hero doesn't read empty on either side. The
 * cards are real CRM moments (a won deal, a WhatsApp reply, a response-time
 * metric, an incoming lead) and gently float. They're a desktop enhancement
 * (hidden below lg, where only the cloud shows), static under reduced motion.
 */

import { motion, useReducedMotion } from 'framer-motion'
import { Check, MessageCircle } from 'lucide-react'
import { CrmIconCloud } from './crm-icon-cloud'

function Float({
  children,
  className,
  delay = 0,
  drift = 8,
  reduce,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  drift?: number
  reduce: boolean | null
}) {
  return (
    <motion.div
      className={'absolute hidden lg:block ' + (className ?? '')}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={reduce ? undefined : { opacity: 1, y: [0, -drift, 0] }}
      transition={{
        opacity: { duration: 0.6, delay },
        y: { duration: 5 + drift * 0.2, repeat: Infinity, ease: 'easeInOut', delay },
      }}
    >
      {children}
    </motion.div>
  )
}

const card = 'rounded-card border border-line bg-white/90 p-3 shadow-float backdrop-blur'

export function HeroStage() {
  const reduce = useReducedMotion()

  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-xl sm:aspect-[16/9] sm:max-w-5xl">
      {/* icon cloud, centered */}
      <div className="absolute inset-y-0 left-1/2 w-[85%] max-w-md -translate-x-1/2 sm:w-[46%]">
        <CrmIconCloud />
      </div>

      {/* left gutter */}
      <Float reduce={reduce} delay={0.1} className="left-0 top-[16%]">
        <div className={card + ' w-44'}>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[rgb(var(--c-won))] text-white">
              <Check className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <p className="text-xs font-semibold text-ink">Deal won</p>
              <p className="font-mono text-sm font-extrabold text-[rgb(var(--c-won))]">₹2,12,400</p>
            </div>
          </div>
        </div>
      </Float>

      <Float reduce={reduce} delay={0.35} drift={10} className="bottom-[14%] left-[3%]">
        <div className={card + ' w-52'}>
          <div className="mb-1.5 flex items-center gap-1.5 text-[rgb(var(--c-won))]">
            <MessageCircle className="h-3.5 w-3.5" aria-hidden />
            <span className="text-[10px] font-semibold uppercase tracking-wide">WhatsApp</span>
          </div>
          <div className="rounded-2xl rounded-tl-sm bg-[#D7F0DD] px-2.5 py-1.5 text-xs text-ink">
            Yes sir — sharing the quote now 👍
          </div>
        </div>
      </Float>

      {/* right gutter */}
      <Float reduce={reduce} delay={0.2} drift={10} className="right-0 top-[12%]">
        <div className={card + ' w-48'}>
          <p className="font-mono text-lg font-extrabold text-ink">4 hrs → 3 min</p>
          <p className="text-[11px] text-slate">enquiry to first call</p>
        </div>
      </Float>

      <Float reduce={reduce} delay={0.45} className="bottom-[16%] right-[2%]">
        <div className={card + ' w-48'}>
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-sky px-2 py-0.5 text-[10px] font-semibold text-brand">IndiaMART</span>
            <span className="rounded-full bg-sky px-2 py-0.5 text-[10px] font-semibold text-brand">New lead</span>
          </div>
          <p className="mt-1.5 text-sm font-bold text-ink">Rakesh Gupta</p>
          <p className="font-mono text-[11px] text-slate">50 HP submersible pump × 4</p>
        </div>
      </Float>
    </div>
  )
}

export default HeroStage
