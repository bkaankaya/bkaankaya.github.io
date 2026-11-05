// Generic illustrated empty state used across multiple account pages.
import { type LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon
  heading: string
  body: string
  action?: React.ReactNode
}

export function EmptyState({ icon: Icon, heading, body, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-20 h-20 rounded-full border border-dashed border-[#E8E2D5] flex items-center justify-center mb-5">
        <Icon className="w-8 h-8 text-[#9A9489]" strokeWidth={1.5} />
      </div>
      <h3 className="font-sans text-sm font-medium text-[#1A1A1A] mb-1">{heading}</h3>
      <p className="font-sans text-xs text-[#6B6760] max-w-xs leading-relaxed mb-6">{body}</p>
      {action}
    </div>
  )
}
