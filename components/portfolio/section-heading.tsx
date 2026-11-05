import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Reveal } from "@/components/portfolio/reveal"

export function SectionHeading({ eyebrow, title, description, action, id }: { eyebrow: string; title: string; description?: string; action?: { label: string; href: string }; id?: string }) {
  return (
    <div className="section-heading-row">
      <Reveal className="section-heading-copy">
        <p className="eyebrow"><span className="eyebrow-dot" />{eyebrow}</p>
        <h2 className="section-title" id={id}>{title}</h2>
        {description ? <p className="section-description">{description}</p> : null}
      </Reveal>
      {action ? (
        <Link className="button button-outline section-heading-action" href={action.href}>
          {action.label} <ArrowRight aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  )
}

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <Reveal className="page-intro">
      <p className="eyebrow"><span className="eyebrow-dot" />{eyebrow}</p>
      <h1>{title}</h1>
      <p className="page-intro-description">{description}</p>
    </Reveal>
  )
}
