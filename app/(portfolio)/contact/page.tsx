import type { Metadata } from "next"
import { ContactPanel } from "@/components/portfolio/contact-panel"

export const metadata: Metadata = {
  title: "Contact | Bertan Kaan Kaya",
  description: "Contact Bertan Kaan Kaya for software engineering opportunities and collaborations via email, LinkedIn or GitHub.",
}

export default function ContactPage() {
  return <main id="main-content" className="portfolio-main interior-main contact-main">
    <header className="page-intro"><p className="eyebrow"><span className="eyebrow-dot" />GET IN TOUCH</p><h1 id="contact-title">Let’s connect.</h1><p className="page-intro-description">Have an opportunity or a project in mind? Reach out using one of the channels below.</p></header>
    <ContactPanel standalone />
  </main>
}
