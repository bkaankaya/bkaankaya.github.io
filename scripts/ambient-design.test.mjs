import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"

const css = readFileSync("app/globals.css", "utf8")
const shell = readFileSync("components/portfolio/portfolio-shell.tsx", "utf8")

test("hero ambient arc stops once within four seconds", () => {
  assert.match(css, /animation:\s*ambient-arc-settle\s+3500ms[^;]*\b1\s+both/)
  assert.match(css, /@keyframes\s+ambient-arc-settle/)
  assert.doesNotMatch(css, /wave-drift|ambient-arc-settle[^;]*infinite/)
})
test("four routes have static progressive aurora accents", () => {
  for (const sel of [".project-archive", ".experience-section", ".education-layout", ".about-main"]) {
    assert.ok(css.includes(sel))
  }
  for (const token of ["--ambient-violet", "--ambient-blue", "--ambient-cyan"]) {
    assert.ok(css.includes(token))
  }
})
test("reduced-motion and optional Save-Data disable decorative motion", () => {
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/)
  assert.match(css, /html\[data-save-data\]\s+\.hero-section::before/)
  assert.ok(shell.includes('toggleAttribute("data-save-data", connection?.saveData === true)'))
})
function luminance(hex) {
  const c = [1, 3, 5].map(i => Number.parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
  return c[0] * .2126 + c[1] * .7152 + c[2] * .0722
}
test("light theme subtle text on base background meets 4.5 to 1", () => {
  assert.ok((luminance("#f6f7fb") + .05) / (luminance("#626980") + .05) >= 4.5)
  assert.ok(css.includes("--site-subtle: #626980"))
})
