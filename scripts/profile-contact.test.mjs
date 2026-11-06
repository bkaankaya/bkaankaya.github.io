import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { test } from 'node:test'
const read = path => readFileSync(path, 'utf8')
const profile = read('lib/portfolio-profile.ts')
const education = read('app/(portfolio)/education/page.tsx')
const contact = read('components/portfolio/contact-panel.tsx')
const header = read('components/portfolio/site-header.tsx')
const footer = read('components/portfolio/portfolio-footer.tsx')
const home = read('components/portfolio/home-page.tsx')
function source(dir) { return readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? source(`${dir}/${e.name}`) : /\.(ts|tsx)$/.test(e.name) ? [`${dir}/${e.name}`] : []) }

test('education and grades follow the general CV and Cambridge certificate', () => {
  for (const value of ['TED University', 'B.Sc. in Computer Engineering', 'Business Administration', 'GPA: 2.94', 'Sep 2022 – Jun 2026', 'Beştepe Koleji', '2017 – 2022', 'June 2021']) assert.ok(profile.includes(value), value)
  for (const [subject, grade] of [['Mathematics','A'],['Biology','B'],['Business','B']]) assert.ok(profile.includes(`subject: "${subject}", grade: "${grade}"`))
  assert.match(education, /href=\{website\}/)
  assert.match(education, /languages.map/)
  assert.match(profile, /name: "Turkish", level: "Native"/)
  assert.match(profile, /name: "English", level: "Advanced"/)
  assert.match(profile, /name: "Spanish", level: "Beginner"/)
})
test('unsupported education and language claims are absent from the application', () => {
  for (const path of ['app','components','lib'].flatMap(source)) assert.doesNotMatch(read(path), /Tor Vergata|Politecnico|Mechanical Engineering|Italian|15\+/, path)
  for (const company of ['TNC Group', 'Anova R&D Technologies', 'PROVEN Technologies', 'T2 Software']) assert.ok(profile.includes(company))
})
test('Contact is a real route used by header, footer, hero and project CTAs', () => {
  assert.ok(existsSync('app/(portfolio)/contact/page.tsx'))
  for (const text of [header,footer,home,read('components/portfolio/project-card.tsx')]) assert.ok(text.includes('href="/contact/"'))
  assert.match(contact, /id="contact"/)
  assert.match(read('app/(portfolio)/about/page.tsx'), /<ContactPanel \/>/)
})
test('email has an honest mailto action, copy confirmation and failure fallback', () => {
  assert.match(contact, /href=\{portfolioContact.mailto\}/)
  assert.match(contact, /await navigator.clipboard.writeText\(portfolioContact.email\)/)
  assert.match(contact, /catch[\s\S]*?select\(\)/)
  assert.match(contact, /role="status"/)
  assert.doesNotMatch(contact, /Message sent|Email sent|fetch\(/)
})

test('project-to-contact navigation releases its modal scroll lock before routing', () => {
  const card = read('components/portfolio/project-card.tsx')
  assert.match(card, /onNavigate=\{dismissForNavigation\}/)
  assert.match(card, /function dismissForNavigation\(\)[\s\S]*?releaseScroll\(\)/)
  assert.match(card, /previousOverflow.current = null/)
})
