import type { Metadata } from "next"
import { ArrowUpRight, CalendarDays, Code2, GraduationCap, Layers, Rocket } from "lucide-react"
import { PageIntro } from "@/components/portfolio/section-heading"
import { Reveal } from "@/components/portfolio/reveal"
import { experienceItems } from "@/lib/portfolio-data"

export const metadata: Metadata = {
  title: "Experience | B. Kaan Kaya",
  description: "Career path, product work and engineering experience of B. Kaan Kaya.",
}

const skillHighlights = ["Frontend", "Design Engineering", "AI Products", "Embedded Systems", "Technical Communication", "Problem Solving"]

export default function ExperiencePage() {
  return (
    <main id="main-content" className="portfolio-main interior-main">
      <div className="experience-intro-layout">
        <PageIntro eyebrow="CAREER PATH" title="Experience" description="From engineering studies to product-building internships and AI-focused work." />
        <div className="experience-highlights">
          <Reveal className="experience-stat-card">
            <span className="stat-icon"><Code2 aria-hidden="true" /></span>
            <div><strong>15+</strong><h2>Hands-on Projects</h2><p>Product, AI, web and embedded</p></div>
          </Reveal>
          <Reveal className="experience-quick-links" delay={80}>
            <a href="/about"><span className="quick-link-icon"><Layers aria-hidden="true" /></span><span><strong>Cross-disciplinary Work</strong><small>Software × Hardware × Product</small></span><ArrowUpRight aria-hidden="true" /></a>
            <a href="/education"><span className="quick-link-icon"><GraduationCap aria-hidden="true" /></span><span><strong>International Study</strong><small>Engineering studies abroad</small></span><ArrowUpRight aria-hidden="true" /></a>
          </Reveal>
        </div>
      </div>

      <section className="experience-section" aria-label="Work and learning timeline">
        <div className="experience-timeline">
          {experienceItems.map(({ title, description, date, icon: Icon, accent }, index) => (
            <Reveal key={title} className="experience-entry-wrap" delay={index * 60}>
              <span className="timeline-node" aria-hidden="true"><span /></span>
              <article className="experience-entry" data-accent={accent}>
                <div className="experience-illustration"><Icon aria-hidden="true" /></div>
                <div className="experience-entry-copy">
                  <h2>{title}</h2>
                  <p>{description}</p>
                </div>
                <span className="date-pill"><CalendarDays aria-hidden="true" />{date}</span>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="skills-section" aria-labelledby="skills-title">
        <Reveal>
          <p className="eyebrow"><span className="eyebrow-dot" />SKILLS</p>
          <h2 className="section-title" id="skills-title">What I bring</h2>
        </Reveal>
        <div className="skill-chip-list">
          {skillHighlights.map((skill, index) => <Reveal key={skill} delay={index * 35}><span className="skill-chip"><Rocket aria-hidden="true" />{skill}</span></Reveal>)}
        </div>
      </section>
    </main>
  )
}
