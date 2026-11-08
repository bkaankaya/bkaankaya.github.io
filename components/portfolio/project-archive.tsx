"use client"

import { useId, useMemo, useRef, useState, type CSSProperties } from "react"
import { flushSync } from "react-dom"
import { ArrowUpRight, Search, X } from "lucide-react"
import { projects, projectFilters, type ProjectCategory } from "@/lib/portfolio-data"
import { ProjectCard } from "@/components/portfolio/project-card"
import { portfolioContact } from "@/lib/portfolio-contact"

type FilterOption = (typeof projectFilters)[number]

export function ProjectArchive() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("All")
  const [query, setQuery] = useState("")
  const searchId = useId()
  const resultsId = useId()
  const searchRef = useRef<HTMLInputElement>(null)
  const visibleProjects = useMemo(() => {
    const term = query.trim().toLocaleLowerCase()
    return projects.filter(project =>
      (activeFilter === "All" || project.categories.includes(activeFilter as ProjectCategory)) &&
      (!term || [project.title, project.description, ...project.tags].join(" ").toLocaleLowerCase().includes(term)),
    )
  }, [activeFilter, query])

  function clearSearch() {
    setQuery("")
    // The clear button disappears; keep keyboard users at the search field.
    searchRef.current?.focus({ preventScroll: true })
  }

  function resetFilters() {
    setActiveFilter("All")
    clearSearch()
  }

  function handleSelectFilter(nextFilter: FilterOption) {
    if (nextFilter === activeFilter) return
    const doc = document as Document & { startViewTransition?: (update: () => void) => { ready?: Promise<void>; finished: Promise<void> } }
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches && doc.startViewTransition && !document.documentElement.hasAttribute("data-route-transition")) {
      const transition = doc.startViewTransition(() => flushSync(() => setActiveFilter(nextFilter)))
      void transition.ready?.catch(() => {})
      void transition.finished.catch(() => {})
    } else setActiveFilter(nextFilter)
  }

  return (
    <div className="project-archive">
      <div className="archive-overview">
        <div className="archive-total"><span className="archive-total-number">{String(projects.length).padStart(2, "0")}</span><span>projects<br /><small>One complete collection</small></span></div>
        <a className="archive-github" href={portfolioContact.githubUrl} target="_blank" rel="noopener noreferrer">Explore my GitHub <ArrowUpRight aria-hidden="true" /></a>
      </div>
      <div className="archive-toolbar">
        <div className="filter-list" role="group" aria-label="Filter projects by category">
          {projectFilters.map(filter => {
            const count = filter === "All" ? projects.length : projects.filter(project => project.categories.includes(filter)).length
            return <button key={filter} className={`filter-button${activeFilter === filter ? " is-active" : ""}`} type="button" aria-pressed={activeFilter === filter} aria-controls={resultsId} onClick={() => handleSelectFilter(filter)}>{filter}<span className="filter-count" aria-hidden="true">{count}</span></button>
          })}
        </div>
        <div className="project-search" role="search" aria-label="Search the project collection">
          <Search aria-hidden="true" />
          <label className="sr-only" htmlFor={searchId}>Search projects by name or technology</label>
          <input ref={searchRef} id={searchId} type="search" autoComplete="off" aria-controls={resultsId} placeholder="Find a project or technology…" value={query} onChange={event => setQuery(event.target.value)} />
          {query ? <button type="button" aria-label="Clear project search" onClick={clearSearch}><X aria-hidden="true" /></button> : null}
        </div>
      </div>
      <div className="archive-results-heading"><p role="status" aria-live="polite" aria-atomic="true">{activeFilter === "All" && !query.trim() ? "All projects" : `${visibleProjects.length} ${visibleProjects.length === 1 ? "project" : "projects"} found`}<span aria-hidden="true">{String(visibleProjects.length).padStart(2, "0")}</span></p><span>Open a project. Explore the details.</span></div>
      {visibleProjects.length ? <div id={resultsId} className="project-grid archive-grid" data-filter={activeFilter}>
        {visibleProjects.map((project, index) => <div key={project.slug} className="archive-grid-item h-full" style={{ viewTransitionName: `project-card-${project.slug}`, "--filter-delay": `${Math.min(index, 5) * 35}ms` } as CSSProperties}><ProjectCard slug={project.slug} /></div>)}
      </div> : <div id={resultsId} className="archive-empty"><Search aria-hidden="true" /><h2>No matching projects</h2><p>Try another project name, category or technology.</p><button className="button button-outline" type="button" onClick={resetFilters}>Show all {projects.length} projects</button></div>}
    </div>
  )
}
