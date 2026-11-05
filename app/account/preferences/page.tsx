// Communication preferences / GDPR preference centre.
"use client"

import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Breadcrumbs } from "@/components/account/Breadcrumbs"

interface Prefs {
  emailOrderUpdates: boolean
  emailLaunches: boolean
  emailPersonalised: boolean
  emailClubNews: boolean
  smsShipping: boolean
  smsPromo: boolean
  pushOrders: boolean
  pushMarketing: boolean
}

// MOCK — replace with API call to GET /api/v1/account/preferences
const initialPrefs: Prefs = {
  emailOrderUpdates: true,
  emailLaunches: true,
  emailPersonalised: false,
  emailClubNews: true,
  smsShipping: true,
  smsPromo: false,
  pushOrders: true,
  pushMarketing: false,
}

interface SwitchRowProps {
  id: string
  label: string
  description?: string
  checked: boolean
  disabled?: boolean
  onChange?: (v: boolean) => void
}

function SwitchRow({ id, label, description, checked, disabled, onChange }: SwitchRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="flex-1 min-w-0">
        <Label htmlFor={id} className="font-sans text-sm font-medium text-[#1A1A1A] cursor-pointer">
          {label}
        </Label>
        {description && (
          <p className="font-sans text-xs text-[#6B6760] mt-0.5 leading-relaxed">{description}</p>
        )}
        {disabled && (
          <span className="font-sans text-[11px] uppercase tracking-[0.08em] text-[#9A9489] mt-0.5 inline-block">
            Required
          </span>
        )}
      </div>
      <Switch
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-[#C8A96E] flex-shrink-0"
      />
    </div>
  )
}

export default function PreferencesPage() {
  const [prefs, setPrefs] = useState<Prefs>(initialPrefs)
  const [isDirty, setIsDirty] = useState(false)

  const set = (key: keyof Prefs) => (v: boolean) => {
    setPrefs((p) => ({ ...p, [key]: v }))
    setIsDirty(true)
  }

  const unsubscribeAll = () => {
    setPrefs((p) => ({
      ...p,
      emailLaunches: false,
      emailPersonalised: false,
      emailClubNews: false,
      smsShipping: false,
      smsPromo: false,
      pushOrders: false,
      pushMarketing: false,
    }))
    setIsDirty(true)
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: "Account", href: "/account" }, { label: "Communication" }]} />

      <div className="mb-6">
        <h2 className="font-sans text-2xl font-medium text-[#1A1A1A] mb-1">Communication</h2>
        <p className="font-sans text-sm text-[#6B6760] max-w-prose">
          Choose how Vague keeps in touch with you. You can change this anytime.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E2D5] divide-y divide-[#E8E2D5]">
        {/* Email */}
        <div className="px-6 md:px-8 pb-2">
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#6B6760] pt-6 mb-0">
            Email
          </p>
          <SwitchRow
            id="emailOrderUpdates"
            label="Order updates"
            description="Confirmations, shipping notices, and delivery updates."
            checked={prefs.emailOrderUpdates}
            disabled
          />
          <SwitchRow
            id="emailLaunches"
            label="New product launches"
            description="Be first to hear about drops and restocks."
            checked={prefs.emailLaunches}
            onChange={set("emailLaunches")}
          />
          <SwitchRow
            id="emailPersonalised"
            label="Personalised offers"
            description="Deals based on your purchase history and browsing."
            checked={prefs.emailPersonalised}
            onChange={set("emailPersonalised")}
          />
          <SwitchRow
            id="emailClubNews"
            label="Vague Club news"
            description="Tier milestones, reward drops, and loyalty updates."
            checked={prefs.emailClubNews}
            onChange={set("emailClubNews")}
          />
        </div>

        {/* SMS */}
        <div className="px-6 md:px-8 pb-2">
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#6B6760] pt-6 mb-0">
            SMS
          </p>
          <SwitchRow
            id="smsShipping"
            label="Shipping & delivery alerts"
            description="Text updates when your order ships or is delivered."
            checked={prefs.smsShipping}
            onChange={set("smsShipping")}
          />
          <SwitchRow
            id="smsPromo"
            label="Promotional SMS"
            description="Occasional offers and sale alerts by text."
            checked={prefs.smsPromo}
            onChange={set("smsPromo")}
          />
        </div>

        {/* Push */}
        <div className="px-6 md:px-8 pb-2">
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#6B6760] pt-6 mb-0">
            Push Notifications
          </p>
          <SwitchRow
            id="pushOrders"
            label="Order updates"
            description="Real-time push notifications for your orders."
            checked={prefs.pushOrders}
            onChange={set("pushOrders")}
          />
          <SwitchRow
            id="pushMarketing"
            label="Marketing notifications"
            description="Promotions and product announcements."
            checked={prefs.pushMarketing}
            onChange={set("pushMarketing")}
          />
        </div>

        {/* Unsubscribe all */}
        <div className="px-6 md:px-8 py-5">
          <div className="border-t border-dashed border-[#E8E2D5] pt-5">
            <p className="font-sans text-xs text-[#6B6760] mb-3">
              Unsubscribing removes all optional marketing communications. Transactional emails (order confirmations, shipping updates) are always sent.
            </p>
            <button
              onClick={unsubscribeAll}
              className="text-[#8B2F2F] hover:bg-[#F4E6E6] font-medium h-10 px-4 rounded-xl transition-colors text-sm"
            >
              Unsubscribe from all marketing
            </button>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="mt-6 flex justify-end">
        <button
          disabled={!isDirty}
          className="bg-[#C8A96E] hover:bg-[#B8995E] text-[#0B0B0B] font-medium h-11 px-6 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
        >
          Save preferences
        </button>
      </div>
    </div>
  )
}
