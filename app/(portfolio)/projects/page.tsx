import type { Metadata } from "next"
import { PageIntro } from "@/components/portfolio/section-heading"
import { ProjectArchive } from "@/components/portfolio/project-archive"

export const metadata: Metadata = {
  title: "Projects | B. Kaan Kaya",
  description: "A curated archive of AI, embedded, full-stack and product engineering work by B. Kaan Kaya.",
}

export default function ProjectsPage() {
  return (
    <main id="main-content" className="portfolio-main interior-main">
      <PageIntro eyebrow="ALL WORK" title="Projects" description="A curated archive of AI, embedded, full-stack and product engineering work." />
      <ProjectArchive />
    </main>
  )
}
