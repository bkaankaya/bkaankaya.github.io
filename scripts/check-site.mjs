import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = file => readFileSync(join(root, file), 'utf8');
const page = read('index.html');
const css = read('assets/styles.css');
const js = read('assets/main.js');
const projectNames = readdirSync(join(root, 'projects'), { withFileTypes: true })
  .filter(entry => entry.isDirectory()).map(entry => entry.name).sort();

assert.equal(projectNames.length, 12, 'All 12 existing project directories must be present');
assert.match(page, /TED University/, 'Do not rewrite the published education claim');
assert.match(page, /minor in Business Administration/, 'Preserve the existing education context');
assert.match(page, /<img[^>]+class="portrait-photo"[^>]+width="280"[^>]+height="350"/, 'Reserve hero image aspect ratio');
assert.match(page, /<meta name="viewport" content="width=device-width, initial-scale=1">/);
assert.match(page, /id="filter-count"[^>]+aria-live="polite"/);
assert.equal((page.match(/data-category-card=/g) || []).length, 16,
  'Keep four featured entries and twelve project-library entries');

function checkPage(relativePath) {
  const html = read(relativePath);
  assert.match(html, /<html lang="en">/, relativePath + ': language declaration missing');
  assert.match(html, /<main id="main">/, relativePath + ': main landmark missing');
  assert.match(html, /href="#main" class="skip"/, relativePath + ': skip link missing');
  assert.equal((html.match(/<h1(?:\\s|>)/g) || []).length, 1, relativePath + ': exactly one h1 required');
  assert.match(html, /<title>[^<]+<\/title>/, relativePath + ': page title missing');
  assert.match(html, /name="description"/, relativePath + ': description missing');
  for (const match of html.matchAll(/href="(\/[^"]+)"/g)) {
    const route = match[1].split(/[?#]/)[0];
    if (!route || route === '/') continue;
    const target = route.endsWith('/') ? join(root, route, 'index.html') : join(root, route);
    assert.ok(existsSync(target), relativePath + ': broken internal URL ' + match[1]);
  }
}

checkPage('index.html');
for (const slug of projectNames) {
  assert.ok(page.includes('href="/projects/' + slug + '/"'), 'Project missing from homepage: ' + slug);
  checkPage('projects/' + slug + '/index.html');
}

for (const marker of [
  ':root[data-theme="dark"]', 'prefers-reduced-motion', 'focus-visible',
  '.menu-toggle', '.topnav', '.project-grid', '.case-article',
  '.portrait-photo', '--space-4', 'max-width: 600px',
]) assert.ok(css.includes(marker), 'Missing design-system contract: ' + marker);

for (const marker of [
  'js-enhanced', 'nav-open', 'aria-expanded', 'Escape',
  'history.pushState', 'popstate', 'aria-pressed', 'localStorage',
]) assert.ok(js.includes(marker), 'Missing behavior contract: ' + marker);

assert.ok(!/<script[^>]+src="https?:\/\//i.test(page), 'No external script/CDN is needed');
assert.ok(!/transition:\s*all\b/i.test(css), 'Do not animate every CSS property');

let braces = 0;
const styles = css.replace(/\/\*[\s\S]*?\*\//g, '');
for (const character of styles) {
  if (character === '{') braces++;
  if (character === '}') braces--;
  assert.ok(braces >= 0, 'Unexpected closing CSS brace');
}
assert.equal(braces, 0, 'CSS braces are unbalanced');

console.log('PASS: 13 pages, 12 project routes, truthful education copy, accessible UI contracts, stable internal links, and dependency-free styles.');
