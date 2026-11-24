'use client'

/**
 * Section 12 — Interactive feature bento grid.
 *
 * An editorial bento of real EZCRM modules at varied sizes, each card carrying
 * a small live product demo that animates on hover/focus. Titles and taglines
 * come from the CMS modules (passed as a prop); visuals are illustrative.
 */

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import type { ModuleContent } from '@/content/modules'
import { MessageCircle, Bot, FileText, Workflow, Ticket, BarChart3, Send, Users } from 'lucide-react'
import { StaggerGroup, staggerItem } from '@/components/motion/reveal'

type Cell = { slug: string; span: string; icon: typeof MessageCircle; visual: React.ReactNode }

function MiniBars() {
  return (
    <div className="flex h-12 items-end gap-1">
      {[40, 70, 55, 85, 62, 95, 74].map((h, i) => (
        <span key={i} className="flex-1 rounded-sm bg-brand" style={{ height: `${h}%`, opacity: 0.3 + i * 0.1 }} />
      ))}
    </div>
  )
}
function MiniChat() {
  return (
    <div className="space-y-1.5">
      <div className="max-w-[85%] rounded-xl rounded-tl-sm bg-sky px-2.5 py-1.5 text-[11px] text-ink">Is this in stock?</div>
      <div className="ml-auto max-w-[85%] rounded-xl rounded-tr-sm bg-[#D7F0DD] px-2.5 py-1.5 text-[11px] text-ink">Yes! Sharing a quote 👍</div>
    </div>
  )
}
function MiniChips() {
  return (
    <div className="flex flex-wrap gap-1.5">
      {['IndiaMART', 'JustDial', 'Facebook', 'WhatsApp', 'Website'].map((s) => (
        <span key={s} className="rounded-full bg-sky px-2 py-0.5 text-[10px] font-semibold text-brand">{s}</span>
      ))}
    </div>
  )
}
function MiniDoc() {
  return (
    <div className="rounded-chip border border-line bg-white p-2 text-[10px]">
      <div className="flex justify-between"><span className="text-slate">Pump × 4</span><span className="font-mono text-ink">₹1,80,000</span></div>
      <div className="flex justify-between"><span className="text-slate">GST 18%</span><span className="font-mono text-ink">₹32,400</span></div>
      <div className="mt-1 flex justify-between border-t border-line pt-1 font-semibold"><span className="text-ink">Total</span><span className="font-mono text-ink">₹2,12,400</span></div>
    </div>
  )
}
function MiniNodes() {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-brand" style={{ opacity: 0.4 + i * 0.2 }} />
          {i < 3 && <span className="h-px w-5 bg-line" />}
        </div>
      ))}
    </div>
  )
}

const CELLS: Cell[] = [
  { slug: 'dashboard', span: 'sm:col-span-2 sm:row-span-2', icon: BarChart3, visual: <MiniBars /> },
  { slug: 'whatsapp', span: 'sm:row-span-2', icon: MessageCircle, visual: <MiniChat /> },
  { slug: 'lead-integrations', span: 'sm:col-span-2', icon: Users, visual: <MiniChips /> },
  { slug: 'quotations', span: '', icon: FileText, visual: <MiniDoc /> },
  { slug: 'automations', span: '', icon: Workflow, visual: <MiniNodes /> },
  { slug: 'ai-chatbot', span: '', icon: Bot, visual: <MiniChat /> },
  { slug: 'email-campaigns', span: '', icon: Send, visual: <MiniChips /> },
  { slug: 'ticketing', span: '', icon: Ticket, visual: <MiniNodes /> },
]

export function FeatureBento({ modules }: { modules: ModuleContent[] }) {
  const reduce = useReducedMotion()
  const bySlug = new Map(modules.map((m) => [m.slug, m]))

  return (
    <section className="shell py-14 lg:py-20">
      <header className="mx-auto max-w-2xl text-center">
        <p className="kicker mb-3">The platform</p>
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
          One platform. Every part of the sale.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate">
          From first enquiry to final payment — explore the modules that run your floor.
        </p>
      </header>

      <StaggerGroup className="mt-12 grid auto-rows-[11rem] grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {CELLS.map((cell) => {
          const m = bySlug.get(cell.slug)
          const title = m?.title ?? cell.slug
          const tagline = m?.tagline ?? ''
          const Icon = cell.icon
          return (
            <motion.div key={cell.slug} variants={reduce ? undefined : staggerItem} className={cell.span}>
              <Link
                href={`/features/${cell.slug}`}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-card border border-line bg-white p-4 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-float"
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-chip bg-sky text-brand">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                </div>
                <div className="my-2 opacity-90 transition-opacity group-hover:opacity-100">{cell.visual}</div>
                <div>
                  <p className="text-sm font-bold text-ink">{title}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-slate">{tagline}</p>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </StaggerGroup>
    </section>
  )
}
