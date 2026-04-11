# Pitfalls Research

**Domain:** Client-side text conversion/encoding web tool (keyboard layout mapping, percent encoding, Base64, CRT aesthetic)
**Researched:** 2026-04-11
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: `btoa()`/`atob()` Crash on Non-ASCII (Cyrillic, Emoji, CJK)

**What goes wrong:**
`btoa()` throws `InvalidCharacterError` (DOMException) when given any string containing characters with code points above `0xFF` (255). Since this tool handles Cyrillic text from the keyboard converter, a user who converts QWERTY to ЙЦУКЕН and then switches to Base64 encode will immediately hit this error. `btoa("Привет")` throws. `btoa("Hello")` works. This creates a confusing split where "some text works and some doesn't" with no explanation.

**Why it happens:**
`btoa()` was designed for binary strings where each character represents one byte. JavaScript strings are UTF-16, and Cyrillic characters (e.g., `П` = U+041F) exceed the single-byte limit. MDN explicitly documents this: "if a character's code point exceeds 0xFF, btoa will cause a 'Character Out Of Range' exception." This is the #1 most common Base64 bug in JavaScript web tools.

**How to avoid:**
Use `TextEncoder`/`TextDecoder` to round-trip through UTF-8 bytes before Base64 encoding/decoding. MDN's recommended pattern:

```javascript
// Encode: string -> UTF-8 bytes -> binary string -> Base64
function toBase64(str) {
  const bytes = new TextEncoder().encode(str);
  const binString = Array.from(bytes, (b) => String.fromCodePoint(b)).join("");
  return btoa(binString);
}

// Decode: Base64 -> binary string -> UTF-8 bytes -> string
function fromBase64(base64) {
  const binString = atob(base64);
  const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0));
  return new TextDecoder().decode(bytes);
}
```

Never use raw `btoa()`/`atob()` on user input.

**Warning signs:**
- Base64 works with "Hello World" in testing but crashes with non-English text
- No try/catch around encoding operations
- Tests only use ASCII strings

**Phase to address:**
Phase 1 (core conversion logic). This must be correct from the start — it's the core of the Base64 tool. Implement the UTF-8-safe wrapper functions as the only encoding path; never expose raw `btoa`/`atob` to user input.

**Confidence:** HIGH (verified via MDN official documentation, June 2025)

---

### Pitfall 2: Incomplete QWERTY <-> ЙЦУКЕН Character Map

**What goes wrong:**
The mapping table is incomplete or uses the wrong JCUKEN variant. Key issues:

1. **Microsoft vs Apple vs Typewriter layouts differ.** The standard Windows ЙЦУКЕН layout (since Windows 3.1, 1994) has different punctuation/symbol positions than the Apple layout or the Unix/Typewriter layout (GOST 6431-90). For example, the Ё key position, punctuation marks, and number-row shifted characters all differ between variants.

2. **Punctuation and symbols are missed.** Developers map the 33 Cyrillic letters to 26 Latin letters + some keys, but forget punctuation keys that differ: `.` `,` `;` `'` `[` `]` and their shifted variants (`<` `>` `:` `"` `{` `}`). On the Russian Windows layout, these keys produce different characters than their QWERTY equivalents.

3. **Characters that don't have a mapping.** Some QWERTY keys (like `@` `#` `$` `^` `&`) have no Cyrillic counterpart on the standard Russian layout — they're accessed via Shift+number. The reverse is also true: Ъ and Ё map to keys that produce `]` and `` ` `` on QWERTY, but the shifted versions differ.

4. **Case sensitivity ignored.** The mapping must handle both lowercase and uppercase independently, because the Shift-key mappings are not simply "capitalize the unshifted mapping." For example, Shift+3 on QWERTY is `#`, but Shift+3 on ЙЦУКЕН is `№` (numero sign).

**Why it happens:**
Developers find a basic 33-letter mapping table online, test with `"ghbdtn" -> "привет"`, declare it done, and miss the 15+ punctuation/symbol pairs that also need mapping. Also, there is no single authoritative "standard" — the Wikipedia JCUKEN article documents at least 3 Russian layout variants.

**How to avoid:**
- Target the **Microsoft Windows ЙЦУКЕН layout** specifically (most common by far). Document this choice.
- Build the map from the full keyboard image (all rows, all shift states), not just letters.
- Include the full set: 33 Cyrillic letters (lower + upper), digits (same on both), and all punctuation/symbol pairs for both unshifted and shifted states.
- Characters with no counterpart should pass through unchanged, not silently disappear or produce garbage.
- Test with a sentence that includes punctuation: `"Привет, мир! Как дела? №3."` round-trips correctly.

**Warning signs:**
- Mapping table only has ~33 entries (letters only, no punctuation)
- No Ё mapping (ё is commonly forgotten — Wikipedia even notes "Ё is often instinctively disregarded by JCUKEN users")
- Testing only with alphabetic strings, never with mixed punctuation
- No documentation of which layout variant is being targeted

**Phase to address:**
Phase 1 (core conversion logic). Build the complete mapping table before any UI work. Validate by mapping the entire keyboard layout image key-by-key.

**Confidence:** HIGH (verified via Wikipedia JCUKEN article showing Microsoft layout diagram, and domain knowledge of Russian keyboard)

---

### Pitfall 3: CRT Scanline/Flicker Effects Trigger Motion Sensitivity and Seizure Risk

**What goes wrong:**
CRT aesthetic effects — particularly animated scanlines, screen flicker, phosphor glow animations, and screen curvature distortions — can trigger vestibular disorders, migraines, and in extreme cases seizure disorders (photosensitive epilepsy). This isn't hypothetical: CSS animations that flash or flicker more than 3 times per second violate WCAG 2.1 Success Criterion 2.3.1. A scanline animation running at 60fps absolutely qualifies.

Additionally, the green-on-black color scheme creates a narrow contrast palette. If the green is too dim or the background too dark, text becomes unreadable. If the green is too bright with glow effects, it causes eye strain over extended use.

**Why it happens:**
CRT effects are built as pure visual polish early in development, without accessibility considerations. The developer tests on their own screen, finds it "cool," and ships it. `prefers-reduced-motion` media query support exists but is never implemented. The effects are baked directly into the base CSS rather than being layered on optionally.

**How to avoid:**
1. **Layer CRT effects on top of a readable base.** The page must be fully usable without any animations/effects. Start with readable green-on-dark text, then add effects.
2. **Respect `prefers-reduced-motion: reduce`.** Disable ALL animated effects (scanlines, flicker, glow pulses) when this media query matches. MDN confirms it's been baseline across all browsers since January 2020.
3. **No flashing above 3Hz.** If you animate a scanline, use a slow, subtle drift — not a rapid flicker.
4. **Ensure WCAG AA contrast ratio (4.5:1 minimum for text).** Test `#00ff00` on `#000000` — this actually passes (~5.8:1), but dimmer greens like `#00cc00` on `#0a0a0a` may not. Use a contrast checker.
5. **Keep glow/blur effects static or very slow.** A `text-shadow` glow is fine; animating its size/opacity rapidly is not.

**Warning signs:**
- No `@media (prefers-reduced-motion: reduce)` anywhere in CSS
- Scanline animation uses `animation-duration` under 2 seconds
- Green text color chosen "by eye" without contrast ratio verification
- Effects applied to the same elements as text content (instead of pseudo-elements or overlays)

**Phase to address:**
Phase 1 (layout/CSS). Implement `prefers-reduced-motion` support from the very first CSS file. Choose the green color with a contrast checker. Structure CSS so effects are in a separate layer that can be toggled off.

**Confidence:** HIGH (verified via MDN prefers-reduced-motion documentation, WCAG 2.1 standards)

---

### Pitfall 4: `decodeURIComponent` Throws on Malformed Percent Sequences

**What goes wrong:**
`decodeURIComponent()` throws a `URIError: URI malformed` when given invalid percent-encoded sequences. Common inputs that crash it:
- `%` not followed by two hex digits: `"100% done"` 
- Lone surrogates in percent form: `%ED%A0%80`
- Truncated sequences: `"%C3"` (incomplete UTF-8 multi-byte)
- Random percent signs in natural text: `"50% off"`

Users frequently paste arbitrary text (not just valid URLs) into the decode field. A tool that crashes on `"100%"` is broken for its core use case.

**Why it happens:**
Developers use raw `decodeURIComponent()` without wrapping it in error handling, assuming input will always be valid percent-encoded text. The corresponding `encodeURIComponent()` also throws on lone surrogates (strings containing `\uD800`-`\uDFFF` without a pair), though this is less common in practice.

**How to avoid:**
- **Always wrap `decodeURIComponent` in try/catch.** Display a clear error message ("Invalid percent-encoded input") rather than silently failing or crashing.
- **Consider `encodeURIComponent` edge cases:** It throws `URIError` on lone surrogates. Use `String.prototype.toWellFormed()` (baseline since 2024) to sanitize input before encoding, or catch and report the error.
- **Decide on `+` handling.** `decodeURIComponent` does NOT decode `+` to space. In `application/x-www-form-urlencoded` format (query strings), `+` means space. Users will expect `"hello+world"` to decode to `"hello world"`. Either add a checkbox/option for form-encoding mode, or document the behavior clearly.

**Warning signs:**
- No try/catch around decode operations
- Testing only with output from your own encode function (round-trip), never with arbitrary user input
- No handling for `+` as space
- No user-facing error messages, just console errors

**Phase to address:**
Phase 1 (core conversion logic). Every conversion function must have error handling from day one. Display errors in the UI, not just the console.

**Confidence:** HIGH (verified via MDN encodeURIComponent documentation, October 2025)

---

### Pitfall 5: `navigator.clipboard.writeText()` Fails Silently Outside Secure Context

**What goes wrong:**
The copy-to-clipboard feature breaks in two common scenarios:
1. **Not HTTPS.** `navigator.clipboard` requires a secure context (HTTPS or localhost). On plain HTTP (e.g., `file:///` protocol or HTTP hosting), the API is undefined or throws `NotAllowedError`.
2. **No user gesture.** The clipboard API requires a recent user activation (click/keypress). Programmatic copy without a user gesture is rejected.
3. **Tab not focused.** Some browsers reject clipboard writes when the tab is not in the foreground.

For a tool where "copy to clipboard" is a primary workflow action, this failing silently makes the tool feel broken.

**Why it happens:**
Developers test on `localhost` (which counts as secure context), everything works. Then they deploy to HTTP hosting or a user opens the file locally, and clipboard fails. The async nature of `navigator.clipboard.writeText()` means errors are swallowed in unhandled promise rejections.

**How to avoid:**
1. **Always handle the promise rejection.** Show a user-visible "Copied!" or "Copy failed" message.
2. **Fallback to `document.execCommand('copy')` for insecure contexts.** While deprecated, it still works in all major browsers and doesn't require HTTPS. The fallback pattern: create a temporary textarea, select its content, exec copy, remove the element.
3. **Deploy to HTTPS from the start.** GitHub Pages, Netlify, and Vercel all provide HTTPS by default.
4. **Bind copy to a click handler** (satisfies user gesture requirement).

**Warning signs:**
- Using `navigator.clipboard.writeText()` without `.catch()`
- No fallback for non-HTTPS environments
- No visual feedback after copy action
- Testing only on localhost

**Phase to address:**
Phase 1 (utility buttons). Implement clipboard with fallback and visual feedback from the start.

**Confidence:** HIGH (verified via MDN Clipboard.writeText documentation, November 2025)

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcoding the keyboard map as two parallel strings (`"qwerty..."` and `"йцукен..."`) | Quick to write, easy to read | Impossible to maintain — adding/fixing one char requires counting positions perfectly; no association between pairs is visible | Never — use an object/map from the start |
| Using raw `btoa()`/`atob()` directly | Works for ASCII testing | Crashes on any non-ASCII input; requires rewriting all call sites later | Never — wrap from the start |
| Putting all JS in one `<script>` block | No module system needed | Hard to test tools independently; all conversion logic is tangled with DOM manipulation | MVP only — split into functions early, even if in one file |
| Inline styles for CRT effects | Fast iteration | Can't be overridden by `prefers-reduced-motion` media query; hard to maintain | Never — use CSS classes |
| Using `document.execCommand('copy')` only | Works everywhere, no HTTPS needed | Deprecated API, could be removed; no async, blocks UI on large text | Only as fallback behind `navigator.clipboard` |

## Integration Gotchas

Common mistakes when connecting to browser APIs.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Clipboard API | Not handling promise rejection — copy silently fails | Always `.catch()` and show visual feedback; include `execCommand` fallback |
| `encodeURIComponent` | Assuming all input is valid UTF-16 — lone surrogates crash it | Use `String.prototype.isWellFormed()` to check, or wrap in try/catch |
| `btoa()`/`atob()` | Passing user text directly — crashes on non-ASCII | Always go through TextEncoder/TextDecoder for UTF-8 round-trip |
| CSS `@font-face` (monospace CRT font) | Loading a web font that delays rendering or FOUT | Use `font-display: swap` and a good system font fallback stack (`'Courier New', Courier, monospace`) |
| `textarea` event handling | Using `oninput` for live conversion (against requirements) | Use button click handlers only; store conversion state cleanly |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| CSS scanline overlay using `repeating-linear-gradient` on a massive element | Janky scrolling, high GPU paint time | Use a small tiling `background-image` or `::after` pseudo-element with `pointer-events: none` and fixed positioning | On lower-end devices or high-DPI displays |
| Converting very large text (100KB+) character by character in the keyboard mapper | UI freezes during conversion | Not a realistic concern for this tool's use case, but add a length warning if input exceeds ~50KB | 50KB+ input |
| CSS `text-shadow` glow on every character in a large text block | Extreme repaint cost; scrolling becomes sluggish | Apply glow only to headings/labels, not to the textarea content itself | Any textarea with 1000+ characters |
| CSS `filter: blur()` for CRT glow on the entire page | Full-page GPU composite on every frame | Apply filters only to small decorative elements, not the main content area | Any device with integrated GPU |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Interpreting HTML in converted output (using `innerHTML` to display results) | XSS — user pastes `<script>alert(1)</script>`, it gets base64-decoded and injected | Always use `textContent` or `value` (textarea) to display output — never `innerHTML` |
| Not sanitizing clipboard paste before conversion | Pasted content could contain invisible control characters (zero-width spaces, RTL overrides) that produce unexpected encoding output | Display input as-is in textarea (which is safe); document that control characters are preserved in encoding |
| Loading external fonts or resources from CDN without SRI | Supply chain attack — compromised CDN serves malicious font/script | For a no-build-step vanilla project, use system fonts or self-host. No external dependencies means no supply chain risk |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No visual feedback on copy | User clicks "Copy" but has no idea if it worked; pastes elsewhere and gets old clipboard content | Show a brief "Copied!" indicator (CSS transition, 1.5s) next to the button |
| Error messages only in console | User gets blank output or nothing happens; they assume the tool is broken | Display errors inline near the output field: "Error: Input contains invalid percent-encoded sequences" |
| Both fields editable but unclear which is source | User edits the "output" field, clicks "Encode", gets confused because it encodes from the wrong field | Label fields clearly ("Input" / "Output") or make bidirectional conversion explicit with separate "Encode" / "Decode" buttons pointing in clear directions |
| Tool selector links at bottom invisible on short viewports | Users never discover they can switch tools | Ensure tool selector is always visible — either sticky or within initial viewport |
| Monospace CRT font too small or too large | Unreadable on mobile or on large monitors | Use relative units (`rem`/`em`) and test at multiple viewport sizes |
| No clear button confirmation | User accidentally clears a large text they pasted | The "clear" action is destructive but low-stakes — a brief undo option is nice but not required; ensure the button is not adjacent to "copy" to prevent misclicks |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Base64 tool:** Works with "Hello World" — test with `"Привет 🌍"` (Cyrillic + emoji). Verify round-trip: encode then decode returns identical string.
- [ ] **Keyboard converter:** Maps letters — test with `"Ghbdtn? Rfr ltkf? №3"` (contains `?`, `,`, `№` and digits). Verify punctuation maps correctly in both directions.
- [ ] **Percent encoding:** Encodes and decodes — test with `"100% done"` (bare percent in decode), `"hello+world"` (plus sign), and `"Москва"` (Cyrillic in URL).
- [ ] **Copy button:** Works on localhost — test from a `file:///` URL and from deployed HTTPS. Verify visual feedback appears.
- [ ] **CRT effects:** Look great on your 4K monitor — test on a 768px-tall laptop, mobile viewport, and with `prefers-reduced-motion: reduce` enabled in DevTools.
- [ ] **Bidirectional fields:** Encode works — verify that editing the output field and clicking "Decode" also works correctly.
- [ ] **Error handling:** Happy path works — paste garbage into both fields for every tool and verify no uncaught exceptions in console.
- [ ] **Empty input:** Click "Encode" with empty fields — should produce empty output or a clear message, not an error.

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Incomplete keyboard map | LOW | Add missing pairs to the map object; no structural change needed |
| Raw `btoa`/`atob` used throughout | MEDIUM | Replace all `btoa`/`atob` calls with wrapper functions; test all code paths with non-ASCII |
| CRT effects baked into base CSS without motion query support | MEDIUM | Refactor effects into a `.crt-effects` class; add `@media (prefers-reduced-motion: reduce)` to disable; test visually |
| `innerHTML` used for output display | LOW | Change to `textContent` or `value`; grep codebase for all `innerHTML` usage |
| No clipboard fallback | LOW | Add the `execCommand` fallback function; wrap in try/catch |
| No error handling on decode functions | LOW | Wrap each conversion in try/catch; add error display to UI |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| `btoa`/`atob` Unicode crash | Phase 1: Core logic | Test `toBase64("Привет 🌍")` round-trips correctly |
| Incomplete keyboard map | Phase 1: Core logic | Map every key from the Microsoft ЙЦУКЕН layout image; test with punctuation-heavy string |
| CRT motion/accessibility | Phase 1: CSS/Layout | Enable `prefers-reduced-motion` in DevTools; verify no animations remain |
| `decodeURIComponent` crash | Phase 1: Core logic | Test `fromPercentEncoded("100% done")` shows error, doesn't crash |
| Clipboard fails silently | Phase 1: Utility buttons | Test copy from `file:///` URL; verify fallback works |
| XSS via innerHTML | Phase 1: UI wiring | Grep for `innerHTML`; should be zero instances in output display code |
| Contrast ratio too low | Phase 1: CSS/Layout | Verify green-on-dark meets 4.5:1 with browser DevTools contrast checker |
| `+` not decoded as space | Phase 1: Percent encoding | Document behavior or add mode toggle; test with form-encoded strings |

## Sources

- MDN: `Window.btoa()` — https://developer.mozilla.org/en-US/docs/Web/API/Window/btoa (verified 2025-06-24, documents Unicode string handling and TextEncoder workaround)
- MDN: `encodeURIComponent()` — https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent (verified 2025-10-30, documents lone surrogate throws and `+` vs `%20`)
- MDN: Base64 Glossary — https://developer.mozilla.org/en-US/docs/Glossary/Base64 (verified 2025-12-10, documents btoa binary string limitation)
- MDN: `prefers-reduced-motion` — https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion (verified 2026-01-08, baseline since January 2020)
- MDN: `Clipboard.writeText()` — https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText (verified 2025-11-30, documents secure context requirement)
- Wikipedia: JCUKEN — https://en.wikipedia.org/wiki/JCUKEN (documents Microsoft, Apple, and Typewriter layout variants with keyboard images)
- WCAG 2.1 Success Criterion 2.3.1: Three Flashes or Below Threshold

---
*Pitfalls research for: client-side text conversion/encoding web multitool*
*Researched: 2026-04-11*
