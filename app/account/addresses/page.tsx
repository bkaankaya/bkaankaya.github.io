// Address book page — saved shipping and billing addresses.
"use client"

import { useState } from "react"
import { MapPin, Plus, Pencil, Trash2, AlertCircle, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { EmptyState } from "@/components/account/EmptyState"
import { Breadcrumbs } from "@/components/account/Breadcrumbs"

interface Address {
  id: string
  fullName: string
  line1: string
  line2?: string
  city: string
  zip: string
  country: string
  phone: string
  isDefaultShipping: boolean
  isDefaultBilling: boolean
}

// MOCK — replace with API call to GET /api/v1/account/addresses
const initialAddresses: Address[] = [
  {
    id: "addr_1",
    fullName: "Kaan Kaya",
    line1: "Barbaros Mahallesi, Beşiktaş",
    city: "Istanbul",
    zip: "34353",
    country: "Turkey",
    phone: "+90 555 555 55 55",
    isDefaultShipping: true,
    isDefaultBilling: true,
  },
]

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [form, setForm] = useState({
    fullName: "", line1: "", line2: "", city: "", zip: "",
    country: "Turkey", phone: "", isDefaultShipping: false, isDefaultBilling: false,
  })

  const openAdd = () => {
    setEditingAddress(null)
    setForm({ fullName: "", line1: "", line2: "", city: "", zip: "", country: "Turkey", phone: "", isDefaultShipping: false, isDefaultBilling: false })
    setDialogOpen(true)
  }

  const openEdit = (addr: Address) => {
    setEditingAddress(addr)
    setForm({ fullName: addr.fullName, line1: addr.line1, line2: addr.line2 || "", city: addr.city, zip: addr.zip, country: addr.country, phone: addr.phone, isDefaultShipping: addr.isDefaultShipping, isDefaultBilling: addr.isDefaultBilling })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (editingAddress) {
      setAddresses((prev) => prev.map((a) => a.id === editingAddress.id ? { ...a, ...form } : a))
    } else {
      setAddresses((prev) => [...prev, { id: `addr_${Date.now()}`, ...form }])
    }
    setDialogOpen(false)
  }

  const handleDelete = () => {
    if (deletingId) setAddresses((prev) => prev.filter((a) => a.id !== deletingId))
    setDeletingId(null)
  }

  const f = (id: keyof typeof form) => ({
    id,
    value: form[id] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [id]: e.target.value })),
  })

  return (
    <div>
      <Breadcrumbs items={[{ label: "Account", href: "/account" }, { label: "Addresses" }]} />

      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="font-sans text-2xl font-medium text-[#1A1A1A] mb-1">Addresses</h2>
          <p className="font-sans text-sm text-[#6B6760]">Your saved shipping and billing addresses.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#C8A96E] hover:bg-[#B8995E] text-[#0B0B0B] font-medium h-11 px-5 rounded-xl transition-colors text-sm flex-shrink-0"
        >
          <Plus className="w-4 h-4" strokeWidth={2} />
          Add new address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8E2D5]">
          <EmptyState
            icon={MapPin}
            heading="No saved addresses"
            body="Add your first shipping or billing address to speed up checkout."
            action={
              <button
                onClick={openAdd}
                className="bg-[#C8A96E] hover:bg-[#B8995E] text-[#0B0B0B] font-medium h-11 px-6 rounded-xl transition-colors text-sm"
              >
                Add address
              </button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white rounded-2xl border border-[#E8E2D5] p-6">
              <div className="flex gap-2 mb-3 flex-wrap">
                {addr.isDefaultShipping && (
                  <span className="rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[#8B7340] bg-[#F0E5CC]">
                    Default Shipping
                  </span>
                )}
                {addr.isDefaultBilling && (
                  <span className="rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[#8B7340] bg-[#F0E5CC]">
                    Default Billing
                  </span>
                )}
              </div>
              <p className="font-sans text-sm font-medium text-[#1A1A1A] mb-1">{addr.fullName}</p>
              <p className="font-sans text-xs text-[#6B6760] leading-relaxed">
                {addr.line1}{addr.line2 && `, ${addr.line2}`}
                <br />{addr.city}, {addr.zip}
                <br />{addr.country}
                <br />{addr.phone}
              </p>
              <div className="flex gap-1 mt-4 pt-4 border-t border-[#E8E2D5]">
                <button
                  onClick={() => openEdit(addr)}
                  className="flex items-center gap-1.5 text-[#1A1A1A] hover:bg-[#FAF7F1] font-medium h-9 px-3 rounded-lg transition-colors text-xs"
                >
                  <Pencil className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Edit
                </button>
                {!addr.isDefaultShipping && (
                  <button className="flex items-center gap-1.5 text-[#1A1A1A] hover:bg-[#FAF7F1] font-medium h-9 px-3 rounded-lg transition-colors text-xs">
                    Set as default
                  </button>
                )}
                <button
                  onClick={() => setDeletingId(addr.id)}
                  className="flex items-center gap-1.5 text-[#8B2F2F] hover:bg-[#F4E6E6] font-medium h-9 px-3 rounded-lg transition-colors text-xs ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white rounded-2xl border border-[#E8E2D5] max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-sans text-base font-medium text-[#1A1A1A]">
              {editingAddress ? "Edit address" : "New address"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {(["fullName", "line1", "line2", "city", "zip", "phone"] as const).map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block text-[11px] uppercase tracking-[0.12em] text-[#6B6760] mb-1.5">
                  {field === "fullName" ? "Full Name" : field === "line1" ? "Address Line 1" : field === "line2" ? "Address Line 2 (optional)" : field === "zip" ? "Postal Code" : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  {...f(field)}
                  className="w-full h-11 rounded-xl border border-[#E8E2D5] bg-white px-4 text-sm text-[#1A1A1A] placeholder:text-[#9A9489] focus:border-[#C8A96E] focus:ring-2 focus:ring-[#C8A96E]/30 focus:outline-none transition-colors"
                />
              </div>
            ))}

            <div>
              <label htmlFor="country" className="block text-[11px] uppercase tracking-[0.12em] text-[#6B6760] mb-1.5">Country</label>
              <select
                {...f("country")}
                className="w-full h-11 rounded-xl border border-[#E8E2D5] bg-white px-4 text-sm text-[#1A1A1A] focus:border-[#C8A96E] focus:ring-2 focus:ring-[#C8A96E]/30 focus:outline-none transition-colors"
              >
                <option>Turkey</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Germany</option>
                <option>France</option>
              </select>
            </div>

            <div className="flex gap-6 pt-1">
              {(["isDefaultShipping", "isDefaultBilling"] as const).map((key) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.checked }))}
                    className="w-4 h-4 rounded border-[#E8E2D5] accent-[#C8A96E]"
                  />
                  <span className="font-sans text-xs text-[#1A1A1A]">
                    {key === "isDefaultShipping" ? "Default shipping" : "Default billing"}
                  </span>
                </label>
              ))}
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-[#C8A96E] hover:bg-[#B8995E] text-[#0B0B0B] font-medium h-11 px-6 rounded-xl transition-colors text-sm mt-2"
            >
              {editingAddress ? "Save changes" : "Add address"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent className="bg-white rounded-2xl border border-[#E8E2D5]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-sans text-base font-medium text-[#1A1A1A]">
              Delete address?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-sans text-sm text-[#6B6760]">
              This address will be permanently removed from your account.
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
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
