// Shell layout wrapping every route in the /account area.
import { AccountHeaderStrip } from "@/components/account/AccountHeaderStrip"
import { AccountSidebar } from "@/components/account/AccountSidebar"
import { MobileAccountNav } from "@/components/account/MobileAccountNav"
import { Navbar } from "@/components/navbar"

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  // MOCK — replace with session/auth context
  const user = {
    firstName: "Kaan",
    memberSince: "January 2025",
    tier: "Gold",
    loyaltyPoints: 1850,
    activeOrdersCount: 2,
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <a
        href="#account-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#0B0B0B] focus:text-white focus:rounded-lg focus:text-sm"
      >
        Skip to content
      </a>

      <Navbar />

      <div className="pt-16">
        <AccountHeaderStrip
          firstName={user.firstName}
          memberSince={user.memberSince}
          tier={user.tier}
          loyaltyPoints={user.loyaltyPoints}
          activeOrdersCount={user.activeOrdersCount}
        />

        <MobileAccountNav />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="flex gap-10">
            <AccountSidebar />
            <main id="account-main" className="flex-1 min-w-0">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
