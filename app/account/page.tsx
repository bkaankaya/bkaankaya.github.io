// Account dashboard — at-a-glance overview of orders, loyalty, and wishlist.
import { Package, ArrowRight, Star, Heart, Headphones } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

// MOCK — replace with API call to GET /api/v1/account/dashboard
const mockDashboard = {
  activeOrders: 2,
  latestOrderStatus: "In transit · arrives Wed 13 May",
  loyaltyTier: "Gold",
  loyaltyPoints: 1850,
  loyaltyNextTier: "Platinum",
  loyaltyPointsToNext: 450,
  loyaltyTotalToNext: 2300,
  wishlistCount: 7,
  wishlistThumbnails: [
    "/placeholder.svg?height=40&width=40",
    "/placeholder.svg?height=40&width=40",
    "/placeholder.svg?height=40&width=40",
  ],
  recommended: [
    { id: "1", name: "Whey Isolate Pro", price: "$49.99", initial: "W" },
    { id: "2", name: "Pre-Workout Alpha", price: "$39.99", initial: "P" },
    { id: "3", name: "Creatine Monohydrate", price: "$24.99", initial: "C" },
    { id: "4", name: "Vegan Protein Blend", price: "$44.99", initial: "V" },
  ],
}

export default function AccountDashboardPage() {
  const d = mockDashboard
  const progressPct = Math.min(
    100,
    Math.round(((d.loyaltyTotalToNext - d.loyaltyPointsToNext) / d.loyaltyTotalToNext) * 100)
  )

  return (
    <div>
      {/* At a Glance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {/* Active Orders */}
        <div className="bg-white rounded-2xl border border-[#E8E2D5] p-6 flex flex-col">
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#6B6760] mb-3">
            Active Orders
          </p>
          <span className="font-sans text-5xl tabular-nums font-semibold text-[#1A1A1A] leading-none mb-3">
            {d.activeOrders}
          </span>
          <p className="font-sans text-xs text-[#6B6760] mb-4 leading-relaxed">{d.latestOrderStatus}</p>
          <Link
            href="/account/orders"
            className="mt-auto inline-flex items-center gap-1 text-[#C8A96E] hover:text-[#B8995E] font-medium text-sm transition-colors"
          >
            View all <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
          </Link>
        </div>

        {/* Loyalty */}
        <div className="bg-white rounded-2xl border border-[#E8E2D5] p-6 flex flex-col">
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#6B6760] mb-3">
            Vague Club
          </p>
          <span className="font-sans text-2xl uppercase tracking-wide font-medium text-[#1A1A1A] mb-3">
            {d.loyaltyTier}
          </span>
          <div className="h-1 rounded-full bg-[#E8E2D5] mb-2">
            <div
              className="h-full rounded-full bg-[#C8A96E] transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="font-sans text-xs text-[#6B6760] mb-4">
            {d.loyaltyPointsToNext} pts until {d.loyaltyNextTier}
          </p>
          <Link
            href="/account/rewards"
            className="mt-auto inline-flex items-center gap-1 text-[#C8A96E] hover:text-[#B8995E] font-medium text-sm transition-colors"
          >
            See rewards <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
          </Link>
        </div>

        {/* Wishlist */}
        <div className="bg-white rounded-2xl border border-[#E8E2D5] p-6 flex flex-col">
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#6B6760] mb-3">
            Wishlist
          </p>
          <span className="font-sans text-5xl tabular-nums font-semibold text-[#1A1A1A] leading-none mb-3">
            {d.wishlistCount}
          </span>
          <div className="flex gap-1.5 mb-4">
            {d.wishlistThumbnails.map((src, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-lg bg-[#F5F0E8] border border-[#E8E2D5] overflow-hidden"
              />
            ))}
          </div>
          <Link
            href="/account/wishlist"
            className="mt-auto inline-flex items-center gap-1 text-[#C8A96E] hover:text-[#B8995E] font-medium text-sm transition-colors"
          >
            View wishlist <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
          </Link>
        </div>
      </div>

      {/* Recommended */}
      <div className="mb-10">
        <p className="font-sans text-[11px] uppercase tracking-[0.12em] text-[#6B6760] mb-4">
          Pick up where you left off
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {d.recommended.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-[#E8E2D5] p-4 hover:-translate-y-0.5 transition-transform duration-200 cursor-pointer"
            >
              <div className="aspect-square rounded-xl bg-[#F5F0E8] flex items-center justify-center mb-3">
                <span className="font-sans text-3xl font-medium text-[#C8A96E]">{product.initial}</span>
              </div>
              <p className="font-sans text-sm font-medium text-[#1A1A1A] leading-snug mb-1 truncate">
                {product.name}
              </p>
              <p className="font-sans text-sm tabular-nums text-[#6B6760]">{product.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Help banner */}
      <div className="bg-white rounded-2xl border border-[#E8E2D5] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="w-12 h-12 rounded-xl bg-[#F0E5CC] flex items-center justify-center flex-shrink-0">
          <Headphones className="w-5 h-5 text-[#C8A96E]" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-sans text-sm font-medium text-[#1A1A1A] mb-1">Order help, fast.</h3>
          <p className="font-sans text-xs text-[#6B6760] leading-relaxed">
            Track an order, start a return, or chat with our team.
          </p>
        </div>
        <Link
          href="/support"
          className="flex-shrink-0 bg-[#0B0B0B] hover:bg-[#1A1A1A] text-white font-medium h-11 px-6 rounded-xl transition-colors text-sm inline-flex items-center"
        >
          Open support
        </Link>
      </div>
    </div>
  )
}
