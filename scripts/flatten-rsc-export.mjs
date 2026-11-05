import { copyFileSync, existsSync, lstatSync, readFileSync, readdirSync } from "node:fs"
import { join, relative, resolve, sep, isAbsolute } from "node:path"
import { fileURLToPath } from "node:url"

// Characters Next.js emits in RSC payload names (base64url segments, "!", "(", "$" ...).
// Anything outside this set (path separators, Windows-reserved characters, control
// characters, whitespace) is rejected instead of being copied.
const SAFE_NAME = /^[A-Za-z0-9._!$()~@+=,-]+$/

export class FlattenError extends Error {}

function fail(message) {
  throw new FlattenError(message)
}

function assertInside(root, candidate) {
  const rel = relative(root, candidate)
  if (rel === "" || rel.startsWith("..") || isAbsolute(rel)) {
    fail(`path escapes export directory: ${rel}`)
  }
}

function sameBytes(a, b) {
  return readFileSync(a).equals(readFileSync(b))
}

/**
 * Copies every `.txt` file found below `<route>/__next.*` directories to a
 * dot-joined sibling name inside `<route>` (GitHub Pages cannot serve the
 * nested form Next.js uses). Fail-closed: throws FlattenError on a missing out
 * directory, symlinks, unexpected file types, unsafe names and on any target
 * that already exists with different bytes. Returns the number of copied files.
 */
export function flattenRscExport(outDir) {
  const root = resolve(outDir)
  if (!existsSync(root)) fail(`export directory not found: ${root}`)
  if (!lstatSync(root).isDirectory()) fail(`export path is not a directory: ${root}`)

  const planned = new Map() // target path -> source path
  const work = []

  function walk(currentDir) {
    for (const entry of readdirSync(currentDir, { withFileTypes: true })) {
      const fullPath = join(currentDir, entry.name)
      if (entry.isSymbolicLink()) fail(`symlink not allowed in export: ${relative(root, fullPath)}`)
      if (entry.isDirectory()) {
        if (entry.name.startsWith("__next.")) collect(currentDir, fullPath)
        else walk(fullPath)
      }
    }
  }

  function collect(routeDir, nextDir) {
    for (const entry of readdirSync(nextDir, { withFileTypes: true })) {
      const fullPath = join(nextDir, entry.name)
      const shown = relative(root, fullPath)
      if (entry.isSymbolicLink()) fail(`symlink not allowed in export: ${shown}`)
      if (entry.isDirectory()) {
        collect(routeDir, fullPath)
      } else if (entry.isFile() && entry.name.endsWith(".txt")) {
        const parts = relative(routeDir, fullPath).split(sep)
        for (const part of parts) {
          if (!SAFE_NAME.test(part) || part.includes("..")) fail(`unsafe file name in export: ${shown}`)
        }
        const targetPath = join(routeDir, parts.join("."))
        assertInside(root, targetPath)
        const previous = planned.get(targetPath)
        if (previous !== undefined) {
          if (!sameBytes(previous, fullPath)) {
            fail(`two different sources map to ${relative(root, targetPath)}`)
          }
          continue
        }
        planned.set(targetPath, fullPath)
        work.push([fullPath, targetPath])
      } else {
        fail(`unexpected entry inside RSC directory: ${shown}`)
      }
    }
  }

  walk(root)

  let copied = 0
  for (const [source, target] of work) {
    if (existsSync(target) || lstatSyncSafe(target)) {
      if (lstatSync(target).isSymbolicLink() || !lstatSync(target).isFile()) {
        fail(`target is not a regular file: ${relative(root, target)}`)
      }
      if (!sameBytes(source, target)) {
        fail(`collision: ${relative(root, target)} exists with different content`)
      }
      continue
    }
    copyFileSync(source, target)
    copied += 1
  }
  return copied
}

function lstatSyncSafe(path) {
  try {
    return lstatSync(path)
  } catch {
    return null
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const copied = flattenRscExport(join(process.cwd(), "out"))
    console.log(`PASS: flattened Next.js RSC static export payloads for GitHub Pages (${copied} new files).`)
  } catch (error) {
    if (error instanceof FlattenError) {
      console.error(`FAIL: ${error.message}`)
      process.exit(1)
    }
    throw error
  }
}
