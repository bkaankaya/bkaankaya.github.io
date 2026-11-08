"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react"
import { BrandIcon } from "@/components/portfolio/brand-icon"
import { portfolioContact } from "@/lib/portfolio-contact"

/** No pretend form submission: email opens the visitor's app; copying is explicit. */
export function ContactPanel({ standalone = false }: { standalone?: boolean }) {
  const [copyFeedback, setCopyFeedback] = useState<{ state: "idle" | "copied" | "fallback"; request: number }>({ state: "idle", request: 0 })
  const copyState = copyFeedback.state
  const copyRequest = useRef(0)
  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => () => { copyRequest.current += 1 }, [])

  async function copyEmail() {
    const request = ++copyRequest.current
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable")
      await navigator.clipboard.writeText(portfolioContact.email)
      if (request !== copyRequest.current) return
      setCopyFeedback({ state: "copied", request })
    } catch {
      if (request !== copyRequest.current) return
      emailRef.current?.focus({ preventScroll: true })
      emailRef.current?.select()
      setCopyFeedback({ state: "fallback", request })
    }
  }

  return <section id="contact" className={`contact-panel${standalone ? " contact-panel--standalone" : ""}`} aria-labelledby="contact-title">
    {!standalone ? <div className="contact-intro"><p className="eyebrow"><span className="eyebrow-dot" />GET IN TOUCH</p><h2 id="contact-title">Let’s connect.</h2><p>For opportunities, collaborations or a conversation about software.</p></div> : null}
    <div className="contact-methods">
      <article className="contact-card contact-email-card">
        <Mail aria-hidden="true" /><h2>Email</h2>
        <label className="sr-only" htmlFor="contact-email-address">Email address</label>
        <input id="contact-email-address" ref={emailRef} value={portfolioContact.email} readOnly aria-label="Email address" />
        <div className="contact-email-actions">
          <a className="button button-primary" href={portfolioContact.mailto}>Open email app <ArrowUpRight aria-hidden="true" /></a>
          <button className="button button-outline copy-email-button" type="button" onClick={copyEmail}>{copyState === "copied" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}{copyState === "copied" ? "Copied" : "Copy email"}</button>
        </div>
        <p className="contact-email-help">No mail app configured? Copy the address and use your preferred email service.</p>
        <p className="contact-copy-status" role="status" aria-live="polite" aria-atomic="true"><span key={copyFeedback.request}>{copyState === "copied" ? "Email address copied." : copyState === "fallback" ? "Automatic copying is unavailable. The address is selected; copy it manually." : ""}</span></p>
      </article>
      <a className="contact-card" href={portfolioContact.githubUrl} target="_blank" rel="noopener noreferrer">
        <BrandIcon brand="github" size={25} /><ArrowUpRight className="contact-card-arrow" aria-hidden="true" /><strong>GitHub</strong><span>{portfolioContact.githubLabel}</span><p>Explore my public repositories.</p>
      </a>
      <a className="contact-card" href={portfolioContact.linkedinUrl} target="_blank" rel="noopener noreferrer">
        <BrandIcon brand="linkedin" size={25} /><ArrowUpRight className="contact-card-arrow" aria-hidden="true" /><strong>LinkedIn</strong><span>{portfolioContact.linkedinLabel}</span><p>Connect professionally.</p>
      </a>
    </div>
  </section>
}
