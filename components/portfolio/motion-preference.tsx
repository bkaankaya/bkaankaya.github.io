"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

export const MOTION_CHANGE_EVENT = "portfolio-motion-change"
const MotionContext = createContext({ paused: true, devicePaused: false, ready: false })

/** Motion follows device preferences without a site-level pause control. */
export function MotionPreferenceProvider({ children }: { children: ReactNode }) {
  const [devicePaused, setDevicePaused] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    const connection = (navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }).connection
    const syncDevice = () => setDevicePaused(reduced.matches || connection?.saveData === true)
    syncDevice()
    setReady(true)
    reduced.addEventListener("change", syncDevice)
    connection?.addEventListener("change", syncDevice)
    return () => {
      reduced.removeEventListener("change", syncDevice)
      connection?.removeEventListener("change", syncDevice)
    }
  }, [])

  const paused = !ready || devicePaused
  useEffect(() => {
    document.documentElement.dataset.motion = paused ? "paused" : "full"
    window.dispatchEvent(new Event(MOTION_CHANGE_EVENT))
  }, [paused])

  const value = useMemo(() => ({ paused, devicePaused, ready }), [paused, devicePaused, ready])
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
}

export function useMotionPreference() { return useContext(MotionContext) }
