"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ArrowUpRight, ExternalLink, X } from "lucide-react"
import { projects } from "@/lib/portfolio-data"
import { portfolioMailto } from "@/lib/portfolio-contact"

let cachedSupportsDisplayTransition: boolean | undefined

function canTransitionDisplay(): boolean {
  if (cachedSupportsDisplayTransition !== undefined) return cachedSupportsDisplayTransition
  if (typeof window === "undefined" || !window.CSS?.supports?.("transition-behavior", "allow-discrete") || !document.body) {
    return false
  }
  const probe = document.createElement("div")
  probe.style.cssText = "transition: display 1s allow-discrete !important; display: block;"
  document.body.appendChild(probe)
  getComputedStyle(probe).display
  probe.style.display = "none"
  cachedSupportsDisplayTransition = getComputedStyle(probe).display === "block"
  probe.remove()
  return cachedSupportsDisplayTransition
}

function supportsTopLayerExit(): boolean {
  return typeof window !== "undefined" && Boolean(window.CSS?.supports?.("overlay", "auto")) && canTransitionDisplay()
}

export function ProjectCard({ slug }: { slug: string }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const project = projects.find((item) => item.slug === slug)

  const closeDialog = useCallback(async () => {
    const dialog = dialogRef.current
    if (!dialog || !dialog.open) {
      setDialogOpen(false)
      return
    }

    const prefersReducedMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (!prefersReducedMotion && !supportsTopLayerExit()) {
      dialog.setAttribute("data-closing", "")
      const animations = dialog.getAnimations({ subtree: true })
      if (animations.length > 0) {
        await Promise.race([
          Promise.allSettled(animations.map((a) => a.finished)),
          new Promise((resolve) => window.setTimeout(resolve, 260)),
        ])
      }
      dialog.removeAttribute("data-closing")
    }

    if (dialog.open) {
      dialog.close()
    }
    setDialogOpen(false)
    triggerRef.current?.focus()
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (dialogOpen) {
      if (!dialog.open) {
        dialog.removeAttribute("data-closing")
        dialog.showModal()
      }
      const prevHtmlOverflow = document.documentElement.style.overflow
      const prevBodyOverflow = document.body.style.overflow
      document.documentElement.style.overflow = "hidden"
      document.body.style.overflow = "hidden"
      return () => {
        document.documentElement.style.overflow = prevHtmlOverflow
        document.body.style.overflow = prevBodyOverflow
      }
    }
  }, [dialogOpen])

  if (!project) return null
  const ProjectIcon = project.icon

  return (
    <>
      <article className="project-card" data-accent={project.accent}>
        <div className="project-card-content">
          <div className="project-card-top">
            <span className="project-icon">
              <ProjectIcon aria-hidden="true" />
            </span>
            <button
              ref={triggerRef}
              className="project-open-button"
              type="button"
              aria-label={`View details for ${project.title}`}
              aria-haspopup="dialog"
              onClick={(event) => {
                triggerRef.current = event.currentTarget
                setDialogOpen(true)
              }}
            >
              <ExternalLink aria-hidden="true" />
            </button>
          </div>
          <p className="project-category">{project.category}</p>
          <h3>
            <button
              type="button"
              className="project-title-trigger"
              aria-haspopup="dialog"
              onClick={(event) => {
                triggerRef.current = event.currentTarget
                setDialogOpen(true)
              }}
            >
              {project.title}
            </button>
          </h3>
          <p className="project-description">{project.description}</p>
          <ul className="tag-list" aria-label={`${project.title} technologies`}>
            {project.tags.map((tag) => (
              <li className="tag-pill" key={tag}>
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </article>

      <dialog
        ref={dialogRef}
        className="project-dialog"
        aria-labelledby={`dialog-title-${project.slug}`}
        onCancel={(event) => {
          event.preventDefault()
          void closeDialog()
        }}
        onClose={() => {
          setDialogOpen(false)
        }}
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            void closeDialog()
          }
        }}
      >
        <div className="project-dialog-content">
          <button
            className="dialog-close-button"
            type="button"
            aria-label="Close project details"
            onClick={() => void closeDialog()}
          >
            <X aria-hidden="true" />
          </button>
          <p className="eyebrow">
            <span className="eyebrow-dot" />
            {project.category} PROJECT
          </p>
          <h2 id={`dialog-title-${project.slug}`}>{project.title}</h2>
          <p className="dialog-description">{project.details}</p>
          <ul className="tag-list" aria-label="Project technologies">
            {project.tags.map((tag) => (
              <li className="tag-pill" key={tag}>
                {tag}
              </li>
            ))}
          </ul>
          <a
            className="button button-primary dialog-contact-link"
            href={portfolioMailto(`Let’s talk about ${project.title}`)}
          >
            Discuss a similar project <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </dialog>
    </>
  )
}
