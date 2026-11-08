import { HomePage } from "@/components/portfolio/home-page"
import { portfolioPageMetadata } from "@/lib/portfolio-metadata"

export const metadata = portfolioPageMetadata("/")

export default function Home() {
  return <HomePage />
}
