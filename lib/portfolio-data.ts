import {
  Activity,
  Building2,
  Cloud,
  Code2,
  Coffee,
  Cpu,
  Database,
  GraduationCap,
  Layers,
  Link2,
  ScanLine,
  Terminal,
  type LucideIcon,
} from "lucide-react"

export type ProjectCategory = "AI" | "Full-stack" | "Embedded" | "Research" | "Blockchain"
export type ProjectAccent = "violet" | "teal" | "orange" | "blue" | "pink"

export type PortfolioProject = {
  slug: string
  title: string
  description: string
  details: string
  category: ProjectCategory
  categories: ProjectCategory[]
  tags: string[]
  accent: ProjectAccent
  icon: LucideIcon
}

export const projectFilters = ["All", "AI", "Full-stack", "Embedded", "Research", "Blockchain"] as const

export const projects: PortfolioProject[] = [
  {
    slug: "dora-voice",
    title: "AI Receptionist (DoraVoice)",
    description: "AI-powered receptionist that automates business calls, scheduling and customer interactions.",
    details: "A product-focused AI receptionist experience built to make voice-driven customer support feel natural, dependable and easy for businesses to manage.",
    category: "AI",
    categories: ["AI", "Full-stack"],
    tags: ["Next.js", "TypeScript", "PostgreSQL", "AI"],
    accent: "violet",
    icon: Activity,
  },
  {
    slug: "vague",
    title: "Vague",
    description: "A modern platform for building, managing and scaling AI workflows.",
    details: "A modern product platform with an emphasis on clear customer journeys, thoughtful interfaces and practical AI-powered workflows.",
    category: "Full-stack",
    categories: ["Full-stack", "AI"],
    tags: ["Next.js", "Tailwind CSS", "Prisma", "AI"],
    accent: "teal",
    icon: Layers,
  },
  {
    slug: "embedded-systems-suite",
    title: "Embedded Systems Suite",
    description: "A collection of embedded projects including real-time and IoT systems.",
    details: "A collection of hands-on embedded experiments exploring real-time systems, connected devices and the relationship between hardware and software.",
    category: "Embedded",
    categories: ["Embedded"],
    tags: ["C/C++", "FreeRTOS", "STM32", "IoT"],
    accent: "orange",
    icon: Cpu,
  },
  {
    slug: "quickscan",
    title: "QuickScan",
    description: "A document-scanning and information-extraction tool with OCR and AI-powered analysis.",
    details: "A document workflow concept combining scanning, OCR and AI-assisted analysis to turn unstructured information into useful results.",
    category: "AI",
    categories: ["AI", "Research"],
    tags: ["Java", "Spring", "OCR", "AI"],
    accent: "teal",
    icon: ScanLine,
  },
  {
    slug: "hospital-management-system",
    title: "Hospital Management System",
    description: "A full-stack hospital management platform for patients, staff and appointments.",
    details: "A full-stack management system concept focused on coordinating patient records, staff workflows and appointment information in one place.",
    category: "Full-stack",
    categories: ["Full-stack", "Research"],
    tags: ["Java", "SQL", "Security"],
    accent: "blue",
    icon: Building2,
  },
  {
    slug: "yemeksepeti-dapp",
    title: "Yemeksepeti DApp",
    description: "A decentralized food-ordering platform prototype built with Web3 technologies.",
    details: "A decentralized product prototype exploring how Web3 technologies could support a transparent food-ordering experience.",
    category: "Blockchain",
    categories: ["Blockchain", "Full-stack"],
    tags: ["React", "Web3", "Solidity"],
    accent: "pink",
    icon: Link2,
  },
]

export const processSteps: { title: string; description: string; icon: LucideIcon }[] = [
  { title: "Build", description: "Turn ideas into reliable products.", icon: Code2 },
  { title: "Design", description: "Create intuitive and effective flows.", icon: Layers },
  { title: "Ship", description: "Deliver, iterate and scale.", icon: Activity },
  { title: "Learn", description: "Stay curious and keep improving.", icon: GraduationCap },
]

export const technologies: { name: string; detail: string; icon: LucideIcon }[] = [
  { name: "React", detail: "UI", icon: Code2 },
  { name: "Next.js", detail: "Web", icon: Layers },
  { name: "Python", detail: "AI", icon: Terminal },
  { name: "Java", detail: "Backend", icon: Coffee },
  { name: "Docker", detail: "DevOps", icon: Cpu },
  { name: "PostgreSQL", detail: "Data", icon: Database },
  { name: "AWS", detail: "Cloud", icon: Cloud },
  { name: "More", detail: "Tools", icon: Activity },
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
    title: "AI Receptionist / DoraVoice Work",
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
