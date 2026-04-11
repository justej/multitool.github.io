# Project Research Summary

**Project:** Multitool — Text Conversion/Encoding Web Utility
**Domain:** Client-side text conversion web tool (keyboard layout mapping, URL encoding, Base64)
**Researched:** 2026-04-11
**Confidence:** HIGH

## Executive Summary

Multitool is a focused, retro-styled, single-page web tool combining QWERTY↔ЙЦУКЕН keyboard layout conversion with Base64 and URL percent encoding/decoding. The competitive landscape is split between sprawling toolkits (CyberChef with 300+ operations, CodeBeautify with 500+ pages) and single-purpose converters (base64encode.org). Multitool occupies a genuine gap: a small, fast, zero-dependency utility that does 3 things perfectly under a memorable CRT terminal aesthetic. The QWERTY↔ЙЦУКЕН layout converter is the unique hook — translit.net dominates *phonetic* transliteration but layout-mistake fixing (you typed "ghbdtn" and meant "привет") is underserved on the web.

The recommended approach is vanilla HTML/CSS/JS with zero dependencies and no build step. Every conversion operation maps to a browser built-in API (`btoa`/`atob` + `TextEncoder` for Base64, `encodeURIComponent` for URL encoding, character map for keyboard layout). ES modules provide clean file organization without bundling. The architecture follows a Strategy pattern: a tool registry maps tool IDs to pure converter functions, and a single UI shell swaps behavior by switching the active tool reference. This means adding a new tool later requires touching exactly 2 files (the converter module + the registry).

The top risks are all in the conversion logic, not the infrastructure: (1) `btoa()` crashes on Cyrillic/emoji input without the TextEncoder wrapper — fatal for a tool that inherently handles Russian text; (2) the QWERTY↔ЙЦУКЕН map is easy to get 90% right (letters) but hard to get 100% right (punctuation, shifted symbols, Ё); (3) CRT visual effects can trigger motion sensitivity and must respect `prefers-reduced-motion` from day one; (4) `decodeURIComponent` throws on malformed input like `"100% done"` and needs error handling. All of these are preventable with correct implementation upfront — none require architectural changes, just discipline.

## Key Findings

### Recommended Stack

Zero external dependencies. The entire stack is browser APIs: `TextEncoder`/`TextDecoder` for UTF-8 handling, `btoa()`/`atob()` for Base64, `encodeURIComponent()`/`decodeURIComponent()` for URL encoding, `navigator.clipboard.writeText()` for copy, and CSS custom properties + `@keyframes` for the CRT aesthetic. ES modules (`type="module"`) provide code organization without a bundler.

**Core technologies:**
- **HTML5 + CSS3 + Vanilla JS (ES2020+):** No framework, no build step, no preprocessor. The project is ~500 lines of JS total — a framework would be pure overhead
- **ES Modules (native):** One `<script type="module">` entry point; converters in separate files under `tools/`. Supported in all evergreen browsers since 2018
- **Self-hosted WOFF2 font:** Monospace terminal font (IBM Plex Mono or JetBrains Mono for Cyrillic support). Self-hosted for offline capability and zero external requests
- **No libraries, no CDN, no build tools:** Every feature maps to a browser built-in. Self-contained static files deployable anywhere

**Critical version note:** Avoid `Uint8Array.toBase64()` — it's only Baseline since September 2025, too new for broad adoption. Stick with the `btoa` + `TextEncoder` pattern.

### Expected Features

**Must have (table stakes):**
- Copy-to-clipboard with visual feedback — every competitor has this
- Clear/reset button — users process multiple inputs per session
- Bidirectional conversion (encode & decode) — separate buttons per direction
- Correct UTF-8 handling — non-ASCII (Cyrillic, emoji) must work in Base64
- Generous, paste-friendly text areas — at least 8 visible lines
- Error handling on invalid input — clear inline messages, not console errors
- Tool selector/navigation — switch tools without reloading
- Client-side only (no server) — state explicitly for user trust

**Should have (differentiators):**
- QWERTY↔ЙЦУКЕН keyboard layout converter — the unique hook, no good web competitor
- Retro CRT aesthetic — phosphor green, scanlines, glow. No competitor uses this; makes the tool memorable
- Two editable side-by-side panels — more flexible than one-input/one-output
- Zero-dependency instant load — <100ms load vs CyberChef's 4MB bundle
- Keyboard shortcut (Ctrl+Enter) — small effort, big power-user win

**Defer (v2+):**
- Additional keyboard layouts (AZERTY, QWERTZ)
- Additional encodings (HTML entities, Hex, Unicode escape)
- Single-file downloadable version
- PWA/offline mode (trivial to add later given zero dependencies)
- Transliteration — never build this; translit.net owns the space

### Architecture Approach

Flat file structure with a Strategy pattern at the core. A single `index.html` shell contains two textareas, action buttons, and a tool selector nav. `app.js` is the entry point that wires event delegation, imports a tool registry, and coordinates UI updates. Each converter lives in `tools/*.js` as pure functions (`string → string`) with zero DOM awareness. The registry maps tool IDs to metadata (labels, button captions) and conversion function references. Switching tools swaps the active strategy — the UI shell, event wiring, and data flow remain identical for all tools.

**Major components:**
1. **HTML Shell (`index.html`)** — static layout: two textareas, action buttons, tool selector nav, copy/clear utilities
2. **CSS Theme (`style.css`)** — CRT retro aesthetic via custom properties, scanline overlay, text-shadow glow, monospace font
3. **App Entry (`app.js`)** — bootstraps event listeners, initializes default tool, coordinates components
4. **Tool Registry (`registry.js`)** — maps tool IDs to converter functions and UI metadata; the only file that imports tool modules
5. **Converter Modules (`tools/*.js`)** — pure functions: `keyboard.js`, `percent.js`, `base64.js`. No DOM, no state, no side effects
6. **UI Manager (`ui.js`)** — DOM manipulation helpers for tool switching (swap labels, active states, clear fields)
7. **Clipboard Helper (`clipboard.js`)** — thin wrapper around `navigator.clipboard.writeText()` with fallback and feedback

**Key architectural rule:** Dependencies flow inward. Tool modules never import from app/UI/registry. Adding a new tool = create `tools/newtool.js` + add registry entry. No other files touched.

### Critical Pitfalls

1. **`btoa()` crashes on Cyrillic/emoji** — Must use `TextEncoder`→`btoa` pattern from day one. Never expose raw `btoa()` to user input. Test with `"Привет 🌍"`, not just `"Hello"`.
2. **Incomplete QWERTY↔ЙЦУКЕН map** — Target Microsoft Windows layout specifically. Map ALL keys including punctuation and shifted symbols (not just 33 letters). Include Ё. Characters with no counterpart pass through unchanged.
3. **CRT effects trigger motion sensitivity** — Respect `prefers-reduced-motion: reduce` from the first CSS file. No flashing above 3Hz. Ensure green-on-dark meets WCAG AA contrast (4.5:1). Layer effects on top of a readable base.
4. **`decodeURIComponent` throws on malformed input** — Always wrap in try/catch. `"100% done"` and `"hello+world"` are realistic test cases. Display clear inline errors.
5. **Clipboard fails outside secure context** — Handle promise rejection, show visual feedback ("Copied!" / "Copy failed"), add `execCommand('copy')` fallback for non-HTTPS. Deploy to HTTPS from the start.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation — HTML Shell + CRT Theme + First Converter
**Rationale:** Architecture research shows building one tool end-to-end first validates the entire registry/strategy pattern before investing in remaining tools. The keyboard layout converter is the unique differentiator and the hardest converter to get right (complete character map), so it should be first.
**Delivers:** Working single-page app with CRT aesthetic, two-panel layout, tool selector nav, and fully functional QWERTY↔ЙЦУКЕН conversion.
**Addresses:** Two-panel layout, tool switching shell, CRT styling, QWERTY↔ЙЦУКЕН converter, `prefers-reduced-motion` support
**Avoids:** Pitfall #2 (incomplete keyboard map — build complete map from keyboard image), Pitfall #3 (CRT accessibility — implement `prefers-reduced-motion` from first CSS), Pitfall (XSS — use `textContent`/`value` only, never `innerHTML`)

### Phase 2: Remaining Converters + Error Handling
**Rationale:** With the shell validated, adding Base64 and URL encoding is plugging pure functions into the existing registry. These tools have the most dangerous pitfalls (Unicode crashes, malformed input throws) so they need careful error handling built in from the start.
**Delivers:** All 3 conversion tools working with robust error handling and inline error display.
**Addresses:** Base64 encode/decode with UTF-8 handling, URL percent encode/decode, error handling for invalid input
**Avoids:** Pitfall #1 (btoa crashes on Cyrillic — use TextEncoder wrapper), Pitfall #4 (decodeURIComponent throws — wrap in try/catch with user-facing errors)

### Phase 3: Utility Features + Polish
**Rationale:** Copy-to-clipboard and clear buttons are table stakes but independent of which tool is active. Keyboard shortcuts are a small effort power-user win. This phase completes the MVP feature set.
**Delivers:** Copy-to-clipboard with visual feedback and fallback, clear buttons, keyboard shortcut (Ctrl+Enter), responsive layout for mobile viewports.
**Addresses:** Copy-to-clipboard, clear/reset, keyboard shortcut, responsive CSS, privacy notice ("all processing is client-side")
**Avoids:** Pitfall #5 (clipboard fails silently — handle rejection, add fallback, show feedback)

### Phase Ordering Rationale

- **Phase 1 before Phase 2:** Architecture research explicitly recommends building one tool end-to-end to validate the registry contract before adding more tools. The keyboard converter is chosen first because it's the differentiator AND the hardest to get right (complete character map).
- **Phase 2 before Phase 3:** Converters are the core product; utility features are polish. Base64 and URL encoding depend on the shell from Phase 1 but are independent of clipboard/shortcuts.
- **CRT styling in Phase 1, not last:** The aesthetic IS the product identity. Building it last risks it being bolted on poorly. Research shows CRT effects must be layered on a readable base with `prefers-reduced-motion` from the start — this is easier to get right when it's built first.
- **Error handling with converters (Phase 2), not deferred:** Research identified that both Base64 and URL encoding have realistic crash scenarios with normal user input. Error handling isn't polish — it's core functionality for these tools.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1 (keyboard map):** The QWERTY↔ЙЦУКЕН character map requires referencing the exact Microsoft Windows layout image and mapping every key position including shifted symbols. The Wikipedia JCUKEN article has the layout diagram. This is tedious but well-documented.
- **Phase 1 (CRT font):** Font choice needs verification — VT323 has the best retro look but limited Cyrillic support. IBM Plex Mono or JetBrains Mono are safer for Cyrillic. May need to test actual font files.

Phases with standard patterns (skip research-phase):
- **Phase 2 (Base64 + URL encoding):** MDN documents the exact patterns needed. The `TextEncoder`→`btoa` pattern and `encodeURIComponent` usage are well-established. Copy the MDN pattern verbatim.
- **Phase 3 (clipboard + shortcuts):** Clipboard API and keyboard event handling are thoroughly documented. Standard patterns, no surprises.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All recommendations backed by MDN official docs with specific verification dates. Zero dependencies means zero compatibility risk. Browser API baseline dates confirmed. |
| Features | HIGH | Competitive landscape well-mapped across 8 competitors. Table stakes validated against real products. Differentiators are genuine (no direct competitor combines layout conversion + encoding with CRT aesthetic). |
| Architecture | HIGH | Pattern (Strategy/Registry) is textbook for this use case. Build order validated by dependency analysis. File structure is minimal and justified. |
| Pitfalls | HIGH | Every pitfall verified against MDN documentation with specific error behaviors. Real test cases provided. The `btoa` Unicode issue and incomplete keyboard map are the most common mistakes in this exact domain. |

**Overall confidence:** HIGH

### Gaps to Address

- **Font choice for Cyrillic:** VT323 vs IBM Plex Mono vs JetBrains Mono needs hands-on testing with actual Russian text rendering. Research identified the tradeoff (retro look vs Cyrillic coverage) but the final choice requires visual comparison.
- **`+` handling in URL decode:** `decodeURIComponent` does NOT decode `+` as space, but users expect it for form-encoded strings. Need a product decision: add a mode toggle, silently handle it, or document the behavior. Recommend: decode `+` as space by default (matches user expectations) with a note in the UI.
- **CSS nesting support:** Available in latest browsers (Chrome 120+, Firefox 117+, Safari 17.2+) but newer than other APIs used. If targeting slightly older browsers, use flat selectors. Low-risk gap — flat CSS works fine.

## Sources

### Primary (HIGH confidence)
- MDN Web Docs — `Window.btoa()`, `TextEncoder`, `encodeURIComponent()`, `Clipboard.writeText()`, `@font-face`, JavaScript Modules (all verified 2025-2026)
- Can I Use — Clipboard API: 97%+ global support
- WCAG 2.1 Success Criterion 2.3.1 — flashing content threshold
- Wikipedia JCUKEN article — Microsoft, Apple, Typewriter layout variants with keyboard images

### Secondary (MEDIUM confidence)
- Competitor analysis: CyberChef, base64encode.org, CodeBeautify, IT Tools, cryptii, translit.net, Punto Switcher — feature sets and UX patterns observed directly

### Tertiary (LOW confidence)
- None — all findings backed by primary or secondary sources

---
*Research completed: 2026-04-11*
*Ready for roadmap: yes*
