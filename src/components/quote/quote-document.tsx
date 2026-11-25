'use client'

/**
 * The quotation as the customer would receive it: seller and buyer blocks,
 * line table with HSN/SAC, GST breakdown by slab, totals and the amount in
 * words. Purely presentational: every figure comes from computeQuote.
 *
 * The line table is a real <table> that collapses to two columns (item,
 * amount) so it fits a 320px screen without horizontal scrolling.
 */

import { formatINR, type QuoteResult } from '@/lib/gst'
import { JOURNEY_CUSTOMER, JOURNEY_QUOTE_NUMBER, SELLER } from '@/demo/sample-data'
import { cn } from '@/lib/utils'
import { formatDemoDate, rupeesInWords, type DraftLine } from './catalogue'

const money = (n: number) => formatINR(n, { paise: true })

export function QuoteDocument({
  lines,
  quote,
  placeOfSupply,
  version,
  status,
}: {
  lines: DraftLine[]
  quote: QuoteResult
  placeOfSupply: string
  version: number
  status: string
}) {
  const byId = new Map(quote.lines.map((l) => [l.id, l]))
  const inter = quote.interState

  return (
    <article aria-label={`Quotation ${JOURNEY_QUOTE_NUMBER} preview`} className="bg-white p-4 text-ink sm:p-6">
      {/* letterhead */}
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-4">
        <div className="min-w-0">
          <p className="font-display text-lg font-extrabold tracking-tight">{SELLER.name}</p>
          <p className="mt-0.5 text-xs text-slate">{SELLER.state}, India</p>
          <p className="mt-0.5 font-mono text-xs text-slate">GSTIN {SELLER.gstin}</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="kicker">Quotation</p>
          <p className="font-mono text-sm font-semibold">
            {JOURNEY_QUOTE_NUMBER} <span className="text-slate">· v{version}</span>
          </p>
          <p className="mt-0.5 font-mono text-xs text-slate">Date {formatDemoDate()}</p>
          <p className="font-mono text-xs text-slate">Valid till {formatDemoDate(undefined, 15)}</p>
        </div>
      </header>

      <div className="grid gap-4 border-b border-line py-4 text-xs sm:grid-cols-2">
        <div>
          <p className="font-semibold uppercase tracking-wide text-slate">Bill to</p>
          <p className="mt-1 text-sm font-semibold">{JOURNEY_CUSTOMER.company}</p>
          <p className="text-slate">
            Attn. {JOURNEY_CUSTOMER.name}, {JOURNEY_CUSTOMER.city}
          </p>
        </div>
        <div className="sm:text-right">
          <p className="font-semibold uppercase tracking-wide text-slate">Place of supply</p>
          <p className="mt-1 text-sm font-semibold">{placeOfSupply}</p>
          <p className="text-slate">{inter ? 'Inter-state · IGST' : 'Intra-state · CGST + SGST'}</p>
        </div>
      </div>

      {/* lines */}
      <table className="mt-4 w-full table-fixed text-xs">
        <caption className="sr-only">Quotation lines</caption>
        <thead>
          <tr className="border-b border-line text-left text-slate">
            <th scope="col" className="pb-2 font-semibold">
              Item
            </th>
            <th scope="col" className="hidden w-[84px] pb-2 text-right font-semibold sm:table-cell">
              Taxable
            </th>
            <th scope="col" className="w-[96px] pb-2 text-right font-semibold sm:w-[104px]">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {lines.length === 0 ? (
            <tr>
              <td colSpan={3} className="py-6 text-center text-slate">
                No lines yet. Add an item from the catalogue.
              </td>
            </tr>
          ) : null}
          {lines.map((l, i) => {
            const r = byId.get(l.id)
            return (
              <tr key={l.id} className="border-b border-line/70 align-top">
                <td className="py-2 pr-2">
                  <p className="font-semibold">
                    <span className="font-mono text-slate">{i + 1}.</span> {l.name}
                  </p>
                  <p className="mt-0.5 font-mono tabular-nums text-slate">
                    {l.codeType} {l.code} · {l.qty} {l.unit} × {money(l.unitPrice)}
                    {l.discountPct ? ` · −${l.discountPct}%` : ''} · GST {l.gstRate}%
                  </p>
                </td>
                <td className="hidden py-2 text-right font-mono tabular-nums sm:table-cell">
                  {r ? money(r.taxable) : null}
                </td>
                <td className="py-2 text-right font-mono font-semibold tabular-nums">{r ? money(r.total) : null}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {/* tax table by slab: two columns so it fits narrow screens */}
        <table className="w-full self-start text-xs">
          <caption className="mb-1 text-left font-semibold uppercase tracking-wide text-slate">GST breakdown</caption>
          <thead className="sr-only">
            <tr>
              <th scope="col">Component</th>
              <th scope="col">Amount</th>
            </tr>
          </thead>
          {quote.bySlab.map((s) => (
            <tbody key={s.rate} className="border-b border-line/70 font-mono tabular-nums">
              <tr>
                <th scope="row" className="pt-1.5 text-left font-semibold">
                  {s.rate}% slab, taxable
                </th>
                <td className="pt-1.5 text-right">{money(s.taxable)}</td>
              </tr>
              {inter ? (
                <tr>
                  <th scope="row" className="pb-1.5 text-left font-normal text-slate">
                    IGST @ {s.rate}%
                  </th>
                  <td className="pb-1.5 text-right">{money(s.tax)}</td>
                </tr>
              ) : (
                <>
                  {/* CGST and SGST are equal on every line, so each is half the slab tax. */}
                  <tr>
                    <th scope="row" className="text-left font-normal text-slate">
                      CGST @ {s.rate / 2}%
                    </th>
                    <td className="text-right">{money(s.tax / 2)}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="pb-1.5 text-left font-normal text-slate">
                      SGST @ {s.rate / 2}%
                    </th>
                    <td className="pb-1.5 text-right">{money(s.tax / 2)}</td>
                  </tr>
                </>
              )}
            </tbody>
          ))}
        </table>

        {/* totals */}
        <dl className="text-xs">
          <Row label="Subtotal (gross)" value={money(quote.gross)} />
          <Row label="Discount" value={quote.discount ? `−${money(quote.discount)}` : money(0)} />
          <Row label="Taxable amount" value={money(quote.taxable)} strong />
          {inter ? (
            <Row label="IGST" value={money(quote.igst)} />
          ) : (
            <>
              <Row label="CGST" value={money(quote.cgst)} />
              <Row label="SGST" value={money(quote.sgst)} />
            </>
          )}
          <Row label="Round off" value={`${quote.roundOff < 0 ? '−' : '+'}${money(Math.abs(quote.roundOff))}`} />
          <div className="mt-2 flex items-baseline justify-between gap-3 rounded-chip bg-sky px-3 py-2">
            <dt className="text-sm font-bold">Grand total</dt>
            <dd className="font-mono text-base font-extrabold tabular-nums text-brand-deep">
              {formatINR(quote.grandTotal)}
            </dd>
          </div>
        </dl>
      </div>

      <p className="mt-4 border-t border-line pt-3 text-xs text-slate">
        <span className="font-semibold text-ink">Amount in words: </span>
        {rupeesInWords(quote.grandTotal)}
      </p>
      <p className="mt-2 text-xs text-slate">Status: {status}</p>
    </article>
  )
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={cn('flex items-baseline justify-between gap-3 py-1', strong && 'border-t border-line pt-1.5')}>
      <dt className={cn(strong ? 'font-semibold text-ink' : 'text-slate')}>{label}</dt>
      <dd className={cn('font-mono tabular-nums', strong && 'font-semibold')}>{value}</dd>
    </div>
  )
}
