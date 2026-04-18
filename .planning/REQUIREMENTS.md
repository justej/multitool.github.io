# Requirements: Multitool

**Defined:** 2026-04-11
**Core Value:** Instant, no-fuss text conversion between keyboard layouts and common encodings in a single browser tab.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Layout Conversion

- [x] **LAYOUT-01**: User can convert text typed in QWERTY layout to ЙЦУКЕН equivalent (e.g., "ghbdtn" → "привет")
- [x] **LAYOUT-02**: User can convert text typed in ЙЦУКЕН layout to QWERTY equivalent (e.g., "привет" → "ghbdtn")
- [x] **LAYOUT-03**: Conversion covers full character set including uppercase, lowercase, digits, and punctuation/symbols for standard Microsoft QWERTY and ЙЦУКЕН layouts

### Base64 Encoding

- [x] **B64-01**: User can encode arbitrary text (including Cyrillic and other non-ASCII) to Base64
- [x] **B64-02**: User can decode valid Base64 back to readable text (including non-ASCII content)
- [x] **B64-03**: User sees a clear error message when attempting to decode invalid Base64 input

### URL Percent Encoding

- [x] **URL-01**: User can percent-encode text (including Cyrillic and special characters) for use in URLs
- [x] **URL-02**: User can decode percent-encoded text back to readable form
- [x] **URL-03**: User sees a clear error message when attempting to decode malformed percent-encoded input (e.g., bare `%`, truncated sequences)

### UI Shell

- [x] **UI-01**: Page displays two side-by-side editable text areas large enough for multi-paragraph text
- [x] **UI-02**: Action buttons between/near the text areas change labels and behavior based on selected tool (e.g., "Encode"/"Decode" for Base64, "QWERTY→ЙЦУКЕН"/"ЙЦУКЕН→QWERTY" for layout converter)
- [x] **UI-03**: Each text area has a "Copy to clipboard" button that copies the field content and shows visual feedback (e.g., "Copied!" flash)
- [x] **UI-04**: A "Clear" button resets both text fields
- [x] **UI-05**: Tool selector displayed as text links at the bottom of the page; clicking a link switches the active tool
- [x] **UI-06**: Switching tools updates button labels, field placeholders, and conversion logic without page reload

### Code Structure

- [x] **CODE-01**: Each conversion tool lives in its own JS file (ES module) — no monolithic script
- [x] **CODE-02**: Shared UI shell logic (field management, button wiring, tool switching) is separated from individual converter logic

### Visual Design

- [x] **VIS-01**: Page uses a retro CRT green-phosphor-on-dark color scheme with monospace font
- [x] **VIS-02**: Scanline overlay and text-shadow glow effects create authentic CRT terminal feel
- [x] **VIS-03**: CRT animation effects respect `prefers-reduced-motion` (disable scanlines/glow/flicker for users who prefer reduced motion)
- [x] **VIS-04**: Layout is responsive — usable on mobile viewports (fields stack vertically on narrow screens)

### Trust & Deployment

- [x] **TRUST-01**: All processing happens client-side — no data sent to any server
- [x] **TRUST-02**: Site works as static files deployable to GitHub Pages, Netlify, or similar
- [x] **TRUST-03**: Page loads with zero external runtime dependencies (no CDN, no npm packages at runtime)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Additional UX

- **UX-01**: Keyboard shortcut (Ctrl+Enter) triggers conversion without clicking buttons
- **UX-02**: "No data sent to server" privacy badge visible in UI

### Additional Tools

- **TOOL-01**: Additional keyboard layouts (AZERTY ↔ ЙЦУКЕН, QWERTZ ↔ ЙЦУКЕН)
- **TOOL-02**: HTML entity encode/decode
- **TOOL-03**: Single downloadable HTML file version (<50KB) for offline/air-gapped use

## Out of Scope

| Feature | Reason |
|---------|--------|
| Live/real-time conversion as you type | Explicit user decision — button-click only |
| Phonetic transliteration (translit) | translit.net owns this space; layout conversion is a different need |
| Recipe/pipeline chaining (CyberChef-style) | Overkill for simple conversions, complex UI |
| File upload / binary conversion | Out of scope for a text tool |
| User accounts / saved history | Stateless tool, no server |
| Ads or monetization | Degrades aesthetic and trust |
| Server-side processing | Client-side only by design |
| Character set selector (CP866, KOI8-R, etc.) | UTF-8 handles 99.9% of modern use cases |
| Mobile-native app | Web only, responsive CSS is sufficient |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| LAYOUT-01 | Phase 1 | Complete |
| LAYOUT-02 | Phase 1 | Complete |
| LAYOUT-03 | Phase 1 | Complete |
| B64-01 | Phase 2 | Complete |
| B64-02 | Phase 2 | Complete |
| B64-03 | Phase 2 | Complete |
| URL-01 | Phase 2 | Complete |
| URL-02 | Phase 2 | Complete |
| URL-03 | Phase 2 | Complete |
| UI-01 | Phase 1 | Complete |
| UI-02 | Phase 1 | Complete |
| UI-03 | Phase 3 | Complete |
| UI-04 | Phase 3 | Complete |
| UI-05 | Phase 1 | Complete |
| UI-06 | Phase 1 | Complete |
| CODE-01 | Phase 1 | Complete |
| CODE-02 | Phase 1 | Complete |
| VIS-01 | Phase 1 | Complete |
| VIS-02 | Phase 1 | Complete |
| VIS-03 | Phase 1 | Complete |
| VIS-04 | Phase 3 | Complete |
| TRUST-01 | Phase 1 | Complete |
| TRUST-02 | Phase 1 | Complete |
| TRUST-03 | Phase 1 | Complete |

**Coverage:**
- v1 requirements: 24 total
- Mapped to phases: 24 ✓
- Unmapped: 0

---
*Requirements defined: 2026-04-11*
*Last updated: 2026-04-11 after roadmap creation*
