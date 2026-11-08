import type { MetadataRoute } from "next"
import { portfolioPages, portfolioUrl, type PortfolioPath } from "@/lib/portfolio-metadata"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  return (Object.keys(portfolioPages) as PortfolioPath[]).map((path) => ({ url: portfolioUrl(path) }))
}
