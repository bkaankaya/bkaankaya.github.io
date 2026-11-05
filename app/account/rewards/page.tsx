// Vague Club loyalty & rewards page.
"use client"

import { useState } from "react"
import { ShoppingBag, Star, MessageCircle, Mail, Link as LinkIcon, Copy, Check } from "lucide-react"
import { Breadcrumbs } from "@/components/account/Breadcrumbs"
import { Separator } from "@/components/ui/separator"

// MOCK — replace with API call to GET /api/v1/account/rewards
const mockRewards = {
  tierName: "GOLD TIER",
  points: 1850,
  nextTier: "PLATINUM",
  pointsToNext: 450,
  totalToNext: 2300,
  referralCode: "KAAN-VG2026",
  history: [
    { date: "May 6, 2026", reason: "Order ORD-2026-0007", points: +180 },
    { date: "Apr 18, 2026", reason: "Product review — Whey Isolate Pro", points: +100 },
    { date: "Mar 3, 2026", reason: "Order ORD-2026-0001", points: +45 },
    { date: "Feb 20, 2026", reason: "Referral — Yusuf A.", points: +50 },
    { date: "Feb 10, 2026", reason: "Redeemed — $5 off coupon", points: -500 },
    { date: "Jan 15, 2026", reason: "Welcome bonus", points: +200 },
  ],
}

const redeemOptions = [
  { id: "r1", label: "$5 off", pts: 500, desc: "One-time voucher" },
  { id: "r2", label: "Free shipping", pts: 300, desc: "Your next order" },
  { id: "r3", label: "Mystery sample box", pts: 750, desc: "3 trial packs" },
]

export default function RewardsPage() {
  const d = mockRewards
  const progressPct = Math.min(100, Math.round(((d.totalToNext - d.pointsToNext) / d.totalToNext) * 100))
  const [copied, setCopied] = useState(false)

  const copyCode = async () => {
    await navigator.clipboard.writeText(d.referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: "Account", href: "/account" }, { label: "Rewards" }]} />

      {/* Hero */}
      <div className="bg-white rounded-2xl border border-[#E8E2D5] p-8 md:p-10 mb-6 text-center">
        <p className="text-[11px] uppercase tracking-[0.12em] text-[#6B6760] mb-2">Vague Club</p>
        <p className="font-sans text-lg uppercase tracking-widest font-medium text-[#1A1A1A] mb-3">
          {d.tierName}
        </p>
        <p className="font-sans text-7xl tabular-nums font-semibold text-[#C8A96E] leading-none mb-6">
          {d.points.toLocaleString()}
        </p>
        <div className="max-w-xs mx-auto">
          <div className="h-1.5 rounded-full bg-[#E8E2D5] mb-2">
            <div
              className="h-full rounded-full bg-[#C8A96E] transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="font-sans text-xs text-[#6B6760]">
            {d.pointsToNext} pts until {d.nextTier}
          </p>
        </div>
      </div>

      {/* 3-up grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Earn */}
        <div className="bg-white rounded-2xl border border-[#E8E2D5] p-6">
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#6B6760] mb-4">Earn Points</p>
          <ul className="space-y-3">
            {[
              { icon: ShoppingBag, body: "1 pt per $1 spent", pts: "1×" },
              { icon: Star, body: "Product review", pts: "+100" },
              { icon: MessageCircle, body: "Referral signup", pts: "+50" },
            ].map(({ icon: Icon, body, pts }) => (
              <li key={body} className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-[#9A9489] flex-shrink-0" strokeWidth={1.5} />
                <span className="flex-1 font-sans text-sm text-[#1A1A1A]">{body}</span>
                <span className="font-sans text-sm tabular-nums font-medium text-[#C8A96E]">{pts}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Redeem */}
        <div className="bg-white rounded-2xl border border-[#E8E2D5] p-6">
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#6B6760] mb-4">Redeem Rewards</p>
          <ul className="space-y-3">
            {redeemOptions.map((opt) => {
              const canRedeem = d.points >= opt.pts
              return (
                <li key={opt.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm font-medium text-[#1A1A1A]">{opt.label}</p>
                    <p className="font-sans text-xs text-[#6B6760]">{opt.desc}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-sans text-xs tabular-nums text-[#C8A96E]">{opt.pts} pts</span>
                    <button
                      disabled={!canRedeem}
                      className="text-[#1A1A1A] hover:bg-[#FAF7F1] font-medium h-7 px-3 rounded-lg transition-colors text-xs border border-[#E8E2D5] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Redeem
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Refer */}
        <div className="bg-white rounded-2xl border border-[#E8E2D5] p-6">
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#6B6760] mb-4">Refer a Friend</p>
          <div className="bg-[#FAF7F1] border border-dashed border-[#E8E2D5] rounded-xl p-4 font-sans tabular-nums tracking-widest text-lg select-all text-center text-[#1A1A1A] mb-3">
            {d.referralCode}
          </div>
          <button
            onClick={copyCode}
            className="w-full flex items-center justify-center gap-2 h-10 bg-[#0B0B0B] hover:bg-[#1A1A1A] text-white font-medium rounded-xl text-sm transition-colors mb-4"
          >
            {copied ? <Check className="w-4 h-4" strokeWidth={2} /> : <Copy className="w-4 h-4" strokeWidth={1.5} />}
            {copied ? "Copied!" : "Copy code"}
          </button>
          <div className="flex justify-center gap-4">
            <button aria-label="Share via email" className="w-9 h-9 rounded-lg border border-[#E8E2D5] flex items-center justify-center text-[#6B6760] hover:text-[#1A1A1A] hover:bg-[#FAF7F1] transition-colors">
              <Mail className="w-4 h-4" strokeWidth={1.5} />
            </button>
            <button aria-label="Share via SMS" className="w-9 h-9 rounded-lg border border-[#E8E2D5] flex items-center justify-center text-[#6B6760] hover:text-[#1A1A1A] hover:bg-[#FAF7F1] transition-colors">
              <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
            </button>
            <button aria-label="Copy link" className="w-9 h-9 rounded-lg border border-[#E8E2D5] flex items-center justify-center text-[#6B6760] hover:text-[#1A1A1A] hover:bg-[#FAF7F1] transition-colors">
              <LinkIcon className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Points history */}
      <div className="bg-white rounded-2xl border border-[#E8E2D5] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E8E2D5]">
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#6B6760]">Points History</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E8E2D5]">
              {["Date", "Reason", "Points"].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-[11px] uppercase tracking-[0.12em] text-[#6B6760] font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {d.history.map((row, i) => (
              <tr key={i} className="border-b border-[#E8E2D5] last:border-0 hover:bg-[#FAF7F1] transition-colors">
                <td className="px-6 py-4 font-sans text-xs text-[#6B6760] whitespace-nowrap">{row.date}</td>
                <td className="px-6 py-4 font-sans text-sm text-[#1A1A1A]">{row.reason}</td>
                <td className={`px-6 py-4 font-sans text-sm tabular-nums font-medium whitespace-nowrap ${row.points > 0 ? "text-[#C8A96E]" : "text-[#6B6760]"}`}>
                  {row.points > 0 ? `+${row.points}` : row.points} pts
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
