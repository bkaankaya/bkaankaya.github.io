"use client"

import { useEffect, useState } from "react"
import { PortfolioFooter } from "@/components/portfolio/portfolio-footer"
import { SiteHeader } from "@/components/portfolio/site-header"

export type PortfolioTheme = "dark" | "light"

const STORAGE_KEY = "bk-portfolio-theme"
const MOTION_STORAGE_KEY = "bk-ambient-paused"

export function PortfolioShell({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<PortfolioTheme>("dark")
  const [motionPaused, setMotionPaused] = useState(false)

  useEffect(() => {
    // Browser Network Information API is optional. Content never depends on it.
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    document.documentElement.toggleAttribute("data-save-data", connection?.saveData === true)
    try {
      setMotionPaused(window.localStorage.getItem(MOTION_STORAGE_KEY) === "true")
    } catch {
      // Reading a preference is optional; never prevent the portfolio from rendering.
    }
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved === "light" || saved === "dark") {
        setTheme(saved)
        document.documentElement.dataset.theme = saved
        document.documentElement.style.colorScheme = saved
        return
      }
    } catch {
      // Ignore storage access errors in restricted browsing modes
    }
    document.documentElement.dataset.theme = "dark"
    document.documentElement.style.colorScheme = "dark"
  }, [])

  function toggleTheme() {
    setTheme((current) => {
      const next: PortfolioTheme = current === "dark" ? "light" : "dark"
      document.documentElement.dataset.theme = next
      document.documentElement.style.colorScheme = next
      try {
        window.localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // Ignore storage write errors
      }
      return next
    })
  }

  function toggleMotion() {
    setMotionPaused((current) => {
      const paused = !current
      try {
        window.localStorage.setItem(MOTION_STORAGE_KEY, String(paused))
      } catch {
        // Storage may be disabled; the in-memory control still works.
      }
      return paused
    })
  }

  return (
    <div className="portfolio-app" data-theme={theme} data-motion={motionPaused ? "paused" : "playing"}>
      <div className="ambient-scene" aria-hidden="true">
        <span className="ambient-scene__orb ambient-scene__orb--violet" />
        <span className="ambient-scene__orb ambient-scene__orb--blue" />
        <span className="ambient-scene__grid" />
      </div>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader theme={theme} onToggleTheme={toggleTheme} motionPaused={motionPaused} onToggleMotion={toggleMotion} />
      {children}
      <PortfolioFooter />
    </div>
  )
}
