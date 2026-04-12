# Multitool

## What This Is

A retro-styled web utility site that bundles text conversion and encoding tools into a single page. Users pick a tool, type or paste text into either of two side-by-side fields, and click a button to convert/encode/decode. The aesthetic is green-phosphor CRT terminal — built for anyone who regularly needs quick keyboard layout conversion or text encoding.

## Core Value

Instant, no-fuss text conversion between keyboard layouts and common encodings in a single browser tab.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] QWERTY <-> ЙЦУКЕН keyboard layout conversion
- [ ] Percent (URL) encoding and decoding
- [ ] Base64 encoding and decoding
- [ ] Two side-by-side editable text fields (bidirectional)
- [ ] Action buttons that change per selected tool (encode/decode/convert)
- [ ] Utility buttons (copy to clipboard, clear) on each field
- [ ] Tool selector displayed as text links at the bottom of the page
- [ ] Retro CRT green-on-dark visual style
- [ ] Conversion triggered on button click (not live)
- [ ] Static-hostable — no server, no build step

### Out of Scope

- Backend / API — purely client-side
- User accounts or saved history — stateless tool
- Mobile-native app — web only, responsive enough to use on mobile
- Live/real-time conversion as you type — explicit button click only

## Context

- Vanilla HTML/CSS/JS — no framework, no build tooling
- Single-page app: one HTML file (or a small set of static files)
- Tools share the same two-panel layout; switching tools changes captions, buttons, and conversion logic
- Keyboard converter maps character-by-character between QWERTY and ЙЦУКЕН (standard Russian) layouts
- Percent encoding uses standard `encodeURIComponent` / `decodeURIComponent`
- Base64 uses `btoa` / `atob` (with UTF-8 handling for non-ASCII)
- Will be deployed to static hosting (GitHub Pages, Netlify, or similar)

## Constraints

- **Tech stack**: Vanilla HTML/CSS/JS only — no frameworks, no transpilation, no bundlers
- **Code structure**: Each tool in its own JS file (ES modules). No spaghetti — clean separation between UI shell, tool registry, and individual converter logic.
- **Deployment**: Must work as static files — no server-side logic
- **Browser support**: Modern evergreen browsers (Chrome, Firefox, Safari, Edge)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Vanilla JS, no framework | Scope is small; a framework adds unnecessary complexity | — Pending |
| One JS file per tool (ES modules) | Readability, debuggability, no spaghetti — each converter is self-contained | — Pending |
| Button-click conversion, not live | User explicitly requested; simpler UX for copy-paste workflows | — Pending |
| CRT retro aesthetic | User preference — green phosphor on dark, old terminal vibe | — Pending |
| Text links for tool selector | Minimalist bottom toolbar matching retro aesthetic | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-11 after initialization*
