import type { Metadata } from "next"
import { ArrowUpRight, BookOpen, CalendarDays, Globe2, Layers, MapPin, Microscope, Settings2, Target } from "lucide-react"
import { PageIntro } from "@/components/portfolio/section-heading"
import { Reveal } from "@/components/portfolio/reveal"
import { educationItems, focusAreas, learningAreas } from "@/lib/portfolio-data"

export const metadata: Metadata = {
  title: "Education | B. Kaan Kaya",
  description: "Engineering studies, academic background and continuous learning interests of B. Kaan Kaya.",
}

export default function EducationPage() {
  return (
    <main id="main-content" className="portfolio-main interior-main">
      <PageIntro eyebrow="ACADEMIC BACKGROUND" title="Education" description="An engineering foundation, interdisciplinary learning and a commitment to continuous growth." />

      <div className="education-layout">
        <div className="education-list">
          {educationItems.map(({ school, program, description, degree, status, location, accent, icon: Icon }, index) => (
            <Reveal key={school} delay={index * 70}>
              <article className="education-card" data-accent={accent}>
                <div className="education-card-heading">
                  <span className="education-icon"><Icon aria-hidden="true" /></span>
                  <div><h2>{school}</h2><h3>{program}</h3></div>
                  <a className="education-link" href={school === "University of Rome Tor Vergata" ? "https://web.uniroma2.it/en/" : "https://www.polito.it/en"} target="_blank" rel="noreferrer" aria-label={`Learn more about ${school}`}><ArrowUpRight aria-hidden="true" /></a>
                </div>
                <p className="education-description">{description}</p>
                <div className="education-meta">
                  <span><BookOpen aria-hidden="true" />{degree}</span><span><CalendarDays aria-hidden="true" />{status}</span><span><MapPin aria-hidden="true" />{location}</span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <aside className="education-sidebar" aria-label="Education highlights">
          <Reveal className="info-panel">
            <h2><span className="panel-icon"><Settings2 aria-hidden="true" /></span>Highlights</h2>
            <div className="highlight-row"><span><Settings2 aria-hidden="true" /></span><strong>Engineering foundation</strong><i /><span><Layers aria-hidden="true" /></span><strong>Product mindset</strong><i /><span><Microscope aria-hidden="true" /></span><strong>Research curiosity</strong></div>
          </Reveal>
          <Reveal className="info-panel" delay={70}>
            <h2><span className="panel-icon"><Target aria-hidden="true" /></span>Relevant Focus Areas</h2>
            <div className="focus-tag-list">{focusAreas.map((item) => <span className="tag-pill" key={item}>{item}</span>)}</div>
          </Reveal>
          <Reveal className="info-panel" delay={140}>
            <h2><span className="panel-icon"><Globe2 aria-hidden="true" /></span>Languages</h2>
            <div className="language-list"><span><b>EN</b>English</span><i /><span><b>IT</b>Italian</span><i /><span><b>TR</b>Turkish</span></div>
          </Reveal>
        </aside>
      </div>

      <section className="content-section learning-section" aria-labelledby="learning-title">
        <Reveal>
          <p className="eyebrow"><span className="eyebrow-dot" />CONTINUOUS LEARNING</p>
          <h2 className="section-title" id="learning-title">Continuous Learning</h2>
        </Reveal>
        <div className="learning-grid">
          {learningAreas.map(({ title, description, icon: Icon, accent }, index) => (
            <Reveal key={title} delay={index * 55}>
              <article className="learning-card" data-accent={accent}>
                <span className="learning-icon"><Icon aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  )
}

