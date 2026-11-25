'use client'

/**
 * Reset confirmation. Uses the native <dialog> with showModal(), which makes
 * the rest of the page inert, traps Tab, and closes on Escape. Focus starts
 * on "Cancel" (the safe choice) and returns to the trigger on close.
 */

import * as React from 'react'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { brandBtn, smallBtn } from './ui'
import { usePlayground } from './store'

export function ResetButton({ className }: { className?: string }) {
  const { dispatch } = usePlayground()
  const dialog = React.useRef<HTMLDialogElement>(null)
  const trigger = React.useRef<HTMLButtonElement>(null)
  const cancel = React.useRef<HTMLButtonElement>(null)

  const open = () => {
    const d = dialog.current
    if (!d) return
    if (typeof d.showModal === 'function') d.showModal()
    else d.setAttribute('open', '')
    cancel.current?.focus()
  }
  const close = () => {
    const d = dialog.current
    if (d?.open) {
      if (typeof d.close === 'function') d.close()
      else d.removeAttribute('open')
    }
  }

  React.useEffect(() => {
    const d = dialog.current
    if (!d) return
    const onClose = () => trigger.current?.focus()
    d.addEventListener('close', onClose)
    return () => d.removeEventListener('close', onClose)
  }, [])

  return (
    <>
      <button ref={trigger} type="button" className={cn(smallBtn, 'h-9', className)} onClick={open} aria-haspopup="dialog">
        <RotateCcw className="h-4 w-4" aria-hidden />
        Reset
      </button>
      <dialog
        ref={dialog}
        aria-labelledby="pg-reset-title"
        aria-describedby="pg-reset-desc"
        className="w-[min(26rem,calc(100vw-2rem))] rounded-card border border-line bg-white p-0 text-ink shadow-float backdrop:bg-night/40"
        onClick={(e) => {
          // Click on the backdrop (the dialog element itself) cancels.
          if (e.target === e.currentTarget) close()
        }}
      >
        <div className="p-5">
          <h2 id="pg-reset-title" className="font-display text-lg font-bold text-ink">
            Reset the playground?
          </h2>
          <p id="pg-reset-desc" className="mt-2 text-sm text-slate">
            This removes the leads, messages and quotations you added and restores the original sample data. Only this browser tab
            is affected.
          </p>
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <button ref={cancel} type="button" className={smallBtn} onClick={close}>
              Cancel
            </button>
            <button
              type="button"
              className={brandBtn}
              onClick={() => {
                dispatch({ type: 'RESET' })
                close()
              }}
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Reset sample data
            </button>
          </div>
        </div>
      </dialog>
    </>
  )
}
