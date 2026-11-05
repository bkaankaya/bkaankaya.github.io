import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Github, Linkedin, Mail, MapPin, Layers, Activity, Code2 } from "lucide-react"
import { Reveal } from "@/components/portfolio/reveal"

const portraitSource = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-EopK6L1jOreIYg5r738E7f63cWJs4z.png"

export const metadata: Metadata = {
  title: "About | B. Kaan Kaya",
  description: "Learn about B. Kaan Kaya’s approach to product engineering, software, AI and design.",
}

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
          <p>I’m B. Kaan Kaya, a software engineer who builds products at the intersection of software, <span className="accent-text">AI</span> and engineering. I turn ideas into reliable, user-focused systems — from early exploration to scalable, real-world products.</p>
          <p>I care about thoughtful design, clean and maintainable code, and delivering practical impact. Whether it’s a new product, an AI-powered experience or a complex system, I focus on clarity, execution and long-term value.</p>
        </Reveal>
        <Reveal className="about-profile-panel" delay={100}>
          <div className="about-portrait-frame">
            <Image className="profile-photo" src={portraitSource} alt="Portrait of B. Kaan Kaya" width={1536} height={1024} unoptimized />
          </div>
          <div className="about-status-card">
            <span><MapPin aria-hidden="true" />Based in Europe</span>
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

      <section className="contact-section" id="contact" aria-labelledby="contact-title">
        <Reveal className="contact-intro">
          <p className="eyebrow"><span className="eyebrow-dot" />GET IN TOUCH</p>
          <h2 id="contact-title">Let’s connect.</h2>
          <p>Reach out for collaborations, opportunities or just a chat about products, AI and engineering.</p>
        </Reveal>
        <div className="contact-grid">
          <Reveal><a className="contact-card" href="mailto:bk@kaankaya.dev"><Mail aria-hidden="true" /><ArrowUpRight className="contact-card-arrow" aria-hidden="true" /><strong>Email</strong><span>bk@kaankaya.dev</span></a></Reveal>
          <Reveal delay={50}><a className="contact-card" href="https://github.com/kaankaya" target="_blank" rel="noreferrer"><Github aria-hidden="true" /><ArrowUpRight className="contact-card-arrow" aria-hidden="true" /><strong>GitHub</strong><span>github.com/kaankaya</span></a></Reveal>
          <Reveal delay={100}><a className="contact-card" href="https://linkedin.com/in/kaankaya" target="_blank" rel="noreferrer"><Linkedin aria-hidden="true" /><ArrowUpRight className="contact-card-arrow" aria-hidden="true" /><strong>LinkedIn</strong><span>linkedin.com/in/kaankaya</span></a></Reveal>
          <Reveal delay={150}>
            <div className="contact-cta-card">
              <h3>Let’s build something thoughtful.</h3>
              <Link className="button button-primary" href="mailto:bk@kaankaya.dev">Get in Touch <ArrowRight aria-hidden="true" /></Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
