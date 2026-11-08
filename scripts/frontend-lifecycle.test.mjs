// Execute reviewed callback sources with synthetic browser bindings, without
// mounting React, starting a server, generating media or touching exported output.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'

function tree(file) {
  return ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
}
function find(root, predicate) {
  if (predicate(root)) return root
  return ts.forEachChild(root, node => find(node, predicate))
}
function evaluate(node, bindings) {
  assert.ok(node, 'Expected callback source')
  const code = ts.transpileModule(`(${node.getText()})`, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText
  return runInNewContext(code, bindings, { timeout: 1000 })
}
function effect(file, bindings, contains = '') {
  const call = find(tree(file), node => ts.isCallExpression(node) && node.expression.getText() === 'useEffect' && node.arguments[0].getText().includes(contains))
  return evaluate(call?.arguments[0], bindings)()
}
function target(properties = {}) {
  const listeners = new Map()
  return Object.assign({
    addEventListener(name, callback) {
      if (!listeners.has(name)) listeners.set(name, new Set())
      listeners.get(name).add(callback)
    },
    removeEventListener(name, callback) { listeners.get(name)?.delete(callback) },
    emit(name, event = {}) { for (const callback of listeners.get(name) ?? []) callback(event) },
    count() { return [...listeners.values()].reduce((total, entries) => total + entries.size, 0) },
  }, properties)
}
function animationFrames() {
  let sequence = 0
  const pending = new Map()
  return {
    requestAnimationFrame(callback) { pending.set(++sequence, callback); return sequence },
    cancelAnimationFrame(id) { pending.delete(id) },
    flush() { const batch = [...pending.values()]; pending.clear(); for (const callback of batch) callback() },
    count: () => pending.size,
  }
}

test('ambient pointer work is cancelled on leave, hidden tab and preference changes', () => {
  const frames = animationFrames()
  const motion = target({ matches: false })
  const fine = target({ matches: true })
  const network = target({ saveData: false })
  const field = { style: { setProperty() {} }, dataset: { active: 'false' } }
  const document = target({ hidden: false })
  const window = target({ ...frames, matchMedia: query => query.includes('reduced') ? motion : fine })
  const cleanup = effect('components/portfolio/ambient-dot-field.tsx', { window, document, navigator: { connection: network }, fieldRef: { current: field } })
  const move = () => window.emit('pointermove', { pointerType: 'mouse', clientX: 50, clientY: 80 })
  move()
  assert.equal(frames.count(), 1)
  document.emit('pointerleave')
  assert.equal(frames.count(), 0)
  frames.flush()
  assert.equal(field.dataset.active, 'false')
  move()
  document.hidden = true
  document.emit('visibilitychange')
  assert.equal(frames.count(), 0)
  document.hidden = false
  for (const [preference, name, value] of [[motion, 'matches', true], [fine, 'matches', false], [network, 'saveData', true]]) {
    move()
    assert.equal(frames.count(), 1)
    const previous = preference[name]
    preference[name] = value
    preference.emit('change')
    assert.equal(frames.count(), 0)
    move()
    assert.equal(frames.count(), 0)
    assert.equal(field.dataset.active, 'false')
    preference[name] = previous
    preference.emit('change')
  }
  move()
  frames.flush()
  assert.equal(field.dataset.active, 'true')
  cleanup()
  assert.equal(field.dataset.active, 'false')
  for (const emitter of [window, document, motion, fine, network]) assert.equal(emitter.count(), 0)
})

test('theme setup releases both animation frames and the data preference listener', () => {
  for (const flushFirst of [false, true]) {
    const frames = animationFrames()
    const network = target({ saveData: false })
    const attributes = new Set()
    const root = { dataset: {}, style: {}, toggleAttribute(name, value) { value ? attributes.add(name) : attributes.delete(name) } }
    let theme
    const cleanup = effect('components/portfolio/portfolio-shell.tsx', {
      window: { ...frames, localStorage: { getItem: () => 'light' } }, document: { documentElement: root },
      navigator: { connection: network }, STORAGE_KEY: 'bk-portfolio-theme', setTheme: value => { theme = value },
    })
    assert.equal(theme, 'light')
    assert.equal(root.dataset.theme, 'light')
    network.saveData = true
    network.emit('change')
    assert.ok(attributes.has('data-save-data'))
    if (flushFirst) frames.flush()
    assert.equal(frames.count(), 1)
    cleanup()
    assert.equal(frames.count(), 0)
    assert.equal(network.count(), 0)
    frames.flush()
    assert.equal(root.dataset.themeReady, undefined)
  }
})

function clipboardHarness(writeText) {
  const source = tree('components/portfolio/contact-panel.tsx')
  const feedback = []
  const focus = []
  const copyRequest = { current: 0 }
  const bindings = {
    navigator: { clipboard: { writeText } }, portfolioContact: { email: 'test@example.com' }, copyRequest,
    setCopyFeedback: value => feedback.push({ ...value }),
    emailRef: { current: { focus: options => focus.push(['focus', options.preventScroll]), select: () => focus.push(['select']) } },
  }
  const copy = evaluate(find(source, node => ts.isFunctionDeclaration(node) && node.name?.text === 'copyEmail'), bindings)
  const cleanup = effect('components/portfolio/contact-panel.tsx', bindings)
  return { copy, cleanup, feedback, focus }
}
test('repeated copy attempts produce distinct feedback updates without refocusing the field', async () => {
  const h = clipboardHarness(async () => {})
  await h.copy()
  await h.copy()
  assert.deepEqual(h.feedback, [{ state: 'copied', request: 1 }, { state: 'copied', request: 2 }])
  assert.deepEqual(h.focus, [])
  const source = readFileSync('components/portfolio/contact-panel.tsx', 'utf8')
  assert.match(source, /role="status"[^>]*aria-atomic="true"><span key=\{copyFeedback.request\}>/)
})
test('an older clipboard completion cannot overwrite the latest fallback or steal focus', async () => {
  const requests = []
  const h = clipboardHarness(() => new Promise((resolve, reject) => requests.push({ resolve, reject })))
  const first = h.copy()
  const second = h.copy()
  requests[1].reject(new Error('Denied'))
  await second
  requests[0].resolve()
  await first
  assert.deepEqual(h.feedback, [{ state: 'fallback', request: 2 }])
  assert.deepEqual(h.focus, [['focus', true], ['select']])
})
test('unmount invalidates a pending clipboard request, including its failure fallback', async () => {
  for (const failure of [false, true]) {
    let finish
    const h = clipboardHarness(() => new Promise((resolve, reject) => { finish = failure ? reject : resolve }))
    const pending = h.copy()
    h.cleanup()
    finish()
    await pending
    assert.deepEqual(h.feedback, [])
    assert.deepEqual(h.focus, [])
  }
})

test('desktop breakpoint closes the mobile disclosure and transfers only hidden focus', () => {
  const source = tree('components/portfolio/site-header.tsx')
  const handler = find(source, node => ts.isFunctionDeclaration(node) && node.name?.text === 'handleLayoutChange')
  const activeLink = {}, externalLink = {}, toggle = {}
  const calls = []
  const media = { matches: true }
  const document = { activeElement: activeLink }
  const bindings = {
    mobileLayout: media, document, activePath: '/projects', menuToggleRef: { current: toggle },
    mobileNavRef: { current: { contains: element => element === activeLink } },
    linkRefs: { current: { '/projects': { focus: () => calls.push('project') } } },
    contactLinkRef: { current: { focus: () => calls.push('contact') } }, setMenuOpen: value => calls.push(value),
  }
  const change = evaluate(handler, bindings)
  change()
  assert.deepEqual(calls, [])
  media.matches = false
  change()
  assert.deepEqual(calls.splice(0), ['project', false])
  bindings.activePath = '/contact'
  change()
  assert.deepEqual(calls.splice(0), ['contact', false])
  document.activeElement = externalLink
  change()
  assert.deepEqual(calls, [false])
})

test('breakpoint listener also protects a focused closed menu toggle and cleans up', () => {
  const mobileLayout = target({ matches: true })
  const toggle = {}
  const calls = []
  const cleanup = effect('components/portfolio/site-header.tsx', {
    window: { matchMedia: () => mobileLayout }, document: { activeElement: toggle }, menuOpen: false,
    mobileNavRef: { current: { contains: () => false } }, menuToggleRef: { current: toggle }, activePath: '/',
    linkRefs: { current: { '/': { focus: () => calls.push('home') } } }, contactLinkRef: { current: null },
    setMenuOpen: value => calls.push(value),
  }, 'handleLayoutChange')
  mobileLayout.matches = false
  mobileLayout.emit('change')
  assert.deepEqual(calls, ['home', false])
  cleanup()
  assert.equal(mobileLayout.count(), 0)
})

test('route entrance is cancelled when a tab becomes hidden and releases all listeners', () => {
  let cancellations = 0
  const reducedMotion = target({ matches: false })
  const connection = target({ saveData: false })
  const window = target()
  const document = target({ hidden: false })
  const cleanup = effect('components/portfolio/route-transition.tsx', {
    window, document, matchMedia: () => reducedMotion, navigator: { connection },
    entrance: { current: { cancel: () => cancellations++ } },
  })
  document.emit('visibilitychange')
  assert.equal(cancellations, 0)
  document.hidden = true
  document.emit('visibilitychange')
  assert.equal(cancellations, 1)
  cleanup()
  assert.equal(cancellations, 2)
  for (const emitter of [window, document, reducedMotion, connection]) assert.equal(emitter.count(), 0)
})
