import { createRequire } from 'node:module'
import { mkdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

// Reuse Next's locked Sharp dependency. No runtime service, new package or remote asset.
const require = createRequire(import.meta.url)
const sharp = createRequire(require.resolve('next/package.json'))('sharp')
const root = join(process.cwd(), 'public/projects')
const out = join(root, 'optimized')
await mkdir(out, { recursive: true })
const specifications = [
  ['quickscan-logo.png', 'quickscan-mark.webp', 160, true],
  ['quickscan-login.png', 'quickscan-screen.webp', 600, false],
  ['quickscan-home.png', 'quickscan-home.webp', 720, false],
  ['quickscan-publish.png', 'quickscan-publish.webp', 720, false],
  ['rezero-gameplay.png', 'rezero-gameplay.webp', 1280, false],
  ['rezero-attack.png', 'rezero-attack.webp', 1280, false],
  ['rezero-shockwave.png', 'rezero-shockwave.webp', 1280, false],
  ['rezero-menu.png', 'rezero-menu.webp', 1280, false],
]
let before = 0, after = 0
for (const [source, target, width, trim] of specifications) {
  const input = join(root, source), output = join(out, target)
  let pipeline = sharp(input).rotate()
  if (trim) pipeline = pipeline.trim({ threshold: 10 })
  await pipeline.resize({ width, withoutEnlargement: true }).webp({ quality: 85, effort: 5 }).toFile(output)
  before += (await stat(input)).size
  after += (await stat(output)).size
}
console.log(`Prepared ${specifications.length} local project images: ${before} → ${after} bytes (${Math.round(100 - after / before * 100)}% smaller).`)
