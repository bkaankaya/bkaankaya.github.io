// Source/handler checks only. These do not replace React, browser or assistive-technology tests.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'

const paths = {
  archive: 'components/portfolio/project-archive.tsx',
  media: 'components/portfolio/project-media.tsx',
}
const trees = Object.fromEntries(Object.entries(paths).map(([name, path]) => [name,
  ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX),
]))
function nodes(tree, predicate) {
  const result = []
  function visit(node) {
    if (predicate(node)) result.push(node)
    ts.forEachChild(node, visit)
  }
  visit(tree)
  return result
}
function elements(tree, tag) {
  return nodes(tree, node => (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && node.tagName.getText() === tag)
}
function attribute(node, name) {
  return node.attributes.properties.find(item => ts.isJsxAttribute(item) && item.name.text === name)?.initializer
}
function value(node, name, tree) {
  const item = attribute(node, name)
  return item && (ts.isJsxExpression(item) ? item.expression?.getText(tree) : item.text)
}
function namedFunction(tree, name) {
  const found = nodes(tree, node => ts.isFunctionDeclaration(node) && node.name?.text === name)
  assert.equal(found.length, 1, `Expected one ${name} function`)
  return found[0]
}
function galleryHandler(name, context) {
  const fn = namedFunction(trees.media, name)
  const source = ts.transpileModule(`(${fn.getText(trees.media)})`, { compilerOptions: { target: ts.ScriptTarget.ES2020 } }).outputText
  // Only the reviewed gallery handler is evaluated, against synthetic bindings.
  return runInNewContext(source, context, { timeout: 1000 })
}

// Real event order, rendering and accessibility-tree behavior still need a browser.
test('changed components are syntactically valid TSX', () => {
  for (const tree of Object.values(trees)) assert.deepEqual(tree.parseDiagnostics, [], tree.fileName)
})

test('search has an explicit label and no interactive clear button inside it', () => {
  const tree = trees.archive
  const input = elements(tree, 'input').find(node => value(node, 'type', tree) === 'search')
  assert.ok(input)
  const inputId = value(input, 'id', tree)
  assert.ok(inputId)
  const labels = nodes(tree, ts.isJsxElement).filter(node => node.openingElement.tagName.getText(tree) === 'label')
  const label = labels.find(node => value(node.openingElement, 'htmlFor', tree) === inputId)
  assert.ok(label)
  assert.equal(elements(label, 'button').length, 0)
  const clear = elements(tree, 'button').find(node => value(node, 'aria-label', tree) === 'Clear project search')
  assert.equal(value(clear, 'onClick', tree), 'clearSearch')
})

test('clear search restores focus before its trigger disappears', () => {
  const calls = []
  const context = { setQuery: value => calls.push(['query', value]), searchRef: { current: { focus: options => calls.push(['focus', options.preventScroll]) } } }
  const fn = namedFunction(trees.archive, 'clearSearch')
  runInNewContext(`(${fn.getText(trees.archive)})`, context, { timeout: 1000 })()
  assert.deepEqual(calls, [['query', ''], ['focus', true]])
})

test('empty-state reset also returns to the surviving search input', () => {
  const calls = []
  const context = { setActiveFilter: value => calls.push(value), clearSearch: () => calls.push('clear-and-focus') }
  const fn = namedFunction(trees.archive, 'resetFilters')
  runInNewContext(`(${fn.getText(trees.archive)})`, context, { timeout: 1000 })()
  assert.deepEqual(calls, ['All', 'clear-and-focus'])
})

test('result count is announced once and controls address either result state', () => {
  const tree = trees.archive
  const input = elements(tree, 'input')[0]
  const resultsId = value(input, 'aria-controls', tree)
  assert.ok(resultsId)
  assert.equal(elements(tree, 'div').filter(node => value(node, 'id', tree) === resultsId).length, 2)
  const status = elements(tree, 'p').find(node => value(node, 'role', tree) === 'status')
  assert.equal(value(status, 'aria-live', tree), 'polite')
  assert.equal(value(status, 'aria-atomic', tree), 'true')
  assert.equal(elements(status.parent, 'span').filter(node => value(node, 'aria-hidden', tree) === 'true').length, 1)
})

test('gallery focus warms images without pausing rotation', () => {
  const calls = []
  const context = { setWarm: value => calls.push(['warm', value]) }
  galleryHandler('prepareForFocus', context)()
  assert.deepEqual(calls, [['warm', true]])
  const root = elements(trees.media, 'div').find(node => value(node, 'ref', trees.media) === 'mediaRef')
  assert.equal(value(root, 'onFocusCapture', trees.media), 'prepareForFocus')
  assert.equal(attribute(root, 'onBlurCapture'), undefined)
})

test('thumbnail selection only changes to a decoded frame without setting a pause', () => {
  const calls = []
  const context = {
    frames: ['first', 'second', 'pending'], ready: { current: new Set(['first', 'second']) },
    setWarm: value => calls.push(['warm', value]), setIndex: value => calls.push(['index', value]),
    restartAutoplay: { current: null },
  }
  const select = galleryHandler('select', context)
  select(1)
  select(2)
  assert.deepEqual(calls, [['warm', true], ['index', 1], ['warm', true]])
})

test('gallery arrows skip unloaded frames and wrap without setting a pause', () => {
  let index = 0
  const context = {
    frames: ['first', 'pending', 'third'], ready: { current: new Set(['first', 'third']) },
    setWarm: () => {}, setIndex: update => { index = update(index) },
    restartAutoplay: { current: null },
  }
  const step = galleryHandler('step', context)
  step(1)
  assert.equal(index, 2)
  step(1)
  assert.equal(index, 0)
  step(-1)
  assert.equal(index, 2)
})

test('automatic previews do not generate live slide announcements', () => {
  const node = elements(trees.media, 'span').find(node => value(node, 'className', trees.media) === 'gallery-position')
  const expression = value(node, 'aria-live', trees.media)
  for (const [active, compact, expected] of [[true, true, 'off'], [false, true, 'polite'], [false, false, 'polite']]) {
    assert.equal(runInNewContext(expression, { active, compact }, { timeout: 1000 }), expected)
  }
  assert.equal(value(node, 'aria-atomic', trees.media), 'true')
})
