import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const read = path => readFileSync(path, 'utf8')
const navigation = read('components/portfolio/route-transition.tsx')
const header = read('components/portfolio/site-header.tsx')
const shell = read('components/portfolio/portfolio-shell.tsx')
const css = read('app/navigation.css')

test('navigation preserves synchronous Next links, caller props and the persistent shell', () => {
  assert.match(navigation, /import Link from "next\/link"/)
  const link = navigation.slice(navigation.indexOf('export function TransitionLink'))
  assert.match(link, /return <Link \{\.\.\.props\} \/>/)
  assert.doesNotMatch(navigation, /preventDefault|useRouter|router\.(?:push|replace)|startViewTransition|setTimeout/)
  assert.doesNotMatch(link, /onClick=|onMouseDown=|onPointerDown=|onNavigate=/)
  assert.match(shell, /<SiteHeader[\s\S]*?<RouteContent>\{children\}<\/RouteContent>/)
  assert.doesNotMatch(navigation, /key=\{pathname\}|next\/dist|FrozenRouter|pushState\(/)
  for (const href of ['/', '/projects/', '/experience/', '/education/', '/about/', '/contact/']) assert.ok(header.includes(`"${href}"`), href)
  // Next 16.4.5's explicit Full prefetch sends a runtime RSC request to the
  // HTML URL. Default auto prefetch requests the exported static segment files.
  assert.doesNotMatch(header, /\bprefetch(?:\s*=\s*\{\s*true\s*\}|(?=\s|\/?>)(?!\s*=))/, 'Static export navigation must keep the default auto prefetch strategy')
})

test('route motion has cancellation, reduced-motion and mobile keyboard fallbacks', () => {
  for (const signal of ['prefers-reduced-motion: reduce', 'saveData', 'entrance.current?.cancel()', '"popstate"', '"pagehide"', 'contentRef.current.animate', 'duration: 300']) assert.ok(navigation.includes(signal), signal)
  assert.match(navigation, /if \(previousPath.current === pathname\) return/)
  assert.doesNotMatch(css, /view-transition-name|view-transition-group|view-transition-old|view-transition-new/)
  assert.match(header, /inert=\{!menuOpen\}/)
  assert.match(header, /tabIndex=\{menuOpen \? 0 : -1\}/)
  assert.match(header, /event.key === "Escape"/)
  assert.match(css, /@media \(max-width: 700px\)[\s\S]*?\.mobile-navigation\s*\{/)
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/)
})
