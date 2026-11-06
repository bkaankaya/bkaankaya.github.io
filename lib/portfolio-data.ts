import {
  Activity,
  Building2,
  Code2,
  Cpu,
  GraduationCap,
  Gamepad2,
  Layers,
  Link2,
  ScanLine,
  type LucideIcon,
} from "lucide-react"
import type { BrandId } from "@/components/portfolio/brand-icon"

export type ProjectCategory = "AI" | "Full-stack" | "Embedded" | "Research" | "Blockchain" | "Games"
export type ProjectAccent = "violet" | "teal" | "orange" | "blue" | "pink"

export type PortfolioProject = {
  slug: string
  title: string
  description: string
  details: string
  category: ProjectCategory
  categories: ProjectCategory[]
  tags: string[]
  /** Original, locally hosted editorial illustration; not an app screenshot. */
  image: string
  accent: ProjectAccent
  icon: LucideIcon
}

export const projectFilters = ["All", "AI", "Full-stack", "Embedded", "Research", "Blockchain", "Games"] as const

export const projects: PortfolioProject[] = [
  {
    slug: "dora-voice",
    title: "DoraVoice",
    description: "Voice AI receptionist for business calls, appointments and customer support workflows.",
    details: "DoraVoice combines a Java / Spring Boot backend, PostgreSQL and AI-assisted voice workflows with a business-focused web experience. The visual shown here is a bespoke editorial illustration, not a live product screenshot.",
    category: "AI",
    categories: ["AI", "Full-stack"],
    tags: ["Spring Boot", "Next.js", "PostgreSQL", "AI"],
    image: "/projects/doravoice.svg",
    accent: "violet",
    icon: Activity,
  },
  {
    slug: "vague",
    title: "Vague",
    description: "Full-stack sports e-commerce with product management, order workflows and payments.",
    details: "A sports-commerce platform built using Next.js, Spring Boot, PostgreSQL, Redis and integrations for checkout and order processing. The artwork is an illustrative composition, not a screenshot of an order or customer account.",
    category: "Full-stack",
    categories: ["Full-stack"],
    tags: ["Next.js", "Spring Boot", "PostgreSQL", "Stripe"],
    image: "/projects/vague.svg",
    accent: "teal",
    icon: Layers,
  },
  {
    slug: "embedded-systems-suite",
    title: "Embedded Systems Suite",
    description: "Embedded engineering projects covering microcontrollers, sensors and real-time systems.",
    details: "A collection of hardware/software explorations including C/C++, STM32 development and communication between devices and monitoring interfaces.",
    category: "Embedded",
    categories: ["Embedded"],
    tags: ["C/C++", "STM32", "UART", "IoT"],
    image: "/projects/embedded.svg",
    accent: "orange",
    icon: Cpu,
  },
  {
    slug: "quickscan",
    title: "QuickScan",
    description: "Exam processing and evaluation workflows using OCR and AI-assisted extraction.",
    details: "A team-built exam management project connecting document recognition with backend workflows and web/mobile interfaces. Visual is conceptual and contains no student records or confidential sample documents.",
    category: "AI",
    categories: ["AI", "Research"],
    tags: ["Spring Boot", "OCR", "FastAPI", "Flutter"],
    image: "/projects/quickscan.svg",
    accent: "teal",
    icon: ScanLine,
  },
  {
    slug: "hospital-management-system",
    title: "Hospital Management System",
    description: "Java-based healthcare administration for staff, patient workflows and appointments.",
    details: "A hospital-management software project focused on structured records, appointments and staff operations. The illustration uses synthetic interface placeholders, not patient information.",
    category: "Full-stack",
    categories: ["Full-stack"],
    tags: ["Java", "SQL", "Management"],
    image: "/projects/hospital.svg",
    accent: "blue",
    icon: Building2,
  },
  {
    slug: "yemeksepeti-dapp",
    title: "Yemeksepeti DApp",
    description: "A decentralized food-ordering platform prototype exploring Web3 transactions.",
    details: "An experimental food-ordering interface combining consumer flows with blockchain-oriented prototype concepts. The image is editorial concept art, not a live external brand interface.",
    category: "Blockchain",
    categories: ["Blockchain", "Full-stack"],
    tags: ["React", "Web3", "Solidity"],
    image: "/projects/food-dapp.svg",
    accent: "pink",
    icon: Link2,
  },
  {
    slug: "rezero-2d-game",
    title: "ReZero 2D Game",
    description: "A 2D battle-game experiment with a custom combat and animation pipeline.",
    details: "An experimental JavaScript / HTML5 Canvas and Electron game centered on a one-on-one boss battle. Work includes sprite animation configuration, combat logic and effects. The illustration is original portfolio concept art—not a gameplay screenshot—and private source assets are not published.",
    category: "Games",
    categories: ["Games"],
    tags: ["JavaScript", "Canvas", "Electron", "2D Combat"],
    image: "/projects/rezero.svg",
    accent: "violet",
    icon: Gamepad2,
  },
]

export const processSteps: { title: string; description: string; icon: LucideIcon }[] = [
  { title: "Build", description: "Turn ideas into reliable products.", icon: Code2 },
  { title: "Design", description: "Create intuitive and effective flows.", icon: Layers },
  { title: "Ship", description: "Deliver, iterate and scale.", icon: Activity },
  { title: "Learn", description: "Stay curious and keep improving.", icon: GraduationCap },
]

export const technologies: { name: string; detail: string; brand: BrandId }[] = [
  { name: "React", detail: "UI", brand: "react" },
  { name: "Next.js", detail: "Web", brand: "nextjs" },
  { name: "Python", detail: "AI", brand: "python" },
  { name: "Java", detail: "Backend", brand: "java" },
  { name: "Docker", detail: "DevOps", brand: "docker" },
  { name: "PostgreSQL", detail: "Data", brand: "postgresql" },
  { name: "AWS", detail: "Cloud", brand: "aws" },
  { name: "More", detail: "Tools", brand: "more" },
]

export const experienceItems: { title: string; description: string; date: string; icon: LucideIcon; accent: ProjectAccent }[] = [
  {
    title: "Independent Product & Software Projects",
    description: "Built end-to-end portfolio, AI, embedded and web projects with a focus on design, delivery and iteration.",
    date: "2024 – Present",
    icon: Layers,
    accent: "violet",
  },
  {
    title: "DoraVoice Project Work",
    description: "Contributed to frontend, product polish and engineering quality across a modern AI assistant product.",
    date: "2024",
    icon: Activity,
    accent: "violet",
  },
  {
    title: "Mechanical Engineering Studies & Technical Projects",
    description: "Applied structured problem solving, analytical thinking and systems design across academic and technical work.",
    date: "2020 – 2024",
    icon: GraduationCap,
    accent: "teal",
  },
  {
    title: "Early Engineering & Embedded Exploration",
    description: "Worked on embedded systems, IoT experiments and practical implementation-focused projects.",
    date: "2019 – 2020",
    icon: Cpu,
    accent: "orange",
  },
]

export const educationItems = [
  {
    school: "University of Rome Tor Vergata",
    program: "Master’s studies in Mechanical Engineering",
    description: "Advanced, research-oriented studies in mechanical engineering, with a focus on modeling, design and real-world engineering applications.",
    degree: "Master’s",
    status: "Ongoing",
    location: "Rome, Italy",
    accent: "violet" as const,
    icon: GraduationCap,
  },
  {
    school: "Politecnico di Torino",
    program: "Bachelor’s in Mechanical Engineering",
    description: "An English-medium engineering education, building a strong foundation in mechanics, design and systems engineering.",
    degree: "Bachelor’s",
    status: "Graduated",
    location: "Turin, Italy",
    accent: "teal" as const,
    icon: Building2,
  },
]

export const learningAreas = [
  { title: "Frontend Design", description: "Building modern, user-centered interfaces and experiences.", icon: Code2, accent: "violet" as const },
  { title: "AI Systems", description: "Exploring AI tools, applications and their real-world impact.", icon: Activity, accent: "teal" as const },
  { title: "Software Engineering", description: "Improving software design, quality and development practices.", icon: Layers, accent: "blue" as const },
  { title: "Technical Communication", description: "Communicating complex ideas clearly and effectively.", icon: Link2, accent: "orange" as const },
]

export const focusAreas = ["Mechanics", "Systems Thinking", "AI Interest", "Design Engineering", "Problem Solving"]
