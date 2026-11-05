"use client"

import { useMemo, useState, type CSSProperties } from "react"
import { flushSync } from "react-dom"
import { projects, projectFilters, type ProjectCategory } from "@/lib/portfolio-data"
import { ProjectCard } from "@/components/portfolio/project-card"

type FilterOption = (typeof projectFilters)[number]

export function ProjectArchive() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("All")

  const visibleProjects = useMemo(() => {
    if (activeFilter === "All") return projects
    return projects.filter((project) => project.categories.includes(activeFilter as ProjectCategory))
  }, [activeFilter])

  function handleSelectFilter(nextFilter: FilterOption) {
    if (nextFilter === activeFilter) return

    const prefersReducedMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const docWithVT = document as Document & {
      startViewTransition?: (callback: () => void) => { finished: Promise<void> }
    }

    if (!prefersReducedMotion && typeof docWithVT.startViewTransition === "function") {
      docWithVT.startViewTransition(() => {
        flushSync(() => {
          setActiveFilter(nextFilter)
        })
      })
    } else {
      setActiveFilter(nextFilter)
    }
  }

  return (
    <div className="project-archive">
      <div className="filter-list" role="group" aria-label="Filter projects by category">
        {projectFilters.map((filter) => (
          <button
            key={filter}
            className={`filter-button${activeFilter === filter ? " is-active" : ""}`}
            type="button"
            aria-pressed={activeFilter === filter}
            onClick={() => handleSelectFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {visibleProjects.length} {visibleProjects.length === 1 ? "project" : "projects"}.
      </p>
      <div className="project-grid archive-grid" data-filter={activeFilter}>
        {visibleProjects.map((project, index) => {
          const itemStyle = {
            viewTransitionName: `project-card-${project.slug}`,
            "--filter-delay": `${index * 40}ms`,
          } as CSSProperties

          return (
            <div
              key={project.slug}
              className="archive-grid-item h-full"
              style={itemStyle}
            >
              <ProjectCard slug={project.slug} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
