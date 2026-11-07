"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { createContext, useContext, useEffect, useLayoutEffect, useRef, type ComponentProps, type ReactNode, type RefObject } from "react"

const RouteContentRef = createContext<RefObject<HTMLDivElement | null> | null>(null)

function motionAllowed() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  return !document.hidden && !matchMedia("(prefers-reduced-motion: reduce)").matches && !connection?.saveData
}

/**
 * Next owns navigation, prefetching, history and scroll restoration. Animate only
 * after a new pathname commits, so motion never delays or cancels a route change.
 * The persistent header and cached page state do not remount.
 */
export function PortfolioNavigation({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const previousPath = useRef(pathname)
  const contentRef = useRef<HTMLDivElement>(null)
  const entrance = useRef<Animation | null>(null)

  useLayoutEffect(() => {
    if (previousPath.current === pathname) return
    previousPath.current = pathname
    entrance.current?.cancel()
    if (!motionAllowed() || !contentRef.current?.animate) return
    entrance.current = contentRef.current.animate(
      [{ opacity: 0.2, transform: "translate3d(0, 8px, 0)" }, { opacity: 1, transform: "none" }],
      { duration: 300, easing: "cubic-bezier(.22, 1, .36, 1)" },
    )
  }, [pathname])

  useEffect(() => {
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)")
    const connection = (navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }).connection
    const cancel = () => entrance.current?.cancel()
    const handlePreference = () => { if (reducedMotion.matches || connection?.saveData) cancel() }
    window.addEventListener("popstate", cancel)
    window.addEventListener("pagehide", cancel)
    reducedMotion.addEventListener("change", handlePreference)
    connection?.addEventListener("change", handlePreference)
    return () => {
      window.removeEventListener("popstate", cancel)
      window.removeEventListener("pagehide", cancel)
      reducedMotion.removeEventListener("change", handlePreference)
      connection?.removeEventListener("change", handlePreference)
      cancel()
    }
  }, [])

  return <RouteContentRef.Provider value={contentRef}>{children}</RouteContentRef.Provider>
}

export function RouteContent({ children }: { children: ReactNode }) {
  const contentRef = useContext(RouteContentRef)
  return <div ref={contentRef} className="portfolio-route-content">{children}</div>
}

/** Forward every normal Link prop, including the caller's onNavigate callback. */
export function TransitionLink(props: ComponentProps<typeof Link>) {
  return <Link {...props} />
}
