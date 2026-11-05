/**
 * ============================================================
 * PROJEYE ENTEGRE EDİLECEK YENİLİKLER — VAGUE ACCOUNT AREA
 * ============================================================
 *
 * RENK PALETİ (Ana sayfayla uyumlu):
 *   Arka plan      : #ffffff (beyaz) / #f5f5f5 (açık gri)
 *   Navbar/Footer  : #0d1117 (koyu siyah-lacivert)
 *   Altın aksan    : #C9963A (VAGUE LABS/GEAR etiket rengi)
 *   Birincil metin : #111111
 *   İkincil metin  : #6b7280
 *   Kenarlık       : #e5e7eb
 *   Kart yüzeyi    : #ffffff
 *   Vurgu hover    : #faf5eb
 *
 * DOSYA YAPISI — her bölüm kendi rotasına yerleştirilecek:
 *
 *  [A]  components/account/AccountShell.tsx      — sidebar + header + mobile nav
 *  [B]  components/account/OrderTracker.tsx      — 4-adım sipariş takip çizgisi
 *  [C]  components/account/StatusBadge.tsx       — sipariş durum etiketi
 *  [D]  app/account/layout.tsx                   — route shell
 *  [E]  app/account/page.tsx                     — Dashboard
 *  [F]  app/account/profile/page.tsx             — Profil
 *  [G]  app/account/orders/page.tsx              — Siparişlerim
 *  [H]  app/account/orders/[orderId]/page.tsx    — Sipariş Detayı
 *  [I]  app/account/addresses/page.tsx           — Adresler
 *  [J]  app/account/payment-methods/page.tsx     — Ödeme Yöntemleri
 *  [K]  app/account/wishlist/page.tsx            — İstek Listesi
 *  [L]  app/account/rewards/page.tsx             — Ödüller (Vague Club)
 *  [M]  app/account/returns/page.tsx             — İadeler & Değişimler
 *  [N]  app/account/preferences/page.tsx         — İletişim Tercihleri
 *  [O]  app/account/security/page.tsx            — Güvenlik
 * ============================================================
 */

// ─────────────────────────────────────────────────────────────
// [A]  components/account/AccountShell.tsx
// ─────────────────────────────────────────────────────────────
// "use client"
//
// Sidebar, mobile nav scroll pill ve header şeridini içerir.
// usePathname ile aktif link belirlenir.
//
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { LayoutDashboard, User, MapPin, CreditCard, Package,
//          Heart, RotateCcw, Star, Bell, Shield, LogOut } from "lucide-react"
//
// export function AccountSidebar() {
//   const pathname = usePathname()
//   const sections = [
//     { label: "Hesabım", items: [
//       { href: "/account",                label: "Dashboard",         icon: LayoutDashboard },
//       { href: "/account/profile",        label: "Profil",            icon: User },
//       { href: "/account/addresses",      label: "Adresler",          icon: MapPin },
//       { href: "/account/payment-methods",label: "Ödeme Yöntemleri",  icon: CreditCard },
//     ]},
//     { label: "Siparişler", items: [
//       { href: "/account/orders",   label: "Siparişlerim", icon: Package },
//       { href: "/account/wishlist", label: "İstek Listesi",icon: Heart },
//       { href: "/account/returns",  label: "İadeler",      icon: RotateCcw },
//     ]},
//     { label: "Ödüller & Ayarlar", items: [
//       { href: "/account/rewards",     label: "Vague Club",   icon: Star },
//       { href: "/account/preferences", label: "Bildirimler",  icon: Bell },
//       { href: "/account/security",    label: "Güvenlik",     icon: Shield },
//     ]},
//   ]
//   return (
//     <nav className="hidden md:flex flex-col w-56 flex-shrink-0 sticky top-24 self-start">
//       {sections.map((section, si) => (
//         <div key={section.label} className={si > 0 ? "mt-6" : ""}>
//           <p className="text-[10px] uppercase tracking-widest text-[#6b7280] px-3 mb-1.5">
//             {section.label}
//           </p>
//           <ul>
//             {section.items.map((item) => {
//               const isActive = pathname === item.href ||
//                 (item.href !== "/account" && pathname.startsWith(item.href))
//               return (
//                 <li key={item.href}>
//                   <Link href={item.href}
//                     className={`flex items-center gap-3 h-10 rounded-lg text-sm transition-colors ${
//                       isActive
//                         ? "border-l-2 border-[#C9963A] bg-[#faf5eb] text-[#111111] font-medium pl-[14px] pr-3"
//                         : "text-[#6b7280] hover:bg-[#f5f5f5] hover:text-[#111111] px-3"
//                     }`}>
//                     <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-[#C9963A]" : "text-[#9ca3af]"}`} strokeWidth={1.5} />
//                     {item.label}
//                   </Link>
//                 </li>
//               )
//             })}
//           </ul>
//         </div>
//       ))}
//       <div className="mt-6 pt-4 border-t border-[#e5e7eb]">
//         <button className="flex items-center gap-3 h-10 w-full px-3 rounded-lg text-sm text-[#6b7280] hover:bg-[#fff1f1] hover:text-[#b91c1c] transition-colors">
//           <LogOut className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
//           Çıkış Yap
//         </button>
//       </div>
//     </nav>
//   )
// }

// ─────────────────────────────────────────────────────────────
// [B]  components/account/OrderTracker.tsx
// ─────────────────────────────────────────────────────────────
// Sipariş adımlarını anahtarlayan yatay ilerleme çizgisi.
// Tamamlanan adımlar: altın (#C9963A) daire + check
// Aktif adım: siyah (#0d1117) daire
// Gelecek adım: beyaz daire + gri kenarlık
//
// type TrackingStep = "received" | "preparing" | "shipped" | "delivered"
// Kullanım: <OrderTracker currentStep="preparing" />

// ─────────────────────────────────────────────────────────────
// [C]  components/account/StatusBadge.tsx
// ─────────────────────────────────────────────────────────────
// Sipariş durum etiketi. Renkler:
//   pending   → sarı-amber bg (#fef3c7) + metin (#92400e)
//   confirmed → mavi  bg (#dbeafe)  + metin (#1e40af)
//   shipped   → mor   bg (#ede9fe)  + metin (#5b21b6)
//   delivered → yeşil bg (#d1fae5)  + metin (#065f46)
//   cancelled → kırmızı bg (#fee2e2)+ metin (#991b1b)
// Kullanım: <StatusBadge status="shipped" />

// ─────────────────────────────────────────────────────────────
// [D]  app/account/layout.tsx
// ─────────────────────────────────────────────────────────────
/*
import { Navbar } from "@/components/navbar"
import { AccountSidebar } from "@/components/account/AccountSidebar"
import { MobileAccountNav } from "@/components/account/MobileAccountNav"

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = { firstName: "Kaan", memberSince: "Ocak 2025", tier: "Gold", loyaltyPoints: 1850 }
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Navbar />
      <div className="pt-16">
        {/* Header strip */}
        <div className="bg-[#0d1117] border-b border-[#1f2937]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#9ca3af] mb-0.5">Hoş geldin</p>
              <h1 className="text-xl font-bold text-white">{user.firstName}</h1>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-[#9ca3af]">Vague Club</p>
                <p className="text-sm font-semibold text-[#C9963A]">{user.tier}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#9ca3af]">Puanlar</p>
                <p className="text-sm font-semibold text-white">{user.loyaltyPoints.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
        <MobileAccountNav />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex gap-8">
            <AccountSidebar />
            <main id="account-main" className="flex-1 min-w-0">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
*/

// ─────────────────────────────────────────────────────────────
// [E]  app/account/page.tsx  — Dashboard
// ─────────────────────────────────────────────────────────────
/*
export default function AccountDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#111111]">Dashboard</h2>

      {/* Özet Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Aktif Sipariş",  value: "2",      sub: "kargoda" },
          { label: "Toplam Sipariş", value: "14",     sub: "tüm zamanlar" },
          { label: "Club Puanı",     value: "1.850",  sub: "Gold üye" },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-[#e5e7eb] p-5">
            <p className="text-xs uppercase tracking-widest text-[#6b7280] mb-1">{c.label}</p>
            <p className="text-3xl font-bold text-[#111111]">{c.value}</p>
            <p className="text-xs text-[#9ca3af] mt-0.5">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Son Sipariş */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[#111111] uppercase tracking-wider">Son Sipariş</h3>
          <a href="/account/orders" className="text-xs text-[#C9963A] hover:underline">Tümünü gör →</a>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-[#f5f5f5] flex items-center justify-center text-[#9ca3af] text-lg font-bold flex-shrink-0">V</div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[#111111]">Premium Whey Protein</p>
            <p className="text-xs text-[#6b7280]">Çikolata — 900g × 1</p>
          </div>
          <span className="text-xs font-medium bg-[#fef3c7] text-[#92400e] px-2.5 py-1 rounded-full">Kargoda</span>
        </div>
      </div>
    </div>
  )
}
*/

// ─────────────────────────────────────────────────────────────
// [F]  app/account/profile/page.tsx  — Profil
// ─────────────────────────────────────────────────────────────
/*
"use client"
import { useState } from "react"
import { Pencil } from "lucide-react"

export default function ProfilePage() {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: "kaan3162", email: "kaan3162@gmail.com",
    phone: "5555555555", birthdate: "2026-05-01",
  })
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#111111]">Profil</h2>
      <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-[#6b7280]">Kişisel Bilgiler</span>
          <button onClick={() => setEditing(!editing)}
            className="flex items-center gap-1.5 text-xs text-[#C9963A] hover:text-[#a67c28] transition-colors">
            <Pencil className="w-3.5 h-3.5" />
            {editing ? "İptal" : "Düzenle"}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "İsim",         key: "name" },
            { label: "E-Mail",       key: "email" },
            { label: "Telefon",      key: "phone" },
            { label: "Doğum Tarihi", key: "birthdate" },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-xs text-[#6b7280] mb-1">{f.label}</label>
              {editing ? (
                <input
                  value={form[f.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9963A]/30 focus:border-[#C9963A]"
                />
              ) : (
                <p className="text-sm font-medium text-[#111111]">{form[f.key as keyof typeof form]}</p>
              )}
            </div>
          ))}
        </div>
        {editing && (
          <div className="flex gap-3 pt-2">
            <button onClick={() => setEditing(false)}
              className="px-5 py-2 text-sm font-medium bg-[#0d1117] text-white rounded-lg hover:bg-[#1f2937] transition-colors">
              Kaydet
            </button>
            <button onClick={() => setEditing(false)}
              className="px-5 py-2 text-sm font-medium border border-[#e5e7eb] text-[#6b7280] rounded-lg hover:bg-[#f5f5f5] transition-colors">
              Vazgeç
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
*/

// ─────────────────────────────────────────────────────────────
// [G]  app/account/orders/page.tsx  — Siparişlerim
// ─────────────────────────────────────────────────────────────
/*
import Link from "next/link"
import { StatusBadge } from "@/components/account/StatusBadge"

const MOCK_ORDERS = [
  {
    id: "2", date: "6 Mayıs 2026", itemCount: 3,
    total: "$2.159,64", status: "pending",
    items: [
      { name: "Vegan Protein Blend",    variant: "Limon — 150g × 1",         price: "$349,90", img: null },
      { name: "Pump Matrix Stim-Free",  variant: "Tropical — 30 Servings × 1",price: "$849,90", img: null },
      { name: "Vegan Protein Blend",    variant: "Çikolata — 900g × 1",      price: "$599,90", img: null },
    ],
  },
]

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#111111] flex items-center gap-2">
        <span className="text-[#C9963A]">📦</span> Siparişlerim
      </h2>
      {MOCK_ORDERS.map((order) => (
        <div key={order.id} className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-[#e5e7eb]">
            <div className="flex gap-6">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#6b7280]">Sipariş Tarihi</p>
                <p className="text-sm font-semibold text-[#111111]">{order.date}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#6b7280]">Ürün Sayısı</p>
                <p className="text-sm font-semibold text-[#111111]">{order.itemCount} Ürün</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#6b7280]">Toplam</p>
                <p className="text-sm font-semibold text-[#C9963A]">{order.total}</p>
              </div>
            </div>
            <StatusBadge status={order.status as any} />
          </div>
          <div className="divide-y divide-[#f5f5f5]">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                <div className="w-12 h-12 rounded-lg bg-[#f5f5f5] flex items-center justify-center text-[#9ca3af] font-bold text-base flex-shrink-0">
                  {item.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#111111] truncate">{item.name}</p>
                  <p className="text-xs text-[#6b7280]">{item.variant}</p>
                </div>
                <p className="text-sm font-semibold text-[#111111]">{item.price}</p>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 flex justify-end border-t border-[#f5f5f5]">
            <Link href={`/account/orders/${order.id}`}
              className="text-sm font-medium text-[#C9963A] hover:text-[#a67c28] transition-colors">
              Sipariş Detayı →
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
*/

// ─────────────────────────────────────────────────────────────
// [H]  app/account/orders/[orderId]/page.tsx  — Sipariş Detayı
// ─────────────────────────────────────────────────────────────
/*
import Link from "next/link"
import { OrderTracker } from "@/components/account/OrderTracker"

export default function OrderDetailPage({ params }: { params: { orderId: string } }) {
  const order = {
    id: params.orderId, date: "6 Mayıs 2026, 21:07",
    total: "$2.159,64", currentStep: "received" as const,
    items: [
      { name: "Vegan Protein Blend",   variant: "Limon — 150g",          qty: 1, price: "$349,90" },
      { name: "Pump Matrix Stim-Free", variant: "Tropical — 30 Servings", qty: 1, price: "$849,90" },
      { name: "Vegan Protein Blend",   variant: "Çikolata — 900g",        qty: 1, price: "$599,90" },
    ],
  }
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#111111]">Sipariş Detayı #{order.id}</h2>
          <p className="text-sm text-[#6b7280] mt-0.5">{order.date} tarihinde verildi.</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-[#6b7280]">Toplam Tutar</p>
          <p className="text-2xl font-bold text-[#C9963A]">{order.total}</p>
        </div>
      </div>

      <h3 className="text-sm font-semibold text-[#111111] uppercase tracking-wider">Kargolarınız</h3>
      <div className="space-y-4">
        {order.items.map((item, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
            <div className="flex items-start gap-4 p-5">
              <div className="w-14 h-14 rounded-lg bg-[#f5f5f5] flex items-center justify-center text-[#9ca3af] font-bold text-xl flex-shrink-0">
                {item.name[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#111111]">{item.name}</p>
                <p className="text-xs text-[#6b7280]">Varyant: {item.variant}</p>
                <p className="text-xs text-[#6b7280]">ADET: {item.qty}</p>
              </div>
              <p className="text-sm font-semibold text-[#111111]">{item.price}</p>
            </div>
            <div className="border-t border-[#f5f5f5] p-5">
              <OrderTracker currentStep={order.currentStep} />
            </div>
          </div>
        ))}
      </div>
      <Link href="/account/orders"
        className="inline-flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-[#111111] transition-colors">
        ← Siparişlere dön
      </Link>
    </div>
  )
}
*/

// ─────────────────────────────────────────────────────────────
// [I]  app/account/addresses/page.tsx  — Adresler
// ─────────────────────────────────────────────────────────────
/*
"use client"
import { useState } from "react"
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react"

type Address = { id: number; label: string; full: string; isDefault: boolean }

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#111111]">Adresler</h2>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 text-sm font-medium px-4 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f5f5f5] transition-colors text-[#111111]">
          <Plus className="w-4 h-4" /> Adres Ekle
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-10 flex flex-col items-center gap-3 text-center">
          <MapPin className="w-8 h-8 text-[#d1d5db]" strokeWidth={1} />
          <p className="text-sm text-[#6b7280]">Henüz kayıtlı bir adresiniz bulunmamaktadır.</p>
          <button onClick={() => setShowForm(true)}
            className="mt-2 px-5 py-2 text-sm font-medium bg-[#0d1117] text-white rounded-lg hover:bg-[#1f2937] transition-colors">
            İlk Adresinizi Ekleyin
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white rounded-xl border border-[#e5e7eb] p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#111111]">{addr.label}</span>
                  {addr.isDefault && (
                    <span className="text-[10px] bg-[#faf5eb] text-[#C9963A] border border-[#C9963A]/30 px-2 py-0.5 rounded-full font-medium">
                      Varsayılan
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 text-[#9ca3af] hover:text-[#111111] rounded transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 text-[#9ca3af] hover:text-[#b91c1c] rounded transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <p className="text-sm text-[#6b7280] leading-relaxed">{addr.full}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
*/

// ─────────────────────────────────────────────────────────────
// [J]  app/account/payment-methods/page.tsx  — Ödeme Yöntemleri
// ─────────────────────────────────────────────────────────────
/*
"use client"
import { CreditCard, Plus } from "lucide-react"

export default function PaymentMethodsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#111111]">Ödeme Yöntemleri</h2>
        <button className="flex items-center gap-2 text-sm font-medium px-4 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f5f5f5] transition-colors text-[#111111]">
          <Plus className="w-4 h-4" /> Kart Ekle
        </button>
      </div>
      <div className="bg-white rounded-xl border border-[#e5e7eb] p-10 flex flex-col items-center gap-3 text-center">
        <CreditCard className="w-8 h-8 text-[#d1d5db]" strokeWidth={1} />
        <p className="text-sm text-[#6b7280]">Henüz kayıtlı bir ödeme yönteminiz bulunmamaktadır.</p>
        <button className="mt-2 px-5 py-2 text-sm font-medium bg-[#0d1117] text-white rounded-lg hover:bg-[#1f2937] transition-colors">
          Kart Ekle
        </button>
      </div>
      <div className="bg-[#f5f5f5] rounded-xl p-4 flex items-start gap-3">
        <span className="text-[#C9963A] mt-0.5 flex-shrink-0">🔒</span>
        <p className="text-xs text-[#6b7280] leading-relaxed">
          Kart bilgileriniz PCI-DSS uyumlu şifreli bir formda saklanmaktadır.
          Kart numaranızın tamamı hiçbir zaman sunucularımızda tutulmaz.
        </p>
      </div>
    </div>
  )
}
*/

// ─────────────────────────────────────────────────────────────
// [K]  app/account/wishlist/page.tsx  — İstek Listesi
// ─────────────────────────────────────────────────────────────
/*
"use client"
import { useState } from "react"
import { Heart, ShoppingBag, X } from "lucide-react"

const MOCK_WISHLIST = [
  { id: 1, brand: "VAGUE LABS", name: "Premium Whey Isolate",  price: "$59,99", oldPrice: "$74,99" },
  { id: 2, brand: "VAGUE GEAR", name: "Resistance Bands Set",  price: "$9,09",  oldPrice: "$11,69" },
  { id: 3, brand: "VAGUE LABS", name: "Creatine Monohydrate",  price: "$18,18", oldPrice: "$15,58" },
]

export default function WishlistPage() {
  const [items, setItems] = useState(MOCK_WISHLIST)
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#111111] flex items-center gap-2">
        <Heart className="w-6 h-6 text-[#C9963A]" />
        İstek Listesi
        <span className="ml-1 text-lg font-normal text-[#6b7280]">({items.length})</span>
      </h2>
      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-10 text-center">
          <Heart className="w-8 h-8 text-[#d1d5db] mx-auto mb-3" strokeWidth={1} />
          <p className="text-sm text-[#6b7280]">İstek listeniz boş.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden group relative">
              <button onClick={() => setItems(items.filter((i) => i.id !== item.id))}
                className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-sm text-[#9ca3af] hover:text-[#b91c1c] transition-colors z-10">
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="aspect-square bg-[#f5f5f5] flex items-center justify-center text-[#9ca3af] text-3xl font-bold">
                {item.name[0]}
              </div>
              <div className="p-4">
                <p className="text-[10px] uppercase tracking-widest text-[#C9963A] font-semibold mb-1">{item.brand}</p>
                <p className="text-sm font-medium text-[#111111] mb-2 leading-snug">{item.name}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-bold text-[#111111]">{item.price}</span>
                  {item.oldPrice !== item.price && (
                    <span className="text-xs text-[#9ca3af] line-through">{item.oldPrice}</span>
                  )}
                </div>
                <button className="w-full flex items-center justify-center gap-2 py-2 bg-[#0d1117] text-white text-xs font-medium rounded-lg hover:bg-[#1f2937] transition-colors">
                  <ShoppingBag className="w-3.5 h-3.5" /> Sepete Ekle
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
*/

// ─────────────────────────────────────────────────────────────
// [L]  app/account/rewards/page.tsx  — Vague Club / Ödüller
// ─────────────────────────────────────────────────────────────
/*
export default function RewardsPage() {
  const points = 1850
  const nextTier = 2500
  const progress = Math.round((points / nextTier) * 100)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#111111]">Vague Club</h2>

      {/* Tier kartı */}
      <div className="bg-[#0d1117] rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#9ca3af] mb-1">Mevcut Tier</p>
            <p className="text-2xl font-bold text-[#C9963A]">GOLD</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#9ca3af] mb-1">Toplam Puan</p>
            <p className="text-2xl font-bold">{points.toLocaleString()}</p>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-[#9ca3af]">
            <span>Platinum&apos;a {(nextTier - points).toLocaleString()} puan kaldı</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-[#1f2937] rounded-full overflow-hidden">
            <div className="h-full bg-[#C9963A] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Kazanma / Harcama / Davet */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { title: "Puan Kazan",    desc: "Her satın alımda ₺10 = 1 puan" },
          { title: "Puan Harca",    desc: "500 puan = ₺50 indirim" },
          { title: "Arkadaş Davet", desc: "Her davet için 200 puan" },
        ].map((c) => (
          <div key={c.title} className="bg-white rounded-xl border border-[#e5e7eb] p-5">
            <p className="text-sm font-semibold text-[#111111] mb-1.5">{c.title}</p>
            <p className="text-xs text-[#6b7280] leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
*/

// ─────────────────────────────────────────────────────────────
// [M]  app/account/returns/page.tsx  — İadeler & Değişimler
// ─────────────────────────────────────────────────────────────
/*
"use client"
import { useState } from "react"
import { RotateCcw, Info, Plus } from "lucide-react"

export default function ReturnsPage() {
  const [requests] = useState<unknown[]>([])
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#111111] flex items-center gap-2">
            <RotateCcw className="w-6 h-6 text-[#C9963A]" />
            İadeler & Değişimler
          </h2>
          <p className="text-sm text-[#6b7280] mt-0.5">Siparişleriniz için iade veya değişim talebi oluşturun.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#C9963A] text-white rounded-lg hover:bg-[#a67c28] transition-colors">
          <Plus className="w-4 h-4" /> Yeni Talep
        </button>
      </div>

      {/* İade Politikası */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 flex gap-3">
        <Info className="w-4 h-4 text-[#C9963A] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-[#111111] mb-1">İade Politikası</p>
          <p className="text-xs text-[#6b7280] leading-relaxed">
            Ürünleri teslim tarihinden itibaren 30 gün içinde iade edebilirsiniz.
            Ürünlerin açılmamış ve orijinal ambalajında olması gerekmektedir.
            Hasarlı ürünler için fotoğraflı kanıt gerekebilir.
          </p>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-10 flex flex-col items-center gap-3 text-center">
          <RotateCcw className="w-8 h-8 text-[#d1d5db]" strokeWidth={1} />
          <p className="text-sm font-medium text-[#111111]">Henüz iade talebiniz yok</p>
          <p className="text-xs text-[#6b7280]">Yukarıdaki butona tıklayarak yeni bir talep oluşturun.</p>
        </div>
      ) : null}
    </div>
  )
}
*/

// ─────────────────────────────────────────────────────────────
// [N]  app/account/preferences/page.tsx  — İletişim Tercihleri
// ─────────────────────────────────────────────────────────────
/*
"use client"
import { useState } from "react"
import { Bell } from "lucide-react"

const PREFS = [
  { key: "orders",    label: "Sipariş Güncellemeleri",  desc: "Kargo ve teslimat bildirimleri" },
  { key: "promo",     label: "Kampanya & İndirimler",   desc: "Özel teklifler ve indirim kodları" },
  { key: "product",   label: "Yeni Ürünler",            desc: "Yeni ürün duyuruları" },
  { key: "club",      label: "Vague Club",              desc: "Puan ve ödül bildirimleri" },
  { key: "blog",      label: "Blog & İçerik",           desc: "Beslenme ve antrenman içerikleri" },
]

export default function PreferencesPage() {
  const [prefs, setPrefs] = useState(Object.fromEntries(PREFS.map((p) => [p.key, true])))
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#111111] flex items-center gap-2">
        <Bell className="w-6 h-6 text-[#C9963A]" />
        İletişim Tercihleri
      </h2>
      <div className="bg-white rounded-xl border border-[#e5e7eb] divide-y divide-[#f5f5f5]">
        {PREFS.map((pref) => (
          <div key={pref.key} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-[#111111]">{pref.label}</p>
              <p className="text-xs text-[#6b7280] mt-0.5">{pref.desc}</p>
            </div>
            <button
              role="switch"
              aria-checked={prefs[pref.key]}
              onClick={() => setPrefs({ ...prefs, [pref.key]: !prefs[pref.key] })}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
                prefs[pref.key] ? "bg-[#C9963A]" : "bg-[#d1d5db]"
              }`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
                prefs[pref.key] ? "left-6" : "left-1"
              }`} />
            </button>
          </div>
        ))}
      </div>
      <button className="px-5 py-2.5 text-sm font-medium bg-[#0d1117] text-white rounded-lg hover:bg-[#1f2937] transition-colors">
        Tercihleri Kaydet
      </button>
    </div>
  )
}
*/

// ─────────────────────────────────────────────────────────────
// [O]  app/account/security/page.tsx  — Güvenlik
// ─────────────────────────────────────────────────────────────
/*
"use client"
import { useState } from "react"
import { Shield, Key, Smartphone, AlertTriangle, Eye, EyeOff } from "lucide-react"

export default function SecurityPage() {
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw]     = useState(false)
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#111111] flex items-center gap-2">
        <Shield className="w-6 h-6 text-[#C9963A]" />
        Güvenlik
      </h2>

      {/* Şifre Değişikliği */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Key className="w-4 h-4 text-[#C9963A]" />
          <h3 className="text-sm font-semibold text-[#111111]">Şifre Değiştir</h3>
        </div>
        {[
          { label: "Mevcut Şifre", show: showCurrentPw, toggle: () => setShowCurrentPw(!showCurrentPw) },
          { label: "Yeni Şifre",   show: showNewPw,     toggle: () => setShowNewPw(!showNewPw) },
        ].map((f) => (
          <div key={f.label}>
            <label className="block text-xs text-[#6b7280] mb-1.5">{f.label}</label>
            <div className="relative">
              <input type={f.show ? "text" : "password"}
                className="w-full px-3 py-2 pr-10 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9963A]/30 focus:border-[#C9963A]" />
              <button type="button" onClick={f.toggle}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280]">
                {f.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}
        <button className="px-5 py-2.5 text-sm font-medium bg-[#0d1117] text-white rounded-lg hover:bg-[#1f2937] transition-colors">
          Şifreyi Güncelle
        </button>
      </div>

      {/* 2FA */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#C9963A]" />
            <div>
              <p className="text-sm font-semibold text-[#111111]">İki Faktörlü Kimlik Doğrulama</p>
              <p className="text-xs text-[#6b7280] mt-0.5">Hesabınıza ekstra güvenlik katmanı ekleyin.</p>
            </div>
          </div>
          <button
            role="switch" aria-checked={twoFAEnabled}
            onClick={() => setTwoFAEnabled(!twoFAEnabled)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
              twoFAEnabled ? "bg-[#C9963A]" : "bg-[#d1d5db]"
            }`}>
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
              twoFAEnabled ? "left-6" : "left-1"
            }`} />
          </button>
        </div>
      </div>

      {/* Tehlikeli Bölge */}
      <div className="bg-white rounded-xl border border-[#fca5a5] p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-[#b91c1c] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#b91c1c] mb-1">Hesabı Sil</p>
            <p className="text-xs text-[#6b7280] mb-3 leading-relaxed">
              Hesabınız kalıcı olarak silinir. Bu işlem geri alınamaz.
            </p>
            <button className="px-4 py-2 text-xs font-medium border border-[#fca5a5] text-[#b91c1c] rounded-lg hover:bg-[#fff1f1] transition-colors">
              Hesabı Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
*/

export {}
