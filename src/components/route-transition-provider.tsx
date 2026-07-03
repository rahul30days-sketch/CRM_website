'use client'

import React, { createContext, useContext, useEffect, useRef, useState, Suspense } from 'react'
import { usePathname, useSearchParams, useRouter as useNextRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'

const TransitionContext = createContext<{
  startTransition: (href: string) => void
} | null>(null)

// Only reveal the loader if a navigation is actually slow. Prefetched/cached
// route transitions finish in well under this, so the loader never flashes on
// fast navigations — which is what made every click feel like it "loaded".
const REVEAL_DELAY_MS = 180

function RouteTransitionInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearReveal = () => {
    if (revealTimer.current) {
      clearTimeout(revealTimer.current)
      revealTimer.current = null
    }
  }

  // Route committed → cancel any pending reveal and hide the loader.
  useEffect(() => {
    clearReveal()
    setLoading(false)
  }, [pathname, searchParams])

  // Clean up the pending timer on unmount.
  useEffect(() => () => clearReveal(), [])

  // Safety fallback so the overlay can never get stuck.
  useEffect(() => {
    if (!loading) return
    const timer = setTimeout(() => setLoading(false), 10000)
    return () => clearTimeout(timer)
  }, [loading])

  const startTransition = (href: string) => {
    const currentUrl = window.location.pathname + window.location.search
    if (href && href !== currentUrl && href.startsWith('/')) {
      clearReveal()
      revealTimer.current = setTimeout(() => setLoading(true), REVEAL_DELAY_MS)
    }
  }

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
  }, [])

  return (
    <TransitionContext.Provider value={{ startTransition }}>
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
  return (
    <Suspense fallback={null}>
      <RouteTransitionInner>{children}</RouteTransitionInner>
    </Suspense>
  )
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
