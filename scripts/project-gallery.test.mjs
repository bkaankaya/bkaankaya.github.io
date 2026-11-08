import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'
const read = path => readFileSync(path, 'utf8')
const data = read('lib/portfolio-data.ts')
const card = read('components/portfolio/project-card.tsx')
const media = read('components/portfolio/project-media.tsx')
const styles = read('app/project-visuals.css')
const dots = read('components/portfolio/ambient-dot-field.tsx')
const shell = read('components/portfolio/portfolio-shell.tsx')

// Complete data, repository, media and category contracts are validated from the
// TypeScript AST in portfolio-inventory.test.mjs rather than counting source text.
test('identity is rendered separately from interactive product galleries', () => {
  assert.match(card, /project-icon/)
  assert.match(card, /src=\{project.logo\}/)
  assert.doesNotMatch(media, /project.logo/)
  assert.match(card, /<ProjectMedia\b[^>]*\bcontrols\b[^>]*\bcompact\b[^>]*\bonExplore=\{openDialog\}/)
  assert.match(media, /className="project-art-trigger project-expand-trigger"\s+type="button"/)
  assert.match(media, /aria-haspopup="dialog"/)
  const tree = ts.createSourceFile('project-card.tsx', card, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  function check(node, buttonDepth = 0) {
    if (ts.isJsxSelfClosingElement(node) && node.tagName.getText(tree) === 'ProjectMedia') assert.equal(buttonDepth, 0, 'Gallery controls must not be nested inside an outer button')
    const isButton = ts.isJsxElement(node) && node.openingElement.tagName.getText(tree) === 'button'
    ts.forEachChild(node, child => check(child, buttonDepth + Number(isButton)))
  }
  check(tree)
})
test('original evidence stays local and optimized derivatives are reproducible', () => {
  for (const name of ['quickscan-logo.png','quickscan-login.png','quickscan-home.png','quickscan-publish.png','rezero-gameplay.png','rezero-attack.png','rezero-shockwave.png','rezero-menu.png']) assert.ok(existsSync(`public/projects/${name}`), name)
  const prepare = read('scripts/prepare-project-media.mjs')
  assert.match(prepare, /withoutEnlargement: true/)
  assert.match(prepare, /webp/)
  assert.match(prepare, /trim/)
  assert.doesNotMatch(prepare, /https?:\/\//)
  const scripts = JSON.parse(read('package.json')).scripts
  assert.equal(scripts.prebuild, 'node scripts/prepare-project-media.mjs')
  assert.equal(scripts.predev, scripts.prebuild)
})
test('gallery starts only on capable-device hover and tears down its timer', () => {
  assert.match(media, /GALLERY_INTERVAL_MS = 5000/)
  assert.match(media, /if \(!active \|\| frames.length < 2\) return/)
  for (const check of ['clearInterval', 'prefers-reduced-motion: reduce', 'hover: hover', 'document.hidden', 'saveData', 'removeEventListener', 'ready.current.has']) assert.ok(media.includes(check), check)
  assert.match(card, /active=\{hovering && !dialogOpen\}/)
  assert.match(media, /if \(paused \|\| \(controls && !compact\)\) return/)
})
test('cards and dialogs expose labeled controls and retain the selected view when expanded', () => {
  for (const label of ['Previous image', 'Next image', 'Pause automatic previews', 'Resume automatic previews', 'Show image']) assert.ok(media.includes(label), label)
  assert.match(media, /role="group"\s+aria-label=/)
  assert.match(media, /aria-pressed=\{frameIndex === index\}/)
  // The rotation button announces its action with a changing label, not a toggle state.
  assert.doesNotMatch(media, /aria-pressed=\{paused\}/)
  assert.match(media, /onExplore\(event.currentTarget, index\)/)
  assert.match(card, /setInitialFrame\(frame\)/)
  assert.match(card, /<ProjectMedia\b[^>]*initialIndex=\{initialFrame\}/)
})
test('modal is centered, bounded, keyboard accessible and has manual gallery controls', () => {
  assert.match(styles, /inset:0; margin:auto;/)
  assert.match(styles, /max-height:calc\(100dvh - 48px\)/)
  assert.match(card, /dialog.showModal\(\)/)
  assert.match(card, /onCancel=/)
  assert.match(card, /clearTimeout/)
  assert.match(card, /aria-describedby=/)
  assert.match(media, /Previous image/)
  assert.match(media, /Next image/)
})
test('screenshots keep their full aspect ratio, with a separate mobile device viewport', () => {
  assert.match(styles, /object-fit:contain/)
  assert.match(styles, /aspect-ratio:9 \/ 20/)
  assert.doesNotMatch(styles, /scale\(1\.3/)
  assert.match(media, /aria-hidden=\{frameIndex !== index\}/)
})
test('pointer ambience remains passive and respects OS and save-data preferences', () => {
  assert.match(shell, /<AmbientDotField \/>/)
  assert.match(dots, /requestAnimationFrame/)
  assert.match(dots, /cancelAnimationFrame/)
  assert.match(dots, /passive: true/)
  assert.match(styles, /mask-image: radial-gradient/)
  assert.match(styles, /prefers-reduced-motion:\s*reduce/)
  assert.match(styles, /html\[data-save-data\]/)
})
