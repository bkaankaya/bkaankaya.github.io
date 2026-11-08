"use client"

import { useEffect, useRef } from "react"

/**
 * One procedural dot texture, one pointer spotlight—not hundreds of React nodes
 * and not a canvas animation loop. Pointer sampling is coalesced with rAF.
 * The artwork is decorative and never participates in focus or pointer targets.
 */
export function AmbientDotField() {
  const fieldRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const field = fieldRef.current
    if (!field) return

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const fineQuery = window.matchMedia("(hover: hover) and (pointer: fine)")
    const network = (navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }).connection

    let frame = 0
    let x = -1
    let y = -1

    function enabled() {
      return !document.hidden && !motionQuery.matches && fineQuery.matches && !network?.saveData
    }
    function onMove(event: PointerEvent) {
      if (!enabled()) return
      if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") return
      x = event.clientX
      y = event.clientY
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        field!.style.setProperty("--dot-x", `${x}px`)
        field!.style.setProperty("--dot-y", `${y}px`)
        field!.dataset.active = "true"
        frame = 0
      })
    }
    function hide() {
      if (frame) window.cancelAnimationFrame(frame)
      frame = 0
      field!.dataset.active = "false"
    }
    function onPreferenceChange() { if (!enabled()) hide() }
    window.addEventListener("pointermove", onMove, { passive: true })
    document.addEventListener("pointerleave", hide)
    document.addEventListener("visibilitychange", onPreferenceChange)
    motionQuery.addEventListener("change", onPreferenceChange)
    fineQuery.addEventListener("change", onPreferenceChange)
    network?.addEventListener("change", onPreferenceChange)
    return () => {
      window.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerleave", hide)
      document.removeEventListener("visibilitychange", onPreferenceChange)
      motionQuery.removeEventListener("change", onPreferenceChange)
      fineQuery.removeEventListener("change", onPreferenceChange)
      network?.removeEventListener("change", onPreferenceChange)
      hide()
    }
  }, [])

  return (
    <div ref={fieldRef} className="ambient-dot-field" aria-hidden="true" data-active="false">
      <span className="ambient-dot-field__base" />
      <span className="ambient-dot-field__highlight" />
      <span className="ambient-dot-field__halo" />
    </div>
  )
}
