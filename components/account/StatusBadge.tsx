// Reusable order/item status badge used across the account area.

type StatusVariant =
  | "delivered"
  | "shipped"
  | "processing"
  | "pending-payment"
  | "cancelled"
  | "failed"
  | "returned"
  | "refunded"

const variantStyles: Record<StatusVariant, string> = {
  delivered: "text-[#2F6B3E] bg-[#E8F1EA]",
  shipped: "text-[#2F4E7A] bg-[#E6ECF4]",
  processing: "text-[#8B6A1F] bg-[#FAF1DA]",
  "pending-payment": "text-[#8B6A1F] bg-[#FAF1DA]",
  cancelled: "text-[#8B2F2F] bg-[#F4E6E6]",
  failed: "text-[#8B2F2F] bg-[#F4E6E6]",
  returned: "text-[#4A4640] bg-[#EEEAE0]",
  refunded: "text-[#4A4640] bg-[#EEEAE0]",
}

const variantLabels: Record<StatusVariant, string> = {
  delivered: "Delivered",
  shipped: "Shipped",
  processing: "Processing",
  "pending-payment": "Pending Payment",
  cancelled: "Cancelled",
  failed: "Failed",
  returned: "Returned",
  refunded: "Refunded",
}

interface StatusBadgeProps {
  variant: StatusVariant
  className?: string
}

export function StatusBadge({ variant, className = "" }: StatusBadgeProps) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] ${variantStyles[variant]} ${className}`}
    >
      {variantLabels[variant]}
    </span>
  )
}
