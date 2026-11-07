import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { test } from 'node:test'
const read = path => readFileSync(path, 'utf8')
const data = read('lib/portfolio-data.ts')
const disclosure = read('components/portfolio/technology-stack.tsx')
const card = read('components/portfolio/project-card.tsx')
const media = read('components/portfolio/project-media.tsx')
const css = read('app/refinement.css')

test('More discloses exactly four project-backed technologies, not an unbounded list', () => {
  const extra = data.split('export const additionalTechnologies:')[1].split('export const experienceItems:')[0]
  assert.equal((extra.match(/name: "/g) || []).length, 4)
  for (const name of ['TypeScript', 'Spring Boot', 'C/C++', 'Solidity']) assert.ok(extra.includes(`name: "${name}"`))
  assert.doesNotMatch(data, /name: "More"/)
  for (const icon of ['typescript','springboot','cplusplus','solidity']) assert.ok(existsSync(`public/brands/${icon}.svg`))
})
test('technology disclosure uses a real button with accessible state and hidden content', () => {
  assert.match(disclosure, /type="button"/)
  assert.match(disclosure, /aria-expanded=\{expanded\}/)
  assert.match(disclosure, /aria-controls="additional-technologies"/)
  assert.match(disclosure, /id="additional-technologies"/)
  assert.match(disclosure, /hidden=\{!expanded\}/)
  assert.match(disclosure, /event.key === "Escape"/)
  assert.match(disclosure, /toggleRef.current\?\.focus/)
  assert.match(css, /technology-expanded\[hidden\]\s*\{\s*display:none/)
  assert.match(css, /prefers-reduced-motion:reduce/)
})
test('DoraVoice uses two supplied design previews and both projects have distinct badge assets', () => {
  const dora = data.split('slug: "dora-voice"')[1].split('slug: "vague"')[0]
  assert.match(dora, /logo: "\/projects\/doravoice-mark.webp"/)
  assert.match(dora, /gallery: \["\/projects\/doravoice-call-preview.webp", "\/projects\/doravoice-product-preview.webp"\]/)
  assert.match(dora, /visualType: "concept"/)
  const mediaNote = dora.match(/mediaNote:\s*"([^"]+)"/)?.[1]
  assert.ok(mediaNote && /\bconcepts?\b/i.test(mediaNote), 'DoraVoice media must remain labeled as a concept')
  assert.match(card, /Concept preview/)
  assert.match(card, /project.mediaNote/)
  assert.match(media, /project.galleryAlts\?\.\[frameIndex\]/)
  assert.match(data, /logo: "\/projects\/rezero-mark.webp"/)
  for (const name of ['doravoice-mark.webp','rezero-mark.webp','doravoice-call-preview.webp','doravoice-product-preview.webp']) {
    const bytes = readFileSync(`public/projects/${name}`)
    assert.equal(bytes.toString('ascii',0,4),'RIFF')
    assert.equal(bytes.toString('ascii',8,12),'WEBP')
    assert.ok(bytes.length < 150000, `${name} exceeds image budget`)
  }
})
