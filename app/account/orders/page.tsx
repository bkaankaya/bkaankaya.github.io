// Order history page — filterable stack of order cards.
"use client"

import { useState } from "react"
import { Search, RotateCcw, Package, ArrowRight, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { StatusBadge } from "@/components/account/StatusBadge"
import { EmptyState } from "@/components/account/EmptyState"
import { Breadcrumbs } from "@/components/account/Breadcrumbs"

type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled" | "pending-payment" | "returned"

interface OrderLineItem {
  id: string
  name: string
  variant: string
  qty: number
  price: string
}

interface Order {
  id: string
  date: string
  itemCount: number
  total: string
  status: OrderStatus
  items: OrderLineItem[]
}

// MOCK — replace with API call to GET /api/v1/account/orders
const mockOrders: Order[] = [
  {
    id: "ORD-2026-0007",
    date: "May 6, 2026",
    itemCount: 3,
    total: "$2,159.64",
    status: "pending-payment",
    items: [
      { id: "1", name: "Vegan Protein Blend", variant: "Limon — 150g", qty: 1, price: "$349.90" },
      { id: "2", name: "Pump Matrix Stim-Free", variant: "Tropical — 30 Servings", qty: 1, price: "$849.90" },
      { id: "3", name: "Vegan Protein Blend", variant: "Chocolate — 900g", qty: 1, price: "$599.90" },
    ],
  },
  {
    id: "ORD-2026-0004",
    date: "Apr 18, 2026",
    itemCount: 2,
    total: "$89.98",
    status: "delivered",
    items: [
      { id: "4", name: "Whey Isolate Pro", variant: "Vanilla — 1kg", qty: 1, price: "$49.99" },
      { id: "5", name: "Creatine Monohydrate", variant: "Unflavoured — 500g", qty: 1, price: "$24.99" },
    ],
  },
  {
    id: "ORD-2026-0001",
    date: "Mar 3, 2026",
    itemCount: 1,
    total: "$44.99",
    status: "shipped",
    items: [
      { id: "6", name: "Pre-Workout Alpha", variant: "Watermelon — 30 Servings", qty: 1, price: "$44.99" },
    ],
  },
]

const filterOptions = ["All", "Active", "Delivered", "Cancelled", "Returned"] as const
type FilterOption = (typeof filterOptions)[number]

function matchesFilter(order: Order, filter: FilterOption): boolean {
  if (filter === "All") return true
  if (filter === "Active") return ["processing", "pending-payment", "shipped"].includes(order.status)
  if (filter === "Delivered") return order.status === "delivered"
  if (filter === "Cancelled") return order.status === "cancelled"
  if (filter === "Returned") return order.status === "returned"
  return true
}

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false)
  const visibleItems = expanded ? order.items : order.items.slice(0, 3)
  const hiddenCount = order.items.length - 3

  return (
    <div className="bg-white rounded-2xl border border-[#E8E2D5] overflow-hidden">
      {/* Header */}
      <div className="bg-[#FAF7F1] border-b border-[#E8E2D5] px-6 py-4 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-0 grid grid-cols-3 gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-[#6B6760] mb-0.5">Order Date</p>
            <p className="font-sans text-sm tabular-nums font-medium text-[#1A1A1A]">{order.date}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-[#6B6760] mb-0.5">Order Summary</p>
            <p className="font-sans text-sm text-[#1A1A1A]">{order.itemCount} Items</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-[#6B6760] mb-0.5">Total Amount</p>
            <p className="font-sans text-sm tabular-nums font-medium text-[#C8A96E]">{order.total}</p>
          </div>
        </div>
        <StatusBadge variant={order.status} />
      </div>

      {/* Line items */}
      <div className="px-6 py-4">
        {visibleItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4 py-3 border-b border-[#E8E2D5] last:border-0">
            <div className="w-14 h-14 rounded-xl bg-[#F5F0E8] flex items-center justify-center flex-shrink-0">
              <span className="font-sans text-xl font-medium text-[#C8A96E]">{item.name.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans text-sm font-medium text-[#1A1A1A] truncate">{item.name}</p>
              <p className="font-sans text-xs text-[#6B6760]">{item.variant} &times; {item.qty}</p>
            </div>
            <p className="font-sans text-sm tabular-nums text-[#1A1A1A] flex-shrink-0">{item.price}</p>
          </div>
        ))}

        {hiddenCount > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-[#6B6760] hover:text-[#1A1A1A] text-xs font-medium mt-3 transition-colors"
          >
            {expanded ? (
              <><ChevronUp className="w-3.5 h-3.5" strokeWidth={2} /> Show less</>
            ) : (
              <><ChevronDown className="w-3.5 h-3.5" strokeWidth={2} /> +{hiddenCount} more</>
            )}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 pb-5 flex items-center justify-between">
        <button className="flex items-center gap-1.5 text-[#1A1A1A] hover:bg-[#FAF7F1] font-medium h-10 px-4 rounded-xl transition-colors text-sm border border-[#E8E2D5]">
          <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} />
          Buy again
        </button>
        <Link
          href={`/account/orders/${order.id}`}
          className="inline-flex items-center gap-1 text-[#C8A96E] hover:text-[#B8995E] font-medium text-sm transition-colors"
        >
          Order Details <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
        </Link>
      </div>
    </div>
  )
}

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("All")
  const [search, setSearch] = useState("")

  const filtered = mockOrders.filter(
    (o) =>
      matchesFilter(o, activeFilter) &&
      (search === "" ||
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.items.some((i) => i.name.toLowerCase().includes(search.toLowerCase())))
  )

  return (
    <div>
      <Breadcrumbs items={[{ label: "Account", href: "/account" }, { label: "My Orders" }]} />

      <div className="mb-6">
        <h2 className="font-sans text-2xl font-medium text-[#1A1A1A] mb-1">My Orders</h2>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.08em] transition-colors ${
                activeFilter === f
                  ? "bg-[#0B0B0B] text-white"
                  : "bg-white text-[#6B6760] border border-[#E8E2D5] hover:border-[#C8A96E] hover:text-[#1A1A1A]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="ml-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9A9489]" strokeWidth={1.5} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order # or product"
            className="pl-9 pr-4 h-9 rounded-xl border border-[#E8E2D5] bg-white text-sm text-[#1A1A1A] placeholder:text-[#9A9489] focus:border-[#C8A96E] focus:ring-2 focus:ring-[#C8A96E]/30 focus:outline-none transition-colors w-64"
          />
        </div>
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8E2D5]">
          <EmptyState
            icon={Package}
            heading="No orders yet"
            body="When you place your first order it will appear here."
            action={
              <Link
                href="/"
                className="bg-[#C8A96E] hover:bg-[#B8995E] text-[#0B0B0B] font-medium h-11 px-6 rounded-xl transition-colors text-sm inline-flex items-center"
              >
                Start shopping
              </Link>
            }
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}
