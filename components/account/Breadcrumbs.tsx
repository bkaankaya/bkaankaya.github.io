// Breadcrumb trail shown below the account header strip.

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-1.5 font-sans text-xs text-[#6B6760]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && <span className="text-[#9A9489]">&rsaquo;</span>}
              {isLast || !item.href ? (
                <span className={isLast ? "text-[#1A1A1A]" : ""}>{item.label}</span>
              ) : (
                <a href={item.href} className="hover:text-[#1A1A1A] transition-colors">
                  {item.label}
                </a>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
