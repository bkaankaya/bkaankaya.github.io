// Horizontally-scrollable pill nav shown on mobile instead of the sidebar.
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

const navItems = [
  { href: "/account", label: "Dashboard" },
  { href: "/account/profile", label: "Profile" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/payment-methods", label: "Payment" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/account/returns", label: "Returns" },
  { href: "/account/rewards", label: "Rewards" },
  { href: "/account/preferences", label: "Preferences" },
  { href: "/account/security", label: "Security" },
]

export function MobileAccountNav() {
  const pathname = usePathname()
  const scrollRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
    }
  }, [pathname])

  return (
    <div className="md:hidden sticky top-16 z-30 bg-[#F5F0E8]/95 backdrop-blur border-b border-[#E8E2D5]">
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/account" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              ref={isActive ? activeRef : undefined}
              className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.08em] transition-colors whitespace-nowrap ${
                isActive
                  ? "bg-[#0B0B0B] text-white"
                  : "bg-white text-[#6B6760] border border-[#E8E2D5] hover:border-[#C8A96E] hover:text-[#1A1A1A]"
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
