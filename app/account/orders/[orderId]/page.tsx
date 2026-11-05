import OrderDetailClient from "./order-detail-client"

// The unrelated mock account page does not have real orders to pre-render.
// Keep its client component in source, but do not publish invented order IDs.
export function generateStaticParams(): { orderId: string }[] {
  return []
}

export default function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  return <OrderDetailClient params={params} />
}
