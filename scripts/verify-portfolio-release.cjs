/* Real-browser release checks. QA packages live outside the application graph.
   PORTFOLIO_QA_MODULES=/path/to/qa PORTFOLIO_BASE_URL=http://127.0.0.1:4173 node scripts/verify-portfolio-release.cjs
   Install playwright@1.65.0 and axe-core@4.14.0 in that separate QA directory first. */
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { createRequire } = require('node:module')
const qa = process.env.PORTFOLIO_QA_MODULES ? createRequire(path.resolve(process.env.PORTFOLIO_QA_MODULES, 'package.json')) : require
const { chromium } = qa('playwright')
const base = process.env.PORTFOLIO_BASE_URL || 'http://127.0.0.1:4173'
const evidence = process.env.PORTFOLIO_QA_OUTPUT || '/tmp/portfolio-evidence'
const routes = ['/', '/projects/', '/experience/', '/education/', '/about/', '/contact/']
const widths = [320, 390, 768, 1024, 1440]
const results = { matrix: [], interactions: [], failures: [] }
fs.mkdirSync(path.join(evidence, 'screenshots'), { recursive: true })
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
async function until(fn, message) {
  for (let i = 0; i < 40; i++) { if (await fn()) return; await sleep(100) }
  assert.fail(message)
}

;(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] })
  results.browser = browser.version()
  try {
    if (process.env.PORTFOLIO_INTERACTIONS_ONLY !== '1') for (const width of widths) for (const theme of ['dark', 'light']) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 })
      await context.addInitScript(t => localStorage.setItem('bk-portfolio-theme', t), theme)
      const page = await context.newPage()
      let errors = []
      page.on('pageerror', error => errors.push(error.message))
      for (const route of routes) {
        errors = []
        const response = await page.goto(base + route, { waitUntil: 'networkidle' })
        await page.evaluate(() => document.fonts.ready)
        await until(() => page.locator('html').getAttribute('data-motion').then(Boolean), 'Motion preference did not initialize')
        const layout = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth - innerWidth,
          h1Count: document.querySelectorAll('main h1').length,
          canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
          running: document.getAnimations().filter(a => a.playState === 'running').length,
        }))
        let violations = []
        if (width === 390 || width === 1440) {
          await page.addScriptTag({ path: qa.resolve('axe-core/axe.min.js') })
          violations = await page.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } })).violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({ target: n.target, detail: n.failureSummary })) })))
        }
        const record = { width, theme, route, status: response.status(), ...layout, errors: [...errors], violations }
        results.matrix.push(record)
        if (record.status !== 200 || layout.overflow > 1 || layout.h1Count !== 1 || errors.length || violations.length) results.failures.push(record)
        if ((width === 1440 && route === '/' && theme === 'dark') || (width === 1440 && route === '/projects/' && theme === 'light') || (width === 390 && route === '/projects/' && theme === 'dark') || (width === 390 && route === '/contact/' && theme === 'light')) {
          await page.screenshot({ path: path.join(evidence, 'screenshots', `final-${route.replaceAll('/', '') || 'home'}-${width}-${theme}.jpg`), type: 'jpeg', quality: 80 })
        }
      }
      await context.close()
      console.log(`MATRIX ${width}/${theme} complete`)
    }

    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    const page = await context.newPage()
    async function check(name, fn) {
      try { await fn(); results.interactions.push({ name, pass: true }); console.log('PASS', name) }
      catch (error) { results.interactions.push({ name, pass: false, error: error.message, stack: error.stack }); results.failures.push({ name, error: error.message }); console.log('FAIL', name, error.message) }
    }
    await page.goto(base + '/projects/', { waitUntil: 'networkidle' })
    await check('search and clear retain focus and complete collection', async () => {
      const input = page.getByRole('searchbox')
      await input.fill('quickscan')
      assert.equal(await page.locator('.project-card').count(), 1)
      await page.getByRole('button', { name: 'Clear project search' }).click()
      assert.equal(await page.locator('.project-card').count(), 12)
      assert.equal(await input.evaluate(e => e === document.activeElement), true)
    })
    await check('empty-state reset and category filter preserve inventory', async () => {
      await page.getByRole('searchbox').fill('no-such-project-7281')
      await page.getByRole('button', { name: 'Show all 12 projects' }).click()
      assert.equal(await page.locator('.project-card').count(), 12)
      await page.locator('.filter-button').filter({ hasText: /^Games/ }).click()
      await until(() => page.locator('.project-card').count().then(n => n === 1), 'Games filter failed')
      await page.locator('.filter-button').filter({ hasText: /^All/ }).click()
      await until(() => page.locator('.project-card').count().then(n => n === 12), 'All filter failed')
    })
    await check('native project dialog Escape restores trigger and scrolling', async () => {
      const trigger = page.locator('[data-project="quickscan"] .project-title-trigger')
      await trigger.click()
      assert.equal(await page.locator('dialog[open]').count(), 1)
      await page.keyboard.press('Escape')
      await until(() => page.locator('dialog[open]').count().then(n => n === 0), 'Dialog stayed open')
      assert.equal(await trigger.evaluate(e => e === document.activeElement), true)
      assert.notEqual(await page.evaluate(() => document.documentElement.style.overflow), 'hidden')
    })
    await check('motion pause stops animations and persists across routes/reload', async () => {
      const toggle = page.getByRole('button', { name: 'Pause visual effects', exact: true })
      await toggle.click()
      await until(() => page.locator('html').getAttribute('data-motion').then(v => v === 'paused'), 'Motion did not pause')
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
      assert.equal(await page.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length), 0)
      await page.locator('.desktop-navigation').getByRole('link', { name: 'About', exact: true }).click()
      await page.waitForURL('**/about/')
      assert.equal(await page.locator('html').getAttribute('data-motion'), 'paused')
      await page.reload({ waitUntil: 'networkidle' })
      assert.equal(await toggle.getAttribute('aria-pressed'), 'true')
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
      assert.equal(await page.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length), 0)
      await toggle.click()
      await until(() => page.locator('html').getAttribute('data-motion').then(v => v === 'full'), 'Motion did not resume')
    })
    await check('OS reduced motion overrides saved full effects', async () => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await until(() => page.getByRole('button', { name: 'Pause visual effects', exact: true }).isDisabled(), 'Device preference not respected')
      assert.equal(await page.locator('html').getAttribute('data-motion'), 'paused')
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
      assert.equal(await page.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length), 0)
      await page.emulateMedia({ reducedMotion: 'no-preference' })
      await until(() => page.locator('html').getAttribute('data-motion').then(v => v === 'full'), 'Full motion not restored after device change')
    })
    await check('gallery retains manual selection and consistent control order', async () => {
      await page.emulateMedia({ reducedMotion: 'no-preference' })
      await page.evaluate(() => localStorage.removeItem('bk-portfolio-motion-paused'))
      await page.goto(base + '/projects/', { waitUntil: 'networkidle' })
      const card = page.locator('article[data-project="quickscan"]')
      await card.scrollIntoViewIfNeeded()
      const next = card.getByRole('button', { name: 'Next image', exact: true })
      await until(() => next.isEnabled(), 'Gallery images unavailable')
      await next.click()
      const index = await card.locator('.project-media').getAttribute('data-frame')
      await card.hover()
      await page.waitForTimeout(5200)
      assert.equal(await card.locator('.project-media').getAttribute('data-frame'), index)
      const order = await card.locator('.project-gallery-controls button').evaluateAll(elements => elements.filter(e => e.getBoundingClientRect().width > 0).map(e => ({ cls: e.className, x: e.getBoundingClientRect().left })))
      assert.equal(order[0].cls, 'gallery-pause')
      assert.ok(order[0].x <= order[1].x)
    })
    await check('clipboard rejection exposes manual copy fallback', async () => {
      await page.goto(base + '/contact/', { waitUntil: 'networkidle' })
      await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('test denial')) } }))
      await page.getByRole('button', { name: 'Copy email', exact: true }).click()
      await until(() => page.locator('.contact-copy-status').textContent().then(t => t.includes('manually')), 'Manual copy fallback missing')
      assert.equal(await page.locator('#contact-email-address').evaluate(e => e === document.activeElement && e.selectionEnd > e.selectionStart), true)
    })
    await check('mobile menu Escape and desktop resize preserve visible focus', async () => {
      await page.setViewportSize({ width: 390, height: 844 })
      await page.getByRole('button', { name: 'Open navigation', exact: true }).click()
      await page.locator('#mobile-navigation').getByRole('link', { name: 'Projects', exact: true }).focus()
      await page.keyboard.press('Escape')
      assert.equal(await page.getByRole('button', { name: 'Open navigation', exact: true }).evaluate(e => e === document.activeElement), true)
      await page.getByRole('button', { name: 'Open navigation', exact: true }).click()
      await page.locator('#mobile-navigation').getByRole('link', { name: 'Projects', exact: true }).focus()
      await page.setViewportSize({ width: 1440, height: 900 })
      await until(() => page.locator('#mobile-navigation').getAttribute('aria-hidden').then(v => v === 'true'), 'Mobile menu stayed open')
      assert.ok(await page.evaluate(() => { const e = document.activeElement, r = e.getBoundingClientRect(); return e !== document.body && r.width > 0 && r.height > 0 }))
    })
    await check('deep links, history and 404 retain correct route semantics', async () => {
      await page.goto(base + '/education/', { waitUntil: 'networkidle' })
      await page.locator('.desktop-navigation').getByRole('link', { name: 'Experience', exact: true }).click()
      await page.waitForURL('**/experience/')
      await page.goBack(); await page.waitForURL('**/education/')
      await page.goForward(); await page.waitForURL('**/experience/')
      const missing = await page.goto(base + '/not-a-portfolio-route/', { waitUntil: 'networkidle' })
      assert.equal(missing.status(), 404)
      assert.ok((await page.locator('meta[name="robots"]').getAttribute('content')).includes('noindex'))
    })
    await context.close()
    const plain = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } })
    const plainPage = await plain.newPage()
    await check('without JavaScript the identity and project inventory stay visible', async () => {
      await plainPage.goto(base + '/')
      assert.ok((await plainPage.locator('h1').textContent()).includes('Bertan Kaan Kaya'))
      assert.equal(await plainPage.locator('h1').isVisible(), true)
      await plainPage.goto(base + '/projects/')
      assert.equal(await plainPage.locator('.project-card').count(), 12)
    })
    await plain.close()
  } finally {
    fs.writeFileSync(path.join(evidence, 'final-browser.json'), JSON.stringify(results, null, 2))
    await browser.close()
  }
  console.log(JSON.stringify({ matrix: results.matrix.length, interactions: results.interactions.length, failures: results.failures.length }))
  if (results.failures.length) process.exitCode = 1
})().catch(error => { console.error(error); process.exitCode = 1 })
