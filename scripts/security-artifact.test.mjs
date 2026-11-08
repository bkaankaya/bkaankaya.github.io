import assert from "node:assert/strict"
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { test } from "node:test"
import { assertSafeArtifact } from "./security-artifact.mjs"

function put(dir, name, content = "fixture") {
  const file = join(dir, name)
  mkdirSync(join(file, ".."), { recursive: true })
  writeFileSync(file, content)
}

function fixture(t, { contact = true } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "portfolio-artifact-"))
  // Only the unique fixture directory created above is removed.
  t.after(() => rmSync(dir, { recursive: true, force: true }))
  for (const route of ["", "projects", "experience", "education", "about", ...(contact ? ["contact"] : [])]) {
    put(dir, join(route, "index.html"), '<html><script src="/_next/static/app.js"></script></html>'.padEnd(1100))
  }
  return dir
}

test("artifact checker accepts six static routes, Next bundles and local media", (t) => {
  const dir = fixture(t)
  put(dir, "_next/static/app.js", "window.example = true")
  put(dir, "_next/static/chunks/app/projects/page.js", "window.example = true")
  put(dir, "projects/__next.example.__PAGE__.txt", "static RSC payload")
  put(dir, "projects/demo.svg", '<svg xmlns="http://www.w3.org/2000/svg"/>')
  put(dir, ".nojekyll", "")
  assert.doesNotThrow(() => assertSafeArtifact(dir))
})

test("artifact checker requires the contact route", (t) => {
  assert.throws(() => assertSafeArtifact(fixture(t, { contact: false })), /contact\/index.html/)
})

test("artifact checker rejects private keys, debug files and accidental source exports", async (t) => {
  for (const name of [".env.local", "private.p8", "private.keystore", "credentials.json", "nested/secrets-prod.json", "_next/static/app.js.map", ".git/config", "components/source.js", "source.tsx", "pnpm-lock.yaml", "package.json"]) {
    await t.test(name, (t) => {
      const dir = fixture(t)
      put(dir, name)
      assert.throws(() => assertSafeArtifact(dir), /forbidden file published/)
    })
  }
})

test("artifact checker rejects secret content without reporting the value", (t) => {
  const dir = fixture(t)
  const token = "AKIA" + "A".repeat(16)
  put(dir, "_next/static/app.js", token)
  assert.throws(() => assertSafeArtifact(dir), (error) => /AWS access key/.test(error.message) && !error.message.includes(token))
})

test("artifact checker rejects remote scripts, frames and mixed content", async (t) => {
  for (const [label, html] of [
    ["quoted script", '<script src="https://example.invalid/remote.js"></script>'],
    ["unquoted script", '<script src=https://example.invalid/remote.js></script>'],
    ["spaced attribute", '<script SRC = "https://example.invalid/remote.js"></script>'],
    ["frame", '<iframe src="https://example.invalid"></iframe>'],
    ["quoted mixed content", '<img src="http://example.invalid/media.png">'],
    ["unquoted mixed content", '<img src = http://example.invalid/media.png>'],
  ]) {
    await t.test(label, (t) => {
      const dir = fixture(t)
      put(dir, "index.html", html.padEnd(1100))
      assert.throws(() => assertSafeArtifact(dir), /non-local script|iframe|mixed-content/)
    })
  }
})

test("artifact checker rejects symlinks (skipped when OS permissions forbid them)", (t) => {
  const dir = fixture(t)
  try {
    symlinkSync(join(dir, "index.html"), join(dir, "linked.html"), "file")
  } catch (error) {
    t.skip(`symlink creation not permitted: ${error.code}`)
    return
  }
  assert.throws(() => assertSafeArtifact(dir), /symlink/)
})
