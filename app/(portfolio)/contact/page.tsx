import { ContactPanel } from "@/components/portfolio/contact-panel"
import { portfolioPageMetadata } from "@/lib/portfolio-metadata"

export const metadata = portfolioPageMetadata("/contact/")

export default function ContactPage() {
  return <main id="main-content" className="portfolio-main interior-main contact-main">
    <header className="page-intro"><p className="eyebrow"><span className="eyebrow-dot" />GET IN TOUCH</p><h1 id="contact-title">Let’s connect.</h1><p className="page-intro-description">Have an opportunity or a project in mind? Reach out using one of the channels below.</p></header>
    <ContactPanel standalone />
  </main>
}
