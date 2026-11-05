// Account profile page — personal details, contact info, marketing preferences.
"use client"

import { useState } from "react"
import { Pencil, AlertCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Breadcrumbs } from "@/components/account/Breadcrumbs"

// MOCK — replace with API call to GET /api/v1/account/profile
const mockProfile = {
  displayName: "kaan3162",
  email: "kaan3162@gmail.com",
  phone: "5555555555",
  dob: "2000-01-15",
  emailOffers: true,
  smsUpdates: false,
}

export default function ProfilePage() {
  const [editingName, setEditingName] = useState(false)
  const [displayName, setDisplayName] = useState(mockProfile.displayName)
  const [nameInput, setNameInput] = useState(mockProfile.displayName)
  const [phone, setPhone] = useState(mockProfile.phone)
  const [dob, setDob] = useState(mockProfile.dob)
  const [emailOffers, setEmailOffers] = useState(mockProfile.emailOffers)
  const [smsUpdates, setSmsUpdates] = useState(mockProfile.smsUpdates)
  const [isDirty, setIsDirty] = useState(false)

  const markDirty = () => setIsDirty(true)

  const handleSave = () => {
    setDisplayName(nameInput)
    setIsDirty(false)
    setEditingName(false)
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: "Account", href: "/account" }, { label: "Profile" }]} />

      <div className="mb-6">
        <h2 className="font-sans text-2xl font-medium text-[#1A1A1A] mb-1">Profile</h2>
        <p className="font-sans text-sm text-[#6B6760]">
          Manage your personal details and how we contact you.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E2D5]">
        {/* Identity */}
        <div className="p-6 md:p-8">
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#6B6760] mb-5">Identity</p>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-[#0B0B0B] flex items-center justify-center flex-shrink-0">
              <span className="font-sans text-white font-medium text-lg uppercase">
                {displayName.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] uppercase tracking-[0.12em] text-[#6B6760] mb-1">Name</p>
              {editingName ? (
                <div className="flex gap-2 items-center">
                  <input
                    value={nameInput}
                    onChange={(e) => { setNameInput(e.target.value); markDirty() }}
                    className="h-11 rounded-xl border border-[#E8E2D5] bg-white px-4 text-sm text-[#1A1A1A] placeholder:text-[#9A9489] focus:border-[#C8A96E] focus:ring-2 focus:ring-[#C8A96E]/30 focus:outline-none transition-colors"
                    autoFocus
                  />
                  <button
                    onClick={() => setEditingName(false)}
                    className="text-[#6B6760] hover:text-[#1A1A1A] text-xs font-medium px-2 py-1"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-sans text-sm font-medium text-[#1A1A1A]">{displayName}</span>
                  <button
                    onClick={() => setEditingName(true)}
                    aria-label="Edit name"
                    className="text-[#9A9489] hover:text-[#1A1A1A] transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator className="bg-[#E8E2D5]" />

        {/* Contact */}
        <div className="p-6 md:p-8">
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#6B6760] mb-5">Contact</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Email — read-only */}
            <div>
              <p className="text-[11px] uppercase tracking-[0.12em] text-[#6B6760] mb-1.5">
                E-Mail
              </p>
              <div className="h-11 rounded-xl border border-[#E8E2D5] bg-[#FAF7F1] px-4 flex items-center">
                <span className="font-sans text-sm text-[#6B6760]">{mockProfile.email}</span>
              </div>
              <p className="font-sans text-xs text-[#9A9489] mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0" strokeWidth={1.5} />
                Email cannot be changed — contact support
              </p>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-[11px] uppercase tracking-[0.12em] text-[#6B6760] mb-1.5"
              >
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); markDirty() }}
                className="w-full h-11 rounded-xl border border-[#E8E2D5] bg-white px-4 text-sm text-[#1A1A1A] placeholder:text-[#9A9489] focus:border-[#C8A96E] focus:ring-2 focus:ring-[#C8A96E]/30 focus:outline-none transition-colors"
              />
            </div>

            {/* Date of birth */}
            <div>
              <label
                htmlFor="dob"
                className="block text-[11px] uppercase tracking-[0.12em] text-[#6B6760] mb-1.5"
              >
                Date of Birth
              </label>
              <input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => { setDob(e.target.value); markDirty() }}
                className="w-full h-11 rounded-xl border border-[#E8E2D5] bg-white px-4 text-sm text-[#1A1A1A] focus:border-[#C8A96E] focus:ring-2 focus:ring-[#C8A96E]/30 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        <Separator className="bg-[#E8E2D5]" />

        {/* Marketing consent */}
        <div className="p-6 md:p-8">
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#6B6760] mb-5">
            Communication
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label htmlFor="emailOffers" className="font-sans text-sm font-medium text-[#1A1A1A]">
                  Personalised offers by email
                </Label>
                <p className="font-sans text-xs text-[#6B6760] mt-0.5">
                  Deals tailored to your purchase history.
                </p>
              </div>
              <Switch
                id="emailOffers"
                checked={emailOffers}
                onCheckedChange={(v) => { setEmailOffers(v); markDirty() }}
                className="data-[state=checked]:bg-[#C8A96E]"
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label htmlFor="smsUpdates" className="font-sans text-sm font-medium text-[#1A1A1A]">
                  SMS order updates
                </Label>
                <p className="font-sans text-xs text-[#6B6760] mt-0.5">
                  Shipping and delivery alerts via text.
                </p>
              </div>
              <Switch
                id="smsUpdates"
                checked={smsUpdates}
                onCheckedChange={(v) => { setSmsUpdates(v); markDirty() }}
                className="data-[state=checked]:bg-[#C8A96E]"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 md:px-8 pb-6 md:pb-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={!isDirty}
            className="bg-[#C8A96E] hover:bg-[#B8995E] text-[#0B0B0B] font-medium h-11 px-6 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  )
}
