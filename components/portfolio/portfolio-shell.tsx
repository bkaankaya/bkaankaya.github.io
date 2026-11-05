"use client"

import { useEffect, useState } from "react"
import { PortfolioFooter } from "@/components/portfolio/portfolio-footer"
import { SiteHeader } from "@/components/portfolio/site-header"

export type PortfolioTheme = "dark" | "light"

const STORAGE_KEY = "bk-portfolio-theme"

export function PortfolioShell({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<PortfolioTheme>("dark")

  useEffect(() => {
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
    <div className="portfolio-app" data-theme={theme}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader theme={theme} onToggleTheme={toggleTheme} />
      {children}
      <PortfolioFooter />
    </div>
  )
}
