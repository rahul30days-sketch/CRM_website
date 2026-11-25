/**
 * Sample catalogue and helpers for the homepage quotation simulation.
 *
 * Items are illustrative. HSN/SAC chapters are real (8413 pumps, 3917 plastic
 * pipes, 8501 electric motors, 8481 valves, SAC 9987 installation and
 * maintenance services), but the GST rate a business charges depends on its
 * exact classification, so every rate stays editable in the demo.
 */

import type { GstRate, QuoteLine } from '@/lib/gst'
import { DEMO_TODAY, INDIA_STATES } from '@/demo/sample-data'

export interface CatalogueItem {
  id: string
  name: string
  code: string
  codeType: 'HSN' | 'SAC'
  unitPrice: number
  gstRate: GstRate
  unit: string
}

export const SAMPLE_CATALOGUE: CatalogueItem[] = [
  {
    id: 'mono',
    name: 'Centrifugal monoblock pump 2 HP',
    code: '8413',
    codeType: 'HSN',
    unitPrice: 14800,
    gstRate: 18,
    unit: 'pc',
  },
  {
    id: 'pipe',
    name: 'uPVC pipe 75 mm, 6 m length',
    code: '3917',
    codeType: 'HSN',
    unitPrice: 1450,
    gstRate: 18,
    unit: 'length',
  },
  {
    id: 'motor',
    name: 'Induction motor 5 HP, 3-phase',
    code: '8501',
    codeType: 'HSN',
    unitPrice: 21500,
    gstRate: 18,
    unit: 'pc',
  },
  {
    id: 'valve',
    name: 'Brass ball valve 50 mm',
    code: '8481',
    codeType: 'HSN',
    unitPrice: 1180,
    gstRate: 18,
    unit: 'pc',
  },
  {
    id: 'site',
    name: 'Site installation visit',
    code: '9987',
    codeType: 'SAC',
    unitPrice: 3500,
    gstRate: 18,
    unit: 'visit',
  },
  {
    id: 'amc',
    name: 'Annual maintenance contract (1 year)',
    code: '9987',
    codeType: 'SAC',
    unitPrice: 12000,
    gstRate: 18,
    unit: 'year',
  },
]

/** State names for the place-of-supply select, alphabetical (non-locale sort). */
export const STATE_NAMES: string[] = INDIA_STATES.map((s) => s.name).sort((a, b) =>
  a < b ? -1 : a > b ? 1 : 0,
)

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "2026-11-24" (+ offset days) → "24 Nov 2026", computed in UTC so SSR and client agree. */
export function formatDemoDate(iso: string = DEMO_TODAY, addDays = 0) {
  const [y, m, d] = iso.split('-').map(Number)
  const t = new Date(Date.UTC(y, m - 1, d + addDays))
  return `${t.getUTCDate()} ${MONTHS[t.getUTCMonth()]} ${t.getUTCFullYear()}`
}

/* ─── Amount in words, Indian numbering (lakh / crore) ──────────────────── */

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen',
]
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

function twoDigits(n: number) {
  if (n < 20) return ONES[n]
  const t = TENS[Math.floor(n / 10)]
  return n % 10 ? `${t}-${ONES[n % 10]}` : t
}

function threeDigits(n: number) {
  const h = Math.floor(n / 100)
  const rest = n % 100
  return [h ? `${ONES[h]} Hundred` : '', rest ? twoDigits(rest) : ''].filter(Boolean).join(' ')
}

/** Whole rupees in words: 211338 → "Rupees Two Lakh Eleven Thousand Three Hundred Thirty-Eight Only". */
export function rupeesInWords(amount: number) {
  let n = Math.round(Math.abs(amount))
  if (n === 0) return 'Rupees Zero Only'
  const parts: string[] = []
  const crore = Math.floor(n / 1e7)
  n %= 1e7
  const lakh = Math.floor(n / 1e5)
  n %= 1e5
  const thousand = Math.floor(n / 1e3)
  n %= 1e3
  // Crores above 99 are themselves grouped the Indian way (e.g. "One Hundred Twenty Crore").
  if (crore) parts.push(`${crore >= 100 ? rupeesInWords(crore).slice(7, -5) : twoDigits(crore)} Crore`)
  if (lakh) parts.push(`${twoDigits(lakh)} Lakh`)
  if (thousand) parts.push(`${twoDigits(thousand)} Thousand`)
  if (n) parts.push(threeDigits(n))
  return `Rupees ${parts.join(' ')} Only`
}

/* ─── Editable line state ───────────────────────────────────────────────── */

export type DraftField = 'qty' | 'unitPrice' | 'discountPct'

/** A line as the visitor edits it: the committed numbers plus the raw text in each field. */
export interface DraftLine extends QuoteLine {
  text: Record<DraftField, string>
  unit: string
}

export function toDraft(line: QuoteLine, unit = 'pc'): DraftLine {
  return {
    ...line,
    unit,
    text: { qty: String(line.qty), unitPrice: String(line.unitPrice), discountPct: String(line.discountPct) },
  }
}

/** Returns an error message, or null when the raw text is a valid value for the field. */
export function validateField(field: DraftField, raw: string): string | null {
  const s = raw.trim()
  if (s === '') return 'Enter a number.'
  if (s.startsWith('-')) {
    return field === 'qty'
      ? 'Quantity must be 0 or more.'
      : field === 'unitPrice'
        ? 'Price must be 0 or more.'
        : 'Discount must be between 0 and 100.'
  }
  if (!/^\d*\.?\d*$/.test(s) || s === '.') return 'Use digits only, for example 12 or 12.5.'
  const n = Number(s)
  if (field === 'qty' && !Number.isInteger(n)) return 'Quantity must be a whole number.'
  if (field === 'discountPct' && n > 100) return 'Discount must be between 0 and 100.'
  if (field === 'unitPrice' && n > 1e8) return 'Price looks too large for this demo.'
  if (field === 'qty' && n > 100000) return 'Quantity looks too large for this demo.'
  return null
}
