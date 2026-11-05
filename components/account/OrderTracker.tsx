// Horizontal 4-step order progress tracker used in order detail pages.
"use client"

import { Package, PackageCheck, Truck, Home, Check } from "lucide-react"

type TrackingStep = "received" | "preparing" | "shipped" | "delivered"

const steps: { key: TrackingStep; label: string; Icon: React.ElementType }[] = [
  { key: "received", label: "Order Received", Icon: Package },
  { key: "preparing", label: "Preparing", Icon: PackageCheck },
  { key: "shipped", label: "Shipped", Icon: Truck },
  { key: "delivered", label: "Delivered", Icon: Home },
]

const stepOrder: TrackingStep[] = ["received", "preparing", "shipped", "delivered"]

interface OrderTrackerProps {
  currentStep: TrackingStep
}

export function OrderTracker({ currentStep }: OrderTrackerProps) {
  const currentIndex = stepOrder.indexOf(currentStep)

  return (
    <div className="flex items-start w-full">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex
        const isActive = index === currentIndex
        const isFuture = index > currentIndex
        const isLast = index === steps.length - 1

        return (
          <div key={step.key} className="flex items-start flex-1">
            <div className="flex flex-col items-center flex-1">
              {/* Node */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCompleted
                    ? "bg-[#C8A96E]"
                    : isActive
                    ? "bg-[#0B0B0B]"
                    : "bg-white border border-[#E8E2D5]"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white" strokeWidth={2} />
                ) : (
                  <step.Icon
                    className={`w-4 h-4 ${isActive ? "text-white" : "text-[#9A9489]"}`}
                    strokeWidth={1.5}
                  />
                )}
              </div>
              {/* Label */}
              <span
                className={`mt-2 text-[11px] uppercase tracking-[0.08em] text-center leading-tight ${
                  isActive ? "text-[#1A1A1A] font-medium" : "text-[#6B6760]"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div className="flex-1 h-[1px] mt-[18px] mx-1">
                <div
                  className={`h-full ${
                    index < currentIndex ? "bg-[#C8A96E]" : "bg-[#E8E2D5]"
                  }`}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
