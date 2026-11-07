import type { Metadata } from "next"
import { HomePage } from "@/components/portfolio/home-page"

export const metadata: Metadata = {
  title: "Bertan Kaan Kaya | Software Engineer",
  description: "I build end-to-end products that combine software, AI and real-world impact.",
}

export default function Home() {
  return <HomePage />
}
