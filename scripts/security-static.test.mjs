// Zero-dependency regression checks for outbound links, SVG assets, dangerous
// sinks. Run: node --test scripts/security-static.test.mjs
// Set REQUIRE_OUT=1 only after a fresh build to validate the published artifact;
// otherwise an existing local out/ is deliberately ignored. CI requires the artifact.
import assert from "node:assert/strict"
import { existsSync, readFileSync, readdirSync } from "node:fs"
import { join, relative } from "node:path"
import { test } from "node:test"
import { assertSafeArtifact } from "./security-artifact.mjs"

const root = process.cwd()

function walk(dir, filter = () => true, acc = []) {
  if (!existsSync(dir)) return acc
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isSymbolicLink()) assert.fail(`symlink found: ${relative(root, full)}`)
    if (entry.isDirectory()) walk(full, filter, acc)
    else if (filter(full)) acc.push(full)
  }
  return acc
}

const sourceFiles = ["app", "components", "lib"].flatMap((d) => walk(join(root, d), (f) => /\.(tsx?|jsx?|css)$/.test(f)))
const contact = readFileSync(join(root, "lib/portfolio-contact.ts"), "utf8")
const profile = readFileSync(join(root, "lib/portfolio-profile.ts"), "utf8")
const unis = [...profile.matchAll(/https:\/\/[^"'`\s]+/g)].map((m) => m[0])

// Allowed outbound origins are derived from the concrete public URLs, not a blanket "https:".
const allowedHosts = new Set(
  [...contact.matchAll(/https:\/\/[^"'`\s]+/g)].map((m) => m[0]).concat(unis).map((u) => new URL(u).host),
)

test("source files exist", () => assert.ok(sourceFiles.length > 5))

test("every absolute URL literal in source is https and on a derived allowlist", () => {
  const found = new Set()
  for (const file of sourceFiles) {
    for (const m of readFileSync(file, "utf8").matchAll(/\b[a-z][a-z0-9+.-]*:\/\/[^\s"'`)<>]+/gi)) {
      const url = new URL(m[0])
      found.add(url.origin)
      assert.equal(url.protocol, "https:", `non-https URL in ${relative(root, file)}`)
      assert.ok(
        allowedHosts.has(url.host) || url.host === "bkaankaya.github.io",
        `unexpected host ${url.host} in ${relative(root, file)}`,
      )
    }
  }
  assert.ok(found.size > 0)
})

test("target=_blank anchors always carry rel=noopener noreferrer", () => {
  for (const file of sourceFiles.filter((f) => f.endsWith(".tsx"))) {
    for (const tag of readFileSync(file, "utf8").match(/<a\b[^>]*>/g) ?? []) {
      if (/target=["']_blank["']/.test(tag)) {
        assert.match(tag, /rel=["']noopener noreferrer["']/, `missing rel in ${relative(root, file)}`)
      }
    }
  }
})

test("href values are https literals/contact constants or mailto helpers (no javascript:/data:)", () => {
  for (const file of sourceFiles.filter((f) => f.endsWith(".tsx"))) {
    const text = readFileSync(file, "utf8")
    assert.ok(!/href=["'](javascript|data|vbscript):/i.test(text), `dangerous href in ${relative(root, file)}`)
  }
})

const sinks = [
  /dangerouslySetInnerHTML/,
  /\.innerHTML\b/,
  /\.outerHTML\b/,
  /insertAdjacentHTML/,
  /document\.write/,
  /\beval\s*\(/,
  /new\s+Function\s*\(/,
  /<iframe\b/i,
  /javascript:/i,
  /data:text\/html/i,
]
test("no dangerous DOM/code-execution sinks in application source", () => {
  for (const file of sourceFiles) {
    const text = readFileSync(file, "utf8")
    for (const sink of sinks) assert.ok(!sink.test(text), `${sink} in ${relative(root, file)}`)
  }
})

const svgFiles = walk(join(root, "public"), (f) => f.endsWith(".svg"))
const svgBad = [
  /<script/i,
  /<foreignObject/i,
  /\son[a-z]+\s*=/i,
  /javascript:/i,
  /<iframe|<embed|<object/i,
  /<image\b/i,
  /<use\b[^>]*href=["'](?!#)/i,
  /url\(\s*["']?(https?:|\/\/|data:)/i,
  /@import/i,
]
test("public SVG assets contain no scripts, handlers or external references", () => {
  assert.ok(svgFiles.length > 0)
  for (const file of svgFiles) {
    const text = readFileSync(file, "utf8")
    for (const re of svgBad) assert.ok(!re.test(text), `${re} in ${relative(root, file)}`)
    for (const m of text.matchAll(/(?:href|src)=["']([^"']*)["']/gi)) {
      assert.ok(m[1].startsWith("#"), `external reference in ${relative(root, file)}`)
    }
    for (const m of text.matchAll(/https?:\/\/[^\s"'<>)]+/g)) {
      assert.ok(
        ["http://www.w3.org/2000/svg", "http://www.w3.org/1999/xlink"].includes(m[0]),
        `unexpected URL in ${relative(root, file)}`,
      )
    }
  }
})

const outDir = join(root, "out")
const outTest = process.env.REQUIRE_OUT === "1" ? test : test.skip

outTest("published out/ artifact: routes, no secrets/source maps/debug files, no remote scripts", () => {
  assertSafeArtifact(outDir)
})
