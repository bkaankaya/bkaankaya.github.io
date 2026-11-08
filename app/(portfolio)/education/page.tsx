import { ArrowUpRight, BookOpen, CalendarDays, Globe2, Layers, MapPin, Microscope, Settings2, Target } from "lucide-react"
import { PageIntro } from "@/components/portfolio/section-heading"
import { Reveal } from "@/components/portfolio/reveal"
import { educationItems, focusAreas, learningAreas, languages } from "@/lib/portfolio-data"
import { portfolioPageMetadata } from "@/lib/portfolio-metadata"

export const metadata = portfolioPageMetadata("/education/")

export default function EducationPage() {
  return (
    <main id="main-content" className="portfolio-main interior-main">
      <PageIntro eyebrow="ACADEMIC BACKGROUND" title="Education" description="Computer engineering, business fundamentals and an international academic foundation." />

      <div className="education-layout">
        <div className="education-list">
          {educationItems.map(({ school, program, description, degree, status, period, location, website, qualification, grades, accent, icon: Icon }, index) => (
            <Reveal key={school} delay={index * 70}>
              <article className="education-card" data-accent={accent}>
                <div className="education-card-heading">
                  <span className="education-icon"><Icon aria-hidden="true" /></span>
                  <div><h2>{school}</h2><h3>{program}</h3></div>
                  <a className="education-link" href={website} target="_blank" rel="noopener noreferrer" aria-label={`Learn more about ${school}`}><ArrowUpRight aria-hidden="true" /></a>
                </div>
                <p className="education-description">{description}</p>
                {grades ? <div className="education-qualification">
                  <p>{qualification}</p>
                  <ul aria-label="Cambridge A Level results">{grades.map(({ subject, grade }) => <li key={subject}><span>{subject}</span><strong>{grade}</strong></li>)}</ul>
                </div> : null}
                <div className="education-meta">
                  <span><BookOpen aria-hidden="true" />{degree} · {status}</span><span><CalendarDays aria-hidden="true" />{period}</span><span><MapPin aria-hidden="true" />{location}</span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <aside className="education-sidebar" aria-label="Education highlights">
          <Reveal className="info-panel">
            <h2><span className="panel-icon"><Settings2 aria-hidden="true" /></span>Highlights</h2>
            <div className="highlight-row"><span><Settings2 aria-hidden="true" /></span><strong>Computer engineering</strong><i /><span><Layers aria-hidden="true" /></span><strong>Business minor</strong><i /><span><Microscope aria-hidden="true" /></span><strong>Cambridge A Levels</strong></div>
          </Reveal>
          <Reveal className="info-panel" delay={70}>
            <h2><span className="panel-icon"><Target aria-hidden="true" /></span>Relevant Focus Areas</h2>
            <div className="focus-tag-list">{focusAreas.map((item) => <span className="tag-pill" key={item}>{item}</span>)}</div>
          </Reveal>
          <Reveal className="info-panel" delay={140}>
            <h2><span className="panel-icon"><Globe2 aria-hidden="true" /></span>Languages</h2>
            <dl className="profile-languages">{languages.map(({ code, name, level }) => <div key={code}><dt><b aria-hidden="true">{code}</b>{name}</dt><dd>{level}</dd></div>)}</dl>
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


