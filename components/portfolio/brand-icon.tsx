export type BrandId =
  | "react"
  | "nextjs"
  | "python"
  | "java"
  | "docker"
  | "postgresql"
  | "aws"
  | "github"
  | "linkedin"
  | "more"

type BrandIconProps = {
  brand: BrandId
  size?: number
  className?: string
}

export function BrandIcon({ brand, size = 22, className = "" }: BrandIconProps) {
  if (brand === "more") {
    return (
      <svg
        className={`brand-icon-svg ${className}`.trim()}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="6" cy="12" r="1.75" fill="currentColor" />
        <circle cx="12" cy="12" r="1.75" fill="currentColor" />
        <circle cx="18" cy="12" r="1.75" fill="currentColor" />
      </svg>
    )
  }

  if (brand === "aws") {
    return (
      <span className={`brand-icon-pair ${className}`.trim()} aria-hidden="true">
        <img
          className="brand-icon-img brand-dark-only"
          data-brand="aws"
          src="/brands/aws.svg"
          alt=""
          width={size}
          height={size}
          decoding="async"
        />
        <img
          className="brand-icon-img brand-light-only"
          data-brand="aws"
          src="/brands/aws-light.svg"
          alt=""
          width={size}
          height={size}
          decoding="async"
        />
      </span>
    )
  }

  const isMonochrome = brand === "github" || brand === "linkedin"

  return (
    <img
      className={`brand-icon-img${isMonochrome ? " brand-icon-monochrome" : ""} ${className}`.trim()}
      data-brand={brand}
      src={`/brands/${brand}.svg`}
      alt=""
      width={size}
      height={size}
      decoding="async"
    />
  )
}

