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
  assert.match(media, /function select\(next: number\)[\s\S]*?ready\.current\.has\(frames\[next\]\)/)
  assert.match(media, /disabled=\{!loaded.includes\(src\)\}/)
  assert.match(media, /onError=\{\(\) => \{[\s\S]*?ready.current.delete\(src\)/)
  assert.match(media, /setLoaded\(current => current.filter\(item => item !== src\)\)/)
})

test('manual choices pause automatic rotation and loading does not require hover', () => {
  for (const name of ['select', 'step']) {
    const body = media.slice(media.indexOf(`function ${name}(`)).split('\n  }')[0]
    assert.ok(body.includes('setWarm(true)'), `${name} must warm the gallery`)
    assert.ok(body.includes('setPaused(true)'), `${name} must preserve a manual choice`)
  }
  assert.match(media, /onFocusCapture=\{\(\) => setWarm\(true\)\}/)
  assert.match(media, /if \(!compact \|\| typeof IntersectionObserver === "undefined"\) \{ setWarm\(true\); return \}/)
})

test('offscreen galleries release their timer and observer', () => {
  assert.match(media, /new IntersectionObserver/)
  assert.match(media, /!visible \|\| reduced\.matches/)
  assert.match(media, /observer\?\.disconnect\(\)/)
  assert.match(media, /clearInterval\(timer\)/)
  assert.match(media, /GALLERY_INTERVAL_MS = 5000/)
})
