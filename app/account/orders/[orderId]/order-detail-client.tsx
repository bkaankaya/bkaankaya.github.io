// Order detail page with per-shipment tracking, summary sidebar, and actions.
"use client"

import { use } from "react"
import { ArrowLeft, Download, HelpCircle, XCircle, RotateCcw } from "lucide-react"
import Link from "next/link"
import { OrderTracker } from "@/components/account/OrderTracker"
import { StatusBadge } from "@/components/account/StatusBadge"
import { Breadcrumbs } from "@/components/account/Breadcrumbs"

// MOCK — replace with API call to GET /api/v1/account/orders/:orderId
const mockOrder = {
  id: "ORD-2026-0007",
  placedAt: "May 6, 2026 at 9:07 PM",
  status: "pending-payment" as const,
  total: "$2,159.64",
  subtotal: "$1,799.70",
  shipping: "$9.99",
  tax: "$349.95",
  deliveryAddress: {
    name: "Kaan Kaya",
    line1: "Barbaros Mahallesi, Beşiktaş",
    city: "Istanbul",
    country: "Turkey",
    zip: "34353",
    phone: "+90 555 555 55 55",
  },
  paymentMethod: { brand: "Visa", last4: "4242", chargedOn: "May 6, 2026" },
  shipments: [
    {
      id: "s1",
      trackingNumber: "TR12345678",
      currentStep: "received" as const,
      items: [
        { id: "1", name: "Vegan Protein Blend", variant: "Limon — 150g", qty: 1, price: "$349.90" },
      ],
    },
    {
      id: "s2",
      trackingNumber: "TR12345679",
      currentStep: "received" as const,
      items: [
        { id: "2", name: "Pump Matrix Stim-Free", variant: "Tropical — 30 Servings", qty: 1, price: "$849.90" },
      ],
    },
    {
      id: "s3",
      trackingNumber: "TR12345680",
      currentStep: "received" as const,
      items: [
        { id: "3", name: "Vegan Protein Blend", variant: "Chocolate — 900g", qty: 1, price: "$599.90" },
      ],
    },
  ],
}

export default function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params)
  const order = mockOrder
  const isPending = order.status === "pending-payment" || order.status === "processing" as string
  const isDelivered = order.status === "delivered"

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Account", href: "/account" },
          { label: "My Orders", href: "/account/orders" },
          { label: `#${orderId}` },
        ]}
      />

      {/* Page header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
        <div>
          <h2 className="font-sans uppercase tracking-wide text-2xl font-medium text-[#1A1A1A]">
            Order #{order.id}
          </h2>
          <p className="font-sans text-xs text-[#6B6760] mt-1">Placed on {order.placedAt}</p>
          <div className="mt-2">
            <StatusBadge variant={order.status} />
          </div>
        </div>
        <div className="flex flex-col items-start lg:items-end gap-1">
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#6B6760]">Total Amount</p>
          <span className="font-sans text-4xl tabular-nums font-semibold text-[#C8A96E]">
            {order.total}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main — shipments */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h3 className="font-sans text-[11px] uppercase tracking-[0.12em] text-[#6B6760]">
            Your Shipments
          </h3>

          {order.shipments.map((shipment) => (
            <div key={shipment.id} className="bg-white rounded-2xl border border-[#E8E2D5] p-6">
              {/* Line items */}
              {shipment.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-xl bg-[#F5F0E8] flex items-center justify-center flex-shrink-0">
                    <span className="font-sans text-xl font-medium text-[#C8A96E]">
                      {item.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm font-medium text-[#1A1A1A]">{item.name}</p>
                    <p className="font-sans text-xs text-[#6B6760]">Variant: {item.variant}</p>
                    <p className="font-sans text-xs text-[#6B6760]">QTY: {item.qty}</p>
                  </div>
                  <p className="font-sans text-sm tabular-nums font-medium text-[#1A1A1A]">
                    {item.price}
                  </p>
                </div>
              ))}

              {/* Tracker */}
              <OrderTracker currentStep={shipment.currentStep} />

              {/* Tracking link */}
              {shipment.trackingNumber && (
                <p className="mt-4 font-sans text-xs text-[#6B6760]">
                  Tracking:{" "}
                  <a
                    href="#"
                    className="text-[#C8A96E] hover:text-[#B8995E] font-medium transition-colors"
                  >
                    {shipment.trackingNumber} &#8599;
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4 lg:sticky lg:top-24 self-start">
          {/* Delivery address */}
          <div className="bg-white rounded-2xl border border-[#E8E2D5] p-5">
            <p className="text-[11px] uppercase tracking-[0.12em] text-[#6B6760] mb-3">
              Delivery Address
            </p>
            <p className="font-sans text-sm font-medium text-[#1A1A1A]">{order.deliveryAddress.name}</p>
            <p className="font-sans text-xs text-[#6B6760] leading-relaxed mt-1">
              {order.deliveryAddress.line1}
              <br />
              {order.deliveryAddress.city}, {order.deliveryAddress.zip}
              <br />
              {order.deliveryAddress.country}
              <br />
              {order.deliveryAddress.phone}
            </p>
          </div>

          {/* Payment method */}
          <div className="bg-white rounded-2xl border border-[#E8E2D5] p-5">
            <p className="text-[11px] uppercase tracking-[0.12em] text-[#6B6760] mb-3">
              Payment Method
            </p>
            <p className="font-sans text-sm font-medium text-[#1A1A1A]">
              {order.paymentMethod.brand} ending {order.paymentMethod.last4}
            </p>
            <p className="font-sans text-xs text-[#6B6760] mt-0.5">
              Charged {order.paymentMethod.chargedOn}
            </p>
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-2xl border border-[#E8E2D5] p-5">
            <p className="text-[11px] uppercase tracking-[0.12em] text-[#6B6760] mb-3">
              Order Summary
            </p>
            <div className="space-y-2">
              {[
                { label: "Subtotal", value: order.subtotal },
                { label: "Shipping", value: order.shipping },
                { label: "Tax", value: order.tax },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center">
                  <span className="font-sans text-xs text-[#6B6760]">{row.label}</span>
                  <span className="font-sans text-xs tabular-nums text-[#1A1A1A]">{row.value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 border-t border-[#E8E2D5]">
                <span className="font-sans text-sm font-medium text-[#1A1A1A]">Total</span>
                <span className="font-sans text-sm tabular-nums font-medium text-[#1A1A1A]">
                  {order.total}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <button className="flex items-center gap-2 text-[#1A1A1A] hover:bg-[#FAF7F1] font-medium h-10 px-4 rounded-xl transition-colors text-sm border border-[#E8E2D5] justify-start">
              <Download className="w-4 h-4" strokeWidth={1.5} />
              Download invoice
            </button>
            <Link
              href={`/support?order=${orderId}`}
              className="flex items-center gap-2 text-[#1A1A1A] hover:bg-[#FAF7F1] font-medium h-10 px-4 rounded-xl transition-colors text-sm border border-[#E8E2D5]"
            >
              <HelpCircle className="w-4 h-4" strokeWidth={1.5} />
              Need help with this order?
            </Link>
            {isPending && (
              <button className="flex items-center gap-2 text-[#8B2F2F] hover:bg-[#F4E6E6] font-medium h-10 px-4 rounded-xl transition-colors text-sm border border-[#F4E6E6]">
                <XCircle className="w-4 h-4" strokeWidth={1.5} />
                Cancel order
              </button>
            )}
            {isDelivered && (
              <button className="flex items-center gap-2 text-[#1A1A1A] hover:bg-[#FAF7F1] font-medium h-10 px-4 rounded-xl transition-colors text-sm border border-[#E8E2D5]">
                <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
                Start a return
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
