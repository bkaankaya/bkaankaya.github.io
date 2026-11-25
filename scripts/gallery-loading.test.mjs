import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'

const media = readFileSync('components/portfolio/project-media.tsx', 'utf8')
const tree = ts.createSourceFile('project-media.tsx', media, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
function nodes(root, predicate) {
  const found = []
  function visit(node) {
    if (predicate(node)) found.push(node)
    ts.forEachChild(node, visit)
  }
  visit(root)
  return found
}
const effects = nodes(tree, node => ts.isCallExpression(node) && node.expression.getText(tree) === 'useEffect')

// Evaluate the reviewed preparation effect with synthetic browser bindings only.
// This checks policy and cleanup, not React rendering or browser image requests.
function preparation({ hidden = false, saveData = false, observed = true, compact = true } = {}) {
  const listeners = () => {
    const registered = new Map()
    return {
      registered,
      addEventListener: (name, fn) => registered.set(name, fn),
      removeEventListener: (name, fn) => { if (registered.get(name) === fn) registered.delete(name) },
      emit: name => registered.get(name)?.(),
    }
  }
  const document = { hidden, ...listeners() }
  const connection = { saveData, ...listeners() }
  const warmed = []
  let observer
  const context = {
    controls: true, warm: false, compact, document, navigator: { connection },
    setWarm: value => warmed.push(value), mediaRef: { current: {} },
    IntersectionObserver: observed ? class {
      constructor(callback) { this.callback = callback; observer = this; this.disconnected = false }
      observe() {}
      disconnect() { this.disconnected = true }
    } : undefined,
  }
  const callback = ts.transpileModule(`(${effects[0].arguments[0].getText(tree)})`, { compilerOptions: { target: ts.ScriptTarget.ES2020 } }).outputText
  const cleanup = runInNewContext(callback, context, { timeout: 1000 })()
  return { document, connection, warmed, cleanup, get observer() { return observer }, intersect: value => observer.callback([{ isIntersecting: value }]) }
}

// Exercise the actual rotation effect and manual handlers with a deterministic
// clock. This verifies deadlines and cleanup, not React or browser rendering.
function rotation(overrides = {}) {
  let now = 0, sequence = 0, index = 0, listenerAdds = 0, observer
  const timers = new Map()
  const target = properties => ({
    ...properties, listeners: new Map(),
    addEventListener(name, callback) { listenerAdds++; this.listeners.set(name, callback) },
    removeEventListener(name, callback) { if (this.listeners.get(name) === callback) this.listeners.delete(name) },
    emit(name) { this.listeners.get(name)?.() },
  })
  const document = target({ hidden: false })
  const connection = target({ saveData: false })
  const reduced = target({ matches: false })
  const pointer = target({ matches: true })
  const restartAutoplay = { current: null }
  const context = {
    active: true, motionPaused: false, controls: true, compact: true,
    frames: ['first', 'second', 'third'], ready: { current: new Set(['first', 'second', 'third']) },
    document, navigator: { connection }, matchMedia: query => query.includes('reduced-motion') ? reduced : pointer,
    mediaRef: { current: {} }, restartAutoplay, GALLERY_INTERVAL_MS: 5000, setWarm() {},
    setIndex: update => { index = typeof update === 'function' ? update(index) : update },
    setInterval(callback, delay) { const id = ++sequence; timers.set(id, { callback, delay, due: now + delay }); return id },
    clearInterval: id => timers.delete(id),
    IntersectionObserver: class {
      constructor(callback) { this.callback = callback; this.disconnected = false; observer = this }
      observe() {}
      disconnect() { this.disconnected = true }
    },
    ...overrides,
  }
  const evaluate = node => runInNewContext(ts.transpileModule(`(${node.getText(tree)})`, {
    compilerOptions: { target: ts.ScriptTarget.ES2020 },
  }).outputText, context, { timeout: 1000 })
  const cleanup = evaluate(effects[1].arguments[0])()
  const handler = name => evaluate(nodes(tree, node => ts.isFunctionDeclaration(node) && node.name?.text === name)[0])
  return {
    document, connection, reduced, pointer, restartAutoplay, timers, cleanup,
    select: handler('select'), step: handler('step'),
    get index() { return index }, get listenerAdds() { return listenerAdds }, get observer() { return observer },
    intersect: visible => observer.callback([{ isIntersecting: visible }]),
    advance(milliseconds) {
      const end = now + milliseconds
      while (true) {
        const next = [...timers.values()].sort((a, b) => a.due - b.due)[0]
        if (!next || next.due > end) break
        now = next.due
        next.due += next.delay
        next.callback()
      }
      now = end
    },
  }
}

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

test('manual choices prepare images without pausing rotation and loading does not require hover', () => {
  for (const name of ['select', 'step']) {
    const body = media.slice(media.indexOf(`function ${name}(`)).split('\n  }')[0]
    assert.ok(body.includes('setWarm(true)'), `${name} must warm the gallery`)
    assert.ok(!body.includes('setPaused'), `${name} must not pause automatic previews`)
  }
  assert.match(media, /onFocusCapture=\{prepareForFocus\}/)
  assert.match(media, /function prepareForFocus\(\)[\s\S]*?setWarm\(true\)/)
  assert.match(media, /if \(!compact\) \{ setWarm\(true\); return \}/)
})

test('offscreen galleries release their timer and observer', () => {
  assert.match(media, /new IntersectionObserver/)
  assert.match(media, /!visible \|\| reduced\.matches/)
  assert.match(media, /observer\?\.disconnect\(\)/)
  assert.match(media, /clearInterval\(timer\)/)
  assert.match(media, /GALLERY_INTERVAL_MS = 5000/)
})

test('manual thumbnail and arrow choices each receive a fresh five-second autoplay interval', () => {
  for (const action of ['select', 'step']) {
    const gallery = rotation()
    gallery.advance(4900)
    gallery[action](1)
    assert.equal(gallery.index, 1)
    assert.equal(gallery.timers.size, 1)
    assert.equal(gallery.listenerAdds, 4, 'Selection must not reattach preference or visibility listeners')
    gallery.advance(4999)
    assert.equal(gallery.index, 1, `${action} must retain the image until the full interval expires`)
    gallery.advance(1)
    assert.equal(gallery.index, 2, `${action} must continue autoplay at five seconds`)
    gallery.cleanup()
    assert.equal(gallery.timers.size, 0)
    assert.equal(gallery.restartAutoplay.current, null)
    assert.equal(gallery.observer.disconnected, true)
    for (const target of [gallery.document, gallery.connection, gallery.reduced, gallery.pointer]) assert.equal(target.listeners.size, 0)
    gallery.advance(10000)
    assert.equal(gallery.index, 2, 'Cleanup must prevent later automatic updates')
  }
})

test('manual timer resets preserve device, visibility and hover eligibility guards', () => {
  for (const [target, property, blocked] of [
    ['document', 'hidden', true], ['connection', 'saveData', true],
    ['reduced', 'matches', true], ['pointer', 'matches', false],
  ]) {
    const gallery = rotation()
    gallery[target][property] = blocked
    gallery.select(1)
    assert.equal(gallery.timers.size, 0, `${target} must still block autoplay after selection`)
    gallery.advance(6000)
    assert.equal(gallery.index, 1)
    gallery.cleanup()
  }
  const offscreen = rotation()
  offscreen.intersect(false)
  offscreen.step(1)
  assert.equal(offscreen.timers.size, 0)
  offscreen.cleanup()
  for (const overrides of [{ active: false }, { compact: false }, { motionPaused: true }]) {
    const gallery = rotation(overrides)
    gallery.select(1)
    gallery.step(1)
    assert.equal(gallery.index, 2)
    assert.equal(gallery.timers.size, 0)
    assert.equal(gallery.restartAutoplay.current, null)
  }
})

test('nearby card preparation respects save-data and releases preference listeners', () => {
  const gallery = preparation({ saveData: true })
  gallery.intersect(true)
  assert.deepEqual(gallery.warmed, [])
  gallery.connection.saveData = false
  gallery.connection.emit('change')
  assert.deepEqual(gallery.warmed, [true])
  assert.equal(gallery.observer.disconnected, true)
  gallery.cleanup()
  assert.equal(gallery.connection.registered.size, 0)
  assert.equal(gallery.document.registered.size, 0)
})

test('hidden and offscreen cards do not prepare extra frames', () => {
  const gallery = preparation({ hidden: true })
  gallery.intersect(true)
  assert.deepEqual(gallery.warmed, [])
  gallery.intersect(false)
  gallery.document.hidden = false
  gallery.document.emit('visibilitychange')
  assert.deepEqual(gallery.warmed, [])
  gallery.intersect(true)
  assert.deepEqual(gallery.warmed, [true])
  gallery.cleanup()
})

test('observer fallback retains data and visibility guards while dialogs express explicit intent', () => {
  const fallback = preparation({ observed: false, hidden: true, saveData: true })
  assert.deepEqual(fallback.warmed, [])
  fallback.document.hidden = false
  fallback.document.emit('visibilitychange')
  assert.deepEqual(fallback.warmed, [])
  fallback.connection.saveData = false
  fallback.connection.emit('change')
  assert.deepEqual(fallback.warmed, [true])
  fallback.cleanup()
  assert.deepEqual(preparation({ compact: false, saveData: true }).warmed, [true])
})

test('thumbnails cannot independently request an unloaded stage frame', () => {
  const thumbnail = nodes(tree, node => ts.isJsxSelfClosingElement(node) && node.tagName.getText(tree) === 'Image')
    .find(node => node.attributes.properties.some(attribute => ts.isJsxAttribute(attribute) && attribute.name.getText(tree) === 'width'))
  assert.ok(thumbnail)
  assert.ok(ts.isConditionalExpression(thumbnail.parent))
  assert.equal(thumbnail.parent.condition.getText(tree), 'loaded.includes(src)')
  assert.equal(thumbnail.parent.whenTrue, thumbnail)
  assert.equal(thumbnail.parent.whenFalse.kind, ts.SyntaxKind.NullKeyword)
})
