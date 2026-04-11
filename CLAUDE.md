<!-- GSD:project-start source:PROJECT.md -->
## Project

**Multitool**

A retro-styled web utility site that bundles text conversion and encoding tools into a single page. Users pick a tool, type or paste text into either of two side-by-side fields, and click a button to convert/encode/decode. The aesthetic is green-phosphor CRT terminal — built for anyone who regularly needs quick keyboard layout conversion or text encoding.

**Core Value:** Instant, no-fuss text conversion between keyboard layouts and common encodings in a single browser tab.

### Constraints

- **Tech stack**: Vanilla HTML/CSS/JS only — no frameworks, no transpilation, no bundlers
- **Code structure**: Each tool in its own JS file (ES modules). No spaghetti — clean separation between UI shell, tool registry, and individual converter logic.
- **Deployment**: Must work as static files — no server-side logic
- **Browser support**: Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
### Core Technologies
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| HTML5 | Living Standard | Page structure, semantic markup | Native `<textarea>` elements handle all text input needs; no components needed. `<template>` element useful if dynamically rendering tool UI. |
| CSS3 | Living Standard | CRT retro aesthetic, layout, animations | CSS custom properties for theming, `@keyframes` for scanline/flicker effects, Flexbox for side-by-side panel layout, `@font-face` for monospace terminal font. No preprocessor needed at this scale. |
| Vanilla JavaScript | ES2020+ | All conversion logic, DOM manipulation, clipboard interaction | Every encoding/decoding operation this project needs is built into the browser. Zero libraries required. ES modules (`type="module"`) provide clean file organization without a bundler. |
### Browser APIs (the real "stack")
| API | Baseline Since | Purpose | Why This API |
|-----|---------------|---------|--------------|
| `encodeURIComponent()` / `decodeURIComponent()` | July 2015 | URL/percent encoding & decoding | Native UTF-8 handling. Handles all Unicode correctly out of the box. This is the standard approach — no library needed. |
| `btoa()` / `atob()` + `TextEncoder` / `TextDecoder` | Jan 2020 | Base64 encoding & decoding with UTF-8 support | `btoa()`/`atob()` alone only handle Latin-1. For UTF-8 (required for Cyrillic), pipe through `TextEncoder`/`TextDecoder` first. MDN documents this exact pattern. |
| `navigator.clipboard.writeText()` | March 2020 | Copy-to-clipboard | Async Clipboard API is the modern standard. Requires secure context (HTTPS or localhost). Fallback to `document.execCommand('copy')` not needed — target is modern evergreen browsers. |
| `document.querySelector()` / `addEventListener()` | Baseline | DOM manipulation, event handling | Standard DOM API. No jQuery, no virtual DOM. For 6-8 interactive elements, direct DOM access is simpler and faster. |
### CRT Aesthetic Technologies
| Technology | Purpose | Why This Approach |
|------------|---------|-------------------|
| CSS Custom Properties (`--var`) | Color theming (green phosphor palette) | Define `--crt-green`, `--crt-dark`, `--crt-glow` once, reference everywhere. Easy to tweak or add alternate color schemes later. |
| CSS `@keyframes` | Scanline animation, subtle flicker | Pure CSS animations for scanline overlay and screen flicker. No JS animation library needed. `will-change` and `pointer-events: none` on overlay to avoid performance/interaction issues. |
| CSS `text-shadow` / `box-shadow` | Phosphor glow effect | Multiple `text-shadow` layers with green tones create convincing phosphor bloom. `box-shadow` with `inset` for CRT screen edge vignette. |
| CSS `background: repeating-linear-gradient()` | Scanline overlay | 1-2px alternating transparent/semi-transparent lines create scanline effect. Apply to a `::after` pseudo-element on the container. |
| `@font-face` with WOFF2 | Monospace terminal font | Self-host a monospace font (e.g., VT323 from Google Fonts, or IBM Plex Mono). WOFF2 is the correct format — best compression, universal modern browser support. Use `font-display: swap` to avoid FOIT. |
| CSS `border-radius` | CRT screen curvature | Subtle `border-radius` on the main container simulates CRT screen edge curvature. |
### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **None** | — | — | This project should use zero external libraries. Every feature maps to a browser built-in. Adding dependencies to a vanilla project adds complexity, loading time, and maintenance burden with zero benefit at this scope. |
### Development Tools
| Tool | Purpose | Notes |
|------|---------|-------|
| Any modern browser DevTools | Debugging, CSS inspection, Console | Chrome DevTools or Firefox DevTools. No special setup needed. |
| Local HTTP server | Development serving | `python3 -m http.server 8000` or VS Code Live Server extension. Needed because Clipboard API requires secure context (localhost counts). Also needed if using ES modules (`type="module"`) which require HTTP, not `file://`. |
| Git | Version control | Standard. No special config. |
## Installation
# No installation needed. This is vanilla HTML/CSS/JS.
# Just create files and open in a browser.
# For development, serve locally (clipboard API needs localhost/HTTPS):
# or
## Alternatives Considered
| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Vanilla JS (ES modules) | React/Vue/Svelte | When the tool grows to 20+ interactive components with complex state. This project has ~3 tools sharing one layout — a framework would be pure overhead. |
| Vanilla CSS + Custom Properties | Tailwind CSS / CSS-in-JS | When working in a team with many developers who need consistent utility classes. Solo project with a specific aesthetic is better served by hand-crafted CSS. |
| `btoa()`/`atob()` + TextEncoder | `Uint8Array.toBase64()` / `Uint8Array.fromBase64()` | When targeting only the very latest browsers (Baseline September 2025). Too new as of April 2026 — many users on older browser versions won't have it. Stick with the `btoa`+`TextEncoder` pattern for now. Revisit in late 2026/2027. |
| Self-hosted WOFF2 font | Google Fonts CDN link | When you want zero external requests and full offline capability (which we do for a static utility tool). Download the font file, host it alongside the HTML. Avoids a third-party dependency and privacy concern. |
| `navigator.clipboard.writeText()` | `document.execCommand('copy')` | Never for this project. `execCommand('copy')` is deprecated. The async Clipboard API has been Baseline since March 2020. |
| CSS `::after` pseudo-element for scanlines | `<canvas>` overlay | When you need dynamic/animated scanlines that respond to content. For a static repeating pattern, CSS pseudo-elements are simpler, cheaper to render, and don't require JS. |
| ES modules (`type="module"`) | Single `<script>` tag with everything | When the project exceeds ~200 lines of JS. Modules let you split converters into separate files (e.g., `layout-converter.js`, `base64-converter.js`, `url-converter.js`) without a bundler. Natively supported in all target browsers. |
## What NOT to Use
| Avoid | Why | Use Instead |
|-------|-----|-------------|
| jQuery | Massive download for zero benefit. `querySelector` and `addEventListener` do everything jQuery does in 2026. Adds 87KB+ for no reason. | Native DOM APIs |
| Build tools (Webpack, Vite, Parcel) | Project constraint is "no build step." Static files served directly. Build tools add complexity that contradicts the project's simplicity goal. | Serve files directly; use ES modules for code organization |
| CSS preprocessors (Sass, Less) | Adds a build step. CSS custom properties and nesting (now natively supported in all evergreen browsers) cover the two main reasons people used Sass. | Native CSS with custom properties and nesting |
| `localStorage` for state | Project is explicitly stateless — "no saved history." Adding persistence invites feature creep and complicates the UX. | Keep it stateless. Text fields clear on reload. |
| `Uint8Array.toBase64()` | Baseline only since September 2025. Not yet safe for general use — older evergreen browser versions still in circulation won't support it. | `btoa()`/`atob()` with `TextEncoder`/`TextDecoder` for UTF-8 handling |
| CDN-hosted libraries | Adds external dependencies, extra HTTP requests, potential privacy issues, and a point of failure for an offline-capable utility. | Self-host everything (it's just HTML, CSS, JS, and one font file) |
| TypeScript | Requires a build step to transpile. Violates the "no build tooling" constraint. The JS codebase will be ~300-500 lines — type safety adds overhead without proportional benefit. | Vanilla JS with JSDoc comments if type hints are desired |
| CSS frameworks (Bootstrap, Bulma) | The CRT aesthetic is custom by nature. A CSS framework would fight the design rather than help it, and adds unnecessary weight. | Hand-crafted CSS (it's a feature, not a limitation — you need full control for the CRT effect) |
## Stack Patterns by Variant
- Use ES modules — one JS file per converter, dynamically imported or statically loaded
- Each converter exports a standard interface: `{ encode(text), decode(text), label, buttons }`
- No architectural change needed; just add a new file and register it
- Add a `manifest.json` and a simple `service-worker.js`
- These are static files — no build step needed
- The self-hosted font and zero CDN dependencies make this trivial
- Use IBM Plex Mono (OFL license, excellent Cyrillic) or JetBrains Mono (OFL, excellent Cyrillic)
- VT323 has the best retro terminal look but LIMITED Cyrillic support — verify coverage before choosing
- For QWERTY↔ЙЦУКЕН converter, Cyrillic rendering is critical — font choice must support the full Russian alphabet
## Key Implementation Patterns
### UTF-8-Safe Base64 Encoding
### Clipboard Copy with Error Handling
## Version Compatibility
| Technology | Minimum Browser Version | Notes |
|------------|------------------------|-------|
| ES Modules (`type="module"`) | Chrome 61+, Firefox 60+, Safari 11+, Edge 16+ | All well within "modern evergreen" target. No polyfill needed. |
| Clipboard API (`writeText`) | Chrome 66+, Firefox 63+, Safari 13.1+, Edge 79+ | Requires HTTPS or localhost. All target browsers support it. |
| TextEncoder/TextDecoder | Chrome 38+, Firefox 19+, Safari 10.1+, Edge 79+ | Universal in evergreen browsers. |
| CSS Custom Properties | Chrome 49+, Firefox 31+, Safari 9.1+, Edge 15+ | Universal in evergreen browsers. |
| CSS Nesting | Chrome 120+, Firefox 117+, Safari 17.2+, Edge 120+ | Newly available. Use if targeting only very recent browsers, otherwise stick with flat selectors. |
| `btoa()`/`atob()` | All browsers since July 2015 | Universal. |
| `encodeURIComponent()` | All browsers since July 2015 | Universal. |
## Sources
- MDN Web Docs — `Clipboard.writeText()` (verified 2025-11-30): Baseline Widely available since March 2020, secure context required — HIGH confidence
- MDN Web Docs — `TextEncoder` (verified 2025-06-28): Baseline Widely available since January 2020, always UTF-8 — HIGH confidence
- MDN Web Docs — `Window.btoa()` (verified 2025-06-24): Baseline since July 2015. Documents exact `TextEncoder`→`btoa` pattern for Unicode — HIGH confidence
- MDN Web Docs — `encodeURIComponent()` (verified 2025-10-30): Baseline since July 2015, handles UTF-8 natively — HIGH confidence
- MDN Web Docs — `Uint8Array.prototype.toBase64()` (verified 2025-07-10): Baseline 2025 "Newly available" since September 2025 — HIGH confidence (too new to adopt)
- MDN Web Docs — `@font-face` (verified 2026-01-29): WOFF2 recommended for web delivery — HIGH confidence
- Can I Use — Clipboard API: 97%+ global support — HIGH confidence
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
