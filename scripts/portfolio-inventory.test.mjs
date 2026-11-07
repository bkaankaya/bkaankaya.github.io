// Checks the actual declared portfolio inventory without executing its module,
// importing React components, or relying on property order/string occurrence counts.
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join, posix, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'
import ts from 'typescript'

const source = ts.createSourceFile('portfolio-data.ts', readFileSync('lib/portfolio-data.ts', 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)

function literal(node, tree = source) {
  if (ts.isAsExpression(node) || ts.isSatisfiesExpression(node) || ts.isParenthesizedExpression(node)) return literal(node.expression, tree)
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text
  if (ts.isNumericLiteral(node)) return Number(node.text)
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(element => literal(element, tree))
  if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.map(property => {
    assert.ok(ts.isPropertyAssignment(property), 'Project metadata must use explicit properties')
    const key = property.name.getText(tree).replace(/^["']|["']$/g, '')
    // Lucide component references are irrelevant to the content contract.
    return [key, key === 'icon' ? property.initializer.getText(tree) : literal(property.initializer, tree)]
  }))
  throw new Error(`Unsupported portfolio data expression: ${node.getText(tree)}`)
}

function declaration(name, tree = source) {
  for (const statement of tree.statements) {
    if (!ts.isVariableStatement(statement)) continue
    for (const entry of statement.declarationList.declarations) {
      if (entry.name.getText(tree) === name && entry.initializer) return literal(entry.initializer, tree)
    }
  }
  throw new Error(`Missing portfolio declaration: ${name}`)
}

const projects = declaration('projects')
const filters = declaration('projectFilters')

// CI runs source checks before prebuild. Optimized WebPs are intentionally not
// committed. Exercise the real preparation script in an isolated directory when
// derivatives are absent, rather than skipping image integrity or mutating public/.
function availableMedia(paths) {
  const local = path => `public${path}`
  const absentDerivatives = paths.filter(path => path.startsWith('/projects/optimized/') && !existsSync(local(path)))
  if (absentDerivatives.length === 0) return { file: local, cleanup: () => {} }

  const script = resolve('scripts/prepare-project-media.mjs')
  const preparation = ts.createSourceFile(script, readFileSync(script, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.JS)
  const specifications = declaration('specifications', preparation)
  const generatedPaths = new Set(specifications.map(([, target]) => `/projects/optimized/${target}`))
  for (const path of absentDerivatives) assert.ok(generatedPaths.has(path), `No build recipe for ${path}`)

  const directory = mkdtempSync(join(tmpdir(), 'portfolio-media-test-'))
  const cleanup = () => rmSync(directory, { recursive: true, force: true })
  try {
    const inputDirectory = join(directory, 'public/projects')
    mkdirSync(inputDirectory, { recursive: true })
    for (const [input] of specifications) {
      assert.ok(existsSync(`public/projects/${input}`), `Missing committed media original: ${input}`)
      copyFileSync(`public/projects/${input}`, join(inputDirectory, input))
    }
    const result = spawnSync(process.execPath, [script], { cwd: directory, encoding: 'utf8', timeout: 60000 })
    assert.equal(result.status, 0, `Media preparation failed: ${result.error?.message ?? result.stderr}`)
    return { file: path => existsSync(local(path)) ? local(path) : join(directory, `public${path}`), cleanup }
  } catch (error) {
    cleanup()
    throw error
  }
}

// Owned repositories and visibility verified through GitHub on 7 November 2026.
// An intentional inventory change should update this snapshot after verification.
const expected = {
  'AI-Receptionist': 'private',
  'Vague-': 'private',
  'QuickScan': 'private',
  'T2-Software-Leave-Approval-Application': 'public',
  'STM32_Modbus_DataMonitor': 'public',
  'CineEmbed-A-Multi-Modal-Unsupervised-Film-Recommendation-System': 'public',
  'White-Wine-Quality-Prediction': 'public',
  'DNN-Universal-Function-Approximator': 'public',
  'Hospital-Management-System': 'public',
  'YemekSepetiDapp': 'public',
  'Software-Persona-JS-Project': 'public',
  'ReZero-2D-Game': 'private',
  'bkaankaya.github.io': 'public',
}

test('every verified GitHub repository has exactly one project, including T2 and the portfolio', () => {
  assert.equal(projects.length, 13)
  assert.deepEqual(projects.map(project => project.repository).sort(), Object.keys(expected).sort())
  assert.equal(new Set(projects.map(project => project.slug)).size, projects.length, 'Duplicate project slug')
  assert.equal(new Set(projects.map(project => project.repository)).size, projects.length, 'Duplicate repository mapping')
  for (const project of projects) {
    assert.match(project.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    assert.ok(project.title.trim().length > 2, `Missing title: ${project.repository}`)
    assert.ok(project.description.trim().length > 20, `Missing description: ${project.repository}`)
    assert.ok(project.details.trim().length > 40, `Missing details: ${project.repository}`)
  }
})

test('public projects link to their exact repository and private projects do not promise accessible source', () => {
  for (const project of projects) {
    assert.equal(project.sourceVisibility, expected[project.repository], project.repository)
    if (project.sourceVisibility === 'public') {
      assert.equal(project.sourceUrl, `https://github.com/bkaankaya/${project.repository}`, project.repository)
    } else assert.equal(project.sourceUrl, undefined, `Private source link exposed: ${project.repository}`)
  }
  const card = readFileSync('components/portfolio/project-card.tsx', 'utf8')
  assert.match(card, /project.sourceUrl\s*\?\s*<a\b[^>]*href=\{project.sourceUrl\}/)
  assert.match(card, /Private source/)
})

test('every project category is reachable through the complete filter set', () => {
  assert.deepEqual(filters, ['All', 'AI', 'Full-stack', 'Frontend', 'Embedded', 'Research', 'Blockchain', 'Games'])
  assert.equal(new Set(filters).size, filters.length)
  for (const project of projects) {
    assert.ok(project.categories.includes(project.category), `Primary category missing from filters: ${project.slug}`)
    assert.equal(new Set(project.categories).size, project.categories.length, `Repeated category: ${project.slug}`)
    for (const category of project.categories) assert.ok(category !== 'All' && filters.includes(category), `${project.slug}: ${category}`)
  }
  for (const filter of filters.slice(1)) assert.ok(projects.some(project => project.categories.includes(filter)), `Empty category: ${filter}`)
})

test('all projects have distinct, local preview paths with matching accessible descriptions and provenance', () => {
  const badges = new Set(projects.map(project => project.logo).filter(Boolean))
  for (const project of projects) {
    const gallery = project.gallery
    assert.ok(Array.isArray(gallery) && gallery.length >= 2, `Fewer than two previews: ${project.slug}`)
    assert.equal(new Set(gallery).size, gallery.length, `Repeated preview path: ${project.slug}`)
    assert.equal(project.image, gallery[0], `Cover is not the first gallery frame: ${project.slug}`)
    assert.equal(project.galleryAlts?.length, gallery.length, `Missing frame descriptions: ${project.slug}`)
    assert.equal(new Set(project.galleryAlts).size, gallery.length, `Indistinguishable frame descriptions: ${project.slug}`)
    assert.ok(['screenshot', 'concept', 'visualization'].includes(project.visualType), `Undeclared media provenance: ${project.slug}`)
    assert.ok(project.mediaNote?.length > 15, `Missing media source note: ${project.slug}`)
    for (const [index, path] of gallery.entries()) {
      assert.match(path, /^\/projects\/[a-z0-9/_-]+\.(?:png|webp|jpe?g)$/i, `Non-local or invalid media path: ${project.slug}`)
      assert.equal(posix.normalize(path), path, `Noncanonical media path: ${project.slug}`)
      assert.ok(!badges.has(path), `Logo used as product imagery: ${project.slug}`)
      assert.doesNotMatch(path, /(?:^|[-_/])(?:logo|brand|mark)(?=[-_.\/]|$)/i, `Identity file used as preview: ${project.slug}`)
      assert.ok(project.galleryAlts[index].trim().length >= 15, `Uninformative image description: ${project.slug}/${index}`)
    }
    if (project.visualType === 'concept') assert.match(project.mediaNote, /concept|design|representative/i, `Unlabeled concept: ${project.slug}`)
  }
})

test('every referenced preview exists, decodes as a sufficiently sized image, and contains different bytes', async () => {
  const paths = [...new Set(projects.flatMap(project => project.gallery))]
  const media = availableMedia(paths)
  try {
    const missing = paths.filter(path => !existsSync(media.file(path)))
    assert.deepEqual(missing, [], 'Missing preview assets; generate them before publishing')
    const require = createRequire(import.meta.url)
    const sharp = createRequire(require.resolve('next/package.json'))('sharp')
    const digests = new Map()
    for (const path of paths) {
      const bytes = readFileSync(media.file(path))
      const info = await sharp(bytes).metadata()
      assert.ok(info.width >= 320 && info.height >= 180, `Preview is too small: ${path} (${info.width}×${info.height})`)
      assert.ok(['png', 'jpeg', 'webp'].includes(info.format), `Unsupported preview format: ${path}`)
      assert.ok(bytes.length > 4000, `Preview is empty or an icon-sized placeholder: ${path}`)
      const pixels = await sharp(bytes).stats()
      assert.ok(pixels.channels.some(channel => channel.stdev > 1), `Preview contains no visible content: ${path}`)
      digests.set(path, createHash('sha256').update(bytes).digest('hex'))
    }
    for (const project of projects) {
      assert.equal(new Set(project.gallery.map(path => digests.get(path))).size, project.gallery.length, `Different filenames contain duplicate images: ${project.slug}`)
    }
  } finally {
    media.cleanup()
  }
})

const builtArchive = 'out/projects/index.html'
const publishedTest = existsSync('out') || process.env.REQUIRE_OUT === '1' ? test : test.skip
publishedTest('the exported Projects page contains all 13 cards and all gallery files are published', () => {
  assert.ok(existsSync(builtArchive), 'Build the complete project archive before publishing')
  const html = readFileSync(builtArchive, 'utf8')
  const visibleSlugs = [...html.matchAll(/<article\b[^>]*\bdata-project="([^"]+)"/g)].map(match => match[1])
  assert.deepEqual(visibleSlugs.sort(), projects.map(project => project.slug).sort(), 'Exported archive omitted or duplicated projects')
  const missing = [...new Set(projects.flatMap(project => project.gallery))].filter(path => !existsSync(`out${path}`))
  assert.deepEqual(missing, [], 'Referenced gallery assets were not copied into the published output')
})
