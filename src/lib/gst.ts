/**
 * GST quotation maths — the single implementation every demo uses
 * (homepage quotation builder, lead lifecycle, /experience playground).
 *
 * Rules (illustrative, not tax advice):
 *  - Taxable value per line = qty × unit price − line discount.
 *  - Intra-state supply (seller state = place of supply): CGST + SGST, each
 *    half the rate. Inter-state: IGST at the full rate.
 *  - Amounts are kept in paise internally to avoid floating-point drift;
 *    each tax component is rounded per line, then summed.
 *  - Grand total is rounded to the nearest rupee; the difference is shown as
 *    "Round off", as Indian invoices do.
 */

export type GstRate = 0 | 5 | 12 | 18 | 28

export const GST_RATES: GstRate[] = [0, 5, 12, 18, 28]

export interface QuoteLine {
  id: string
  name: string
  /** HSN for goods, SAC for services. */
  code: string
  codeType: 'HSN' | 'SAC'
  qty: number
  /** Unit price in rupees, before tax. */
  unitPrice: number
  /** Line discount as a percentage of qty × unit price (0–100). */
  discountPct: number
  gstRate: GstRate
}

export interface LineResult {
  id: string
  gross: number
  discount: number
  taxable: number
  cgst: number
  sgst: number
  igst: number
  total: number
}

export interface QuoteResult {
  lines: LineResult[]
  gross: number
  discount: number
  taxable: number
  cgst: number
  sgst: number
  igst: number
  taxTotal: number
  /** Before rounding to the rupee. */
  exactTotal: number
  roundOff: number
  grandTotal: number
  interState: boolean
  /** Taxable value and tax per rate slab, for the tax breakdown table. */
  bySlab: { rate: GstRate; taxable: number; tax: number }[]
}

const toPaise = (rupees: number) => Math.round(rupees * 100)
const fromPaise = (paise: number) => paise / 100

export function computeQuote(
  lines: QuoteLine[],
  opts: { sellerState: string; placeOfSupply: string },
): QuoteResult {
  const interState = opts.sellerState.trim().toLowerCase() !== opts.placeOfSupply.trim().toLowerCase()
  const slabs = new Map<GstRate, { taxable: number; tax: number }>()

  const results = lines.map((l) => {
    const qty = Math.max(0, l.qty)
    const gross = toPaise(qty * Math.max(0, l.unitPrice))
    const discount = Math.round((gross * clamp(l.discountPct, 0, 100)) / 100)
    const taxable = gross - discount
    let cgst = 0
    let sgst = 0
    let igst = 0
    if (interState) {
      igst = Math.round((taxable * l.gstRate) / 100)
    } else {
      // Half rate each, rounded independently (e.g. 9% + 9% for 18%).
      cgst = Math.round((taxable * l.gstRate) / 200)
      sgst = cgst
    }
    const tax = cgst + sgst + igst
    const slab = slabs.get(l.gstRate) ?? { taxable: 0, tax: 0 }
    slab.taxable += taxable
    slab.tax += tax
    slabs.set(l.gstRate, slab)
    return { id: l.id, gross, discount, taxable, cgst, sgst, igst, total: taxable + tax }
  })

  const sum = (k: keyof Omit<LineResult, 'id'>) => results.reduce((s, r) => s + r[k], 0)
  const exact = sum('total')
  const rounded = Math.round(exact / 100) * 100

  return {
    lines: results.map((r) => ({
      id: r.id,
      gross: fromPaise(r.gross),
      discount: fromPaise(r.discount),
      taxable: fromPaise(r.taxable),
      cgst: fromPaise(r.cgst),
      sgst: fromPaise(r.sgst),
      igst: fromPaise(r.igst),
      total: fromPaise(r.total),
    })),
    gross: fromPaise(sum('gross')),
    discount: fromPaise(sum('discount')),
    taxable: fromPaise(sum('taxable')),
    cgst: fromPaise(sum('cgst')),
    sgst: fromPaise(sum('sgst')),
    igst: fromPaise(sum('igst')),
    taxTotal: fromPaise(sum('cgst') + sum('sgst') + sum('igst')),
    exactTotal: fromPaise(exact),
    roundOff: fromPaise(rounded - exact),
    grandTotal: fromPaise(rounded),
    interState,
    bySlab: [...slabs.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([rate, v]) => ({ rate, taxable: fromPaise(v.taxable), tax: fromPaise(v.tax) })),
  }
}

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, Number.isFinite(n) ? n : 0))
}

/** ₹ with Indian digit grouping. `paise: true` shows two decimals. */
export function formatINR(n: number, opts: { paise?: boolean } = {}) {
  return (
    '₹' +
    new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: opts.paise ? 2 : 0,
      maximumFractionDigits: opts.paise ? 2 : 0,
    }).format(n)
  )
}

/** Compact ₹ for KPIs: ₹2.1L, ₹1.35Cr. */
export function formatINRCompact(n: number) {
  if (n >= 1e7) return `₹${trim(n / 1e7)}Cr`
  if (n >= 1e5) return `₹${trim(n / 1e5)}L`
  if (n >= 1e3) return `₹${trim(n / 1e3)}K`
  return formatINR(n)
}

function trim(x: number) {
  return x >= 100 ? x.toFixed(0) : x >= 10 ? x.toFixed(1).replace(/\.0$/, '') : x.toFixed(2).replace(/\.?0+$/, '')
}
