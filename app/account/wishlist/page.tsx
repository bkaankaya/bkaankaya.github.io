// Wishlist page — saved product cards with add-to-bag and remove functionality.
"use client"

import { useState } from "react"
import { Heart, X, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { EmptyState } from "@/components/account/EmptyState"
import { Breadcrumbs } from "@/components/account/Breadcrumbs"

type StockStatus = "in-stock" | "low-stock" | "out-of-stock"

interface WishlistItem {
  id: string
  name: string
  variant: string
  price: string
  stock: StockStatus
}

// MOCK — replace with API call to GET /api/v1/account/wishlist
const initialItems: WishlistItem[] = [
  { id: "w1", name: "Vegan Protein Blend", variant: "Chocolate · 900g", price: "$44.99", stock: "in-stock" },
  { id: "w2", name: "Pump Matrix Stim-Free", variant: "Tropical · 30 Servings", price: "$39.99", stock: "in-stock" },
  { id: "w3", name: "Whey Isolate Pro", variant: "Vanilla · 1kg", price: "$49.99", stock: "low-stock" },
  { id: "w4", name: "Creatine Monohydrate", variant: "Unflavoured · 500g", price: "$24.99", stock: "out-of-stock" },
  { id: "w5", name: "Pre-Workout Alpha", variant: "Watermelon · 30 Servings", price: "$39.99", stock: "in-stock" },
  { id: "w6", name: "EAA Matrix", variant: "Peach · 30 Servings", price: "$34.99", stock: "in-stock" },
  { id: "w7", name: "Omega-3 Elite", variant: "Unflavoured · 90 Caps", price: "$22.99", stock: "in-stock" },
]

const stockConfig: Record<StockStatus, { dot: string; label: string }> = {
  "in-stock": { dot: "bg-[#2F6B3E]", label: "In stock" },
  "low-stock": { dot: "bg-amber-500", label: "Low stock" },
  "out-of-stock": { dot: "bg-[#8B2F2F]", label: "Out of stock" },
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>(initialItems)
  const [removedId, setRemovedId] = useState<string | null>(null)

  const remove = (id: string) => {
    const item = items.find((i) => i.id === id)
    if (!item) return
    setItems((prev) => prev.filter((i) => i.id !== id))
    setRemovedId(id)
    setTimeout(() => {
      setRemovedId(null)
    }, 3000)
  }

  const undo = () => {
    const item = initialItems.find((i) => i.id === removedId)
    if (item) setItems((prev) => [...prev, item])
    setRemovedId(null)
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: "Account", href: "/account" }, { label: "Wishlist" }]} />

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="font-sans text-2xl font-medium text-[#1A1A1A] mb-1">Wishlist</h2>
          <p className="font-sans text-sm text-[#6B6760]">
            You have {items.length} saved {items.length === 1 ? "item" : "items"}
          </p>
        </div>
        {items.length > 0 && (
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setItems([])}
              className="text-[#8B2F2F] hover:bg-[#F4E6E6] font-medium h-10 px-4 rounded-xl transition-colors text-sm border border-[#F4E6E6]"
            >
              Clear wishlist
            </button>
            <button className="bg-[#C8A96E] hover:bg-[#B8995E] text-[#0B0B0B] font-medium h-10 px-4 rounded-xl transition-colors text-sm">
              Move all to bag
            </button>
          </div>
        )}
      </div>

      {/* Undo toast */}
      {removedId && (
        <div className="mb-4 flex items-center justify-between gap-4 bg-[#0B0B0B] text-white rounded-xl px-5 py-3 text-sm">
          <span>Removed from wishlist</span>
          <button onClick={undo} className="text-[#C8A96E] font-medium hover:text-[#B8995E] transition-colors">
            Undo
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8E2D5]">
          <EmptyState
            icon={Heart}
            heading="Your wishlist is empty"
            body="Tap the heart on any product to save it for later."
            action={
              <Link
                href="/"
                className="bg-[#C8A96E] hover:bg-[#B8995E] text-[#0B0B0B] font-medium h-11 px-6 rounded-xl transition-colors text-sm inline-flex items-center"
              >
                Browse products
              </Link>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const stock = stockConfig[item.stock]
            return (
              <div key={item.id} className="bg-white rounded-2xl border border-[#E8E2D5] overflow-hidden">
                {/* Image area */}
                <div className="relative aspect-square bg-[#F5F0E8]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-sans text-6xl font-medium text-[#C8A96E]/40">
                      {item.name.charAt(0)}
                    </span>
                  </div>
                  <button
                    onClick={() => remove(item.id)}
                    aria-label="Remove from wishlist"
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#6B6760] hover:text-[#8B2F2F] hover:scale-105 transition-all"
                  >
                    <X className="w-3.5 h-3.5" strokeWidth={2} />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4">
                  <p className="font-sans text-sm font-medium text-[#1A1A1A] leading-snug mb-0.5 line-clamp-2">
                    {item.name}
                  </p>
                  <p className="font-sans text-xs text-[#6B6760] mb-2">{item.variant}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-sans text-sm tabular-nums font-medium text-[#1A1A1A]">
                      {item.price}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${stock.dot}`} />
                      <span className="font-sans text-xs text-[#6B6760]">{stock.label}</span>
                    </div>
                  </div>
                  <button
                    disabled={item.stock === "out-of-stock"}
                    className="w-full flex items-center justify-center gap-2 bg-[#C8A96E] hover:bg-[#B8995E] text-[#0B0B0B] font-medium h-10 rounded-xl transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
                    Add to bag
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
