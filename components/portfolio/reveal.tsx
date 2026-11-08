"use client"

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react"

import { useMotionPreference } from "@/components/portfolio/motion-preference"

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const { paused: motionPaused } = useMotionPreference()
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const saveData =
      typeof navigator !== "undefined" &&
      "connection" in navigator &&
      Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)

    if (motionPaused || prefersReducedMotion || saveData || !("IntersectionObserver" in window)) {
      element.dataset.revealState = "idle"
      return
    }

    const rect = element.getBoundingClientRect()
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight
    if (rect.top < viewportHeight * 0.95 && rect.bottom > 0) {
      element.dataset.revealState = "idle"
      return
    }

    element.dataset.revealState = "pending"
    const fallbackTimer = window.setTimeout(() => {
      if (element.dataset.revealState === "pending") {
        element.dataset.revealState = "visible"
      }
    }, 1800)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.dataset.revealState = "visible"
          window.clearTimeout(fallbackTimer)
          observer.unobserve(element)
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -24px 0px" },
    )

    observer.observe(element)
    return () => {
      window.clearTimeout(fallbackTimer)
      observer.disconnect()
    }
  }, [motionPaused])

  const style = { "--reveal-delay": `${delay}ms` } as CSSProperties

  return (
    <div ref={elementRef} className={`reveal ${className}`.trim()} data-reveal-state="idle" style={style}>
      {children}
    </div>
  )
}
