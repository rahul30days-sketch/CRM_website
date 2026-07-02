'use client'

import React, { createContext, useContext, useEffect, useState, Suspense } from 'react'
import { usePathname, useSearchParams, useRouter as useNextRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'

const TransitionContext = createContext<{
  startTransition: (href: string) => void
} | null>(null)

function RouteTransitionInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)

  // Dismiss loader when the page path or query params update
  useEffect(() => {
    setLoading(false)
  }, [pathname, searchParams])

  // Safety fallback timeout to prevent infinite loading overlays
  useEffect(() => {
    if (!loading) return
    const timer = setTimeout(() => {
      setLoading(false)
    }, 10000)
    return () => clearTimeout(timer)
  }, [loading])

  const startTransition = (href: string) => {
    const currentUrl = window.location.pathname + window.location.search
    if (href && href !== currentUrl && href.startsWith('/')) {
      setLoading(true)
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white/70 backdrop-blur-[2px] transition-all duration-300"
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
