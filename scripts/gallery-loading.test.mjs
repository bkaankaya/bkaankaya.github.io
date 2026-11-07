import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const media = readFileSync('components/portfolio/project-media.tsx', 'utf8')

test('manual galleries only advance into loaded images', () => {
  assert.match(media, /disabled=\{!canStep\}/)
  assert.equal((media.match(/disabled=\{!canStep\}/g) || []).length, 2)
  assert.match(media, /function step\(direction: -1 \| 1\)/)
  assert.match(media, /ready\.current\.has\(frames\[next\]\)/)
  assert.match(media, /Loading images/)
  assert.match(media, /Other images unavailable/)
})

test('offscreen galleries release their timer and observer', () => {
  assert.match(media, /new IntersectionObserver/)
  assert.match(media, /!visible \|\| reduced\.matches/)
  assert.match(media, /observer\?\.disconnect\(\)/)
  assert.match(media, /clearInterval\(timer\)/)
  assert.match(media, /GALLERY_INTERVAL_MS = 5000/)
})
