import Image from "next/image"
import { MapPin, Layers, Activity, Code2 } from "lucide-react"
import { Reveal } from "@/components/portfolio/reveal"
import { ContactPanel } from "@/components/portfolio/contact-panel"
import { portfolioPageMetadata } from "@/lib/portfolio-metadata"

const portraitSource = "/portrait-kaan.webp"

export const metadata = portfolioPageMetadata("/about/")

const values = [
  { title: "How I Work", icon: Code2, accent: "violet", points: ["Turn ideas into working, reliable products.", "Keep things simple, modular and maintainable.", "Iterate with feedback and focus on real impact."] },
  { title: "What I Value", icon: Layers, accent: "teal", points: ["Clarity in both product and engineering.", "A user-focused, high-quality experience.", "Long-term thinking, ownership and impact."] },
  { title: "What I’m Exploring", icon: Activity, accent: "orange", points: ["AI-native products and real-world applications.", "Better ways to design, build and ship faster.", "Systems, tools and technologies that scale."] },
]

export default function AboutPage() {
  return (
    <main id="main-content" className="portfolio-main interior-main about-main">
      <section className="about-hero-grid" aria-labelledby="about-title">
        <Reveal className="about-copy">
          <p className="eyebrow"><span className="eyebrow-dot" />ABOUT ME</p>
          <h1 id="about-title">Design-minded engineering with a focus on clarity, systems and impact.</h1>
          <p>I’m Bertan Kaan Kaya, a TED University Computer Engineering graduate with a minor in Business Administration. I build products that combine software and <span className="accent-text">AI</span>, including DoraVoice, an AI phone receptionist for small businesses.</p>
          <p>My internship and project experience spans web development, backend software, embedded systems and blockchain applications. I enjoy turning ideas into practical tools, from exam-grading workflows to interactive games.</p>
        </Reveal>
        <Reveal className="about-profile-panel" delay={100}>
          <div className="about-portrait-frame">
            <Image
              className="profile-photo"
              src={portraitSource}
              alt="Portrait of Bertan Kaan Kaya"
              width={520}
              height={520}
              priority
              fetchPriority="high"
              unoptimized
            />
          </div>
          <div className="about-status-card">
            <span><MapPin aria-hidden="true" />Ankara, Turkey · Open to international relocation</span>
            <span><i className="availability-dot" />Open to collaboration</span>
            <span><Layers aria-hidden="true" />Interested in product, frontend and AI experiences</span>
          </div>
        </Reveal>
      </section>

      <section className="content-section values-grid" aria-label="Personal approach and values">
        {values.map(({ title, icon: Icon, accent, points }, index) => (
          <Reveal key={title} delay={index * 65}>
            <article className="value-card" data-accent={accent}>
              <span className="value-icon"><Icon aria-hidden="true" /></span>
              <h2>{title}</h2>
              <ul>{points.map((point) => <li key={point}>{point}</li>)}</ul>
            </article>
          </Reveal>
        ))}
      </section>

      <ContactPanel />
    </main>
  )
}
