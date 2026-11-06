"use client"

import { useRef, useState } from "react"
import { ChevronUp } from "lucide-react"
import { BrandIcon } from "@/components/portfolio/brand-icon"
import { technologies, additionalTechnologies } from "@/lib/portfolio-data"

/** A small disclosure, not a second skills catalogue or a navigation link. */
export function TechnologyStack() {
  const [expanded, setExpanded] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  return (
    <div className="technology-stack" onKeyDown={event => {
      if (event.key === "Escape" && expanded) {
        event.preventDefault()
        setExpanded(false)
        toggleRef.current?.focus({ preventScroll: true })
      }
    }}>
      <div className="technology-grid" role="list" aria-label="Core technologies">
        {technologies.map(({ name, detail, brand }) => (
          <div className="technology-card" role="listitem" key={brand} title={`${name} — ${detail}`} aria-label={`${name} (${detail})`}>
            <BrandIcon brand={brand} size={24} />
            <span>{name}</span>
          </div>
        ))}
        <div role="listitem">
          <button ref={toggleRef} className="technology-card technology-toggle" type="button"
            aria-expanded={expanded} aria-controls="additional-technologies"
            aria-label={expanded ? "Show fewer technologies" : "Show more technologies"}
            onClick={() => setExpanded(current => !current)}>
            {expanded ? <ChevronUp aria-hidden="true" /> : <BrandIcon brand="more" size={24} />}
            <span>{expanded ? "Less" : "More"}</span>
          </button>
        </div>
      </div>
      <div id="additional-technologies" className="technology-expanded" hidden={!expanded}>
        <p className="technology-expanded-label">Also used in my projects</p>
        <div className="technology-extra-grid" role="list" aria-label="Additional technologies">
          {additionalTechnologies.map(({ name, detail, brand }) => (
            <div className="technology-card" role="listitem" key={brand} title={`${name} — ${detail}`} aria-label={`${name} (${detail})`}>
              <BrandIcon brand={brand} size={24} />
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
