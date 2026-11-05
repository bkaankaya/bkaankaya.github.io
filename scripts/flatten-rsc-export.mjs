import { copyFileSync, existsSync, readdirSync } from "node:fs"
import { join, relative, sep } from "node:path"

const outDir = join(process.cwd(), "out")

function flattenNextRscDirs(baseDir, currentDir = baseDir) {
  for (const entry of readdirSync(currentDir, { withFileTypes: true })) {
    const fullPath = join(currentDir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name.startsWith("__next.")) {
        copyNestedFilesAsDotJoined(currentDir, fullPath)
      } else {
        flattenNextRscDirs(baseDir, fullPath)
      }
    }
  }
}

function copyNestedFilesAsDotJoined(routeDir, nextDir) {
  for (const entry of readdirSync(nextDir, { withFileTypes: true })) {
    const fullPath = join(nextDir, entry.name)
    if (entry.isDirectory()) {
      copyNestedFilesAsDotJoined(routeDir, fullPath)
    } else if (entry.isFile() && entry.name.endsWith(".txt")) {
      const relParts = relative(routeDir, fullPath).split(sep)
      const flatName = relParts.join(".")
      const targetPath = join(routeDir, flatName)
      if (!existsSync(targetPath)) {
        copyFileSync(fullPath, targetPath)
      }
    }
  }
}

if (existsSync(outDir)) {
  flattenNextRscDirs(outDir)
  console.log("PASS: flattened Next.js RSC static export payloads for GitHub Pages.")
}

