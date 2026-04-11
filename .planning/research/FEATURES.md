# Feature Landscape

**Domain:** Text conversion / encoding web utility (multitool)
**Researched:** 2026-04-11

## Competitive Landscape Context

Research covered the following competitors:
- **CyberChef** (gchq.github.io/CyberChef) — the "Cyber Swiss Army Knife", 300+ operations, recipe/pipeline model, drag-and-drop
- **base64encode.org / urlencoder.org** — single-purpose encoding tools by HAZOTA, clean UX, one conversion per page
- **CodeBeautify** — 500+ tools, SEO-driven sprawl, every conversion imaginable but scattered UX
- **IT Tools** (it-tools.tech) — 38k GitHub stars, curated developer tool collection, clean modern UX
- **DevTools Daily** — similar curated dev tool set, formatters + encoders + playgrounds
- **cryptii** — modular encoding/encryption with chaining (input → pipe → output), MIT open source
- **translit.net** — the dominant Russian transliteration + keyboard layout tool since 2002, virtual keyboard, ЙЦУКЕН emulation
- **Punto Switcher** (Yandex) — desktop app for auto-detecting wrong keyboard layout

**Multitool's niche:** A focused, retro-styled, single-page tool combining keyboard layout conversion (QWERTY ↔ ЙЦУКЕН) with common text encodings. This is rare — most tools are either sprawling (CyberChef, CodeBeautify) or single-purpose (base64encode.org). The keyboard layout converter + encoding combo under one roof is genuinely differentiated.

---

## Table Stakes

Features users expect from any text conversion web tool. Missing = product feels broken or amateurish.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Copy-to-clipboard button** | Every competitor has it. Users paste results elsewhere 100% of the time. | Low | Use `navigator.clipboard.writeText()`. Must provide visual feedback (e.g., "Copied!" flash). |
| **Clear/reset button** | Users process multiple inputs per session. Must be one-click. | Low | Clear both fields. All competitors provide this. |
| **Bidirectional conversion** | base64encode.org has separate Encode/Decode buttons. Users need both directions. | Low | Already in PROJECT.md — encode/decode, convert both ways. |
| **Correct UTF-8 handling** | Non-ASCII input (Cyrillic, emoji, CJK) is the #1 cause of broken Base64 output. `btoa()` fails on non-ASCII without wrapping. | Med | Must use `TextEncoder`/`TextDecoder` for Base64. `encodeURIComponent` handles UTF-8 natively. Critical for a tool that inherently deals with Cyrillic text. |
| **Paste-friendly large text area** | Users paste multi-paragraph text. Tiny inputs feel hostile. | Low | Generous `<textarea>` with reasonable min-height. Most competitors use ≥8 visible lines. |
| **Error handling on invalid input** | Decoding malformed Base64 or percent-encoded strings must not silently fail or show cryptic browser errors. | Med | Catch exceptions from `atob()` / `decodeURIComponent()` and show clear inline error messages. |
| **Tool selector / navigation** | Users need to switch between tools without reloading. Already planned as bottom links. | Low | Single-page tool switching. All multi-tool sites do this. |
| **Works offline after load** | Pure client-side tools should work without network. Users expect no server dependency. | Low | Already guaranteed by vanilla JS + static hosting. No API calls needed. |
| **No data sent to server** | Privacy-conscious users avoid tools that transmit their data. CyberChef, cryptii, translit.net all explicitly advertise client-side processing. | Low | Already guaranteed by architecture. Worth stating visibly in the UI. |

---

## Differentiators

Features that set the product apart. Not expected, but valued.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **QWERTY ↔ ЙЦУКЕН layout converter** | Very few web tools offer this. translit.net focuses on *transliteration* (latin-to-cyrillic phonetics), not *layout conversion* (remap typed-in-wrong-layout text). Punto Switcher is desktop-only. This is the tool's unique hook — you paste "ghbdtn" and get "привет". | Med | Character-by-character map between US QWERTY and Russian ЙЦУКЕН physical key positions. ~70 character pairs (upper + lower + punctuation shifts). |
| **Retro CRT aesthetic** | None of the competitors use retro styling. CyberChef is utilitarian, base64encode.org is generic Bootstrap, IT Tools is clean modern. The phosphor-green-on-dark terminal look is memorable and makes the tool feel like a distinct product, not another generic converter. | Med | CSS-driven: green monospace text, dark background, subtle scanline overlay, text-shadow glow. No heavy assets needed. |
| **Unified two-panel layout** | Most competitors use one textarea + one output (read-only). Two side-by-side *editable* fields with bidirectional conversion is more flexible — type in either, convert to the other. cryptii has a similar pipeline concept, but this is simpler. | Low | Already in PROJECT.md. Both fields editable, button triggers direction. |
| **All tools share one UI** | CyberChef is powerful but has a steep learning curve. CodeBeautify has 500 pages. This tool's value is *simplicity* — one page, same layout, just swap the conversion logic. Zero cognitive overhead when switching tools. | Low | Architecture inherently enables this. Tool selector just rewires the conversion function + relabels buttons. |
| **Zero-dependency, instant load** | IT Tools is Vue + Vite (heavy). CyberChef is a 4MB+ bundle. base64encode.org loads ads. A vanilla JS tool loads in <100ms with zero dependencies. This matters for a *utility* — users want instant results, not a loading spinner. | Low | Already constrained by PROJECT.md (vanilla HTML/CSS/JS, no build step). |
| **Single self-contained file** | Download one HTML file, use it forever, even on an air-gapped machine. CyberChef offers this but it's a 15MB zip. A <50KB single file is compelling for security-conscious users and offline use. | Low | Achievable with inline CSS/JS. Good stretch goal. |
| **Keyboard shortcut for conversion** | Power users who use this tool daily want Ctrl+Enter to convert instead of clicking. No competitor in this space offers keyboard shortcuts for the core action. | Low | Simple `addEventListener('keydown')`. Small effort, big DX improvement for repeat users. |

---

## Anti-Features

Features to explicitly NOT build. These are traps that would dilute the product or violate its constraints.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Live/real-time conversion as you type** | Explicitly out of scope per PROJECT.md. Also problematic for keyboard layout conversion where mid-typing input is ambiguous. base64encode.org offers this as a toggle but warns it only works for UTF-8. | Button-click conversion only. Predictable, no surprises. |
| **Hundreds of encoding tools** | CodeBeautify's trap: SEO-driven sprawl where every tool is mediocre. CyberChef's 300+ operations serve a different audience (security analysts). This tool's value is *focus*. | Ship 3 tools done perfectly: keyboard layout, URL encoding, Base64. Add more only if each earns its place. |
| **Recipe/pipeline chaining** | CyberChef's killer feature, but it requires a complex UI (drag-and-drop, step ordering) and is overkill for simple conversions. | Keep it simple: one tool, one conversion, one click. |
| **File upload/binary conversion** | base64encode.org supports file-to-Base64. This requires file reader APIs, progress indicators, size limits. Out of scope for a text tool. | Accept text input only. Link to specialized tools for file conversion if needed. |
| **User accounts / saved history** | Explicitly out of scope per PROJECT.md. Adds server dependency, privacy concerns, and complexity. | Stateless tool. Every visit is fresh. |
| **Server-side processing** | Explicitly out of scope per PROJECT.md. | Client-side only. Prominently state this for user trust. |
| **Transliteration (phonetic)** | translit.net owns this space completely (since 2002, deeply featured, multiple alphabet support). Competing with phonetic transliteration is a losing battle. The *layout converter* (wrong-keyboard-layout fixer) is a different, underserved need. | Be clear in UI: this converts *layout mistakes*, not phonetic transliteration. "You typed on the wrong keyboard layout" not "Type Russian with English letters." |
| **Mobile-native app** | Explicitly out of scope. The web tool should be responsive enough for mobile browsers. | Responsive CSS for mobile viewport. No app store presence needed. |
| **Character set selector** | base64encode.org offers 50+ character sets (CP866, KOI8-R, etc.). This is a niche need for legacy systems. | Default to UTF-8 everywhere. This handles 99.9% of modern use cases including Cyrillic. |
| **Ads or monetization** | Degrades the retro aesthetic, slows loading, erodes trust. base64encode.org and CodeBeautify are ad-heavy. | Keep it clean. This is a utility, not a business. |

---

## Feature Dependencies

```
UTF-8 handling (correct TextEncoder/TextDecoder usage)
├── Base64 encode/decode (depends on UTF-8 for non-ASCII)
├── URL percent encode/decode (encodeURIComponent handles UTF-8 natively)
└── Keyboard layout converter (maps between character sets)

Two-panel layout (shared UI shell)
├── Tool selector (switches active conversion logic + button labels)
├── Copy-to-clipboard (per field)
├── Clear button (per field or both)
└── Error display (inline, per field)

CRT retro styling (CSS)
├── Scanline effect (pure CSS overlay)
├── Phosphor glow (text-shadow)
└── Monospace font selection (system or web font)

Keyboard shortcut support
└── Requires: conversion buttons already wired up
```

---

## MVP Recommendation

Prioritize in this order:

1. **Two-panel layout with tool switching** — the shared shell everything lives in
2. **QWERTY ↔ ЙЦУКЕН keyboard layout converter** — the unique differentiator, ship it first
3. **Base64 encode/decode** (with proper UTF-8 handling) — most commonly needed encoding tool
4. **URL percent encode/decode** — second most common, trivial to add once Base64 works
5. **Copy-to-clipboard + clear buttons** — table stakes UX for any conversion tool
6. **Error handling for invalid input** — prevents confusion on bad decodes
7. **CRT retro styling** — the visual identity that makes this memorable
8. **Keyboard shortcut (Ctrl+Enter)** — small effort, big power-user win

**Defer:**
- Additional keyboard layouts (AZERTY, QWERTZ ↔ ЙЦУКЕН): validate demand first
- Additional encodings (HTML entities, Hex, Binary): only if users ask
- Transliteration: never build this, translit.net owns the space
- Single-file downloadable version: nice-to-have after v1

---

## Future Tool Candidates (Post-MVP, Only If Earned)

These are tools that *could* fit the multitool concept but should NOT be built unless user demand is validated:

| Tool | Fit Score | Rationale |
|------|-----------|-----------|
| HTML entity encode/decode | High | Same audience, same UX, trivial to implement |
| JSON escape/unescape | Medium | Developer-oriented, fits the tool concept |
| Morse code | Low | Fun but niche, dilutes focus |
| ROT13 / Caesar cipher | Low | Novelty, not a real need |
| Hash generation (MD5, SHA) | Low | One-way only (breaks bidirectional UX), better tools exist |
| Hex encode/decode | Medium | Developer need, fits bidirectional model |
| Unicode escape/unescape | Medium | Fits the text conversion theme |

---

## Sources

- CyberChef (gchq.github.io/CyberChef) — feature set, UX patterns, recipe model [HIGH confidence]
- base64encode.org / urlencoder.org — feature set, encoding options, UX patterns [HIGH confidence]
- CodeBeautify (codebeautify.org) — feature sprawl, encoding tools list [HIGH confidence]
- IT Tools (github.com/CorentinTh/it-tools) — 38k stars, curated tool approach [HIGH confidence]
- DevTools Daily (devtoolsdaily.com) — encoder/formatter tool categories [HIGH confidence]
- cryptii (cryptii.com) — modular encoding pipeline, open source [MEDIUM confidence]
- translit.net — keyboard layout emulation, transliteration dominance [HIGH confidence]
- Punto Switcher (punto.yandex.ru) — desktop layout auto-switching [HIGH confidence]
