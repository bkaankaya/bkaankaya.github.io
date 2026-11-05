// Slim greeting + quick-stats band sitting directly under the top nav.

interface AccountHeaderStripProps {
  firstName: string
  memberSince: string
  tier: string
  loyaltyPoints: number
  activeOrdersCount: number
}

export function AccountHeaderStrip({
  firstName,
  memberSince,
  tier,
  loyaltyPoints,
  activeOrdersCount,
}: AccountHeaderStripProps) {
  return (
    <div className="bg-[#F5F0E8] border-b border-[#E8E2D5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-3xl md:text-4xl font-semibold tracking-tight text-[#1A1A1A]">
            Hi, {firstName}
          </h1>
          <p className="font-sans text-sm text-[#6B6760] mt-0.5">
            Member since {memberSince} &middot; {tier} tier
          </p>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="rounded-full border border-[#E8E2D5] bg-white px-4 py-1.5 flex flex-col items-center">
            <span className="text-[11px] uppercase tracking-[0.12em] text-[#6B6760]">Points</span>
            <span className="font-sans tabular-nums font-medium text-[#1A1A1A] text-sm">
              {loyaltyPoints.toLocaleString()} pts
            </span>
          </div>
          <div className="rounded-full border border-[#E8E2D5] bg-white px-4 py-1.5 flex flex-col items-center">
            <span className="text-[11px] uppercase tracking-[0.12em] text-[#6B6760]">Active Orders</span>
            <span className="font-sans tabular-nums font-medium text-[#1A1A1A] text-sm">
              {activeOrdersCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
