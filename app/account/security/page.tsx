// Security settings — password, 2FA, active sessions, delete account.
"use client"

import { useState } from "react"
import { Laptop, Smartphone, Tablet, Eye, EyeOff, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Breadcrumbs } from "@/components/account/Breadcrumbs"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

// MOCK — replace with API call to GET /api/v1/account/security
const mockSessions = [
  { id: "s1", device: "laptop" as const, browser: "Chrome 124", os: "macOS 14", location: "Istanbul, TR", lastActive: "Now", isCurrent: true },
  { id: "s2", device: "smartphone" as const, browser: "Safari 17", os: "iOS 17", location: "Istanbul, TR", lastActive: "2h ago", isCurrent: false },
  { id: "s3", device: "laptop" as const, browser: "Firefox 125", os: "Windows 11", location: "Ankara, TR", lastActive: "3d ago", isCurrent: false },
]

const DeviceIcon = ({ type }: { type: "laptop" | "smartphone" | "tablet" }) => {
  const cls = "w-5 h-5 text-[#6B6760] flex-shrink-0"
  if (type === "smartphone") return <Smartphone className={cls} strokeWidth={1.5} />
  if (type === "tablet") return <Tablet className={cls} strokeWidth={1.5} />
  return <Laptop className={cls} strokeWidth={1.5} />
}

function PasswordStrengthBar({ password }: { password: string }) {
  const score =
    (password.length >= 8 ? 1 : 0) +
    (/[A-Z]/.test(password) ? 1 : 0) +
    (/[0-9]/.test(password) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(password) ? 1 : 0)

  const labels = ["", "Weak", "Fair", "Good", "Strong"]
  const colors = ["bg-[#E8E2D5]", "bg-[#8B2F2F]", "bg-amber-500", "bg-[#2F6B3E]", "bg-[#C8A96E]"]

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i <= score ? colors[score] : "bg-[#E8E2D5]"}`} />
        ))}
      </div>
      {password.length > 0 && (
        <p className="font-sans text-xs text-[#6B6760]">{labels[score]}</p>
      )}
    </div>
  )
}

function PasswordInput({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  const [visible, setVisible] = useState(false)
  return (
    <div>
      <label htmlFor={id} className="block text-[11px] uppercase tracking-[0.12em] text-[#6B6760] mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-11 rounded-xl border border-[#E8E2D5] bg-white px-4 pr-10 text-sm text-[#1A1A1A] placeholder:text-[#9A9489] focus:border-[#C8A96E] focus:ring-2 focus:ring-[#C8A96E]/30 focus:outline-none transition-colors"
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9489] hover:text-[#1A1A1A] transition-colors"
        >
          {visible ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
        </button>
      </div>
    </div>
  )
}

export default function SecurityPage() {
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [twoFADialogOpen, setTwoFADialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)
  const [sessions, setSessions] = useState(mockSessions)

  const [currentPw, setCurrentPw] = useState("")
  const [newPw, setNewPw] = useState("")
  const [confirmPw, setConfirmPw] = useState("")
  const [pwError, setPwError] = useState("")
  const [otpValue, setOtpValue] = useState("")

  const [deleteEmail, setDeleteEmail] = useState("")
  const [deleteConfirmText, setDeleteConfirmText] = useState("")

  const handle2FAToggle = (v: boolean) => {
    if (v) {
      setTwoFADialogOpen(true)
    } else {
      setTwoFAEnabled(false)
    }
  }

  const handlePasswordSave = () => {
    if (newPw.length < 8) { setPwError("Password must be at least 8 characters."); return }
    if (!/[A-Z]/.test(newPw)) { setPwError("Include at least one uppercase letter."); return }
    if (!/[0-9]/.test(newPw)) { setPwError("Include at least one number."); return }
    if (newPw !== confirmPw) { setPwError("Passwords don't match."); return }
    setPwError("")
    setPasswordDialogOpen(false)
    setCurrentPw(""); setNewPw(""); setConfirmPw("")
  }

  const signOutSession = (id: string) =>
    setSessions((prev) => prev.filter((s) => s.id !== id))

  return (
    <div>
      <Breadcrumbs items={[{ label: "Account", href: "/account" }, { label: "Security" }]} />

      <div className="mb-6">
        <h2 className="font-sans text-2xl font-medium text-[#1A1A1A] mb-1">Security</h2>
      </div>

      <div className="flex flex-col gap-4">
        {/* Password */}
        <div className="bg-white rounded-2xl border border-[#E8E2D5] p-6">
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#6B6760] mb-4">Password</p>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-sans text-sm font-medium text-[#1A1A1A]">Last changed</p>
              <p className="font-sans text-xs text-[#6B6760] mt-0.5">January 15, 2026</p>
            </div>
            <button
              onClick={() => setPasswordDialogOpen(true)}
              className="flex-shrink-0 bg-[#C8A96E] hover:bg-[#B8995E] text-[#0B0B0B] font-medium h-11 px-5 rounded-xl transition-colors text-sm"
            >
              Change password
            </button>
          </div>
        </div>

        {/* 2FA */}
        <div className="bg-white rounded-2xl border border-[#E8E2D5] p-6">
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#6B6760] mb-4">
            Two-Factor Authentication
          </p>
          <div className="flex items-start justify-between gap-4">
            <div>
              <Label htmlFor="2fa" className="font-sans text-sm font-medium text-[#1A1A1A]">
                Enable 2FA via authenticator app
              </Label>
              <p className="font-sans text-xs text-[#6B6760] mt-0.5 max-w-xs leading-relaxed">
                Add an extra layer of security to your account using Google Authenticator or similar.
              </p>
            </div>
            <Switch
              id="2fa"
              checked={twoFAEnabled}
              onCheckedChange={handle2FAToggle}
              className="data-[state=checked]:bg-[#C8A96E] flex-shrink-0"
            />
          </div>
        </div>

        {/* Active sessions */}
        <div className="bg-white rounded-2xl border border-[#E8E2D5] overflow-hidden">
          <div className="p-6 border-b border-[#E8E2D5]">
            <p className="text-[11px] uppercase tracking-[0.12em] text-[#6B6760]">Active Sessions</p>
          </div>
          {sessions.map((session) => (
            <div key={session.id} className="px-6 py-4 border-b border-[#E8E2D5] last:border-0 flex items-center gap-4">
              <DeviceIcon type={session.device} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-sans text-sm font-medium text-[#1A1A1A]">
                    {session.browser} · {session.os}
                  </p>
                  {session.isCurrent && (
                    <span className="rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em] text-[#8B7340] bg-[#F0E5CC]">
                      This Device
                    </span>
                  )}
                </div>
                <p className="font-sans text-xs text-[#6B6760] mt-0.5">
                  {session.location} &middot; {session.lastActive}
                </p>
              </div>
              {!session.isCurrent && (
                <button
                  onClick={() => signOutSession(session.id)}
                  className="flex-shrink-0 text-[#8B2F2F] hover:bg-[#F4E6E6] font-medium h-9 px-3 rounded-lg transition-colors text-xs"
                >
                  Sign out
                </button>
              )}
            </div>
          ))}
          {sessions.filter((s) => !s.isCurrent).length > 0 && (
            <div className="px-6 py-4 border-t border-[#E8E2D5]">
              <button
                onClick={() => setSessions((prev) => prev.filter((s) => s.isCurrent))}
                className="text-[#8B2F2F] hover:bg-[#F4E6E6] font-medium h-9 px-3 rounded-lg transition-colors text-sm"
              >
                Sign out of all other devices
              </button>
            </div>
          )}
        </div>

        {/* Delete account */}
        <div className="bg-white rounded-2xl border border-[#E8E2D5] p-6">
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#6B6760] mb-4">Delete Account</p>
          <p className="font-sans text-xs text-[#6B6760] leading-relaxed mb-4 max-w-prose">
            This will permanently delete your data after 30 days. Active orders must complete before deletion can proceed.
          </p>
          <button
            onClick={() => setDeleteDialogOpen(true)}
            className="text-[#8B2F2F] hover:bg-[#F4E6E6] font-medium h-10 px-4 rounded-xl transition-colors text-sm border border-[#F4E6E6]"
          >
            Delete account
          </button>
        </div>
      </div>

      {/* Change password dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="bg-white rounded-2xl border border-[#E8E2D5] max-w-md">
          <DialogHeader>
            <DialogTitle className="font-sans text-base font-medium text-[#1A1A1A]">
              Change password
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <PasswordInput id="currentPw" label="Current Password" value={currentPw} onChange={setCurrentPw} />
            <PasswordInput id="newPw" label="New Password" value={newPw} onChange={setNewPw} />
            <PasswordStrengthBar password={newPw} />
            <PasswordInput id="confirmPw" label="Confirm New Password" value={confirmPw} onChange={setConfirmPw} />
            {pwError && (
              <p className="text-xs text-[#8B2F2F] flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />
                {pwError}
              </p>
            )}
            <button
              onClick={handlePasswordSave}
              className="w-full bg-[#C8A96E] hover:bg-[#B8995E] text-[#0B0B0B] font-medium h-11 px-6 rounded-xl transition-colors text-sm"
            >
              Save new password
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 2FA setup dialog */}
      <Dialog open={twoFADialogOpen} onOpenChange={setTwoFADialogOpen}>
        <DialogContent className="bg-white rounded-2xl border border-[#E8E2D5] max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-sans text-base font-medium text-[#1A1A1A]">
              Set up authenticator
            </DialogTitle>
          </DialogHeader>
          <div className="mt-3 flex flex-col items-center gap-4">
            <div className="bg-[#FAF7F1] border border-dashed border-[#E8E2D5] h-48 w-48 rounded-xl grid place-items-center">
              <p className="text-xs text-[#9A9489] text-center px-4">
                QR placeholder — wired to /api/v1/auth/2fa/setup
              </p>
            </div>
            <p className="font-sans text-xs text-[#6B6760] text-center max-w-xs">
              Scan with Google Authenticator or Authy, then enter the 6-digit code below.
            </p>
            <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <button
              disabled={otpValue.length < 6}
              onClick={() => { setTwoFAEnabled(true); setTwoFADialogOpen(false); setOtpValue("") }}
              className="w-full bg-[#C8A96E] hover:bg-[#B8995E] text-[#0B0B0B] font-medium h-11 px-6 rounded-xl transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Verify and enable
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete account dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white rounded-2xl border border-[#E8E2D5]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-sans text-base font-medium text-[#1A1A1A]">
              Delete account?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-sans text-sm text-[#6B6760]">
              This action is irreversible. Type your email and DELETE to confirm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3 my-2">
            <input
              value={deleteEmail}
              onChange={(e) => setDeleteEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full h-11 rounded-xl border border-[#E8E2D5] bg-white px-4 text-sm text-[#1A1A1A] placeholder:text-[#9A9489] focus:border-[#8B2F2F] focus:ring-2 focus:ring-[#8B2F2F]/30 focus:outline-none transition-colors"
            />
            <input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full h-11 rounded-xl border border-[#E8E2D5] bg-white px-4 text-sm text-[#1A1A1A] placeholder:text-[#9A9489] focus:border-[#8B2F2F] focus:ring-2 focus:ring-[#8B2F2F]/30 focus:outline-none transition-colors"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-medium h-10 px-4 rounded-xl text-sm bg-white border border-[#E8E2D5] text-[#1A1A1A] hover:bg-[#FAF7F1]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteConfirmText !== "DELETE" || !deleteEmail}
              className="font-medium h-10 px-4 rounded-xl text-sm bg-[#8B2F2F] text-white hover:bg-[#7A2828] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Delete my account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
