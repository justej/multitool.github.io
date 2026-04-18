/**
 * build.js — Multitool static build script
 *
 * Produces dist/index.html: a single self-contained HTML file with
 * all JS modules concatenated inline and CSS with base64-embedded fonts.
 *
 * Node.js built-ins only — no npm dependencies.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

// --- Step 1: Inline CSS with base64 fonts ---

let css = fs.readFileSync(path.join(ROOT, 'style.css'), 'utf8');

const regularFont = fs.readFileSync(path.join(ROOT, 'fonts', 'JetBrainsMono-Regular.woff2'));
const boldFont    = fs.readFileSync(path.join(ROOT, 'fonts', 'JetBrainsMono-Bold.woff2'));

const regularB64 = regularFont.toString('base64');
const boldB64    = boldFont.toString('base64');

css = css.replace(
  "url('fonts/JetBrainsMono-Regular.woff2')",
  `url('data:font/woff2;base64,${regularB64}')`
);
css = css.replace(
  "url('fonts/JetBrainsMono-Bold.woff2')",
  `url('data:font/woff2;base64,${boldB64}')`
);

// --- Step 2: Concatenate JS modules in dependency order ---

const jsFiles = [
  'tools/keyboard.js',
  'tools/base64.js',
  'tools/url.js',
  'registry.js',
  'ui.js',
  'app.js',
];

const jsChunks = jsFiles.map(relPath => {
  let src = fs.readFileSync(path.join(ROOT, relPath), 'utf8');

  // Remove import statements
  src = src.split('\n').filter(line => !/^\s*import\s+/.test(line)).join('\n');

  // Remove export keyword from declarations, keep the declaration itself
  src = src.replace(/\bexport\s+(const|function|class|let|var)\b/g, '$1');

  // Remove bare "export default ..." lines
  src = src.replace(/^export\s+default\s+.*$/gm, '');

  return `// --- ${relPath} ---\n${src}`;
});

const concatenatedJS = jsChunks.join('\n\n');

// --- Step 3: Build output HTML ---

let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

// Replace stylesheet link with inline style block
html = html.replace(
  '<link rel="stylesheet" href="style.css">',
  `<style>\n${css}\n</style>`
);

// Replace module script tag with inline script block
html = html.replace(
  '<script type="module" src="app.js"></script>',
  `<script type="module">\n${concatenatedJS}\n</script>`
);

// --- Write output ---

fs.mkdirSync(path.join(ROOT, 'dist'), { recursive: true });
const outPath = path.join(ROOT, 'dist', 'index.html');
fs.writeFileSync(outPath, html, 'utf8');

const bytes = fs.statSync(outPath).size;
console.log(`✓ Built dist/index.html (${bytes} bytes)`);
