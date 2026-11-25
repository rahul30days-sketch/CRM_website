'use client'

/**
 * Quotation module: a GST quotation for the selected deal, calculated by the
 * shared computeQuote (Maharashtra seller; intra-state → CGST + SGST,
 * inter-state → IGST). Inputs keep their raw text locally so typing is never
 * fought by number parsing; parsed lines are saved to the store as you type.
 * "Send" adds a PDF card to the WhatsApp thread; "Mark quote accepted" moves
 * the deal to Won at the grand total, which the Dashboard picks up.
 */

import * as React from 'react'
import { CheckCircle2, Plus, Send, Trash2 } from 'lucide-react'
import { GST_RATES, computeQuote, formatINR, type GstRate, type QuoteLine } from '@/lib/gst'
import { cn } from '@/lib/utils'
import { INDIA_STATES, SELLER } from '@/demo/sample-data'
import { Hint, LeadPicker, ModuleHeader, Panel, StageChip, brandBtn, fieldClass, labelClass, smallBtn } from './ui'
import { quoteFor, usePlayground, useSelection, type PgDeal } from './store'

const STATES = [...INDIA_STATES.map((s) => s.name)].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))

interface DraftLine {
  id: string
  name: string
  code: string
  codeType: QuoteLine['codeType']
  qty: string
  unitPrice: string
  discountPct: string
  gstRate: GstRate
}

const toDraft = (l: QuoteLine): DraftLine => ({
  ...l,
  qty: String(l.qty),
  unitPrice: String(l.unitPrice),
  discountPct: String(l.discountPct),
})

function lineErrors(l: DraftLine) {
  const e: Partial<Record<'name' | 'qty' | 'unitPrice' | 'discountPct', string>> = {}
  const qty = Number(l.qty)
  const price = Number(l.unitPrice)
  const disc = Number(l.discountPct)
  if (!l.name.trim()) e.name = 'Add a description.'
  if (!l.qty.trim() || !Number.isInteger(qty) || qty < 1 || qty > 10000) e.qty = 'Whole number, 1 to 10,000.'
  if (!l.unitPrice.trim() || !Number.isFinite(price) || price < 0 || price > 10000000) e.unitPrice = '0 to ₹1 crore.'
  if (l.discountPct.trim() && (!Number.isFinite(disc) || disc < 0 || disc > 100)) e.discountPct = '0 to 100%.'
  return e
}

const toLine = (l: DraftLine): QuoteLine => ({
  id: l.id,
  name: l.name,
  code: l.code,
  codeType: l.codeType,
  qty: Number(l.qty) || 0,
  unitPrice: Number(l.unitPrice) || 0,
  discountPct: Number(l.discountPct) || 0,
  gstRate: l.gstRate,
})

function QuoteEditor({ deal }: { deal: PgDeal }) {
  const { state, dispatch, navigate } = usePlayground()
  const quote = quoteFor(state, deal.id)
  const locked = quote.status === 'accepted'
  const [lines, setLines] = React.useState<DraftLine[]>(() => quote.lines.map(toDraft))
  const [pos, setPos] = React.useState(quote.placeOfSupply)
  const [lineSeq, setLineSeq] = React.useState(quote.lines.length + 1)

  const save = (next: DraftLine[], nextPos = pos) => {
    setLines(next)
    setPos(nextPos)
    dispatch({ type: 'SAVE_QUOTE', dealId: deal.id, lines: next.map(toLine), placeOfSupply: nextPos })
  }
  const edit = (id: string, patch: Partial<DraftLine>) => save(lines.map((l) => (l.id === id ? { ...l, ...patch } : l)))

  const errors = lines.map(lineErrors)
  const invalid = errors.some((e) => Object.keys(e).length > 0) || lines.length === 0
  const result = computeQuote(lines.map(toLine), { sellerState: SELLER.state, placeOfSupply: pos })

  const num = (l: DraftLine, i: number, k: 'qty' | 'unitPrice' | 'discountPct', label: string) => {
    const err = errors[i][k]
    const id = `pg-q-${l.id}-${k}`
    return (
      <div className="min-w-0">
        <label htmlFor={id} className={labelClass}>
          {label}
        </label>
        <input
          id={id}
          className={cn(fieldClass, 'font-mono')}
          inputMode={k === 'qty' ? 'numeric' : 'decimal'}
          value={l[k]}
          disabled={locked}
          onChange={(e) => edit(l.id, { [k]: e.target.value })}
          aria-invalid={err ? true : undefined}
          aria-describedby={err ? `${id}-err` : undefined}
        />
        {err ? (
          <p id={`${id}-err`} className="mt-1 text-[0.6875rem] font-medium text-due">
            {err}
          </p>
        ) : null}
      </div>
    )
  }

  const row = (label: string, value: number, opts: { strong?: boolean; sign?: string } = {}) => (
    <div className={cn('flex items-center justify-between gap-4 py-1', opts.strong && 'border-t border-line pt-2.5')}>
      <dt className={cn('text-sm', opts.strong ? 'font-semibold text-ink' : 'text-slate')}>{label}</dt>
      <dd className={cn('font-mono tabular-nums', opts.strong ? 'text-lg font-semibold text-ink' : 'text-sm text-ink')}>
        {opts.sign ?? ''}
        {formatINR(Math.abs(value), { paise: !opts.strong })}
      </dd>
    </div>
  )

  return (
    <div className="grid gap-4 xl:grid-cols-[3fr_2fr]">
      <Panel
        title={`Quotation ${quote.number}`}
        right={
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-[0.6875rem] font-bold uppercase tracking-wide',
              quote.status === 'accepted' ? 'bg-won/10 text-won' : quote.status === 'sent' ? 'bg-brand/10 text-brand-deep' : 'bg-sky text-slate',
            )}
          >
            {quote.status === 'accepted' ? 'Accepted' : quote.status === 'sent' ? 'Sent' : 'Draft'}
          </span>
        }
      >
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-chip bg-sky/50 px-3 py-2">
            <p className="text-xs font-semibold text-slate">From</p>
            <p className="font-semibold text-ink">{SELLER.name}</p>
            <p className="text-xs text-slate">
              {SELLER.state} · GSTIN <span className="font-mono">{SELLER.gstin}</span>
            </p>
          </div>
          <div className="rounded-chip bg-sky/50 px-3 py-2">
            <p className="text-xs font-semibold text-slate">To</p>
            <p className="font-semibold text-ink">{deal.company}</p>
            <p className="flex items-center gap-2 text-xs text-slate">
              {deal.contact} · {deal.city} <StageChip stage={deal.stage} />
            </p>
          </div>
        </div>

        <div className="mt-3 max-w-xs">
          <label htmlFor="pg-q-pos" className={labelClass}>
            Place of supply
          </label>
          <select id="pg-q-pos" className={fieldClass} value={pos} disabled={locked} onChange={(e) => save(lines, e.target.value)}>
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate">
            {result.interState ? 'Inter-state supply: IGST applies.' : 'Intra-state supply: CGST + SGST apply.'}
          </p>
        </div>

        <ol className="mt-4 space-y-3" aria-label="Quotation lines">
          {lines.map((l, i) => {
            const r = result.lines[i]
            const nameId = `pg-q-${l.id}-name`
            return (
              <li key={l.id} className="rounded-chip border border-line p-3">
                <div className="flex items-end gap-2">
                  <div className="min-w-0 flex-1">
                    <label htmlFor={nameId} className={labelClass}>
                      Item {i + 1}
                      {l.code ? (
                        <span className="ml-1 font-mono font-normal text-slate">
                          {l.codeType} {l.code}
                        </span>
                      ) : null}
                    </label>
                    <input
                      id={nameId}
                      className={fieldClass}
                      value={l.name}
                      disabled={locked}
                      onChange={(e) => edit(l.id, { name: e.target.value })}
                      aria-invalid={errors[i].name ? true : undefined}
                      aria-describedby={errors[i].name ? `${nameId}-err` : undefined}
                    />
                  </div>
                  <button
                    type="button"
                    className={cn(smallBtn, 'w-10 shrink-0 px-0')}
                    disabled={locked || lines.length === 1}
                    onClick={() => save(lines.filter((x) => x.id !== l.id))}
                    aria-label={`Remove item ${i + 1}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </div>
                {errors[i].name ? (
                  <p id={`${nameId}-err`} className="mt-1 text-[0.6875rem] font-medium text-due">
                    {errors[i].name}
                  </p>
                ) : null}
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {num(l, i, 'qty', 'Qty')}
                  {num(l, i, 'unitPrice', 'Unit price (₹)')}
                  {num(l, i, 'discountPct', 'Discount %')}
                  <div className="min-w-0">
                    <label htmlFor={`pg-q-${l.id}-gst`} className={labelClass}>
                      GST rate
                    </label>
                    <select
                      id={`pg-q-${l.id}-gst`}
                      className={cn(fieldClass, 'font-mono')}
                      value={l.gstRate}
                      disabled={locked}
                      onChange={(e) => edit(l.id, { gstRate: Number(e.target.value) as GstRate })}
                    >
                      {GST_RATES.map((g) => (
                        <option key={g} value={g}>
                          {g}%
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {r ? (
                  <p className="mt-2 text-right text-xs text-slate">
                    Taxable <span className="font-mono text-ink">{formatINR(r.taxable, { paise: true })}</span> · Line total{' '}
                    <span className="font-mono font-semibold text-ink">{formatINR(r.total, { paise: true })}</span>
                  </p>
                ) : null}
              </li>
            )
          })}
        </ol>
        <button
          type="button"
          className={cn(smallBtn, 'mt-3')}
          disabled={locked || lines.length >= 8}
          onClick={() => {
            setLineSeq(lineSeq + 1)
            save([
              ...lines,
              { id: `nl${lineSeq}`, name: '', code: '', codeType: 'HSN', qty: '1', unitPrice: '0', discountPct: '0', gstRate: 18 },
            ])
          }}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add line
        </button>
      </Panel>

      <div className="space-y-4">
        <Panel title="Totals">
          <dl>
            {row('Gross', result.gross)}
            {result.discount > 0 ? row('Discount', result.discount, { sign: '− ' }) : null}
            {row('Taxable value', result.taxable)}
            {result.interState ? row('IGST', result.igst) : (
              <>
                {row('CGST', result.cgst)}
                {row('SGST', result.sgst)}
              </>
            )}
            {result.roundOff !== 0 ? row('Round off', result.roundOff, { sign: result.roundOff < 0 ? '− ' : '+ ' }) : null}
            {row('Grand total', result.grandTotal, { strong: true })}
          </dl>
          <div className="mt-4 grid gap-2">
            <button
              type="button"
              className={smallBtn}
              disabled={locked || invalid}
              onClick={() => dispatch({ type: 'SEND_QUOTE', dealId: deal.id })}
            >
              <Send className="h-4 w-4" aria-hidden />
              {quote.status === 'sent' ? 'Send again on WhatsApp' : 'Send on WhatsApp'}
              <span className="text-xs font-normal text-slate">(simulated)</span>
            </button>
            <button
              type="button"
              className={cn(brandBtn, 'bg-won hover:bg-won/90')}
              disabled={locked || invalid || deal.stage === 'won'}
              onClick={() => dispatch({ type: 'ACCEPT_QUOTE', dealId: deal.id })}
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              Mark quote accepted
            </button>
          </div>
          {locked ? (
            <p className="mt-3 rounded-chip bg-won/10 px-3 py-2 text-sm text-won">
              Accepted. {deal.company} is Won at <span className="font-mono font-semibold">{formatINR(result.grandTotal)}</span>.{' '}
              <button type="button" className="font-semibold underline underline-offset-2" onClick={() => navigate('dashboard')}>
                See the dashboard
              </button>
            </p>
          ) : deal.stage === 'won' ? (
            <p className="mt-3 text-xs text-slate">This deal is already Won in the pipeline.</p>
          ) : invalid ? (
            <p className="mt-3 text-xs font-medium text-due">Fix the highlighted fields to send or accept.</p>
          ) : null}
        </Panel>
        <Hint>Change the place of supply to another state and the tax switches from CGST + SGST to IGST.</Hint>
      </div>
    </div>
  )
}

export function QuotationModule() {
  const { state } = usePlayground()
  const { deal } = useSelection()
  return (
    <div>
      <ModuleHeader
        title="Quotation"
        description="Build a GST quotation for the selected deal. Totals follow Indian invoice rules; the numbers are sample data, not tax advice."
        actions={<LeadPicker id="pg-quote-lead" label="Quotation for" className="w-full sm:w-72" />}
      />
      {deal ? <QuoteEditor key={`${deal.id}-${state.epoch}`} deal={deal} /> : null}
    </div>
  )
}
