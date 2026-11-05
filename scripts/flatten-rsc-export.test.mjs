import assert from "node:assert/strict"
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync, existsSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { spawnSync } from "node:child_process"
import { test } from "node:test"
import { fileURLToPath } from "node:url"
import { FlattenError, flattenRscExport } from "./flatten-rsc-export.mjs"

const scriptPath = fileURLToPath(new URL("./flatten-rsc-export.mjs", import.meta.url))

function fixture(setup) {
  const dir = mkdtempSync(join(tmpdir(), "rsc-flatten-"))
  const out = join(dir, "out")
  mkdirSync(out)
  setup(out)
  return { dir, out, cleanup: () => rmSync(dir, { recursive: true, force: true }) }
}

function put(file, content) {
  mkdirSync(join(file, ".."), { recursive: true })
  writeFileSync(file, content)
}

test("flattens nested payloads for the root and a route (platform separators)", () => {
  const f = fixture((out) => {
    put(join(out, "__next.!abc", "__PAGE__.txt"), "root-page")
    put(join(out, "about", "__next.!abc", "about", "__PAGE__.txt"), "about-page")
    put(join(out, "index.html"), "<html></html>")
  })
  try {
    assert.equal(flattenRscExport(f.out), 2)
    assert.equal(readFileSync(join(f.out, "__next.!abc.__PAGE__.txt"), "utf8"), "root-page")
    assert.equal(readFileSync(join(f.out, "about", "__next.!abc.about.__PAGE__.txt"), "utf8"), "about-page")
  } finally {
    f.cleanup()
  }
})

test("fails when the export directory is missing", () => {
  assert.throws(() => flattenRscExport(join(tmpdir(), "definitely-missing-out-dir-xyz")), FlattenError)
})

test("CLI exits non-zero when out/ is missing", () => {
  const dir = mkdtempSync(join(tmpdir(), "rsc-cli-"))
  try {
    const run = spawnSync(process.execPath, [scriptPath], { cwd: dir, encoding: "utf8" })
    assert.equal(run.status, 1)
    assert.match(run.stderr, /^FAIL:/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test("idempotent: identical existing target and repeated run are accepted", () => {
  const f = fixture((out) => {
    put(join(out, "__next.a", "b.txt"), "same")
    put(join(out, "__next.a.b.txt"), "same")
  })
  try {
    assert.equal(flattenRscExport(f.out), 0)
    assert.equal(flattenRscExport(f.out), 0)
  } finally {
    f.cleanup()
  }
})

test("fails on collision with an existing target holding different bytes", () => {
  const f = fixture((out) => {
    put(join(out, "__next.a", "b.txt"), "one")
    put(join(out, "__next.a.b.txt"), "two")
  })
  try {
    assert.throws(() => flattenRscExport(f.out), /collision/)
    assert.equal(readFileSync(join(f.out, "__next.a.b.txt"), "utf8"), "two")
  } finally {
    f.cleanup()
  }
})

test("fails when two different sources map to the same target", () => {
  const f = fixture((out) => {
    put(join(out, "__next.a", "b.c.txt"), "one")
    put(join(out, "__next.a", "b", "c.txt"), "two")
  })
  try {
    assert.throws(() => flattenRscExport(f.out), /two different sources/)
  } finally {
    f.cleanup()
  }
})

test("accepts two sources with identical bytes for the same target", () => {
  const f = fixture((out) => {
    put(join(out, "__next.a", "b.c.txt"), "same")
    put(join(out, "__next.a", "b", "c.txt"), "same")
  })
  try {
    assert.equal(flattenRscExport(f.out), 1)
  } finally {
    f.cleanup()
  }
})

test("fails on unexpected file types inside RSC directories", () => {
  const f = fixture((out) => {
    put(join(out, "__next.a", "payload.js"), "alert(1)")
  })
  try {
    assert.throws(() => flattenRscExport(f.out), /unexpected entry/)
  } finally {
    f.cleanup()
  }
})

test("fails on unsafe file names", () => {
  const f = fixture((out) => {
    put(join(out, "__next.a", "bad name;.txt"), "x")
  })
  try {
    assert.throws(() => flattenRscExport(f.out), /unsafe file name/)
  } finally {
    f.cleanup()
  }
})

test("fails on symlinks (skipped when the OS forbids creating them)", (t) => {
  const f = fixture((out) => {
    put(join(out, "__next.a", "real.txt"), "x")
    put(join(out, "secret.txt"), "outside")
  })
  try {
    try {
      symlinkSync(join(f.out, "secret.txt"), join(f.out, "__next.a", "link.txt"), "file")
    } catch (error) {
      t.skip(`symlink creation not permitted: ${error.code}`)
      return
    }
    assert.throws(() => flattenRscExport(f.out), /symlink/)
    assert.equal(existsSync(join(f.out, "__next.a.link.txt")), false)
  } finally {
    f.cleanup()
  }
})
