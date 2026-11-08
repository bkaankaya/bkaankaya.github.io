// Source/pure metadata checks. REQUIRE_OUT=1 adds checks of a freshly built export;
// the default never treats an existing, possibly stale out/ as current evidence.
import assert from "node:assert/strict"
import { existsSync, readFileSync, readdirSync } from "node:fs"
import { dirname, relative } from "node:path"
import { test } from "node:test"
import { runInNewContext } from "node:vm"
import ts from "typescript"

const read = (path) => readFileSync(path, "utf8")
const expectedPaths = ["/", "/projects/", "/experience/", "/education/", "/about/", "/contact/"]
const expectedOrigin = "https://bkaankaya.github.io"
const helperPath = "lib/portfolio-metadata.ts"
const helperImport = "@/lib/portfolio-metadata"
const loadedPaths = []

function loadModule(path, dependencies = {}) {
  loadedPaths.push(path)
  const result = ts.transpileModule(read(path), {
    fileName: path,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    reportDiagnostics: true,
  })
  assert.deepEqual(result.diagnostics, [], path)
  const exports = {}
  runInNewContext(result.outputText, {
    exports,
    URL,
    require: (name) => {
      assert.ok(Object.hasOwn(dependencies, name), `Unexpected import ${name} in ${path}`)
      return dependencies[name]
    },
  }, { filename: path, timeout: 1000 })
  return exports
}

const helper = loadModule(helperPath)
const sitemap = loadModule("app/sitemap.ts", { [helperImport]: helper })
const robots = loadModule("app/robots.ts", { [helperImport]: helper })

function files(directory, pattern) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = `${directory}/${entry.name}`
    return entry.isDirectory() ? files(path, pattern) : pattern.test(entry.name) ? [path] : []
  })
}

function exportedInitializer(path, name) {
  const source = ts.createSourceFile(path, read(path), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  assert.deepEqual(source.parseDiagnostics, [], path)
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement) || !statement.modifiers?.some((item) => item.kind === ts.SyntaxKind.ExportKeyword)) continue
    const declaration = statement.declarationList.declarations.find((item) => item.name.getText(source) === name)
    if (declaration?.initializer) return declaration.initializer
  }
  assert.fail(`Missing exported ${name} in ${path}`)
}

test("metadata inventory matches the six real portfolio routes and each page uses its own path", () => {
  const pageFiles = files("app/(portfolio)", /^page\.tsx$/)
  const paths = pageFiles.map((path) => {
    const folder = relative("app/(portfolio)", dirname(path)).split("\\").join("/")
    const route = folder ? `/${folder}/` : "/"
    const value = exportedInitializer(path, "metadata")
    assert.ok(ts.isCallExpression(value) && value.expression.getText() === "portfolioPageMetadata", path)
    assert.equal(value.arguments.length, 1, path)
    assert.ok(ts.isStringLiteral(value.arguments[0]), path)
    assert.equal(value.arguments[0].text, route, `Metadata points at the wrong route: ${path}`)
    assert.match(read(path), /import\s*\{\s*portfolioPageMetadata\s*\}\s*from\s*"@\/lib\/portfolio-metadata"/)
    return route
  })
  assert.deepEqual(paths.sort(), [...expectedPaths].sort())
  assert.deepEqual(Object.keys(helper.portfolioPages).sort(), [...expectedPaths].sort())
  const root = exportedInitializer("app/layout.tsx", "metadata")
  assert.ok(ts.isObjectLiteralExpression(root))
  const base = root.properties.find((property) => property.name?.getText() === "metadataBase")
  assert.equal(base?.initializer?.getText(), "new URL(portfolioOrigin)")
  // Avoid passing homepage canonical/social URL metadata to the built-in 404.
  for (const property of root.properties) assert.ok(!["alternates", "openGraph"].includes(property.name?.getText()))
})

test("every page has its own absolute canonical and complete matching Open Graph metadata", () => {
  assert.equal(helper.portfolioOrigin, expectedOrigin)
  const titles = new Set()
  for (const path of expectedPaths) {
    const metadata = helper.portfolioPageMetadata(path)
    const expectedUrl = `${expectedOrigin}${path}`
    assert.equal(metadata.alternates.canonical, expectedUrl, path)
    assert.equal(metadata.openGraph.url, expectedUrl, path)
    assert.equal(metadata.title, helper.portfolioPages[path].title, path)
    assert.equal(metadata.description, helper.portfolioPages[path].description, path)
    assert.equal(metadata.openGraph.title, metadata.title, path)
    assert.equal(metadata.openGraph.description, metadata.description, path)
    assert.equal(metadata.openGraph.type, "website", path)
    assert.ok(metadata.description.length > 40, path)
    const [image] = metadata.openGraph.images
    assert.equal(image.url, "/portrait-kaan.webp")
    assert.equal(image.width, 520)
    assert.equal(image.height, 520)
    assert.equal(image.alt, "Portrait of Bertan Kaan Kaya")
    assert.ok(existsSync(`public${image.url}`))
    titles.add(metadata.title)
  }
  assert.equal(titles.size, expectedPaths.length)
})

test("sitemap and robots are deterministic static metadata routes on the portfolio origin", () => {
  for (const path of ["app/sitemap.ts", "app/robots.ts"]) {
    const dynamic = exportedInitializer(path, "dynamic")
    assert.ok(ts.isStringLiteral(dynamic))
    assert.equal(dynamic.text, "force-static", path)
  }
  assert.deepEqual(Array.from(sitemap.default(), (item) => item.url), expectedPaths.map((path) => `${expectedOrigin}${path}`))
  assert.equal(JSON.stringify(sitemap.default()), JSON.stringify(sitemap.default()))
  for (const item of sitemap.default()) assert.deepEqual(Object.keys(item), ["url"], "Do not invent last-modified dates")
  const rules = robots.default()
  assert.equal(rules.rules.userAgent, "*")
  assert.equal(rules.rules.allow, "/")
  assert.equal(rules.sitemap, `${expectedOrigin}/sitemap.xml`)
  assert.equal(loadedPaths.length, 3, "Only reviewed pure metadata modules should execute")
})

test("literal internal links target existing routes and the shared skip-link target survives", () => {
  const routeSet = new Set(expectedPaths)
  for (const path of [...files("app", /\.tsx$/), ...files("components", /\.tsx$/)]) {
    for (const match of read(path).matchAll(/\bhref=["'](\/[^"']*)["']/g)) {
      const url = new URL(match[1], expectedOrigin)
      const normalized = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`
      assert.ok(routeSet.has(normalized), `Unknown internal route ${match[1]} in ${path}`)
      assert.equal(url.hash, "", `Review literal fragment target in ${path}`)
    }
  }
  assert.match(read("components/portfolio/portfolio-shell.tsx"), /href="#main-content"/)
  assert.match(read("components/portfolio/home-page.tsx"), /<main\b[^>]*id="main-content"/)
  for (const path of files("app/(portfolio)", /^page\.tsx$/).filter((path) => path !== "app/(portfolio)/page.tsx")) {
    assert.match(read(path), /<main\b[^>]*id="main-content"/, path)
  }
})

function decode(value) {
  return value.replace(/&(?:amp|quot|apos|lt|gt|#\d+|#x[\da-f]+);/gi, (entity) => {
    const named = { "&amp;": "&", "&quot;": '"', "&apos;": "'", "&lt;": "<", "&gt;": ">" }
    if (named[entity]) return named[entity]
    return String.fromCodePoint(Number.parseInt(entity.slice(entity[2].toLowerCase() === "x" ? 3 : 2, -1), entity[2].toLowerCase() === "x" ? 16 : 10))
  })
}

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)=["']([^"']*)["']/g)].map((match) => [match[1], decode(match[2])]))
}

const artifactTest = process.env.REQUIRE_OUT === "1" ? test : test.skip
artifactTest("fresh export contains route-specific canonical/social tags, sitemap, robots and a noindex 404", () => {
  for (const path of expectedPaths) {
    const html = read(`out${path}index.html`)
    const metadata = helper.portfolioPageMetadata(path)
    assert.equal(decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? ""), metadata.title, path)
    const links = (html.match(/<link\b[^>]*>/g) ?? []).map(attributes)
    assert.deepEqual(links.filter((link) => link.rel === "canonical").map((link) => link.href), [metadata.alternates.canonical], path)
    const meta = (html.match(/<meta\b[^>]*>/g) ?? []).map(attributes)
    for (const [property, expected] of [["og:url", metadata.openGraph.url], ["og:title", metadata.title], ["og:description", metadata.description], ["og:image", `${expectedOrigin}/portrait-kaan.webp`]]) {
      assert.deepEqual(meta.filter((item) => item.property === property).map((item) => item.content), [expected], `${path}: ${property}`)
    }
    assert.deepEqual(meta.filter((item) => item.name === "description").map((item) => item.content), [metadata.description], path)
  }
  const locations = [...read("out/sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decode(match[1]))
  assert.deepEqual(locations.sort(), expectedPaths.map((path) => `${expectedOrigin}${path}`).sort())
  assert.match(read("out/robots.txt"), /^Allow: \/\s*$/m)
  assert.match(read("out/robots.txt"), /^Sitemap: https:\/\/bkaankaya\.github\.io\/sitemap\.xml\s*$/m)
  const notFound = read("out/404.html")
  const notFoundMeta = (notFound.match(/<meta\b[^>]*>/g) ?? []).map(attributes)
  assert.ok(notFoundMeta.some((item) => item.name === "robots" && /\bnoindex\b/.test(item.content)))
  assert.ok(!(notFound.match(/<link\b[^>]*>/g) ?? []).map(attributes).some((link) => link.rel === "canonical"))
})
