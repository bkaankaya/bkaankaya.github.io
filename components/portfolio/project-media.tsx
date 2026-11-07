"use client"

import Image from "next/image"
import "./project-media.css"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import type { PortfolioProject } from "@/lib/portfolio-data"

export const GALLERY_INTERVAL_MS = 5000

type Props = { project: PortfolioProject; active?: boolean; controls?: boolean }

/** Identity belongs in the badge. This component only displays project previews. */
export function ProjectMedia({ project, active = false, controls = false }: Props) {
  const frames = useMemo(() => project.gallery ?? [project.image], [project])
  const [index, setIndex] = useState(0)
  const [warm, setWarm] = useState(false)
  const [failed, setFailed] = useState<string[]>([])
  const [loaded, setLoaded] = useState<string[]>([])
  const mediaRef = useRef<HTMLDivElement>(null)
  const ready = useRef(new Set<string>())

  useEffect(() => {
    if (controls) { setWarm(true); return }
    setIndex(0)
    if (!active || frames.length < 2) return
    const reduced = matchMedia("(prefers-reduced-motion: reduce)")
    const pointer = matchMedia("(hover: hover) and (pointer: fine)")
    const network = (navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }).connection
    let timer: ReturnType<typeof setInterval> | undefined
    let visible = true
    function synchronize() {
      if (timer) clearInterval(timer)
      timer = undefined
      if (!visible || reduced.matches || !pointer.matches || document.hidden || network?.saveData) return
      setWarm(true)
      timer = setInterval(() => setIndex(current => {
        // Never fade into an undecoded or failed image on a slow connection.
        for (let offset = 1; offset < frames.length; offset++) {
          const next = (current + offset) % frames.length
          if (ready.current.has(frames[next])) return next
        }
        return current
      }), GALLERY_INTERVAL_MS)
    }
    // A hovered card can leave the viewport while the user scrolls.
    // Do not keep advancing invisible artwork or spend background work on it.
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? false
      synchronize()
    }, { threshold: 0.05 })
    if (mediaRef.current) observer?.observe(mediaRef.current)
    synchronize()
    reduced.addEventListener("change", synchronize)
    pointer.addEventListener("change", synchronize)
    document.addEventListener("visibilitychange", synchronize)
    network?.addEventListener("change", synchronize)
    return () => {
      observer?.disconnect()
      if (timer) clearInterval(timer)
      reduced.removeEventListener("change", synchronize)
      pointer.removeEventListener("change", synchronize)
      document.removeEventListener("visibilitychange", synchronize)
      network?.removeEventListener("change", synchronize)
    }
  }, [active, controls, frames])

  const canStep = frames.some((src, frameIndex) => frameIndex !== index && loaded.includes(src))
  const loading = frames.some(src => !loaded.includes(src) && !failed.includes(src))

  function step(direction: -1 | 1) {
    setIndex(current => {
      for (let offset = 1; offset < frames.length; offset++) {
        const next = (current + direction * offset + frames.length) % frames.length
        if (ready.current.has(frames[next])) return next
      }
      return current
    })
  }

  const kind = project.mediaFit ?? "landscape"
  const unavailable = failed.includes(frames[index])
  return (
    <div ref={mediaRef} className={`project-media project-media--${kind}`} data-frame={index}>
      <div className="project-media-stage">
        <div className="project-media-viewport">
          {frames.map((src, frameIndex) => frameIndex === 0 || warm ? (
            <Image key={src} src={src} alt={frameIndex === index ? project.galleryAlts?.[frameIndex] ?? project.imageAlt ?? `${project.title} preview` : ""}
              aria-hidden={frameIndex !== index} fill unoptimized draggable={false}
              loading={frameIndex === 0 ? "lazy" : "eager"}
              sizes={controls ? "(max-width: 700px) 90vw, 800px" : "(max-width: 700px) 90vw, 50vw"}
              className={`project-art-image project-gallery-frame${frameIndex === index ? " is-active" : ""}`}
              onLoad={() => {
                ready.current.add(src)
                setLoaded(current => current.includes(src) ? current : [...current, src])
                setFailed(current => current.filter(item => item !== src))
              }}
              onError={() => {
                ready.current.delete(src)
                setLoaded(current => current.filter(item => item !== src))
                setFailed(current => current.includes(src) ? current : [...current, src])
              }} />
          ) : null)}
          {unavailable ? <span className="project-media-unavailable">Preview unavailable</span> : null}
        </div>
      </div>
      {frames.length > 1 ? controls ? (
        <div className="project-gallery-controls" aria-label={`${project.title} image gallery`}>
          <button type="button" aria-label="Previous image" disabled={!canStep} onClick={() => step(-1)}><ChevronLeft aria-hidden="true" /></button>
          <span role="status" aria-live="polite">{index + 1} <span aria-hidden="true">/</span><span className="sr-only">of</span> {frames.length}
            {!canStep ? <small className="project-gallery-status">{loading ? "Loading images…" : "Other images unavailable"}</small> : null}
          </span>
          <button type="button" aria-label="Next image" disabled={!canStep} onClick={() => step(1)}><ChevronRight aria-hidden="true" /></button>
        </div>
      ) : <span className="project-gallery-count" aria-hidden="true">{index + 1} / {frames.length}</span> : null}
    </div>
  )
}

