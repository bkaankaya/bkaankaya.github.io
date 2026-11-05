import OrderDetailClient from "./order-detail-client"

// The account section is mock content imported with the design.
// GitHub Pages can export only the mock order IDs that already appear in the demo list.
export function generateStaticParams(): { orderId: string }[] {
  return [
    { orderId: "ORD-2026-0007" },
    { orderId: "ORD-2026-0004" },
    { orderId: "ORD-2026-0001" },
  ]
}

export default function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  return <OrderDetailClient params={params} />
}
