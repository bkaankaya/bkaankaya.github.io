import {
  Activity,
  Building2,
  BrainCircuit,
  ChartColumn,
  CalendarDays,
  CheckSquare,
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

export type ProjectCategory = "AI" | "Full-stack" | "Frontend" | "Embedded" | "Research" | "Blockchain" | "Games"
export type ProjectAccent = "violet" | "teal" | "orange" | "blue" | "pink"

export type PortfolioProject = {
  slug: string
  title: string
  repository: string
  sourceVisibility: "public" | "private"
  sourceUrl?: string
  mediaNote?: string
  description: string
  details: string
  category: ProjectCategory
  categories: ProjectCategory[]
  tags: string[]
  /** Local visual; distinguish screenshots, verified branding and editorial compositions. */
  image: string
  /** Verified identity asset; rendered only in the small project badge. */
  logo?: string
  imageAlt?: string
  galleryAlts?: readonly string[]
  mediaFit?: "landscape" | "mobile"
  imageFit?: "contain" | "cover"
  gallery?: readonly string[]
  visualType?: "screenshot" | "illustration" | "concept" | "visualization"
  accent: ProjectAccent
  icon: LucideIcon
}

export const projectFilters = ["All", "AI", "Full-stack", "Frontend", "Embedded", "Research", "Blockchain", "Games"] as const

export const projects: PortfolioProject[] = [
  {
    slug: "dora-voice",
    title: "DoraVoice",
    repository: "AI-Receptionist",
    sourceVisibility: "private",
    description: "Voice AI receptionist for business calls, appointments and customer support workflows.",
    details: "A business voice assistant connecting a Java / Spring Boot backend, PostgreSQL, appointment workflows and a Next.js web experience. The gallery pairs call management with a receptionist product interface concept.",
    category: "AI",
    categories: ["AI", "Full-stack"],
    tags: ["Spring Boot", "Next.js", "PostgreSQL", "Voice AI"],
    image: "/projects/doravoice-call-preview.webp",
    gallery: ["/projects/doravoice-call-preview.webp", "/projects/doravoice-product-preview.webp"],
    galleryAlts: ["DoraVoice call-management interface design preview", "DoraVoice AI receptionist product design preview"],
    visualType: "concept",
    accent: "violet",
    icon: Activity,
    logo: "/projects/doravoice-mark.webp",
    mediaNote: "Call management and receptionist interface concepts",
  },
  {
    slug: "vague",
    title: "Vague",
    repository: "Vague-",
    sourceVisibility: "private",
    description: "Sports commerce with a product catalog, order management and payment workflows.",
    details: "A sports-commerce platform built with Next.js, Spring Boot, PostgreSQL, Redis and Stripe. The paired storefront and product-page concepts translate its shopping workflows into an original Vague visual direction inspired by premium sports retail.",
    category: "Full-stack",
    categories: ["Full-stack"],
    tags: ["Next.js", "Spring Boot", "PostgreSQL", "Stripe"],
    image: "/projects/vague-storefront.png",
    gallery: ["/projects/vague-storefront.png", "/projects/vague-product.png"],
    galleryAlts: ["Vague premium sports-commerce storefront concept", "Vague sports product detail and purchase-flow concept"],
    visualType: "concept",
    accent: "teal",
    icon: Layers,
    logo: "/projects/vague-brand.svg",
    mediaNote: "Storefront and product-page concepts",
  },
  {
    slug: "quickscan",
    title: "QuickScan",
    repository: "QuickScan",
    sourceVisibility: "private",
    description: "Exam processing and assessment workflows combining OCR, AI and web/mobile interfaces.",
    details: "A team-built exam-management project that connects document recognition to backend workflows and Flutter and web interfaces. The gallery pairs the teacher dashboard with the exam-results publication interface, using seeded demonstration records.",
    category: "AI",
    categories: ["AI", "Full-stack", "Research"],
    tags: ["Spring Boot", "OCR", "FastAPI", "Flutter"],
    image: "/projects/optimized/quickscan-home.webp",
    gallery: ["/projects/optimized/quickscan-home.webp", "/projects/optimized/quickscan-publish.webp"],
    galleryAlts: ["QuickScan mobile teacher dashboard with seeded demonstration data", "QuickScan teacher exam publication screen with synthetic demo records"],
    visualType: "screenshot",
    imageFit: "contain",
    accent: "teal",
    icon: ScanLine,
    logo: "/projects/optimized/quickscan-mark.webp",
    mediaFit: "mobile",
    mediaNote: "Teacher dashboard and results · Demonstration data",
  },
  {
    slug: "t2-leave-approval",
    title: "T2 Leave Approval",
    repository: "T2-Software-Leave-Approval-Application",
    sourceVisibility: "public",
    sourceUrl: "https://github.com/bkaankaya/T2-Software-Leave-Approval-Application",
    description: "Employee leave requests and manager approvals, developed from my T2 Software internship project.",
    details: "A full-stack leave-management application originating from my T2 Software internship. Employees submit date-based or hourly requests and view their own leave history; managers can search requests and approve or reject them individually or in bulk. The repository combines React with a Java / Spring Boot API and server-validated authentication.",
    category: "Full-stack",
    categories: ["Full-stack"],
    tags: ["React", "Spring Boot", "Java", "JWT"],
    image: "/projects/t2-manager.jpg",
    gallery: ["/projects/t2-manager.jpg", "/projects/t2-employee.jpg"],
    galleryAlts: ["T2 leave approval manager interface with demonstration requests", "T2 employee leave-status interface with a demonstration request"],
    visualType: "screenshot",
    imageFit: "contain",
    accent: "blue",
    icon: CalendarDays,
    mediaNote: "Original React interface · Synthetic demonstration data",
  },
  {
    slug: "embedded-systems-suite",
    title: "STM32 Data Monitor",
    repository: "STM32_Modbus_DataMonitor",
    sourceVisibility: "public",
    sourceUrl: "https://github.com/bkaankaya/STM32_Modbus_DataMonitor",
    description: "STM32 firmware and a Qt desktop monitor exchanging sensor data over UART and Modbus RTU.",
    details: "An embedded internship project built with mentor guidance. STM32F407 firmware reads its internal temperature sensor, reference voltage and button state; the Qt/C++ desktop application requests holding registers over UART and validates CRC16. The gallery pairs a diagram of the implemented protocol with the native Qt interface in a disconnected state.",
    category: "Embedded",
    categories: ["Embedded"],
    tags: ["C/C++", "STM32", "Modbus RTU", "Qt"],
    image: "/projects/embedded-protocol.png",
    gallery: ["/projects/embedded-protocol.png", "/projects/embedded-qt-interface.png"],
    galleryAlts: ["STM32 Modbus register protocol diagram derived from the project source", "Native Qt interface rendered from the repository UI definition, with hardware disconnected"],
    visualType: "visualization",
    imageFit: "contain",
    accent: "orange",
    icon: Cpu,
    mediaNote: "Register protocol and Qt interface · Hardware disconnected",
  },
  {
    slug: "cineembed",
    title: "CineEmbed",
    repository: "CineEmbed-A-Multi-Modal-Unsupervised-Film-Recommendation-System",
    sourceVisibility: "public",
    sourceUrl: "https://github.com/bkaankaya/CineEmbed-A-Multi-Modal-Unsupervised-Film-Recommendation-System",
    description: "Multimodal movie representations and similarity-based recommendations with deep clustering.",
    details: "A TED University SENG 474 team research project combining film metadata into multimodal representations. Autoencoders and deep embedded clustering support a cosine-similarity recommendation demo built with FastAPI and Next.js. The gallery connects the model architecture and evaluation results with a genre-colored UMAP of film embeddings.",
    category: "Research",
    categories: ["AI", "Research", "Full-stack"],
    tags: ["PyTorch", "FastAPI", "Next.js", "Clustering"],
    image: "/projects/cineembed-architecture.png",
    gallery: ["/projects/cineembed-architecture.png", "/projects/cineembed-clusters.png"],
    galleryAlts: ["CineEmbed multimodal architecture and recorded model evaluation, derived from repository artifacts", "CineEmbed deep embedded clustering UMAP colored by movie genre"],
    visualType: "visualization",
    imageFit: "contain",
    accent: "violet",
    icon: BrainCircuit,
    mediaNote: "Model architecture and embedding analysis",
  },
  {
    slug: "white-wine-quality",
    title: "White Wine Quality",
    repository: "White-Wine-Quality-Prediction",
    sourceVisibility: "public",
    sourceUrl: "https://github.com/bkaankaya/White-Wine-Quality-Prediction",
    description: "Wine-quality classification with model comparison, feature importance and explainable AI.",
    details: "A machine-learning study of physicochemical wine measurements using scikit-learn, XGBoost and explainability analysis. Five-fold cross-validation compares eight classifiers, while permutation importance and SHAP explain which measurements influence predictions. The workflow includes duplicate removal, stratified splitting, preprocessing and assessment of class imbalance.",
    category: "Research",
    categories: ["AI", "Research"],
    tags: ["Python", "scikit-learn", "XGBoost", "SHAP"],
    image: "/projects/wine-model-comparison.png",
    gallery: ["/projects/wine-model-comparison.png", "/projects/wine-feature-importance.png"],
    galleryAlts: ["Wine-quality model comparison using the notebook five-fold cross-validation F1 scores", "Permutation feature importance reproduced from the wine explainability notebook"],
    visualType: "visualization",
    imageFit: "contain",
    accent: "teal",
    icon: ChartColumn,
    mediaNote: "Model comparison and feature importance · Notebook results",
  },
  {
    slug: "dnn-function-approximator",
    title: "Neural Function Approximator",
    repository: "DNN-Universal-Function-Approximator",
    sourceVisibility: "public",
    sourceUrl: "https://github.com/bkaankaya/DNN-Universal-Function-Approximator",
    description: "Nonlinear regression with a PyTorch neural network, preprocessing and five-fold validation.",
    details: "A team deep-learning project for approximating a nonlinear target from synthetic features. The pipeline selects informative inputs, imputes missing values, transforms skewed data and trains a neural network with five-fold validation. The gallery pairs the original training diagnostics with an analysis of the committed synthetic training dataset.",
    category: "Research",
    categories: ["AI", "Research"],
    tags: ["Python", "PyTorch", "Optuna", "Regression"],
    image: "/projects/dnn-data-analysis.png",
    gallery: ["/projects/dnn-data-analysis.png", "/projects/dnn-training.png"],
    galleryAlts: ["Training-data analysis of the neural function approximation project", "Original DNN training loss, validation MAE and learning-rate curves across five folds"],
    visualType: "visualization",
    imageFit: "contain",
    accent: "blue",
    icon: BrainCircuit,
    mediaNote: "Training-data analysis and model diagnostics",
  },
  {
    slug: "hospital-management-system",
    title: "Hospital Management System",
    repository: "Hospital-Management-System",
    sourceVisibility: "public",
    sourceUrl: "https://github.com/bkaankaya/Hospital-Management-System",
    description: "Java Swing desktop workspaces for patient, doctor and hospital administration workflows.",
    details: "A desktop hospital-management engineering demo built with Java Swing, JDBC and MySQL, retaining its original technology stack. The project includes role-specific workspaces, appointment flows and a separate Java HTTPS gateway. The gallery shows the native sign-in and patient workspace interfaces.",
    category: "Full-stack",
    categories: ["Full-stack"],
    tags: ["Java Swing", "JDBC", "MySQL", "Maven"],
    image: "/projects/hospital-login.png",
    gallery: ["/projects/hospital-login.png", "/projects/hospital-workspace.png"],
    galleryAlts: ["Hospital Management System native Java Swing sign-in interface", "Hospital Management System native Java Swing patient workspace"],
    visualType: "screenshot",
    imageFit: "contain",
    accent: "blue",
    icon: Building2,
    mediaNote: "Native Java Swing interface",
  },
  {
    slug: "yemeksepeti-dapp",
    title: "YemekSepeti DApp",
    repository: "YemekSepetiDapp",
    sourceVisibility: "public",
    sourceUrl: "https://github.com/bkaankaya/YemekSepetiDapp",
    description: "A food-ordering prototype connecting restaurant discovery, carts and smart-contract workflows.",
    details: "An experimental React / TypeScript food-ordering application with Solidity contracts, escrow workflows and GraphQL indexing. Customers can explore restaurant menus and build a cart, while a merchant workspace supports order management. The gallery shows the running frontend with its built-in sample restaurant catalog.",
    category: "Blockchain",
    categories: ["Blockchain", "Full-stack"],
    tags: ["React", "TypeScript", "Solidity", "GraphQL"],
    image: "/projects/food-home.jpg",
    gallery: ["/projects/food-home.jpg", "/projects/food-menu.jpg"],
    galleryAlts: ["YemekSepeti DApp frontend with the built-in sample restaurant catalog", "YemekSepeti DApp sample restaurant menu and ordering interface"],
    visualType: "screenshot",
    imageFit: "contain",
    accent: "pink",
    icon: Link2,
    mediaNote: "Restaurant storefront and menu · Sample catalog",
  },
  {
    slug: "software-persona",
    title: "Software Persona · Task Manager",
    repository: "Software-Persona-JS-Project",
    sourceVisibility: "public",
    sourceUrl: "https://github.com/bkaankaya/Software-Persona-JS-Project",
    description: "A focused task manager with priorities, status filters, search and persistent local storage.",
    details: "A React / Vite task-management application implementing create, read, update and delete flows. Tasks carry a priority and status, a reusable dialog supports editing, and summary counters track progress. Data persists locally in the browser. The gallery shows the task overview and editing dialog with demonstration tasks.",
    category: "Frontend",
    categories: ["Frontend"],
    tags: ["React", "Vite", "Tailwind CSS", "localStorage"],
    image: "/projects/persona-overview.jpg",
    gallery: ["/projects/persona-overview.jpg", "/projects/persona-edit.jpg"],
    galleryAlts: ["Software Persona task manager overview with demonstration tasks", "Software Persona task editing dialog with a demonstration task"],
    visualType: "screenshot",
    imageFit: "contain",
    accent: "violet",
    icon: CheckSquare,
    mediaNote: "Task overview and editing · Demonstration tasks",
  },
  {
    slug: "rezero-2d-game",
    title: "ReZero 2D Game",
    repository: "ReZero-2D-Game",
    sourceVisibility: "private",
    description: "A 2D boss-battle experiment with custom combat, sprite animation and visual effects.",
    details: "An experimental JavaScript / HTML5 Canvas and Electron game centered on a one-on-one boss battle. Work includes sprite-animation configuration, combat logic and effects. The gallery shows gameplay, combat effects and the menu.",
    category: "Games",
    categories: ["Games"],
    tags: ["JavaScript", "Canvas", "Electron", "2D Combat"],
    image: "/projects/optimized/rezero-gameplay.webp",
    gallery: ["/projects/optimized/rezero-gameplay.webp", "/projects/optimized/rezero-attack.webp", "/projects/optimized/rezero-shockwave.webp", "/projects/optimized/rezero-menu.webp"],
    galleryAlts: ["ReZero boss-battle arena and game HUD", "ReZero attack animation during combat", "ReZero shockwave visual effect", "ReZero game menu"],
    visualType: "screenshot",
    imageFit: "contain",
    accent: "violet",
    icon: Gamepad2,
    logo: "/projects/rezero-mark.webp",
    mediaNote: "Gameplay, combat effects and menu",
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
]

/** Kept deliberately short; each technology is represented in the project portfolio. */
export const additionalTechnologies: { name: string; detail: string; brand: BrandId }[] = [
  { name: "TypeScript", detail: "Web applications", brand: "typescript" },
  { name: "Spring Boot", detail: "Backend services", brand: "springboot" },
  { name: "C/C++", detail: "Embedded software", brand: "cplusplus" },
  { name: "Solidity", detail: "Smart contracts", brand: "solidity" },
]

export { educationItems, experienceItems, focusAreas, languages } from "./portfolio-profile"

export const learningAreas = [
  { title: "Frontend Design", description: "Building modern, user-centered interfaces and experiences.", icon: Code2, accent: "violet" as const },
  { title: "AI Systems", description: "Exploring AI tools, applications and their real-world impact.", icon: Activity, accent: "teal" as const },
  { title: "Software Engineering", description: "Improving software design, quality and development practices.", icon: Layers, accent: "blue" as const },
  { title: "Technical Communication", description: "Communicating complex ideas clearly and effectively.", icon: Link2, accent: "orange" as const },
]


