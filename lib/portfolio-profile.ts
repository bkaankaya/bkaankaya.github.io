import { Building2, Code2, Cpu, GraduationCap, Layers, Link2, type LucideIcon } from "lucide-react"

/** Public summaries only: owner's general CV and Cambridge June 2021 results. */
export const educationItems: {
  school: string; program: string; description: string; degree: string; status: string;
  period: string; location: string; website: string; accent: string; icon: LucideIcon;
  qualification?: string; grades?: { subject: string; grade: string }[];
}[] = [
  {
    school: "TED University",
    program: "B.Sc. in Computer Engineering",
    description: "Computer Engineering graduate with a minor in Business Administration (Management Program). GPA: 2.94.",
    degree: "Bachelor’s", status: "Graduated", period: "Sep 2022 – Jun 2026", location: "Ankara, Turkey",
    website: "https://www.tedu.edu.tr/", accent: "violet", icon: GraduationCap,
  },
  {
    school: "Beştepe Koleji",
    program: "Anatolian High School · Dual Diploma",
    description: "Completed the Turkish high school curriculum alongside Cambridge International GCE Advanced Levels.",
    degree: "High School", status: "Graduated", period: "2017 – 2022", location: "Ankara, Turkey",
    website: "https://www.bestepekoleji.com/", accent: "teal", icon: Building2,
    qualification: "Cambridge International GCE A Level · June 2021",
    grades: [{ subject: "Mathematics", grade: "A" }, { subject: "Biology", grade: "B" }, { subject: "Business", grade: "B" }],
  },
]

export const languages = [
  { code: "TR", name: "Turkish", level: "Native" },
  { code: "EN", name: "English", level: "Advanced" },
  { code: "ES", name: "Spanish", level: "Beginner" },
] as const

export const focusAreas = ["Software Engineering", "AI & OCR", "Backend Development", "Embedded Systems", "Business Administration"]

export const experienceItems = [
  {
    title: "TNC Group — Software & Data Intern",
    description: "Built a Python task-management application with priority sorting and deadline tracking. Analyzed sales data and created Excel pivot-table dashboards. Remote internship across two periods.",
    date: "Mar–Apr & Nov–Dec 2025", icon: Layers, accent: "violet",
  },
  {
    title: "Anova R&D Technologies — Embedded Systems Intern",
    description: "Read temperature and voltage on an STM32F407 and displayed them in a Qt (C++) interface. Implemented UART communication and Modbus RTU-style frames with CRC validation.",
    date: "Sep – Oct 2025", icon: Cpu, accent: "teal",
  },
  {
    title: "PROVEN Technologies — Blockchain & Backend Intern",
    description: "Built a food-ordering platform with Node.js, Redis and Ethereum smart contracts for escrow and pricing. Added a GraphQL subgraph with Graph Node and IPFS for on-chain order tracking.",
    date: "Aug 2025", icon: Link2, accent: "orange",
  },
  {
    title: "T2 Software — Software Intern",
    description: "Developed React screens, forms and views for employee leave requests and manager approval decisions.",
    date: "Aug – Sep 2024", icon: Code2, accent: "blue",
  },
]
