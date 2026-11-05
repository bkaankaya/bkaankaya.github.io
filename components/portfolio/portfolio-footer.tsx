import Link from "next/link"
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react"

export function PortfolioFooter() {
  return (
    <footer className="portfolio-footer">
      <div className="portfolio-container footer-main">
        <div className="footer-intro">
          <Link className="brand-mark footer-brand" href="/" aria-label="B. Kaan Kaya home">BK<span>.</span></Link>
          <p>Thoughtful software, designed and built to make a real-world impact.</p>
        </div>
        <div className="footer-links">
          <p className="footer-label">EXPLORE</p>
          <Link href="/projects">Selected projects</Link>
          <Link href="/experience">Experience</Link>
          <Link href="/about#contact">Get in touch</Link>
        </div>
        <div className="footer-links footer-socials">
          <p className="footer-label">FIND ME ONLINE</p>
          <a href="https://github.com/kaankaya" target="_blank" rel="noreferrer"><Github aria-hidden="true" /> GitHub <ArrowUpRight aria-hidden="true" /></a>
          <a href="https://linkedin.com/in/kaankaya" target="_blank" rel="noreferrer"><Linkedin aria-hidden="true" /> LinkedIn <ArrowUpRight aria-hidden="true" /></a>
          <a href="mailto:bk@kaankaya.dev"><Mail aria-hidden="true" /> Email <ArrowUpRight aria-hidden="true" /></a>
        </div>
      </div>
      <div className="portfolio-container footer-bottom">
        <span>© {new Date().getFullYear()} B. Kaan Kaya</span>
        <span>Designed with clarity. Built with curiosity.</span>
      </div>
    </footer>
  )
}
