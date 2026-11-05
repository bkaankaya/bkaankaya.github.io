import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"

const p = JSON.parse(readFileSync("package.json","utf8"))
const lock = readFileSync("pnpm-lock.yaml", "utf8")
test("reviewed security upgrades and narrow transitive resolutions stay pinned", () => {
  assert.equal(p.dependencies.next, "16.4.5")
  assert.equal(p.devDependencies.postcss, "8.5.32")
  assert.deepEqual(p.pnpm.overrides, {
    "source-map-js": "1.2.2",
    "baseline-browser-mapping": "2.11.0",
  })
  for(const value of ["next@16.4.5","postcss@8.5.32","source-map-js@1.2.2","baseline-browser-mapping@2.11.0"]){
    assert.ok(lock.includes(value), "missing resolved package: "+value)
  }
})
test("project has an executable dependency-light check script", () => {
  assert.equal(p.scripts.check, "pnpm exec tsc --noEmit && node --test scripts/*.test.mjs")
  assert.ok(!("lint" in p.scripts), "Never advertise an uninstalled ESLint command")
})
