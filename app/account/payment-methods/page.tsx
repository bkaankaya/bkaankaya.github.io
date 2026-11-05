// Saved payment methods page — Stripe-backed card vault.
"use client"

import { useState } from "react"
import { Plus, CreditCard, Lock, Shield, BadgeCheck, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { EmptyState } from "@/components/account/EmptyState"
import { Breadcrumbs } from "@/components/account/Breadcrumbs"

interface SavedCard {
  id: string
  brand: "visa" | "mastercard" | "amex" | "unknown"
  last4: string
  expiry: string
  isDefault: boolean
}

// MOCK — replace with API call to GET /api/v1/account/payment-methods
const initialCards: SavedCard[] = [
  { id: "pm_1", brand: "visa", last4: "4242", expiry: "12/28", isDefault: true },
  { id: "pm_2", brand: "mastercard", last4: "5555", expiry: "08/27", isDefault: false },
]

function CardBrandIcon({ brand }: { brand: SavedCard["brand"] }) {
  if (brand === "visa") {
    return (
      <svg width="38" height="24" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Visa">
        <rect width="38" height="24" rx="4" fill="#1A1F71" />
        <text x="19" y="16" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Arial">VISA</text>
      </svg>
    )
  }
  if (brand === "mastercard") {
    return (
      <svg width="38" height="24" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Mastercard">
        <rect width="38" height="24" rx="4" fill="#F5F5F5" />
        <circle cx="15" cy="12" r="7" fill="#EB001B" />
        <circle cx="23" cy="12" r="7" fill="#F79E1B" />
        <path d="M19 6.8A7 7 0 0 1 19 17.2A7 7 0 0 1 19 6.8Z" fill="#FF5F00" />
      </svg>
    )
  }
  return <CreditCard className="w-8 h-6 text-[#6B6760]" strokeWidth={1.5} />
}

export default function PaymentMethodsPage() {
  const [cards, setCards] = useState<SavedCard[]>(initialCards)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = () => {
    if (deletingId) setCards((prev) => prev.filter((c) => c.id !== deletingId))
    setDeletingId(null)
  }

  const setDefault = (id: string) =>
    setCards((prev) => prev.map((c) => ({ ...c, isDefault: c.id === id })))

  return (
    <div>
      <Breadcrumbs items={[{ label: "Account", href: "/account" }, { label: "Payment Methods" }]} />

      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="font-sans text-2xl font-medium text-[#1A1A1A] mb-1">Payment Methods</h2>
          <p className="font-sans text-sm text-[#6B6760] max-w-md">
            Cards are stored securely by Stripe — we never see your full number.
          </p>
        </div>
        <button
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-2 bg-[#C8A96E] hover:bg-[#B8995E] text-[#0B0B0B] font-medium h-11 px-5 rounded-xl transition-colors text-sm flex-shrink-0"
        >
          <Plus className="w-4 h-4" strokeWidth={2} />
          Add new card
        </button>
      </div>

      {cards.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8E2D5]">
          <EmptyState
            icon={CreditCard}
            heading="No cards saved"
            body="Add a card to speed up your next checkout."
            action={
              <button
                onClick={() => setDialogOpen(true)}
                className="bg-[#C8A96E] hover:bg-[#B8995E] text-[#0B0B0B] font-medium h-11 px-6 rounded-xl transition-colors text-sm"
              >
                Add card
              </button>
            }
          />
        </div>
      ) : (
        <div className="flex flex-col gap-3 mb-6">
          {cards.map((card) => (
            <div key={card.id} className="bg-white rounded-2xl border border-[#E8E2D5] p-5 flex items-center gap-4">
              <div className="flex-shrink-0">
                <CardBrandIcon brand={card.brand} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-sans text-sm font-medium tabular-nums text-[#1A1A1A]">
                    &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; {card.last4}
                  </p>
                  {card.isDefault && (
                    <span className="rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[#8B7340] bg-[#F0E5CC]">
                      Default
                    </span>
                  )}
                </div>
                <p className="font-sans text-xs text-[#6B6760] mt-0.5">Expires {card.expiry}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {!card.isDefault && (
                  <button
                    onClick={() => setDefault(card.id)}
                    className="text-[#1A1A1A] hover:bg-[#FAF7F1] font-medium h-9 px-3 rounded-lg transition-colors text-xs"
                  >
                    Set as default
                  </button>
                )}
                <button
                  onClick={() => setDeletingId(card.id)}
                  aria-label="Remove card"
                  className="text-[#8B2F2F] hover:bg-[#F4E6E6] h-9 w-9 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trust strip */}
      <div className="flex flex-wrap gap-6 mt-4">
        {[
          { icon: Lock, label: "PCI-DSS Level 1" },
          { icon: Shield, label: "3D Secure" },
          { icon: BadgeCheck, label: "Stripe verified" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-[#9A9489]" strokeWidth={1.5} />
            <span className="text-[11px] uppercase tracking-[0.12em] text-[#9A9489]">{label}</span>
          </div>
        ))}
      </div>

      {/* Add card dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white rounded-2xl border border-[#E8E2D5] max-w-md">
          <DialogHeader>
            <DialogTitle className="font-sans text-base font-medium text-[#1A1A1A]">
              Add a new card
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            {/* Stripe CardElement placeholder — wire to <Elements stripe={stripePromise}> */}
            <div className="h-11 rounded-xl border border-[#E8E2D5] bg-[#FAF7F1] px-4 flex items-center mb-4">
              <span className="font-sans text-xs text-[#9A9489]">
                Stripe card element renders here — wrap in &lt;Elements&gt; provider
              </span>
            </div>
            <button
              onClick={() => setDialogOpen(false)}
              className="w-full bg-[#C8A96E] hover:bg-[#B8995E] text-[#0B0B0B] font-medium h-11 px-6 rounded-xl transition-colors text-sm"
            >
              Save card
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent className="bg-white rounded-2xl border border-[#E8E2D5]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-sans text-base font-medium text-[#1A1A1A]">
              Remove card?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-sans text-sm text-[#6B6760]">
              This card will be removed from your account. Any active subscriptions using it may be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-medium h-10 px-4 rounded-xl text-sm bg-white border border-[#E8E2D5] text-[#1A1A1A] hover:bg-[#FAF7F1]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="font-medium h-10 px-4 rounded-xl text-sm bg-[#8B2F2F] text-white hover:bg-[#7A2828]"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
