"use client"

import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import { ArrowUpRight, X } from "lucide-react"
import { projects, type PortfolioProject } from "@/lib/portfolio-data"
import { portfolioMailto } from "@/lib/portfolio-contact"
import { ProjectMedia } from "@/components/portfolio/project-media"

function ProjectIdentity({ project }: { project: PortfolioProject }) {
  const Icon = project.icon
  return <span className={`project-icon${project.logo ? " project-brand" : ""}`} data-brand={project.slug}>
    {project.logo ? <Image src={project.logo} alt={`${project.title} logo`} width={48} height={48} unoptimized /> : <Icon aria-hidden="true" />}
  </span>
}

export function ProjectCard({ slug }: { slug: string }) {
  const project = projects.find(item => item.slug === slug)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [hovering, setHovering] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const closing = useRef(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const closeDialog = useCallback(() => {
    const dialog = dialogRef.current
    if (!dialog?.open || closing.current) return
    closing.current = true
    const finish = () => {
      dialog.close()
      dialog.removeAttribute("data-closing")
      closing.current = false
      setDialogOpen(false)
      triggerRef.current?.focus({ preventScroll: true })
    }
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) finish()
    else {
      dialog.setAttribute("data-closing", "")
      closeTimer.current = setTimeout(finish, 180)
    }
  }, [])

  useEffect(() => {
    if (!dialogOpen || !dialogRef.current) return
    const dialog = dialogRef.current
    dialog.removeAttribute("data-closing")
    if (!dialog.open) dialog.showModal()
    const previous = document.documentElement.style.overflow
    document.documentElement.style.overflow = "hidden"
    return () => {
      document.documentElement.style.overflow = previous
      if (closeTimer.current) clearTimeout(closeTimer.current)
      closing.current = false
      if (dialog.open) dialog.close()
    }
  }, [dialogOpen])

  if (!project) return null
  const visualLabel = project.visualType === "screenshot" ? "Product screenshot" : project.visualType === "concept" ? "Design preview" : "Interface study"
  function openDialog(button: HTMLButtonElement) {
    triggerRef.current = button
    setHovering(false)
    setDialogOpen(true)
  }

  return <>
    <article className="project-card" data-project={project.slug} data-accent={project.accent} data-visual={project.visualType ?? "illustration"}
      onPointerEnter={event => { if (event.pointerType === "mouse") setHovering(true) }}
      onPointerLeave={() => setHovering(false)}>
      <button className="project-art-trigger" type="button" aria-label={`Explore ${project.title} project`} aria-haspopup="dialog" onClick={event => openDialog(event.currentTarget)}>
        <ProjectMedia project={project} active={hovering && !dialogOpen} />
        <span className="project-art-caption" aria-hidden="true"><span><i />{visualLabel}</span><span>Explore project <ArrowUpRight /></span></span>
      </button>
      <div className="project-card-content">
        <div className="project-card-top"><ProjectIdentity project={project} /><span className="project-category">{project.category}</span></div>
        <h3><button type="button" className="project-title-trigger" aria-haspopup="dialog" onClick={event => openDialog(event.currentTarget)}>{project.title}<ArrowUpRight aria-hidden="true" /></button></h3>
        <p className="project-description">{project.description}</p>
        <ul className="tag-list" aria-label={`${project.title} technologies`}>{project.tags.map(tag => <li className="tag-pill" key={tag}>{tag}</li>)}</ul>
      </div>
    </article>
    <dialog ref={dialogRef} className="project-dialog" data-project={project.slug} data-accent={project.accent} data-visual={project.visualType ?? "illustration"}
      aria-labelledby={`dialog-title-${project.slug}`} aria-describedby={`dialog-description-${project.slug}`}
      onCancel={event => { event.preventDefault(); closeDialog() }}
      onClose={() => setDialogOpen(false)}
      onClick={event => {
        if (event.target !== dialogRef.current) return
        const box = event.currentTarget.getBoundingClientRect()
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeDialog()
      }}>
      {dialogOpen ? <div className="project-dialog-content">
        <header className="project-dialog-heading"><div><ProjectIdentity project={project} /><span>{project.category}<small>Project details</small></span></div>
          <button autoFocus className="dialog-close-button" type="button" aria-label="Close project details" onClick={closeDialog}><X aria-hidden="true" /></button>
        </header>
        <div className="project-dialog-visual"><ProjectMedia project={project} controls /></div>
        <div className="project-dialog-copy"><p className="project-preview-note">{visualLabel}{project.visualType === "screenshot" ? " · Captured from the project" : project.visualType === "concept" ? " · Owner-provided concepts, not live product screens" : " · Editorial illustration, not a live product screen"}</p>
          <h2 id={`dialog-title-${project.slug}`}>{project.title}</h2>
          <p className="dialog-description" id={`dialog-description-${project.slug}`}>{project.details}</p>
          <ul className="tag-list" aria-label="Project technologies">{project.tags.map(tag => <li className="tag-pill" key={tag}>{tag}</li>)}</ul>
          <a className="button button-primary dialog-contact-link" href={portfolioMailto(`Let’s talk about ${project.title}`)}>Discuss a similar project <ArrowUpRight aria-hidden="true" /></a>
        </div>
      </div> : null}
    </dialog>
  </>
}
