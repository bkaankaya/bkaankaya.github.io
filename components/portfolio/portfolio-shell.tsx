"use client"

import { useEffect, useState } from "react"
import { PortfolioFooter } from "@/components/portfolio/portfolio-footer"
import { AmbientDotField } from "@/components/portfolio/ambient-dot-field"
import { SiteHeader } from "@/components/portfolio/site-header"
import { PortfolioNavigation, RouteContent } from "@/components/portfolio/route-transition"
import "@/app/navigation.css"

export type PortfolioTheme = "dark" | "light"

const STORAGE_KEY = "bk-portfolio-theme"

export function PortfolioShell({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<PortfolioTheme>("dark")

  useEffect(() => {
    // React hydrates the static dark-themed markup before reading localStorage.
    // Restore transitions only after the saved theme and text colors have settled.
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.documentElement.dataset.themeReady = "true"
      })
    })
    // Browser Network Information API is optional. Content never depends on it.
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    document.documentElement.toggleAttribute("data-save-data", connection?.saveData === true)
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

  return (
    <PortfolioNavigation><div className="portfolio-app" data-theme={theme}>
      <div className="ambient-scene" aria-hidden="true">
        <span className="ambient-scene__orb ambient-scene__orb--violet" />
        <span className="ambient-scene__orb ambient-scene__orb--blue" />
        <span className="ambient-scene__grid" />
      </div>
      <AmbientDotField />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader theme={theme} onToggleTheme={toggleTheme} />
      <RouteContent>{children}</RouteContent>
      <PortfolioFooter />
    </div></PortfolioNavigation>
  )
}
