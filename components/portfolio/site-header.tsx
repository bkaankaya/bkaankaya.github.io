"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react"

type PortfolioTheme = "dark" | "light"

const navigation = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Education", href: "/education" },
  { label: "About", href: "/about" },
]

export function SiteHeader({ theme, onToggleTheme }: { theme: PortfolioTheme; onToggleTheme: () => void }) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const ThemeIcon = theme === "dark" ? Sun : Moon
  const MenuIcon = menuOpen ? X : Menu

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="brand-mark" href="/" aria-label="B. Kaan Kaya home" onClick={() => setMenuOpen(false)}>
          BK<span>.</span>
        </Link>

        <nav className="desktop-navigation" aria-label="Primary navigation">
          {navigation.map((item) => {
            const active = pathname === item.href
            return (
              <Link key={item.href} className={`navigation-link${active ? " is-active" : ""}`} href={item.href} aria-current={active ? "page" : undefined}>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="header-actions">
          <button className="theme-toggle" type="button" onClick={onToggleTheme} aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}>
            <ThemeIcon aria-hidden="true" />
          </button>
          <Link className="button button-primary header-contact" href="/about#contact">
            Contact <ArrowUpRight aria-hidden="true" />
          </Link>
          <button className="mobile-menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="mobile-navigation">
            <MenuIcon aria-hidden="true" />
          </button>
        </div>
      </div>

      <nav id="mobile-navigation" className={`mobile-navigation${menuOpen ? " is-open" : ""}`} aria-label="Mobile navigation" aria-hidden={!menuOpen}>
        {navigation.map((item) => {
          const active = pathname === item.href
          return (
            <Link key={item.href} className={`navigation-link${active ? " is-active" : ""}`} href={item.href} aria-current={active ? "page" : undefined} tabIndex={menuOpen ? 0 : -1} onClick={() => setMenuOpen(false)}>
              {item.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
