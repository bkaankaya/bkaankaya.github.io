import type { Metadata } from "next"

export const portfolioOrigin = "https://bkaankaya.github.io"

// The six public pages share this inventory with the static sitemap.
export const portfolioPages = {
  "/": {
    title: "Bertan Kaan Kaya | Software Engineer",
    description: "I build end-to-end products that combine software, AI and real-world impact.",
  },
  "/projects/": {
    title: "Projects | Bertan Kaan Kaya",
    description: "The complete project collection by Bertan Kaan Kaya: AI products, full-stack applications, embedded systems, research and games.",
  },
  "/experience/": {
    title: "Experience | Bertan Kaan Kaya",
    description: "Career path, product work and engineering experience of Bertan Kaan Kaya.",
  },
  "/education/": {
    title: "Education | Bertan Kaan Kaya",
    description: "TED University Computer Engineering, Beştepe Koleji and Cambridge A Level results of Bertan Kaan Kaya.",
  },
  "/about/": {
    title: "About | Bertan Kaan Kaya",
    description: "Learn about Bertan Kaan Kaya’s approach to product engineering, software, AI and design.",
  },
  "/contact/": {
    title: "Contact | Bertan Kaan Kaya",
    description: "Contact Bertan Kaan Kaya for software engineering opportunities and collaborations via email, LinkedIn or GitHub.",
  },
} as const

export type PortfolioPath = keyof typeof portfolioPages

export function portfolioUrl(path: PortfolioPath): string {
  return new URL(path, portfolioOrigin).href
}

export function portfolioPageMetadata(path: PortfolioPath): Metadata {
  const { title, description } = portfolioPages[path]
  const url = portfolioUrl(path)
  return {
    title,
    description,
    alternates: { canonical: url },
    // Nested metadata is replaced by Next, so every page includes the shared image.
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{
        url: "/portrait-kaan.webp",
        width: 520,
        height: 520,
        alt: "Portrait of Bertan Kaan Kaya",
      }],
    },
  }
}
