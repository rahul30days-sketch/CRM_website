'use client'

/**
 * Professional quotations. Without the paperwork.
 *
 * A working GST quotation on sample data: the visitor edits lines (qty, unit
 * price, discount, GST rate), adds items from a small catalogue, changes the
 * place of supply, and the document preview beside it recalculates on every
 * keystroke via computeQuote (@/lib/gst): the one shared implementation.
 * A simulated approval track and version history show what happens next.
 *
 * Accessibility: every input is labelled with inline validation; the grand
 * total and status changes are announced through polite live regions; the
 * simulated approval steps through Sent → Viewed → Approved only while the
 * section is on screen with motion allowed, otherwise it jumps straight to
 * Approved. Controls stack above the preview on small screens.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import { SampleBadge, SectionHeader, AppWindow } from '@/components/demo/kit'
import { computeQuote, formatINR, type GstRate } from '@/lib/gst'
import { JOURNEY_CUSTOMER, JOURNEY_QUOTE_LINES, JOURNEY_QUOTE_NUMBER, SELLER } from '@/demo/sample-data'
import { useActiveMotion } from '@/hooks/use-active-motion'
import { track } from '@/lib/analytics'
import {
  SAMPLE_CATALOGUE,
  STATE_NAMES,
  toDraft,
  validateField,
  type DraftField,
  type DraftLine,
} from '@/components/quote/catalogue'
import { LineEditor } from '@/components/quote/line-editor'
import { QuoteDocument } from '@/components/quote/quote-document'
import { ApprovalPanel, STATUSES, type QuoteStatus, type QuoteVersion } from '@/components/quote/approval-panel'

const JOURNEY_UNITS: Record<string, string> = { pump: 'pc', panel: 'pc', install: 'job' }
const INITIAL_LINES: DraftLine[] = JOURNEY_QUOTE_LINES.map((l) => toDraft(l, JOURNEY_UNITS[l.id]))
const INITIAL_PLACE = JOURNEY_CUSTOMER.state

const signature = (lines: DraftLine[], place: string) =>
  JSON.stringify([place, lines.map((l) => [l.id, l.qty, l.unitPrice, l.discountPct, l.gstRate])])

export function QuotationAssembly() {
  const rootRef = useRef<HTMLDivElement>(null)
  const active = useActiveMotion(rootRef)

  const [lines, setLines] = useState<DraftLine[]>(INITIAL_LINES)
  const [place, setPlace] = useState(INITIAL_PLACE)
  const [pick, setPick] = useState(SAMPLE_CATALOGUE[0].id)
  const [status, setStatus] = useState<QuoteStatus>('Draft')
  const [simulating, setSimulating] = useState(false)
  const [notice, setNotice] = useState('')
  const nextId = useRef(1)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const quote = useMemo(
    () => computeQuote(lines, { sellerState: SELLER.state, placeOfSupply: place }),
    [lines, place],
  )

  const [versions, setVersions] = useState<QuoteVersion[]>(() => [
    { v: 1, lines: INITIAL_LINES.length, total: quote.grandTotal, placeOfSupply: INITIAL_PLACE, note: 'Initial quotation' },
  ])
  const [savedSig, setSavedSig] = useState(() => signature(INITIAL_LINES, INITIAL_PLACE))
  const sig = signature(lines, place)

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }, [])
  useEffect(() => clearTimers, [clearTimers])

  /** Any edit after the quotation left Draft sends it back to Draft, as a revision would. */
  const touched = useCallback(() => {
    clearTimers()
    setSimulating(false)
    if (status !== 'Draft') setNotice('Edited after sending, so the quotation is back to Draft.')
    setStatus('Draft')
  }, [clearTimers, status])

  const updateField = (id: string, field: DraftField, raw: string) => {
    touched()
    setLines((ls) =>
      ls.map((l) => {
        if (l.id !== id) return l
        const next = { ...l, text: { ...l.text, [field]: raw } }
        // Commit the number only when it is valid; otherwise keep the last valid value.
        if (!validateField(field, raw)) next[field] = Number(raw.trim())
        return next
      }),
    )
  }

  const updateRate = (id: string, rate: GstRate) => {
    touched()
    setLines((ls) => ls.map((l) => (l.id === id ? { ...l, gstRate: rate } : l)))
  }

  const removeLine = (id: string) => {
    touched()
    setLines((ls) => ls.filter((l) => l.id !== id))
  }

  const addLine = () => {
    const item = SAMPLE_CATALOGUE.find((c) => c.id === pick)
    if (!item) return
    touched()
    const id = `${item.id}-${nextId.current++}`
    setLines((ls) => [
      ...ls,
      toDraft(
        { id, name: item.name, code: item.code, codeType: item.codeType, qty: 1, unitPrice: item.unitPrice, discountPct: 0, gstRate: item.gstRate },
        item.unit,
      ),
    ])
  }

  const changePlace = (p: string) => {
    touched()
    setPlace(p)
  }

  const simulate = () => {
    clearTimers()
    setNotice('')
    const from = STATUSES.indexOf(status)
    const finish = () => {
      setSimulating(false)
      track('demo_completed', { demo: 'quotation' })
    }
    if (!active) {
      // Reduced motion or off screen: show the outcome without stepping.
      setStatus('Approved')
      finish()
      return
    }
    setSimulating(true)
    STATUSES.slice(from + 1).forEach((s, i, arr) => {
      timers.current.push(
        setTimeout(() => {
          setStatus(s)
          if (i === arr.length - 1) finish()
        }, 700 * (i + 1)),
      )
    })
  }

  // If the section leaves the screen mid-simulation, finish it instantly rather than run unseen timers.
  useEffect(() => {
    if (!active && simulating) {
      clearTimers()
      setStatus('Approved')
      setSimulating(false)
      track('demo_completed', { demo: 'quotation' })
    }
  }, [active, simulating, clearTimers])

  const saveVersion = () => {
    const prev = versions[versions.length - 1]
    const delta = quote.grandTotal - prev.total
    const v = prev.v + 1
    setVersions((vs) => [
      ...vs,
      {
        v,
        lines: lines.length,
        total: quote.grandTotal,
        placeOfSupply: place,
        note: delta === 0 ? 'Revised, same total' : `Revised, ${delta > 0 ? '+' : '−'}${formatINR(Math.abs(delta))}`,
      },
    ])
    setSavedSig(sig)
    setNotice(`Saved as version ${v}.`)
  }

  const inter = quote.interState
  const currentVersion = sig === savedSig ? versions[versions.length - 1].v : versions[versions.length - 1].v + 1

  return (
    <section aria-labelledby="quote-heading" className="shell py-16 lg:py-24">
      <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          id="quote-heading"
          align="left"
          kicker="GST quotations"
          title="Professional quotations. Without the paperwork."
          lede="Pick items, change quantities, discounts and GST rates, and watch the quotation, tax split and total update as you type. EZCRM builds quotations from your catalogue with HSN/SAC codes on every line."
        />
        <SampleBadge />
      </div>

      <div ref={rootRef} className="mt-10 grid gap-8 lg:mt-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-10">
        {/* ── controls ── */}
        <div className="min-w-0">
          <div className="rounded-card border border-line bg-sky/40 p-4 sm:p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-slate">Seller state</p>
                <p className="mt-1 flex h-10 items-center rounded-chip border border-line bg-white/60 px-3 text-sm text-ink">
                  {SELLER.state}
                </p>
              </div>
              <div>
                <label htmlFor="quote-place" className="block text-xs font-semibold text-slate">
                  Place of supply
                </label>
                <select
                  id="quote-place"
                  value={place}
                  onChange={(e) => changePlace(e.target.value)}
                  aria-describedby="quote-place-note"
                  className="mt-1 h-10 w-full rounded-chip border border-line bg-white px-2 text-sm text-ink focus:border-brand"
                >
                  {STATE_NAMES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p id="quote-place-note" className="mt-3 text-xs leading-relaxed text-slate">
              {inter ? (
                <>
                  <span className="font-semibold text-ink">Inter-state supply: IGST.</span> The seller is in{' '}
                  {SELLER.state} and the place of supply is {place}, so the full GST rate is charged as IGST.
                </>
              ) : (
                <>
                  <span className="font-semibold text-ink">Intra-state supply: CGST + SGST.</span> Seller and place
                  of supply are both {SELLER.state}, so each rate splits in half (18% becomes 9% CGST + 9% SGST).
                </>
              )}
            </p>
          </div>

          <h3 className="mt-6 text-sm font-semibold text-ink">
            Line items <span className="font-normal text-slate">({lines.length})</span>
          </h3>
          {lines.length === 0 ? (
            <p className="mt-3 rounded-chip border border-dashed border-line p-4 text-sm text-slate">
              All lines removed. Add an item from the sample catalogue below.
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {lines.map((l, i) => (
                <LineEditor
                  key={l.id}
                  line={l}
                  index={i}
                  result={quote.lines.find((r) => r.id === l.id)}
                  onField={(f, raw) => updateField(l.id, f, raw)}
                  onRate={(r) => updateRate(l.id, r)}
                  onRemove={() => removeLine(l.id)}
                />
              ))}
            </ul>
          )}

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <label htmlFor="quote-add" className="block text-xs font-semibold text-slate">
                Add from sample catalogue
              </label>
              <select
                id="quote-add"
                value={pick}
                onChange={(e) => setPick(e.target.value)}
                className="mt-1 h-10 w-full min-w-0 rounded-chip border border-line bg-white px-2 text-sm text-ink focus:border-brand"
              >
                {SAMPLE_CATALOGUE.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} · {c.codeType} {c.code} · {formatINR(c.unitPrice)}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={addLine}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-full bg-btn-ink px-4 text-sm font-semibold text-white transition-colors duration-fast hover:bg-brand"
            >
              <Plus className="h-4 w-4" aria-hidden /> Add line
            </button>
          </div>

          <p className="mt-6 rounded-chip border border-line bg-white p-3 text-xs leading-relaxed text-slate">
            Illustrative calculation. Not tax advice; GST rates depend on your product and classification.
          </p>
        </div>

        {/* ── preview ── */}
        <div className="min-w-0 space-y-4 lg:sticky lg:top-24 lg:self-start">
          <AppWindow
            title={`${JOURNEY_QUOTE_NUMBER} · preview`}
            right={
              <span className="font-mono text-xs font-semibold tabular-nums text-ink">{formatINR(quote.grandTotal)}</span>
            }
          >
            <QuoteDocument
              lines={lines}
              quote={quote}
              placeOfSupply={place}
              version={currentVersion}
              status={sig === savedSig ? status : `${status} · unsaved changes`}
            />
          </AppWindow>

          <ApprovalPanel
            status={status}
            simulating={simulating}
            onSimulate={simulate}
            onReset={() => {
              clearTimers()
              setStatus('Draft')
              setNotice('')
            }}
            versions={versions}
            canSave={sig !== savedSig}
            onSave={saveVersion}
          />
          {notice ? <p className="text-xs font-medium text-slate">{notice}</p> : null}
        </div>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        Grand total {formatINR(quote.grandTotal)}, including{' '}
        {inter ? `IGST ${formatINR(quote.igst, { paise: true })}` : `CGST and SGST ${formatINR(quote.cgst + quote.sgst, { paise: true })}`}.
      </p>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        Quotation status: {status}. {notice}
      </p>
    </section>
  )
}
