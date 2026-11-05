import Image from "next/image"
import Link from "next/link"
import type { CSSProperties } from "react"
import { ArrowRight, ArrowUpRight, Mail } from "lucide-react"
import { BrandIcon } from "@/components/portfolio/brand-icon"
import { ProjectCard } from "@/components/portfolio/project-card"
import { Reveal } from "@/components/portfolio/reveal"
import { SectionHeading } from "@/components/portfolio/section-heading"
import { processSteps, projects, technologies } from "@/lib/portfolio-data"
import { portfolioContact, portfolioMailto } from "@/lib/portfolio-contact"

const portraitSource = "/portrait-kaan.webp"

export function HomePage() {
  return (
    <main id="main-content" className="portfolio-main home-main">
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="hero-stagger-item" style={{ "--hero-step": 0 } as CSSProperties}>
              <p className="eyebrow"><span className="eyebrow-dot" />SOFTWARE ENGINEER</p>
              <h1 id="hero-title">Hi, I’m B. Kaan Kaya.</h1>
            </div>
            <p
              className="hero-description hero-stagger-item"
              style={{ "--hero-step": 1 } as CSSProperties}
            >
              I build end-to-end products that combine software, <span className="accent-text">AI</span> and real-world impact.
            </p>
            <div
              className="hero-actions hero-stagger-item"
              style={{ "--hero-step": 2 } as CSSProperties}
            >
              <Link className="button button-primary" href="/projects">View Projects <ArrowRight aria-hidden="true" /></Link>
              <Link className="button button-outline" href="/about#contact">Get in Touch</Link>
            </div>
            <div
              className="social-links hero-stagger-item"
              style={{ "--hero-step": 3 } as CSSProperties}
              aria-label="Social links"
            >
              <a href={portfolioContact.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" title="GitHub">
                <BrandIcon brand="github" size={20} />
              </a>
              <a href={portfolioContact.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" title="LinkedIn">
                <BrandIcon brand="linkedin" size={20} />
              </a>
              <a href={portfolioContact.mailto} aria-label="Email B. Kaan Kaya" title="Email">
                <Mail aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="portrait-frame">
              <Image
                className="profile-photo"
                src={portraitSource}
                alt="Portrait of B. Kaan Kaya"
                width={520}
                height={520}
                priority
                fetchPriority="high"
                unoptimized
              />
            </div>
            <a className="availability-card" href={portfolioMailto("Let’s work together")}>
              <span className="availability-dot" />
              <span className="availability-copy">
                <strong>Open to Opportunities</strong>
                <small>{portfolioContact.availability}</small>
              </span>
              <ArrowUpRight className="availability-arrow" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="process-strip" aria-label="How I work">
          {processSteps.map(({ title, description, icon: Icon }, index) => (
            <Reveal key={title} className="process-item" delay={index * 55}>
              <span className="process-icon"><Icon aria-hidden="true" /></span>
              <span className="process-copy"><strong>{title}</strong><small>{description}</small></span>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="content-section" aria-labelledby="selected-projects-title">
        <SectionHeading id="selected-projects-title" eyebrow="SELECTED PROJECTS" title="Projects" description="A selection of projects I’ve built, from AI systems to embedded and full-stack applications." action={{ label: "View All Projects", href: "/projects" }} />
        <div className="project-grid featured-project-grid">
          {projects.slice(0, 3).map((project, index) => (
            <Reveal key={project.slug} className="h-full" delay={index * 70}>
              <ProjectCard slug={project.slug} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="content-section tech-section" aria-labelledby="technologies-title">
        <div className="tech-section-heading">
          <Reveal>
            <p className="eyebrow"><span className="eyebrow-dot" />TECH STACK</p>
            <h2 className="section-title" id="technologies-title">Technologies</h2>
          </Reveal>
          <div className="technology-grid" role="list" aria-label="Core technologies">
            {technologies.map(({ name, detail, brand }, index) => (
              <Reveal key={name} className="h-full" delay={index * 35}>
                <div
                  className="technology-card"
                  role="listitem"
                  title={`${name} — ${detail}`}
                  aria-label={`${name} (${detail})`}
                >
                  <BrandIcon brand={brand} size={24} />
                  <span>{name}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
