"use client"

import { TransitionLink as Link } from "@/components/portfolio/route-transition"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react"
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react"
import type { PortfolioTheme } from "@/components/portfolio/portfolio-shell"

const navigation = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects/" },
  { label: "Experience", href: "/experience/" },
  { label: "Education", href: "/education/" },
  { label: "About", href: "/about/" },
] as const

function normalizePath(pathname: string | null): string {
  if (!pathname || pathname === "/") return "/"
  return pathname.replace(/\/+$/, "") || "/"
}

export function SiteHeader({
  theme,
  onToggleTheme,
}: {
  theme: PortfolioTheme
  onToggleTheme: () => void
}) {
  const pathname = usePathname()
  const activePath = normalizePath(pathname)
  const [menuOpen, setMenuOpen] = useState(false)
  const [indicatorX, setIndicatorX] = useState<number | null>(null)

  const headerRef = useRef<HTMLElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const menuToggleRef = useRef<HTMLButtonElement>(null)
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({})

  const ThemeIcon = theme === "dark" ? Sun : Moon
  const MenuIcon = menuOpen ? X : Menu

  const updateIndicator = useCallback(() => {
    const navEl = navRef.current
    const activeEl = linkRefs.current[activePath]
    if (!navEl || !activeEl) {
      setIndicatorX(null)
      return
    }
    const navRect = navEl.getBoundingClientRect()
    const linkRect = activeEl.getBoundingClientRect()
    if (navRect.width === 0 || linkRect.width === 0) {
      setIndicatorX(null)
      return
    }
    const center = linkRect.left - navRect.left + linkRect.width / 2 - 10
    setIndicatorX(Math.round(center * 10) / 10)
  }, [activePath])

  useLayoutEffect(() => {
    setMenuOpen(false)
    updateIndicator()
  }, [activePath, updateIndicator])

  useEffect(() => {
    let mounted = true
    updateIndicator()
    // Font swaps and layout changes can move links without a window resize.
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(updateIndicator)
    if (navRef.current) observer?.observe(navRef.current)
    void document.fonts?.ready.then(() => { if (mounted) updateIndicator() })
    if (!observer) window.addEventListener("resize", updateIndicator, { passive: true })
    return () => {
      mounted = false
      observer?.disconnect()
      window.removeEventListener("resize", updateIndicator)
    }
  }, [updateIndicator])

  useEffect(() => {
    if (!menuOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault()
        setMenuOpen(false)
        menuToggleRef.current?.focus()
      }
    }

    function handlePointerDown(event: PointerEvent) {
      const header = headerRef.current
      if (header && !header.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("pointerdown", handlePointerDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("pointerdown", handlePointerDown)
    }
  }, [menuOpen])

  const indicatorStyle: CSSProperties | undefined =
    indicatorX !== null
      ? { transform: `translate3d(${indicatorX}px, 0, 0)`, opacity: 1 }
      : undefined

  return (
    <header ref={headerRef} className="site-header">
      <div className="site-header-inner">
        <Link
          className="brand-mark"
          href="/"
          aria-label="B. Kaan Kaya home"
          onNavigate={() => setMenuOpen(false)}
        >
          BK<span>.</span>
        </Link>

        <nav
          ref={navRef}
          className={`desktop-navigation${indicatorX !== null ? " has-js-indicator" : ""}`}
          aria-label="Primary navigation"
        >
          {navigation.map((item) => {
            const active = activePath === normalizePath(item.href)
            return (
              <Link
                key={item.href}
                ref={(el) => {
                  linkRefs.current[normalizePath(item.href)] = el
                }}
                className={`navigation-link${active ? " is-active" : ""}`}
                href={item.href}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            )
          })}
          <span
            className="nav-active-indicator"
            style={indicatorStyle}
            aria-hidden="true"
          />
        </nav>

        <div className="header-actions">
          <button
            className="theme-toggle"
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            <ThemeIcon aria-hidden="true" />
          </button>
          <Link className="button button-primary header-contact" href="/contact/" onNavigate={() => setMenuOpen(false)}>
            Contact <ArrowUpRight aria-hidden="true" />
          </Link>
          <button
            ref={menuToggleRef}
            className="mobile-menu-toggle"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <MenuIcon aria-hidden="true" />
          </button>
        </div>
      </div>

      <nav
        id="mobile-navigation"
        className={`mobile-navigation${menuOpen ? " is-open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        {navigation.map((item) => {
          const active = activePath === normalizePath(item.href)
          return (
            <Link
              key={item.href}
              className={`navigation-link${active ? " is-active" : ""}`}
              href={item.href}
              aria-current={active ? "page" : undefined}
              tabIndex={menuOpen ? 0 : -1}
              onNavigate={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          )
        })}
        <Link
          className="navigation-link mobile-contact-link"
          href="/contact/"
          onNavigate={() => setMenuOpen(false)}
          tabIndex={menuOpen ? 0 : -1}
        >
          Contact
        </Link>
      </nav>
    </header>
  )
}
