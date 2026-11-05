import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Github, Linkedin, Mail } from "lucide-react"
import { ProjectCard } from "@/components/portfolio/project-card"
import { Reveal } from "@/components/portfolio/reveal"
import { SectionHeading } from "@/components/portfolio/section-heading"
import { processSteps, projects, technologies } from "@/lib/portfolio-data"
import { portfolioContact, portfolioMailto } from "@/lib/portfolio-contact"

const portraitSource = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-EopK6L1jOreIYg5r738E7f63cWJs4z.png"

export function HomePage() {
  return (
    <main id="main-content" className="portfolio-main home-main">
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-grid">
          <Reveal className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" />SOFTWARE ENGINEER</p>
            <h1 id="hero-title">Hi, I’m B. Kaan Kaya.</h1>
            <p className="hero-description">I build end-to-end products that combine software, <span className="accent-text">AI</span> and real-world impact.</p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/projects">View Projects <ArrowRight aria-hidden="true" /></Link>
              <Link className="button button-outline" href="/about#contact">Get in Touch</Link>
            </div>
            <div className="social-links" aria-label="Social links">
              <a href={portfolioContact.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub profile"><Github aria-hidden="true" /></a>
              <a href={portfolioContact.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn profile"><Linkedin aria-hidden="true" /></a>
              <a href={portfolioContact.mailto} aria-label="Email B. Kaan Kaya"><Mail aria-hidden="true" /></a>
            </div>
          </Reveal>

          <Reveal className="hero-visual" delay={90}>
            <div className="portrait-frame">
              <Image className="profile-photo" src={portraitSource} alt="Portrait of B. Kaan Kaya" width={1536} height={1024} priority unoptimized />
            </div>
            <a className="availability-card" href={portfolioMailto("Let’s work together")}>
              <span className="availability-dot" />
              <span className="availability-copy"><strong>Open to Opportunities</strong><small>{portfolioContact.availability}</small></span>
              <ArrowUpRight className="availability-arrow" aria-hidden="true" />
            </a>
          </Reveal>
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
          <div className="technology-grid">
            {technologies.map(({ name, detail, icon: Icon }, index) => (
              <Reveal key={name} className="h-full" delay={index * 35}>
                <div className="technology-card" title={`${name} — ${detail}`}>
                  <Icon aria-hidden="true" />
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
