"use client"

import { useState } from "react"
import { PortfolioFooter } from "@/components/portfolio/portfolio-footer"
import { SiteHeader } from "@/components/portfolio/site-header"

export type PortfolioTheme = "dark" | "light"

export function PortfolioShell({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<PortfolioTheme>("dark")

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"))
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
