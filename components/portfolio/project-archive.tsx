"use client"

import { useMemo, useState } from "react"
import { projects, projectFilters, type ProjectCategory } from "@/lib/portfolio-data"
import { ProjectCard } from "@/components/portfolio/project-card"
import { Reveal } from "@/components/portfolio/reveal"

export function ProjectArchive() {
  const [activeFilter, setActiveFilter] = useState<(typeof projectFilters)[number]>("All")
  const visibleProjects = useMemo(() => {
    if (activeFilter === "All") return projects
    return projects.filter((project) => project.categories.includes(activeFilter as ProjectCategory))
  }, [activeFilter])

  return (
    <div className="project-archive">
      <div className="filter-list" role="group" aria-label="Filter projects by category">
        {projectFilters.map((filter) => (
          <button key={filter} className={`filter-button${activeFilter === filter ? " is-active" : ""}`} type="button" aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)}>
            {filter}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">Showing {visibleProjects.length} {visibleProjects.length === 1 ? "project" : "projects"}.</p>
      <div className="project-grid archive-grid" aria-live="polite">
        {visibleProjects.map((project, index) => (
          <Reveal key={project.slug} className="h-full" delay={index * 55}>
            <ProjectCard slug={project.slug} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}
