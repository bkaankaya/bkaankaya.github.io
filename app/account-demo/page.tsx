"use client"

import { useState } from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  User,
  MapPin,
  CreditCard,
  Package,
  Heart,
  RotateCcw,
  Star,
  Bell,
  Shield,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  X,
  ShoppingBag,
  Info,
  Key,
  Smartphone,
  AlertTriangle,
  Eye,
  EyeOff,
  Check,
  Truck,
  Home,
  PackageCheck,
} from "lucide-react"

// ─── Renk Tokens ───────────────────────────────────────────────
// bg         : #ffffff / #f5f5f5
// navbar     : #0d1117
// altın aksan: #C9963A
// metin      : #111111
// ikincil    : #6b7280
// kenarlık   : #e5e7eb

// ─── Order Tracker ─────────────────────────────────────────────
type TrackingStep = "received" | "preparing" | "shipped" | "delivered"
const TRACKER_STEPS: { key: TrackingStep; label: string; Icon: React.ElementType }[] = [
  { key: "received",  label: "Alındı",    Icon: Package },
  { key: "preparing", label: "Hazırlanıyor", Icon: PackageCheck },
  { key: "shipped",   label: "Kargoda",   Icon: Truck },
  { key: "delivered", label: "Teslim",    Icon: Home },
]
function OrderTracker({ currentStep }: { currentStep: TrackingStep }) {
  const ci = TRACKER_STEPS.findIndex((s) => s.key === currentStep)
  return (
    <div className="flex items-start w-full">
      {TRACKER_STEPS.map((step, index) => {
        const done   = index < ci
        const active = index === ci
        const last   = index === TRACKER_STEPS.length - 1
        return (
          <div key={step.key} className="flex items-start flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                done   ? "bg-[#C9963A]" :
                active ? "bg-[#0d1117]" :
                         "bg-white border border-[#e5e7eb]"
              }`}>
                {done
                  ? <Check className="w-4 h-4 text-white" strokeWidth={2} />
                  : <step.Icon className={`w-4 h-4 ${active ? "text-white" : "text-[#9ca3af]"}`} strokeWidth={1.5} />
                }
              </div>
              <span className={`mt-2 text-[10px] uppercase tracking-wide text-center leading-tight ${
                active ? "text-[#111111] font-medium" : "text-[#6b7280]"
              }`}>{step.label}</span>
            </div>
            {!last && (
              <div className="flex-1 h-px mt-[18px] mx-1">
                <div className={`h-full ${index < ci ? "bg-[#C9963A]" : "bg-[#e5e7eb]"}`} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Status Badge ──────────────────────────────────────────────
const STATUS_MAP: Record<string, { label: string; bg: string; text: string }> = {
  pending:   { label: "Ödeme Bekleniyor", bg: "#fef3c7", text: "#92400e" },
  confirmed: { label: "Onaylandı",        bg: "#dbeafe", text: "#1e40af" },
  shipped:   { label: "Kargoda",          bg: "#ede9fe", text: "#5b21b6" },
  delivered: { label: "Teslim Edildi",    bg: "#d1fae5", text: "#065f46" },
  cancelled: { label: "İptal Edildi",     bg: "#fee2e2", text: "#991b1b" },
}
function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? STATUS_MAP.pending
  return (
    <span className="text-xs font-medium px-3 py-1 rounded-full"
      style={{ backgroundColor: s.bg, color: s.text }}>
      {s.label}
    </span>
  )
}

// ─── Sidebar Nav Items ─────────────────────────────────────────
const NAV_SECTIONS = [
  { label: "Hesabım", items: [
    { key: "dashboard",        label: "Dashboard",         Icon: LayoutDashboard },
    { key: "profile",          label: "Profil",            Icon: User },
    { key: "addresses",        label: "Adresler",          Icon: MapPin },
    { key: "payment-methods",  label: "Ödeme Yöntemleri",  Icon: CreditCard },
  ]},
  { label: "Siparişler", items: [
    { key: "orders",   label: "Siparişlerim",  Icon: Package },
    { key: "wishlist", label: "İstek Listesi", Icon: Heart },
    { key: "returns",  label: "İadeler",       Icon: RotateCcw },
  ]},
  { label: "Ödüller & Ayarlar", items: [
    { key: "rewards",     label: "Vague Club",  Icon: Star },
    { key: "preferences", label: "Bildirimler", Icon: Bell },
    { key: "security",    label: "Güvenlik",    Icon: Shield },
  ]},
]

// ─── Mock Data ─────────────────────────────────────────────────
const MOCK_ORDER_ITEMS = [
  { name: "Vegan Protein Blend",   variant: "Limon — 150g × 1",          price: "$349,90" },
  { name: "Pump Matrix Stim-Free", variant: "Tropical — 30 Servings × 1", price: "$849,90" },
  { name: "Vegan Protein Blend",   variant: "Çikolata — 900g × 1",        price: "$599,90" },
]
const MOCK_WISHLIST = [
  { id: 1, brand: "VAGUE LABS", name: "Premium Whey Isolate", price: "$59,99", oldPrice: "$74,99" },
  { id: 2, brand: "VAGUE GEAR", name: "Resistance Bands Set", price: "$9,09",  oldPrice: "$11,69" },
  { id: 3, brand: "VAGUE LABS", name: "Creatine Monohydrate", price: "$18,18", oldPrice: "$15,58" },
]
const PREFS_LIST = [
  { key: "orders",  label: "Sipariş Güncellemeleri", desc: "Kargo ve teslimat bildirimleri" },
  { key: "promo",   label: "Kampanya & İndirimler",  desc: "Özel teklifler ve indirim kodları" },
  { key: "product", label: "Yeni Ürünler",           desc: "Yeni ürün duyuruları" },
  { key: "club",    label: "Vague Club",             desc: "Puan ve ödül bildirimleri" },
  { key: "blog",    label: "Blog & İçerik",          desc: "Beslenme ve antrenman içerikleri" },
]

// ─────────────────────────────────────────────────────────────
// PAGE VIEWS
// ─────────────────────────────────────────────────────────────

function DashboardView() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#111111]">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Aktif Sipariş",  value: "2",     sub: "kargoda" },
          { label: "Toplam Sipariş", value: "14",    sub: "tüm zamanlar" },
          { label: "Club Puanı",     value: "1.850", sub: "Gold üye" },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-[#e5e7eb] p-5">
            <p className="text-[10px] uppercase tracking-widest text-[#6b7280] mb-1">{c.label}</p>
            <p className="text-3xl font-bold text-[#111111]">{c.value}</p>
            <p className="text-xs text-[#9ca3af] mt-0.5">{c.sub}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-[#e5e7eb] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[#111111] uppercase tracking-wider">Son Sipariş</h3>
          <span className="text-xs text-[#C9963A] cursor-pointer hover:underline">Tümünü gör →</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-[#f5f5f5] flex items-center justify-center text-[#9ca3af] text-xl font-bold flex-shrink-0">V</div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[#111111]">Premium Whey Protein</p>
            <p className="text-xs text-[#6b7280]">Çikolata — 900g × 1</p>
          </div>
          <StatusBadge status="shipped" />
        </div>
      </div>
    </div>
  )
}

function ProfileView() {
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
          <span className="text-[10px] uppercase tracking-widest text-[#6b7280]">Kişisel Bilgiler</span>
          <button onClick={() => setEditing(!editing)}
            className="flex items-center gap-1.5 text-xs text-[#C9963A] hover:text-[#a67c28] transition-colors">
            <Pencil className="w-3.5 h-3.5" />
            {editing ? "İptal" : "Düzenle"}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {(["name","email","phone","birthdate"] as const).map((key) => (
            <div key={key}>
              <label className="block text-xs text-[#6b7280] mb-1.5">
                {{name:"İsim",email:"E-Mail",phone:"Telefon",birthdate:"Doğum Tarihi"}[key]}
              </label>
              {editing ? (
                <input value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9963A]/30 focus:border-[#C9963A]" />
              ) : (
                <p className="text-sm font-medium text-[#111111]">{form[key]}</p>
              )}
            </div>
          ))}
        </div>
        {editing && (
          <div className="flex gap-3 pt-1">
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

function OrdersView({ onDetail }: { onDetail: () => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#111111]">Siparişlerim</h2>
      <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-[#e5e7eb]">
          <div className="flex gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#6b7280]">Sipariş Tarihi</p>
              <p className="text-sm font-semibold text-[#111111]">6 Mayıs 2026</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#6b7280]">Ürün Sayısı</p>
              <p className="text-sm font-semibold text-[#111111]">3 Ürün</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#6b7280]">Toplam</p>
              <p className="text-sm font-semibold text-[#C9963A]">$2.159,64</p>
            </div>
          </div>
          <StatusBadge status="pending" />
        </div>
        <div className="divide-y divide-[#f5f5f5]">
          {MOCK_ORDER_ITEMS.map((item, i) => (
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
          <button onClick={onDetail} className="text-sm font-medium text-[#C9963A] hover:text-[#a67c28] transition-colors">
            Sipariş Detayı →
          </button>
        </div>
      </div>
    </div>
  )
}

function OrderDetailView({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#111111]">Sipariş Detayı #2</h2>
          <p className="text-sm text-[#6b7280] mt-0.5">6 Mayıs 2026, 21:07 tarihinde verildi.</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-[#6b7280]">Toplam</p>
          <p className="text-2xl font-bold text-[#C9963A]">$2.159,64</p>
        </div>
      </div>
      <h3 className="text-sm font-semibold text-[#111111] uppercase tracking-wider">Kargolarınız</h3>
      <div className="space-y-4">
        {MOCK_ORDER_ITEMS.map((item, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
            <div className="flex items-start gap-4 p-5">
              <div className="w-14 h-14 rounded-lg bg-[#f5f5f5] flex items-center justify-center text-[#9ca3af] font-bold text-xl flex-shrink-0">
                {item.name[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#111111]">{item.name}</p>
                <p className="text-xs text-[#6b7280]">Varyant: {item.variant}</p>
                <p className="text-xs text-[#6b7280]">ADET: 1</p>
              </div>
              <p className="text-sm font-semibold text-[#111111]">{item.price}</p>
            </div>
            <div className="border-t border-[#f5f5f5] p-5">
              <OrderTracker currentStep="received" />
            </div>
          </div>
        ))}
      </div>
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-[#111111] transition-colors">
        ← Siparişlere dön
      </button>
    </div>
  )
}

function AddressesView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#111111]">Adresler</h2>
        <button className="flex items-center gap-2 text-sm font-medium px-4 py-2 border border-[#e5e7eb] rounded-lg hover:bg-[#f5f5f5] transition-colors text-[#111111]">
          <Plus className="w-4 h-4" /> Adres Ekle
        </button>
      </div>
      <div className="bg-white rounded-xl border border-[#e5e7eb] p-10 flex flex-col items-center gap-3 text-center">
        <MapPin className="w-8 h-8 text-[#d1d5db]" strokeWidth={1} />
        <p className="text-sm text-[#6b7280]">Henüz kayıtlı bir adresiniz bulunmamaktadır.</p>
        <button className="mt-2 px-5 py-2 text-sm font-medium bg-[#0d1117] text-white rounded-lg hover:bg-[#1f2937] transition-colors">
          İlk Adresinizi Ekleyin
        </button>
      </div>
    </div>
  )
}

function PaymentMethodsView() {
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

function WishlistView() {
  const [items, setItems] = useState(MOCK_WISHLIST)
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#111111] flex items-center gap-2">
        <Heart className="w-6 h-6 text-[#C9963A]" />
        İstek Listesi
        <span className="text-lg font-normal text-[#6b7280]">({items.length})</span>
      </h2>
      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-10 text-center">
          <Heart className="w-8 h-8 text-[#d1d5db] mx-auto mb-3" strokeWidth={1} />
          <p className="text-sm text-[#6b7280]">İstek listeniz boş.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden relative group">
              <button onClick={() => setItems(items.filter((i) => i.id !== item.id))}
                className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-sm text-[#9ca3af] hover:text-[#b91c1c] transition-colors z-10">
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="aspect-square bg-[#f5f5f5] flex items-center justify-center text-[#9ca3af] text-4xl font-bold">
                {item.name[0]}
              </div>
              <div className="p-4">
                <p className="text-[10px] uppercase tracking-widest text-[#C9963A] font-semibold mb-1">{item.brand}</p>
                <p className="text-sm font-medium text-[#111111] mb-2 leading-snug">{item.name}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-bold text-[#111111]">{item.price}</span>
                  <span className="text-xs text-[#9ca3af] line-through">{item.oldPrice}</span>
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

function RewardsView() {
  const points = 1850
  const next = 2500
  const pct = Math.round((points / next) * 100)
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#111111]">Vague Club</h2>
      <div className="bg-[#0d1117] rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#9ca3af] mb-1">Mevcut Tier</p>
            <p className="text-2xl font-bold text-[#C9963A]">GOLD</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[#9ca3af] mb-1">Toplam Puan</p>
            <p className="text-2xl font-bold">{points.toLocaleString()}</p>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-[#9ca3af]">
            <span>Platinum&apos;a {(next - points).toLocaleString()} puan kaldı</span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 bg-[#1f2937] rounded-full overflow-hidden">
            <div className="h-full bg-[#C9963A] rounded-full" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
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

function ReturnsView() {
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
      <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 flex gap-3">
        <Info className="w-4 h-4 text-[#C9963A] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-[#111111] mb-1">İade Politikası</p>
          <p className="text-xs text-[#6b7280] leading-relaxed">
            Ürünleri teslim tarihinden itibaren 30 gün içinde iade edebilirsiniz.
            Ürünlerin açılmamış ve orijinal ambalajında olması gerekmektedir.
          </p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-[#e5e7eb] p-10 flex flex-col items-center gap-3 text-center">
        <RotateCcw className="w-8 h-8 text-[#d1d5db]" strokeWidth={1} />
        <p className="text-sm font-medium text-[#111111]">Henüz iade talebiniz yok</p>
        <p className="text-xs text-[#6b7280]">Yukarıdaki butona tıklayarak yeni bir talep oluşturun.</p>
      </div>
    </div>
  )
}

function PreferencesView() {
  const [prefs, setPrefs] = useState(Object.fromEntries(PREFS_LIST.map((p) => [p.key, true])))
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#111111] flex items-center gap-2">
        <Bell className="w-6 h-6 text-[#C9963A]" />
        İletişim Tercihleri
      </h2>
      <div className="bg-white rounded-xl border border-[#e5e7eb] divide-y divide-[#f5f5f5]">
        {PREFS_LIST.map((pref) => (
          <div key={pref.key} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-[#111111]">{pref.label}</p>
              <p className="text-xs text-[#6b7280] mt-0.5">{pref.desc}</p>
            </div>
            <button role="switch" aria-checked={prefs[pref.key]}
              onClick={() => setPrefs({ ...prefs, [pref.key]: !prefs[pref.key] })}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
                prefs[pref.key] ? "bg-[#C9963A]" : "bg-[#d1d5db]"
              }`}>
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

function SecurityView() {
  const [showCur, setShowCur] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [twoFA, setTwoFA]     = useState(false)
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#111111] flex items-center gap-2">
        <Shield className="w-6 h-6 text-[#C9963A]" />
        Güvenlik
      </h2>
      <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-[#C9963A]" />
          <h3 className="text-sm font-semibold text-[#111111]">Şifre Değiştir</h3>
        </div>
        {[
          { label: "Mevcut Şifre", show: showCur, toggle: () => setShowCur(!showCur) },
          { label: "Yeni Şifre",   show: showNew, toggle: () => setShowNew(!showNew) },
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
      <div className="bg-white rounded-xl border border-[#e5e7eb] p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Smartphone className="w-4 h-4 text-[#C9963A]" />
            <div>
              <p className="text-sm font-semibold text-[#111111]">İki Faktörlü Kimlik Doğrulama</p>
              <p className="text-xs text-[#6b7280] mt-0.5">Hesabınıza ekstra güvenlik katmanı ekleyin.</p>
            </div>
          </div>
          <button role="switch" aria-checked={twoFA} onClick={() => setTwoFA(!twoFA)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
              twoFA ? "bg-[#C9963A]" : "bg-[#d1d5db]"
            }`}>
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
              twoFA ? "left-6" : "left-1"
            }`} />
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-[#fca5a5] p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-[#b91c1c] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#b91c1c] mb-1">Hesabı Sil</p>
            <p className="text-xs text-[#6b7280] mb-3 leading-relaxed">Hesabınız kalıcı olarak silinir. Bu işlem geri alınamaz.</p>
            <button className="px-4 py-2 text-xs font-medium border border-[#fca5a5] text-[#b91c1c] rounded-lg hover:bg-[#fff1f1] transition-colors">
              Hesabı Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN DEMO PAGE
// ─────────────────────────────────────────────────────────────
type ActivePage = "dashboard" | "profile" | "addresses" | "payment-methods" |
  "orders" | "order-detail" | "wishlist" | "returns" | "rewards" | "preferences" | "security"

export default function AccountDemoPage() {
  const [active, setActive] = useState<ActivePage>("dashboard")

  function renderContent() {
    switch (active) {
      case "dashboard":       return <DashboardView />
      case "profile":         return <ProfileView />
      case "addresses":       return <AddressesView />
      case "payment-methods": return <PaymentMethodsView />
      case "orders":          return <OrdersView onDetail={() => setActive("order-detail")} />
      case "order-detail":    return <OrderDetailView onBack={() => setActive("orders")} />
      case "wishlist":        return <WishlistView />
      case "returns":         return <ReturnsView />
      case "rewards":         return <RewardsView />
      case "preferences":     return <PreferencesView />
      case "security":        return <SecurityView />
      default:                return <DashboardView />
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Top bar */}
      <header className="bg-[#0d1117] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <span className="text-white font-bold text-xl tracking-tight">VAGUE</span>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-[#9ca3af] uppercase tracking-widest">Vague Club</p>
              <p className="text-sm font-semibold text-[#C9963A]">Gold</p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-[#9ca3af] uppercase tracking-widest">Puanlar</p>
              <p className="text-sm font-semibold text-white">1.850</p>
            </div>
            <Link href="/" className="text-xs text-[#9ca3af] hover:text-white transition-colors">
              ← Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile nav pill scroll */}
      <div className="md:hidden bg-white border-b border-[#e5e7eb] overflow-x-auto">
        <div className="flex gap-1 px-4 py-2 min-w-max">
          {NAV_SECTIONS.flatMap((s) => s.items).map((item) => {
            const key = item.key as ActivePage
            const isActive = active === key || (active === "order-detail" && key === "orders")
            return (
              <button key={item.key} onClick={() => setActive(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-[#0d1117] text-white"
                    : "text-[#6b7280] hover:bg-[#f5f5f5]"
                }`}>
                <item.Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-8">
          {/* Sidebar */}
          <nav className="hidden md:flex flex-col w-56 flex-shrink-0 sticky top-24 self-start">
            {NAV_SECTIONS.map((section, si) => (
              <div key={section.label} className={si > 0 ? "mt-6" : ""}>
                <p className="text-[10px] uppercase tracking-widest text-[#9ca3af] px-3 mb-1.5">
                  {section.label}
                </p>
                <ul>
                  {section.items.map((item) => {
                    const key = item.key as ActivePage
                    const isActive = active === key || (active === "order-detail" && key === "orders")
                    return (
                      <li key={item.key}>
                        <button onClick={() => setActive(key)}
                          className={`flex items-center gap-3 h-10 w-full rounded-lg text-sm transition-colors ${
                            isActive
                              ? "border-l-2 border-[#C9963A] bg-[#faf5eb] text-[#111111] font-medium pl-[14px] pr-3"
                              : "text-[#6b7280] hover:bg-white hover:text-[#111111] px-3"
                          }`}>
                          <item.Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-[#C9963A]" : "text-[#9ca3af]"}`} strokeWidth={1.5} />
                          {item.label}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
            <div className="mt-6 pt-4 border-t border-[#e5e7eb]">
              <button className="flex items-center gap-3 h-10 w-full px-3 rounded-lg text-sm text-[#6b7280] hover:bg-[#fff1f1] hover:text-[#b91c1c] transition-colors">
                <LogOut className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                Çıkış Yap
              </button>
            </div>
          </nav>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  )
}
