"use client"

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react"

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      element.dataset.revealState = "visible"
      return
    }

    element.dataset.revealState = "pending"
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.dataset.revealState = "visible"
          observer.unobserve(element)
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const style = { "--reveal-delay": `${delay}ms` } as CSSProperties

  return (
    <div ref={elementRef} className={`reveal ${className}`} data-reveal-state="idle" style={style}>
      {children}
    </div>
  )
}
