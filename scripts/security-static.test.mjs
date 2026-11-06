// Zero-dependency regression checks for outbound links, SVG assets, dangerous
// sinks and (when out/ exists) the published artifact. Run: node --test scripts/*.test.mjs
// Set REQUIRE_OUT=1 (CI after the build) to make a missing out/ a failure.
import assert from "node:assert/strict"
import { existsSync, lstatSync, readFileSync, readdirSync } from "node:fs"
import { join, relative } from "node:path"
import { test } from "node:test"

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
const outTest = existsSync(outDir) || process.env.REQUIRE_OUT === "1" ? test : test.skip

outTest("published out/ artifact: routes, no secrets/source maps/debug files, no remote scripts", () => {
  assert.ok(existsSync(outDir), "out/ is missing")
  const files = walk(outDir)
  const rel = files.map((f) => relative(outDir, f).split("\\").join("/"))
  for (const route of ["index.html", "projects/index.html", "experience/index.html", "education/index.html", "about/index.html", "contact/index.html"]) {
    assert.ok(rel.includes(route) && lstatSync(join(outDir, route)).size > 1000, `route missing or empty: ${route}`)
  }
  const forbidden = /(^|\/)\.env|\.(map|pem|key|p12|pfx|log|csv|sarif)$|(^|\/)(debug|build)[^/]*\.json$/i
  for (const f of rel) assert.ok(!forbidden.test(f), `forbidden file published: ${f}`)

  const secretPatterns = [
    ["AWS access key", /AKIA[0-9A-Z]{16}/],
    ["GitHub token", /gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}/],
    ["private key block", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
    ["Slack token", /xox[baprs]-[A-Za-z0-9-]{10,}/],
    ["Google API key", /AIza[0-9A-Za-z_-]{35}/],
    ["NEXT_PUBLIC variable", /NEXT_PUBLIC_[A-Z_]+/],
  ]
  const text = (f) => /\.(html|txt|js|css|svg|json|xml|webmanifest)$/.test(f)
  for (const file of files.filter(text)) {
    const content = readFileSync(file, "utf8")
    for (const [name, re] of secretPatterns) {
      // Report only the label and file; never print the matched value.
      assert.ok(!re.test(content), `${name} pattern matched in ${relative(outDir, file)}`)
    }
  }

  for (const file of files.filter((f) => f.endsWith(".html"))) {
    const html = readFileSync(file, "utf8")
    for (const tag of html.match(/<script\b[^>]*>/gi) ?? []) {
      const src = tag.match(/\ssrc=["']([^"']+)["']/i)?.[1]
      if (src) assert.ok(src.startsWith("/_next/"), `non-local script src ${src} in ${relative(outDir, file)}`)
    }
    assert.ok(!/<iframe\b/i.test(html), `iframe in ${relative(outDir, file)}`)
    assert.ok(!/(src|href)=["']http:\/\//i.test(html), `mixed-content http: reference in ${relative(outDir, file)}`)
  }
})
