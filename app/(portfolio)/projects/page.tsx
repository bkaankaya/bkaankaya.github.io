import type { Metadata } from "next"
import { PageIntro } from "@/components/portfolio/section-heading"
import { ProjectArchive } from "@/components/portfolio/project-archive"

export const metadata: Metadata = {
  title: "Projects | B. Kaan Kaya",
  description: "The complete project collection by B. Kaan Kaya: AI products, full-stack applications, embedded systems, research and games.",
}

export default function ProjectsPage() {
  return (
    <main id="main-content" className="portfolio-main interior-main projects-main">
      <PageIntro eyebrow="THE COMPLETE COLLECTION" title="Projects" description="Products, experiments and engineering work. Every project, in one place." />
      <ProjectArchive />
    </main>
  )
}
