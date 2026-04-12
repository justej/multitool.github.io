# Roadmap: Multitool

## Overview

Three-phase delivery: build the complete UI shell with CRT aesthetic and the hardest converter (keyboard layout) first to validate the architecture end-to-end, then plug in the remaining encoding tools with robust error handling, then finish with utility features and responsive polish.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Shell & Keyboard Converter** - Working CRT-styled app with two-panel layout, tool switching, and QWERTY↔ЙЦУКЕН conversion
- [ ] **Phase 2: Encoding Tools** - Base64 and URL percent encoding/decoding with error handling
- [ ] **Phase 3: Utility & Polish** - Copy-to-clipboard, clear buttons, and responsive mobile layout

## Phase Details

### Phase 1: Shell & Keyboard Converter
**Goal**: Users can convert text between QWERTY and ЙЦУКЕН layouts in a retro CRT-styled app with a complete tool-switching shell
**Depends on**: Nothing (first phase)
**Requirements**: LAYOUT-01, LAYOUT-02, LAYOUT-03, UI-01, UI-02, UI-05, UI-06, VIS-01, VIS-02, VIS-03, CODE-01, CODE-02, TRUST-01, TRUST-02, TRUST-03
**Success Criteria** (what must be TRUE):
  1. User can type/paste text into either panel and click a button to convert between QWERTY and ЙЦУКЕН (both directions), including uppercase, punctuation, and Ё
  2. Page renders with green-phosphor-on-dark CRT aesthetic (scanlines, glow, monospace font) and disables animation effects when prefers-reduced-motion is set
  3. Tool selector links at the bottom switch the active tool — button labels, placeholders, and conversion logic update without page reload
  4. Site loads and runs as static files with zero external runtime dependencies — all processing client-side
  5. Each converter lives in its own ES module file, separate from UI shell logic
**Plans:** 3 plans
Plans:
- [x] 01-01-PLAN.md — HTML shell + CSS CRT theme + self-hosted font
- [x] 01-02-PLAN.md — QWERTY ↔ ЙЦУКЕН keyboard converter module
- [x] 01-03-PLAN.md — Tool registry + app wiring + end-to-end verification
**UI hint**: yes

### Phase 2: Encoding Tools
**Goal**: Users can Base64-encode/decode and URL-percent-encode/decode text, including Cyrillic, with clear error messages for invalid input
**Depends on**: Phase 1
**Requirements**: B64-01, B64-02, B64-03, URL-01, URL-02, URL-03
**Success Criteria** (what must be TRUE):
  1. User can encode arbitrary text (including Cyrillic) to Base64 and decode valid Base64 back to readable text
  2. User can percent-encode text for URLs and decode percent-encoded text back to readable form
  3. User sees a clear, inline error message when attempting to decode invalid Base64 or malformed percent-encoded input
**Plans:** 2 plans
Plans:
- [x] 02-01-PLAN.md — Base64 & URL converter modules + error CSS
- [x] 02-02-PLAN.md — Registry wiring, HTML nav, error display, end-to-end verification

### Phase 3: Utility & Polish
**Goal**: Users have copy/clear convenience features and can use the tool comfortably on mobile screens
**Depends on**: Phase 2
**Requirements**: UI-03, UI-04, VIS-04
**Success Criteria** (what must be TRUE):
  1. User can click a "Copy to clipboard" button on each text field and sees visual feedback confirming the copy
  2. User can click "Clear" to reset both text fields
  3. Layout is responsive — text fields stack vertically on narrow/mobile viewports and remain usable
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Shell & Keyboard Converter | 0/3 | Planned | - |
| 2. Encoding Tools | 0/2 | Planned | - |
| 3. Utility & Polish | 0/? | Not started | - |
