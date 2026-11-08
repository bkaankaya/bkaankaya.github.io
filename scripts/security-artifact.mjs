import assert from "node:assert/strict"
import { existsSync, lstatSync, readFileSync, readdirSync } from "node:fs"
import { join, relative } from "node:path"

const routes = ["index.html", "projects/index.html", "experience/index.html", "education/index.html", "about/index.html", "contact/index.html"]
const forbiddenPath = /(^|\/)(\.git|node_modules)(\/|$)|^(app|components|lib|scripts)(\/|$)|(^|\/)\.env|\.(map|pem|key|p12|pfx|p8|keystore|secret|secrets|log|csv|sarif|ts|tsx|jsx|mjs|cjs|py|sh|ps1|bat|cmd|yml|yaml)$|(^|\/)(credentials[^/]*|secrets[^/]*|debug[^/]*|build[^/]*|package|tsconfig)\.json$/i
const secretPatterns = [
  ["AWS access key", /AKIA[0-9A-Z]{16}/],
  ["GitHub token", /gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}/],
  ["private key block", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ["Slack token", /xox[baprs]-[A-Za-z0-9-]{10,}/],
  ["Google API key", /AIza[0-9A-Za-z_-]{35}/],
  ["NEXT_PUBLIC variable", /NEXT_PUBLIC_[A-Z_]+/],
]

/** Read-only validation of a fresh export; never builds or changes the artifact. */
export function assertSafeArtifact(outDir) {
  assert.ok(existsSync(outDir), "out/ is missing")
  const rootStat = lstatSync(outDir)
  assert.ok(!rootStat.isSymbolicLink() && rootStat.isDirectory(), "out/ must be a regular directory")
  const files = []
  function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const file = join(dir, entry.name)
      const shown = relative(outDir, file).split("\\").join("/")
      assert.ok(!entry.isSymbolicLink(), `symlink found: ${shown}`)
      assert.ok(!forbiddenPath.test(shown), `forbidden file published: ${shown}`)
      if (entry.isDirectory()) walk(file)
      else {
        assert.ok(entry.isFile(), `unexpected file type: ${shown}`)
        files.push(file)
      }
    }
  }
  walk(outDir)
  const names = files.map((file) => relative(outDir, file).split("\\").join("/"))
  for (const route of routes) {
    assert.ok(names.includes(route) && lstatSync(join(outDir, route)).size > 1000, `route missing or empty: ${route}`)
  }
  for (const file of files.filter((name) => /\.(html|txt|js|css|svg|json|xml|webmanifest)$/i.test(name))) {
    const content = readFileSync(file, "utf8")
    const shown = relative(outDir, file)
    for (const [name, pattern] of secretPatterns) {
      // Report only the label and file; never print the matched value.
      assert.ok(!pattern.test(content), `${name} pattern matched in ${shown}`)
    }
    if (!/\.html$/i.test(file)) continue
    for (const tag of content.match(/<script\b[^>]*>/gi) ?? []) {
      const attribute = tag.match(/\ssrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/i)
      if (attribute) {
        const src = attribute[1] ?? attribute[2] ?? attribute[3]
        assert.ok(src.startsWith("/_next/"), `non-local script in ${shown}`)
      }
    }
    assert.ok(!/<iframe\b/i.test(content), `iframe in ${shown}`)
    assert.ok(!/\b(src|href)\s*=\s*["']?http:\/\//i.test(content), `mixed-content http: reference in ${shown}`)
  }
}
