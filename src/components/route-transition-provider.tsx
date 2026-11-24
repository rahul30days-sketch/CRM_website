'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  Suspense,
} from 'react'
import { usePathname, useSearchParams, useRouter as useNextRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'

const TransitionContext = createContext<{
  startTransition: (href: string) => void
} | null>(null)

// Only reveal the loader if a navigation is actually slow. Prefetched/cached
// route transitions finish in well under this, so the loader never flashes on
// fast navigations — which is what made every click feel like it "loaded".
const REVEAL_DELAY_MS = 180

/**
 * Isolated route-change watcher.
 *
 * `useSearchParams()` forces the closest Suspense boundary to client-side
 * render on statically-generated pages. We keep that read inside this tiny
 * component (which renders nothing) and wrap ONLY it in <Suspense>, so the
 * bailout is contained here and the rest of the page — header, content,
 * footer — still server-renders. Rendering `{children}` inside the same
 * boundary (the previous bug) bailed the ENTIRE app to CSR, producing empty
 * SSR HTML on every route in production.
 */
function RouteChangeWatcher({ onCommit }: { onCommit: () => void }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Route (path or query) committed → notify parent to hide the loader.
  useEffect(() => {
    onCommit()
  }, [pathname, searchParams, onCommit])

  return null
}

function RouteTransitionInner({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false)
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearReveal = useCallback(() => {
    if (revealTimer.current) {
      clearTimeout(revealTimer.current)
      revealTimer.current = null
    }
  }, [])

  // Route committed → cancel any pending reveal and hide the loader.
  const handleCommit = useCallback(() => {
    clearReveal()
    setLoading(false)
  }, [clearReveal])

  // Clean up the pending timer on unmount.
  useEffect(() => () => clearReveal(), [clearReveal])

  // Safety fallback so the overlay can never get stuck.
  useEffect(() => {
    if (!loading) return
    const timer = setTimeout(() => setLoading(false), 10000)
    return () => clearTimeout(timer)
  }, [loading])

  const startTransition = useCallback(
    (href: string) => {
      const currentUrl = window.location.pathname + window.location.search
      if (href && href !== currentUrl && href.startsWith('/')) {
        clearReveal()
        revealTimer.current = setTimeout(() => setLoading(true), REVEAL_DELAY_MS)
      }
    },
    [clearReveal],
  )

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a')

      if (anchor) {
        const href = anchor.getAttribute('href')
        const targetAttr = anchor.getAttribute('target')
        const downloadAttr = anchor.getAttribute('download')

        // Filter for valid internal route navigations
        if (
          href &&
          href.startsWith('/') &&
          !href.startsWith('/#') &&
          targetAttr !== '_blank' &&
          downloadAttr === null &&
          !e.defaultPrevented &&
          e.button === 0 && // Left click only
          !e.metaKey &&
          !e.ctrlKey &&
          !e.shiftKey &&
          !e.altKey
        ) {
          startTransition(href)
        }
      }
    }

    document.addEventListener('click', handleAnchorClick, { capture: true })
    return () => {
      document.removeEventListener('click', handleAnchorClick, { capture: true })
    }
  }, [startTransition])

  return (
    <TransitionContext.Provider value={{ startTransition }}>
      {/* Contained CSR bailout — see RouteChangeWatcher. Renders nothing. */}
      <Suspense fallback={null}>
        <RouteChangeWatcher onCommit={handleCommit} />
      </Suspense>

      {loading && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white/70"
          id="global-page-loader"
          role="status"
          aria-live="polite"
        >
          <div className="panel-frame flex flex-col items-center gap-3 p-6 bg-white border border-line shadow-float">
            <Spinner size={40} className="text-brand" />
            <p className="font-mono text-xs text-slate uppercase tracking-wider">Loading...</p>
          </div>
        </div>
      )}

      {children}
    </TransitionContext.Provider>
  )
}

export function RouteTransitionProvider({ children }: { children: React.ReactNode }) {
  return <RouteTransitionInner>{children}</RouteTransitionInner>
}

export function useRouter() {
  const router = useNextRouter()
  const context = useContext(TransitionContext)

  return {
    ...router,
    push: (href: string, options?: any) => {
      if (context) {
        context.startTransition(href)
      }
      router.push(href, options)
    },
    replace: (href: string, options?: any) => {
      if (context) {
        context.startTransition(href)
      }
      router.replace(href, options)
    },
  }
}
