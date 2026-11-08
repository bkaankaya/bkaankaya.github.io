"use client"

import Image from "next/image"
import "./project-media.css"
import { ChevronLeft, ChevronRight, Expand, Pause, Play } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import type { PortfolioProject } from "@/lib/portfolio-data"

export const GALLERY_INTERVAL_MS = 5000

type Props = {
  project: PortfolioProject
  active?: boolean
  controls?: boolean
  compact?: boolean
  initialIndex?: number
  onExplore?: (button: HTMLButtonElement, index: number) => void
}

/** Product imagery is separate from the small identity badge. */
export function ProjectMedia({ project, active = false, controls = false, compact = false, initialIndex = 0, onExplore }: Props) {
  const frames = useMemo(() => project.gallery ?? [project.image], [project])
  const [index, setIndex] = useState(initialIndex)
  const [warm, setWarm] = useState(false)
  const [paused, setPaused] = useState(false)
  const [failed, setFailed] = useState<string[]>([])
  const [loaded, setLoaded] = useState<string[]>([])
  const mediaRef = useRef<HTMLDivElement>(null)
  const ready = useRef(new Set<string>())
  const pointerPauseState = useRef<boolean | null>(null)

  // Modal/focused galleries express intent; nearby cards prepare extra views
  // only while visible and without a reduced-data preference.
  useEffect(() => {
    if (!controls || warm) return
    if (!compact) { setWarm(true); return }
    const network = (navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }).connection
    let nearby = typeof IntersectionObserver === "undefined"
    function prepare() {
      if (!nearby || document.hidden || network?.saveData) return
      setWarm(true)
      observer?.disconnect()
    }
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(entries => {
      nearby = entries.some(entry => entry.isIntersecting)
      prepare()
    }, { rootMargin: "240px" })
    if (mediaRef.current) observer?.observe(mediaRef.current)
    prepare()
    document.addEventListener("visibilitychange", prepare)
    network?.addEventListener("change", prepare)
    return () => {
      observer?.disconnect()
      document.removeEventListener("visibilitychange", prepare)
      network?.removeEventListener("change", prepare)
    }
  }, [controls, compact, warm])

  useEffect(() => {
    if (!active || frames.length < 2) return
    if (paused || (controls && !compact)) return
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
        // Keep the current image visible until the next image has decoded.
        for (let offset = 1; offset < frames.length; offset++) {
          const next = (current + offset) % frames.length
          if (ready.current.has(frames[next])) return next
        }
        return current
      }), GALLERY_INTERVAL_MS)
    }
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
  }, [active, controls, compact, frames, paused])

  const canStep = frames.some((src, frameIndex) => frameIndex !== index && loaded.includes(src))
  const loading = frames.some(src => !loaded.includes(src) && !failed.includes(src))
  function select(next: number) {
    setWarm(true)
    setPaused(true)
    if (ready.current.has(frames[next])) setIndex(next)
  }
  function step(direction: -1 | 1) {
    setWarm(true)
    setPaused(true)
    setIndex(current => {
      for (let offset = 1; offset < frames.length; offset++) {
        const next = (current + direction * offset + frames.length) % frames.length
        if (ready.current.has(frames[next])) return next
      }
      return current
    })
  }

  function pauseForFocus() {
    setWarm(true)
    // Focus must stop hover previews until the visitor explicitly resumes them.
    setPaused(true)
  }

  const kind = project.mediaFit ?? "landscape"
  const unavailable = failed.includes(frames[index])
  return (
    <div ref={mediaRef} className={`project-media project-media--${kind}${compact ? " project-media--compact" : ""}`} data-frame={index} data-fit={project.imageFit ?? "cover"} onFocusCapture={pauseForFocus}>
      <div className="project-media-stage">
        <div className="project-media-viewport">
          {frames.map((src, frameIndex) => frameIndex === 0 || frameIndex === initialIndex || warm ? (
            <Image key={src} src={src} alt={frameIndex === index ? project.galleryAlts?.[frameIndex] ?? project.imageAlt ?? `${project.title} preview ${frameIndex + 1}` : ""}
              aria-hidden={frameIndex !== index} fill unoptimized draggable={false}
              loading={frameIndex === 0 ? "lazy" : "eager"}
              sizes={compact ? "(max-width: 700px) 90vw, 50vw" : "(max-width: 700px) 90vw, 960px"}
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
        {onExplore ? <button className="project-art-trigger project-expand-trigger" type="button" aria-label={`Explore ${project.title} project`} aria-haspopup="dialog" onClick={event => onExplore(event.currentTarget, index)}><span><Expand aria-hidden="true" />View project</span></button> : null}
      </div>
      {frames.length > 1 ? controls ? (
        <div className="project-gallery-controls" role="group" aria-label={`${project.title} image gallery`}>
          {compact ? <button className="gallery-pause" type="button"
            aria-label={paused ? "Resume automatic previews" : "Pause automatic previews"}
            onPointerDown={() => { pointerPauseState.current = paused }}
            onPointerCancel={() => { pointerPauseState.current = null }}
            onKeyDown={() => { pointerPauseState.current = null }}
            onClick={event => {
              // Pointer focus pauses before click. Honor the action the visitor
              // pressed, rather than inadvertently resuming on the first click.
              const wasPaused = event.detail > 0 ? pointerPauseState.current ?? paused : paused
              pointerPauseState.current = null
              setPaused(!wasPaused)
            }}>{paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}</button> : null}
          <button className="gallery-step" type="button" aria-label="Previous image" disabled={!canStep} onClick={() => step(-1)}><ChevronLeft aria-hidden="true" /></button>
          <div className="gallery-thumbnails">
            {frames.map((src, frameIndex) => <button key={src} className="gallery-thumbnail" type="button" aria-label={`Show image ${frameIndex + 1} of ${frames.length}`} aria-pressed={frameIndex === index} disabled={!loaded.includes(src)} onClick={() => select(frameIndex)}>
              {/* Reuse a loaded stage frame; thumbnails must not start hidden-frame downloads. */}
              {loaded.includes(src) ? <Image src={src} alt="" width={72} height={44} unoptimized loading="lazy" /> : null}
              <span>{String(frameIndex + 1).padStart(2, "0")}</span>
            </button>)}
          </div>
          <span className="gallery-position" role="status" aria-live={active && !paused && compact ? "off" : "polite"} aria-atomic="true">{index + 1} <span aria-hidden="true">/</span><span className="sr-only">of</span> {frames.length}
            {!canStep ? <small className="project-gallery-status">{loading ? "Loading images…" : "Other images unavailable"}</small> : null}
          </span>
          <button className="gallery-step" type="button" aria-label="Next image" disabled={!canStep} onClick={() => step(1)}><ChevronRight aria-hidden="true" /></button>
        </div>
      ) : <span className="project-gallery-count" aria-hidden="true">{index + 1} / {frames.length}</span> : null}
    </div>
  )
}

