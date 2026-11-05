/** Single source of truth for PUBLIC, user-provided portfolio contacts.
 * Do not replace with mockup / placeholder names or addresses.
 * Last confirmed from the owner's application materials: 2026-10-17.
 */
const email = "kaankaya928@gmail.com"

export const portfolioContact = {
  email,
  mailto: `mailto:${email}`,
  githubUrl: "https://github.com/bkaankaya",
  githubLabel: "github.com/bkaankaya",
  linkedinUrl: "https://www.linkedin.com/in/kaan-kaya-9890812b0/",
  linkedinLabel: "linkedin.com/in/kaan-kaya-9890812b0",
  availability: "Full-time · Contract · Remote",
} as const

/** Subject is URL encoded; never concatenate untrusted text into mailto URLs. */
export function portfolioMailto(subject: string): string {
  return `${portfolioContact.mailto}?subject=${encodeURIComponent(subject)}`
}
