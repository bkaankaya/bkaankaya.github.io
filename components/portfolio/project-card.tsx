"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUpRight, ExternalLink, X } from "lucide-react"
import { projects } from "@/lib/portfolio-data"

export function ProjectCard({ slug }: { slug: string }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const project = projects.find((item) => item.slug === slug)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (dialogOpen && !dialog.open) dialog.showModal()
    if (!dialogOpen && dialog.open) dialog.close()
  }, [dialogOpen])

  if (!project) return null
  const ProjectIcon = project.icon

  return (
    <>
      <article className="project-card" data-accent={project.accent}>
        <div className="project-card-content">
          <div className="project-card-top">
            <span className="project-icon"><ProjectIcon aria-hidden="true" /></span>
            <button className="project-open-button" type="button" aria-label={`View details for ${project.title}`} aria-haspopup="dialog" onClick={() => setDialogOpen(true)}>
              <ExternalLink aria-hidden="true" />
            </button>
          </div>
          <p className="project-category">{project.category}</p>
          <h3>{project.title}</h3>
          <p className="project-description">{project.description}</p>
          <ul className="tag-list" aria-label={`${project.title} technologies`}>
            {project.tags.map((tag) => <li className="tag-pill" key={tag}>{tag}</li>)}
          </ul>
        </div>
      </article>

      <dialog ref={dialogRef} className="project-dialog" aria-labelledby={`dialog-title-${project.slug}`} onClose={() => setDialogOpen(false)} onClick={(event) => { if (event.target === dialogRef.current) setDialogOpen(false) }}>
        <div className="project-dialog-content">
          <button className="dialog-close-button" type="button" aria-label="Close project details" onClick={() => setDialogOpen(false)}>
            <X aria-hidden="true" />
          </button>
          <p className="eyebrow"><span className="eyebrow-dot" />{project.category} PROJECT</p>
          <h2 id={`dialog-title-${project.slug}`}>{project.title}</h2>
          <p className="dialog-description">{project.details}</p>
          <ul className="tag-list" aria-label="Project technologies">
            {project.tags.map((tag) => <li className="tag-pill" key={tag}>{tag}</li>)}
          </ul>
          <a className="button button-primary dialog-contact-link" href={`mailto:bk@kaankaya.dev?subject=${encodeURIComponent(`Let’s talk about ${project.title}`)}`}>
            Discuss a similar project <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </dialog>
    </>
  )
}
