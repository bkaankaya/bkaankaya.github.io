"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { Pause, Play } from "lucide-react"

export const MOTION_STORAGE_KEY = "bk-portfolio-motion-paused"
export const MOTION_CHANGE_EVENT = "portfolio-motion-change"
const MotionContext = createContext({ paused: true, devicePaused: false, ready: false, toggle: () => {} })

/** A site preference may reduce motion, but never override a device's request to reduce it. */
export function MotionPreferenceProvider({ children }: { children: ReactNode }) {
  const [userPaused, setUserPaused] = useState(false)
  const [devicePaused, setDevicePaused] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    const connection = (navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }).connection
    const syncDevice = () => setDevicePaused(reduced.matches || connection?.saveData === true)
    const syncStorage = () => {
      try { setUserPaused(window.localStorage.getItem(MOTION_STORAGE_KEY) === "true") } catch { /* Memory-only preference when storage is unavailable. */ }
    }
    const onStorage = (event: StorageEvent) => { if (event.key === MOTION_STORAGE_KEY || event.key === null) syncStorage() }
    syncDevice()
    syncStorage()
    setReady(true)
    reduced.addEventListener("change", syncDevice)
    connection?.addEventListener("change", syncDevice)
    window.addEventListener("storage", onStorage)
    return () => {
      reduced.removeEventListener("change", syncDevice)
      connection?.removeEventListener("change", syncDevice)
      window.removeEventListener("storage", onStorage)
    }
  }, [])

  const paused = !ready || userPaused || devicePaused
  useEffect(() => {
    document.documentElement.dataset.motion = paused ? "paused" : "full"
    window.dispatchEvent(new Event(MOTION_CHANGE_EVENT))
  }, [paused])

  const toggle = useCallback(() => {
    if (!ready || devicePaused) return
    const next = !userPaused
    setUserPaused(next)
    try { window.localStorage.setItem(MOTION_STORAGE_KEY, String(next)) } catch { /* Keep the in-memory choice. */ }
  }, [ready, devicePaused, userPaused])
  const value = useMemo(() => ({ paused, devicePaused, ready, toggle }), [paused, devicePaused, ready, toggle])
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
}

export function useMotionPreference() { return useContext(MotionContext) }

export function MotionToggle() {
  const { paused, devicePaused, ready, toggle } = useMotionPreference()
  const Icon = paused ? Play : Pause
  const description = devicePaused ? "Motion is reduced by your device or data-saving settings" : paused ? "Resume visual effects" : "Pause visual effects"
  return <button className="theme-toggle motion-toggle" type="button" aria-label="Pause visual effects"
    aria-pressed={paused} disabled={!ready || devicePaused} title={description} onClick={toggle}>
    <Icon aria-hidden="true" />
  </button>
}
