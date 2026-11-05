// Returns & exchanges page — policy overview and return request list.
"use client"

import { RotateCcw, Package, ArrowRight } from "lucide-react"
import Link from "next/link"
import { EmptyState } from "@/components/account/EmptyState"
import { Breadcrumbs } from "@/components/account/Breadcrumbs"
import { Separator } from "@/components/ui/separator"

// MOCK — replace with API call to GET /api/v1/account/returns
const mockReturns: { id: string; orderId: string; date: string; status: string; items: string }[] = []

const policyPoints = [
  { title: "30-day window", body: "Items can be returned within 30 days of delivery, unopened and in original packaging." },
  { title: "Free return label", body: "We provide a prepaid return label for all eligible returns in Turkey and the EU." },
  { title: "Refund timeline", body: "Refunds are processed within 5–7 business days of receiving your return." },
  { title: "Opened products", body: "We cannot accept returns on opened supplements. If your item is damaged or incorrect, contact support." },
]

export default function ReturnsPage() {
  return (
    <div>
      <Breadcrumbs items={[{ label: "Account", href: "/account" }, { label: "Returns & Exchanges" }]} />

      <div className="mb-6">
        <h2 className="font-sans text-2xl font-medium text-[#1A1A1A] mb-1">Returns & Exchanges</h2>
        <p className="font-sans text-sm text-[#6B6760]">
          Start a return or check the status of an existing request.
        </p>
      </div>

      {/* Policy */}
      <div className="bg-white rounded-2xl border border-[#E8E2D5] p-6 md:p-8 mb-6">
        <p className="text-[11px] uppercase tracking-[0.12em] text-[#6B6760] mb-5">Return Policy</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {policyPoints.map((point) => (
            <div key={point.title}>
              <p className="font-sans text-sm font-medium text-[#1A1A1A] mb-1">{point.title}</p>
              <p className="font-sans text-xs text-[#6B6760] leading-relaxed">{point.body}</p>
            </div>
          ))}
        </div>
        <Separator className="bg-[#E8E2D5] my-5" />
        <p className="font-sans text-xs text-[#6B6760]">
          Need to start a return?{" "}
          <Link href="/account/orders" className="text-[#C8A96E] hover:text-[#B8995E] font-medium transition-colors">
            Go to My Orders
          </Link>{" "}
          and select &quot;Start a return&quot; on any eligible delivered order.
        </p>
      </div>

      {/* Returns list */}
      <div>
        <p className="text-[11px] uppercase tracking-[0.12em] text-[#6B6760] mb-4">Your Requests</p>
        {mockReturns.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E8E2D5]">
            <EmptyState
              icon={RotateCcw}
              heading="No active returns"
              body="Once you initiate a return on an order, your request will appear here."
              action={
                <Link
                  href="/account/orders"
                  className="inline-flex items-center gap-1 text-[#C8A96E] hover:text-[#B8995E] font-medium text-sm transition-colors"
                >
                  View orders <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                </Link>
              }
            />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {mockReturns.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl border border-[#E8E2D5] p-5 flex items-center gap-4">
                <Package className="w-5 h-5 text-[#9A9489]" strokeWidth={1.5} />
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm font-medium text-[#1A1A1A]">{r.items}</p>
                  <p className="font-sans text-xs text-[#6B6760]">Order {r.orderId} · {r.date}</p>
                </div>
                <span className="font-sans text-xs text-[#6B6760]">{r.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
