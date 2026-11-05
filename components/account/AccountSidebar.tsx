// Desktop sticky sidebar navigation for the account area.
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  User,
  MapPin,
  CreditCard,
  Package,
  Heart,
  RotateCcw,
  Star,
  Bell,
  Shield,
  LogOut,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"

const sections = [
  {
    label: "Account",
    items: [
      { href: "/account", label: "Dashboard", icon: LayoutDashboard },
      { href: "/account/profile", label: "Profile", icon: User },
      { href: "/account/addresses", label: "Addresses", icon: MapPin },
      { href: "/account/payment-methods", label: "Payment Methods", icon: CreditCard },
    ],
  },
  {
    label: "Orders",
    items: [
      { href: "/account/orders", label: "My Orders", icon: Package },
      { href: "/account/wishlist", label: "Wishlist", icon: Heart },
      { href: "/account/returns", label: "Returns", icon: RotateCcw },
    ],
  },
  {
    label: "Rewards & Prefs",
    items: [
      { href: "/account/rewards", label: "Rewards", icon: Star },
      { href: "/account/preferences", label: "Communication", icon: Bell },
      { href: "/account/security", label: "Security", icon: Shield },
    ],
  },
]

export function AccountSidebar() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex flex-col w-60 flex-shrink-0 sticky top-24 self-start">
      {sections.map((section, si) => (
        <div key={section.label} className={si > 0 ? "mt-6" : ""}>
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#6B6760] px-3 mb-2">
            {section.label}
          </p>
          <ul>
            {section.items.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/account" && pathname.startsWith(item.href))
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 h-10 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "border-l-2 border-[#C8A96E] bg-[#F0E5CC]/40 text-[#1A1A1A] font-medium pl-[14px] pr-3"
                        : "text-[#6B6760] hover:bg-[#FAF7F1] hover:text-[#1A1A1A] px-3"
                    }`}
                  >
                    <item.icon
                      className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-[#1A1A1A]" : "text-[#6B6760]"}`}
                      strokeWidth={1.5}
                    />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}

      <div className="mt-6">
        <Separator className="bg-[#E8E2D5] mb-3" />
        <button
          className="flex items-center gap-3 h-10 w-full px-3 rounded-lg text-sm text-[#6B6760] hover:bg-[#F4E6E6] hover:text-[#8B2F2F] transition-colors"
          onClick={() => {
            // handleLogout()
          }}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
          Log out
        </button>
      </div>
    </nav>
  )
}
