import { PageIntro } from "@/components/portfolio/section-heading"
import { ProjectArchive } from "@/components/portfolio/project-archive"
import { portfolioPageMetadata } from "@/lib/portfolio-metadata"

export const metadata = portfolioPageMetadata("/projects/")

export default function ProjectsPage() {
  return (
    <main id="main-content" className="portfolio-main interior-main projects-main">
      <PageIntro eyebrow="THE COMPLETE COLLECTION" title="Projects" description="Products, experiments and engineering work. Every project, in one place." />
      <ProjectArchive />
    </main>
  )
}
