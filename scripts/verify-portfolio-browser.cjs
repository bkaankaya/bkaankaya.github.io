// Run against a built static site. Install browser tooling outside this repository:
// PLAYWRIGHT_MODULE=/path/to/playwright BASE_URL=http://localhost:3000 node scripts/verify-portfolio-browser.cjs
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright')
const base = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '')
const output = process.env.QA_OUTPUT || '/tmp/portfolio-browser-review'
fs.mkdirSync(output, { recursive: true })

async function run() {
  const browser = await chromium.launch({ headless: true })
  const checks = [], errors = [], badAssets = []
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  await context.addInitScript(() => {
    const timers = new Set(), create = window.setInterval, clear = window.clearInterval
    window.__galleryTimers = timers
    window.setInterval = (fn, delay, ...args) => {
      const id = create(fn, delay, ...args)
      if (delay === 5000) timers.add(id)
      return id
    }
    window.clearInterval = id => { timers.delete(id); return clear(id) }
  })
  try {
    const page = await context.newPage()
    page.setDefaultTimeout(15000)
    page.on('pageerror', error => errors.push(error.message))
    page.on('response', response => {
      if (response.status() >= 400 && /\.(webp|png|svg|js|css)(\?|$)/.test(response.url())) badAssets.push(response.url())
    })
    await page.goto(base + '/', { waitUntil: 'networkidle' })
    const more = page.getByRole('button', { name: 'Show more technologies' })
    await more.click()
    assert.equal(await page.locator('.technology-extra-grid [role=listitem]').count(), 4)
    assert.match(await page.locator('.technology-extra-grid').innerText(), /Solidity/)
    await page.keyboard.press('Escape')
    assert.equal(await more.getAttribute('aria-expanded'), 'false')
    await page.keyboard.press('Enter')
    assert.equal(await page.getByRole('button', { name: 'Show fewer technologies' }).getAttribute('aria-expanded'), 'true')
    await page.keyboard.press('Space')
    assert.equal(await more.getAttribute('aria-expanded'), 'false')
    await more.click()
    await page.locator('.technology-stack').screenshot({ path: path.join(output, 'technologies.png') })
    checks.push('More/Less: four technologies; click, Enter, Space and Escape')

    await page.goto(base + '/projects/', { waitUntil: 'networkidle' })
    assert.equal(await page.locator('article.project-card').count(), 12)
    const dora = page.locator('article[data-project="dora-voice"]')
    const rezero = page.locator('article[data-project="rezero-2d-game"]')
    for (const card of [dora, rezero]) {
      const image = card.locator('.project-brand img')
      await image.evaluate(img => img.decode())
      assert.ok((await image.getAttribute('src')).includes('-mark.webp'))
    }
    assert.equal(await page.locator('.project-art-trigger img[src*="-mark"]').count(), 0)
    await dora.scrollIntoViewIfNeeded(); await page.mouse.move(1, 1)
    await dora.hover(); await page.waitForTimeout(4200)
    assert.equal(await dora.locator('.project-media').getAttribute('data-frame'), '0')
    await page.waitForTimeout(1200)
    assert.equal(await dora.locator('.project-media').getAttribute('data-frame'), '1')
    assert.equal(await page.evaluate(() => window.__galleryTimers.size), 1)
    await page.waitForTimeout(5000)
    assert.equal(await dora.locator('.project-media').getAttribute('data-frame'), '0')
    await page.mouse.move(1, 1); await page.waitForTimeout(100)
    assert.equal(await page.evaluate(() => window.__galleryTimers.size), 0)
    await dora.screenshot({ path: path.join(output, 'doravoice.png') })
    checks.push('Original DoraVoice/ReZero badge assets; DoraVoice 0→1→0 every 5 seconds; timer cleanup')

    for (const [filter, count] of Object.entries({ AI: 5, 'Full-stack': 7, Frontend: 1, Embedded: 1, Research: 4, Blockchain: 1, Games: 1, All: 12 })) {
      await page.getByRole('group', { name: 'Filter projects by category' }).getByRole('button', { name: filter, exact: true }).click()
      await page.waitForFunction(n => document.querySelectorAll('article.project-card').length === n, count)
    }
    checks.push('All category filters')

    // Hold the second frame pending. A Next click must never blank the first frame.
    let release
    const gate = new Promise(resolve => { release = resolve })
    await page.route('**/doravoice-product-preview.webp', route => gate.then(() => route.continue()))
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.getByRole('button', { name: 'Explore DoraVoice project' }).click()
    const dialog = page.locator('dialog[open]')
    await dialog.locator('.project-art-image').first().evaluate(img => img.decode())
    assert.equal(await dialog.getByRole('button', { name: 'Next image' }).isDisabled(), true)
    assert.equal(await dialog.locator('.project-media').getAttribute('data-frame'), '0')
    release()
    await page.waitForFunction(() => !document.querySelector('dialog[open] button[aria-label="Next image"]').disabled)
    await dialog.getByRole('button', { name: 'Next image' }).click()
    assert.equal(await dialog.locator('.project-media').getAttribute('data-frame'), '1')
    assert.ok(await dialog.locator('.is-active').evaluate(img => img.complete && img.naturalWidth > 0))
    const box = await dialog.boundingBox()
    assert.ok(Math.abs(box.x + box.width / 2 - 720) < 2)
    await page.keyboard.press('Escape'); await page.waitForTimeout(250)
    assert.equal(await page.locator('dialog[open]').count(), 0)
    await page.unroute('**/doravoice-product-preview.webp')
    checks.push('Slow-network manual gallery: disabled while pending, decoded frame after loading; centered dialog and Escape')

    await page.route('**/doravoice-product-preview.webp', route => route.abort())
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.getByRole('button', { name: 'Explore DoraVoice project' }).click()
    await page.waitForFunction(() => document.querySelector('.project-gallery-status')?.textContent === 'Other images unavailable')
    assert.equal(await page.locator('dialog[open] .project-media').getAttribute('data-frame'), '0')
    assert.equal(await page.locator('dialog[open] .project-media-unavailable').count(), 0)
    await page.keyboard.press('Escape'); await page.waitForTimeout(250)
    await page.unroute('**/doravoice-product-preview.webp')
    checks.push('Failed second image retains the first preview')

    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.reload({ waitUntil: 'networkidle' }); await dora.hover()
    await page.waitForTimeout(5300)
    assert.equal(await dora.locator('.project-media').getAttribute('data-frame'), '0')
    assert.equal(await page.evaluate(() => window.__galleryTimers.size), 0)
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    checks.push('Reduced-motion prevents autoplay')

    for (const theme of ['dark', 'light']) {
      await page.goto(base + '/', { waitUntil: 'networkidle' })
      const toggle = page.getByRole('button', { name: 'Switch to ' + theme + ' theme' })
      if (await toggle.count()) await toggle.click()
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 })
        for (const route of ['/', '/projects/', '/experience/', '/education/', '/about/', '/contact/']) {
          const response = await page.goto(base + route, { waitUntil: 'networkidle' })
          assert.equal(response.status(), 200)
          assert.equal(await page.locator('html').getAttribute('data-theme'), theme)
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), theme + ' ' + width + ' ' + route)
        }
      }
    }
    checks.push('Six routes in both themes at 320/390/768/1440px: HTTP 200 and no horizontal overflow')
    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
    const touch = await mobile.newPage()
    await touch.goto(base + '/projects/', { waitUntil: 'networkidle' })
    await touch.getByRole('button', { name: 'Explore DoraVoice project' }).tap()
    const modal = touch.locator('dialog[open]')
    await modal.getByRole('button', { name: 'Next image' }).tap()
    assert.equal(await modal.locator('.project-media').getAttribute('data-frame'), '1')
    await modal.getByRole('link', { name: 'Let’s talk' }).tap()
    await touch.waitForURL('**/contact/')
    assert.notEqual(await touch.evaluate(() => document.documentElement.style.overflow), 'hidden')
    await mobile.close()
    checks.push('Touch gallery controls and project-to-Contact navigation release scroll lock')
    assert.deepEqual(errors, []); assert.deepEqual(badAssets, [])
    const result = { base, checks, errors, badAssets }
    fs.writeFileSync(path.join(output, 'review.json'), JSON.stringify(result, null, 2))
    console.log(JSON.stringify(result))
  } finally { await browser.close() }
}
run().catch(error => { console.error(error); process.exitCode = 1 })
