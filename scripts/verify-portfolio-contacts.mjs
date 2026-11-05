import assert from "node:assert/strict"
import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"

const root = process.cwd()
const canonical = readFileSync(join(root, "lib/portfolio-contact.ts"), "utf8")
for (const value of ["kaankaya928@gmail.com", "https://github.com/bkaankaya", "https://www.linkedin.com/in/kaan-kaya-9890812b0/", "Full-time · Contract · Remote"]) {
  assert.ok(canonical.includes(value), "Missing verified portfolio contact: " + value)
}
const paths = ["app", "components", "lib"]
const patterns = ["bk@kaankaya.dev", "github.com/kaankaya", "linkedin.com/in/kaankaya"]
function checkDir(dir) {
  for (const child of readdirSync(dir, { withFileTypes: true })) {
    const file = join(dir, child.name)
    if (child.isDirectory()) checkDir(file)
    else if (/\.(tsx?|jsx?)$/.test(child.name)) {
      const content = readFileSync(file, "utf8")
      for (const bad of patterns) {
        assert.ok(!content.includes(bad), "Placeholder contact persists in " + file + ": " + bad)
      }
    }
  }
}
paths.forEach(path => checkDir(join(root, path)))
const home = readFileSync(join(root, "components/portfolio/home-page.tsx"), "utf8")
assert.ok(home.includes("{portfolioContact.availability}"), "Hero availability is not centralized")
console.log("PASS: verified contact info, no old placeholder links, centralized availability.")
