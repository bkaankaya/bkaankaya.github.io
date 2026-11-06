import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { test } from "node:test"

const read = file => readFileSync(file, "utf8")
const data = read("lib/portfolio-data.ts")
const card = read("components/portfolio/project-card.tsx")
const shell = read("components/portfolio/portfolio-shell.tsx")
const dots = read("components/portfolio/ambient-dot-field.tsx")
const styles = read("app/project-visuals.css")
const slugs = ["dora-voice","vague","embedded-systems-suite","quickscan","hospital-management-system","yemeksepeti-dapp","rezero-2d-game"]
const artworks = ["doravoice","vague","embedded","quickscan","hospital","food-dapp","rezero"]

test("all seven verified portfolio project entries remain visible", () => {
  for (const slug of slugs) assert.ok(data.includes(`slug: "${slug}"`), "Project omitted: " + slug)
  assert.equal((data.match(/\bslug: "/g) || []).length, 7)
  assert.ok(data.includes('"Games"') && data.includes("Gamepad2"))
  assert.ok(data.includes('title: "DoraVoice"'))
  assert.ok(!data.includes('title: "AI Receptionist (DoraVoice)"'))
  assert.ok(data.includes("sports e-commerce"), "Vague must not be misrepresented as an AI workflow product")
  assert.ok(data.includes("Exam processing"), "QuickScan must retain its OCR/exam identity")
})

test("the seven local visuals are unique, safe and do not expose private repo screenshots", () => {
  const seen = new Set()
  for (const asset of artworks) {
    const path = `public/projects/${asset}.svg`
    assert.ok(existsSync(path), path + " missing")
    const svg = read(path)
    assert.ok(svg.startsWith("<svg") && svg.includes("</svg>"))
    assert.ok(svg.length > 900, "Empty placeholder: " + path)
    assert.ok(!seen.has(svg), "Identical reused illustration: " + path)
    seen.add(svg)
    assert.ok(!/<script|<foreignObject|<image\b|javascript:|data:/i.test(svg), "Unsafe SVG: " + path)
  }
  assert.equal((data.match(/image: "\/projects\//g) || []).length, 7)
  assert.match(card, /className="project-art-image"/)
  assert.match(card, /className="project-dialog-visual"/)
  assert.match(card, /alt=""/)
})

test("pointer-dot feedback is RAF-coalesced, passive and not a React render loop", () => {
  assert.match(shell, /<AmbientDotField motionPaused=\{motionPaused\} \/>/)
  assert.match(dots, /requestAnimationFrame/)
  assert.match(dots, /cancelAnimationFrame/)
  assert.match(dots, /addEventListener\("pointermove", onMove, \{ passive: true \}\)/)
  assert.match(dots, /aria-hidden="true"/)
  assert.doesNotMatch(dots, /\b(?:setState|setInterval)\s*\(/) // Evaluate API calls, not words in comments.
  assert.match(styles, /\.ambient-dot-field__highlight/)
  assert.match(styles, /mask-image: radial-gradient/)
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/)
  assert.match(styles, /html\[data-save-data\]/)
})
