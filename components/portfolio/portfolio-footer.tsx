import Link from "next/link"
import { ArrowUpRight, Mail } from "lucide-react"
import { BrandIcon } from "@/components/portfolio/brand-icon"
import { portfolioContact } from "@/lib/portfolio-contact"

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
          <a href={portfolioContact.githubUrl} target="_blank" rel="noopener noreferrer">
            <BrandIcon brand="github" size={15} /> GitHub <ArrowUpRight aria-hidden="true" />
          </a>
          <a href={portfolioContact.linkedinUrl} target="_blank" rel="noopener noreferrer">
            <BrandIcon brand="linkedin" size={15} /> LinkedIn <ArrowUpRight aria-hidden="true" />
          </a>
          <a href={portfolioContact.mailto}>
            <Mail aria-hidden="true" /> Email <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="portfolio-container footer-bottom">
        <span>© {new Date().getFullYear()} B. Kaan Kaya</span>
        <span>Designed with clarity. Built with curiosity.</span>
      </div>
    </footer>
  )
}
