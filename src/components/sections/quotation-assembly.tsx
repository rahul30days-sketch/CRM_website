'use client'

/**
 * Section 10 — Professional quotations, without the paperwork.
 *
 * Line items, discount, GST and total stagger into one assembled quotation
 * document when the section scrolls into view, then it "sends" to WhatsApp.
 * framer-motion stagger. All financial figures are internally consistent and
 * clearly illustrative.
 */

import { motion, useReducedMotion } from 'framer-motion'
import { FileCheck2, Send } from 'lucide-react'
import { staggerContainer, staggerItem } from '@/components/motion/reveal'

const LINES = [
  { label: '50 HP submersible pump × 4', value: '₹1,80,000' },
  { label: 'Installation kit × 4', value: '₹20,000' },
]
const SUMMARY = [
  { label: 'Subtotal', value: '₹2,00,000', strong: false },
  { label: 'Discount (5%)', value: '−₹10,000', strong: false },
  { label: 'GST (18%)', value: '₹34,200', strong: false },
]

export function QuotationAssembly() {
  const reduce = useReducedMotion()

  return (
    <section className="shell py-14 lg:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="kicker mb-3">Quotations & finance</p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Professional quotations. Without the paperwork.
          </h2>
          <p className="mt-4 max-w-md text-lg text-slate">
            Build GST-compliant quotations from your catalog — HSN codes, tax slabs, discounts and totals — then send for digital approval over WhatsApp. No Word, no wrong prices.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-slate">
            {['Catalog-driven line items & UOM', 'Automatic GST and discount maths', 'Version history on every revision', 'Digital approval & payment link'].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-brand" aria-hidden /> {f}
              </li>
            ))}
          </ul>
        </div>

        <motion.div
          variants={reduce ? undefined : staggerContainer}
          initial={reduce ? false : 'hidden'}
          whileInView={reduce ? undefined : 'show'}
          viewport={{ once: true, amount: 0.3 }}
          className="rounded-card border border-line bg-white p-6 shadow-float"
        >
          <motion.div variants={reduce ? undefined : staggerItem} className="flex items-center justify-between border-b border-line pb-3">
            <div>
              <p className="text-sm font-bold text-ink">Quotation QT-1094</p>
              <p className="font-mono text-[11px] text-slate">Shri Balaji Agro · Nagpur</p>
            </div>
            <span className="rounded-full bg-sky px-2.5 py-0.5 text-[11px] font-semibold text-brand">Draft</span>
          </motion.div>

          <div className="space-y-2 py-3 text-sm">
            {LINES.map((l) => (
              <motion.div key={l.label} variants={reduce ? undefined : staggerItem} className="flex items-center justify-between">
                <span className="text-slate">{l.label}</span>
                <span className="font-mono text-ink">{l.value}</span>
              </motion.div>
            ))}
          </div>

          <div className="space-y-1.5 border-t border-line py-3 text-sm">
            {SUMMARY.map((s) => (
              <motion.div key={s.label} variants={reduce ? undefined : staggerItem} className="flex items-center justify-between">
                <span className="text-slate">{s.label}</span>
                <span className="font-mono text-ink">{s.value}</span>
              </motion.div>
            ))}
          </div>

          <motion.div variants={reduce ? undefined : staggerItem} className="flex items-center justify-between border-t border-line pt-3">
            <span className="text-sm font-semibold text-ink">Total</span>
            <span className="font-mono text-xl font-extrabold text-ink">₹2,24,200</span>
          </motion.div>

          <motion.button
            variants={reduce ? undefined : staggerItem}
            type="button"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-chip bg-[rgb(var(--c-won))] px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Send className="h-4 w-4" aria-hidden /> Send on WhatsApp for approval
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
