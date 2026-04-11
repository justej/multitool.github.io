# Architecture Research

**Domain:** Client-side text conversion/encoding web tool
**Researched:** 2026-04-11
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        HTML Shell (index.html)                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Static Layout (DOM)                      │  │
│  │  ┌──────────────┐  ┌─────────┐  ┌──────────────┐         │  │
│  │  │  Left Panel   │  │ Actions │  │  Right Panel  │         │  │
│  │  │  (textarea)   │  │ (btns)  │  │  (textarea)   │         │  │
│  │  └──────────────┘  └─────────┘  └──────────────┘         │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │              Tool Selector (nav links)               │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                     CSS (style.css)                               │
│  CRT retro theme: green phosphor, scanlines, glow effects        │
├─────────────────────────────────────────────────────────────────┤
│                     JS Entry Point (app.js)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                       │
│  │ Tool     │  │ UI       │  │ Clipboard│                       │
│  │ Registry │  │ Manager  │  │ Helper   │                       │
│  └────┬─────┘  └────┬─────┘  └──────────┘                       │
│       │              │                                           │
├───────┴──────────────┴───────────────────────────────────────────┤
│                   Converter Modules (tools/)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  keyboard.js  │  │  percent.js  │  │  base64.js   │           │
│  │  (QWERTY↔     │  │  (URL encode │  │  (Base64      │           │
│  │   ЙЦУКЕН)     │  │   /decode)   │  │   encode/     │           │
│  └──────────────┘  └──────────────┘  │   decode)      │           │
│                                      └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **HTML Shell** | Static structure: two textareas, action buttons, tool selector nav, utility buttons (copy/clear) | Single `index.html` file with semantic elements. Loads `app.js` as `type="module"` |
| **CSS Theme** | CRT retro aesthetics: green phosphor palette, scanline overlay, text-shadow glow, monospace fonts | Single `style.css`. CSS custom properties for color palette. No preprocessor needed |
| **App Entry** | Bootstraps the app: wires event listeners, initializes default tool, coordinates between components | `app.js` — the only `<script>` tag. Imports everything else via ES modules |
| **Tool Registry** | Maps tool IDs to their converter modules. Knows which tool is active. Provides tool metadata (labels, button captions) | Plain object or Map. Each entry: `{ id, label, actions: [{name, fn}] }` |
| **UI Manager** | Updates DOM when tool changes: swaps button labels, resets fields, toggles active state in nav | Functions that read/write DOM. Called by app entry when tool selection changes |
| **Clipboard Helper** | Copy-to-clipboard via `navigator.clipboard.writeText()` with fallback | Thin wrapper. One function: `copyToClipboard(text)` |
| **Converter Modules** | Pure functions: `convert(input) → output`. No DOM awareness. Each module exports its conversion functions | One file per tool in `tools/` folder. E.g., `keyboard.js` exports `qwertyToYcuken(str)` and `ycukenToQwerty(str)` |

## Recommended Project Structure

```
multitool/
├── index.html              # Single HTML page — the app shell
├── style.css               # All styles (CRT theme, layout)
├── app.js                  # Entry point (type="module"), wiring
├── tools/                  # Converter modules (pure logic)
│   ├── keyboard.js         # QWERTY ↔ ЙЦУКЕН mapping + conversion
│   ├── percent.js          # URL encode/decode wrappers
│   └── base64.js           # Base64 encode/decode with UTF-8 handling
├── ui.js                   # DOM manipulation helpers
├── registry.js             # Tool registry — metadata + action mapping
├── clipboard.js            # Copy-to-clipboard utility
└── .planning/              # Planning files (not deployed)
```

### Structure Rationale

- **Flat file structure (no `src/`):** This is a no-build-step static site. There's no compilation or bundling, so a flat structure at the root is simplest. Deploying means copying the folder as-is. Adding a `src/` directory would add a layer of indirection with zero benefit.
- **`tools/` subdirectory:** The only directory, because converters are the extensible part. Adding a new tool = adding a file here + registering it. Grouping them signals "this is the plugin layer."
- **Separate `ui.js`, `registry.js`, `clipboard.js`:** Each has a single, testable responsibility. ES module `import/export` keeps them wired without globals. Small files are fine — browser-native ES modules handle this with no bundle tax for a handful of files.
- **No `lib/` or `utils/`:** With 3 converter modules and 3 infrastructure files, there's nothing to further categorize. Don't create structure you don't need.

## Architectural Patterns

### Pattern 1: Tool Registry (Strategy Pattern)

**What:** A central registry that maps tool identifiers to their metadata and conversion functions. The active tool is a reference into this registry. Switching tools swaps the strategy, not the wiring.

**When to use:** Any time you have a fixed UI layout that supports multiple "modes" or "tools" — exactly this project's case.

**Trade-offs:** Slightly more code upfront to define the registry format, but adding new tools becomes trivial (add module, add registry entry). Prevents spaghetti if/else chains in the UI code.

**Example:**
```javascript
// registry.js
import { qwertyToYcuken, ycukenToQwerty } from './tools/keyboard.js';
import { urlEncode, urlDecode } from './tools/percent.js';
import { base64Encode, base64Decode } from './tools/base64.js';

export const tools = [
  {
    id: 'keyboard',
    label: 'Keyboard Layout',
    leftLabel: 'QWERTY',
    rightLabel: 'ЙЦУКЕН',
    actions: [
      { label: 'Convert →', fn: qwertyToYcuken, direction: 'left-to-right' },
      { label: '← Convert', fn: ycukenToQwerty, direction: 'right-to-left' },
    ],
  },
  {
    id: 'percent',
    label: 'URL Encode',
    leftLabel: 'Text',
    rightLabel: 'Encoded',
    actions: [
      { label: 'Encode →', fn: urlEncode, direction: 'left-to-right' },
      { label: '← Decode', fn: urlDecode, direction: 'right-to-left' },
    ],
  },
  // ... base64 follows same shape
];

export function getToolById(id) {
  return tools.find(t => t.id === id);
}
```

### Pattern 2: Pure Converter Functions (No Side Effects)

**What:** Every converter is a pure function: `string → string`. No DOM access, no state, no side effects. The converter modules know nothing about the UI.

**When to use:** Always, for utility/conversion logic. This is the strongest architectural boundary in the project.

**Trade-offs:** None — this is strictly better. Pure functions are trivially testable, reusable, and impossible to accidentally couple to the DOM.

**Example:**
```javascript
// tools/base64.js

/**
 * Encode a string to Base64, handling Unicode correctly.
 * Uses TextEncoder to convert to UTF-8 bytes first.
 */
export function base64Encode(str) {
  const bytes = new TextEncoder().encode(str);
  const binary = Array.from(bytes, byte => String.fromCodePoint(byte)).join('');
  return btoa(binary);
}

/**
 * Decode a Base64 string back to Unicode text.
 */
export function base64Decode(b64) {
  const binary = atob(b64);
  const bytes = Uint8Array.from(binary, ch => ch.codePointAt(0));
  return new TextDecoder().decode(bytes);
}
```

### Pattern 3: Event Delegation on the App Shell

**What:** Attach a small number of event listeners to parent containers (or the document), rather than individual buttons. Use `data-*` attributes to identify what was clicked and what action to perform.

**When to use:** When multiple buttons share the same handler pattern (e.g., all "convert" buttons do the same thing with different functions, all "copy" buttons do the same thing for different fields).

**Trade-offs:** Slightly less obvious at first glance which element triggers what. But scales much better as you add tools, and avoids re-binding listeners when the DOM updates. For this project with a fixed DOM, either approach works — but delegation is cleaner when action buttons change labels per tool.

**Example:**
```javascript
// app.js — event delegation for action buttons
document.querySelector('.actions').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;

  const direction = btn.dataset.action; // 'left-to-right' or 'right-to-left'
  const action = currentTool.actions.find(a => a.direction === direction);
  if (!action) return;

  const source = direction === 'left-to-right' ? leftField : rightField;
  const target = direction === 'left-to-right' ? rightField : leftField;
  target.value = action.fn(source.value);
});
```

## Data Flow

### Conversion Flow (Primary)

```
User types/pastes text into a textarea
    ↓
User clicks an action button (e.g., "Encode →")
    ↓
Event listener reads source textarea's .value
    ↓
Calls the active tool's converter function:  fn(inputString) → outputString
    ↓
Writes result to target textarea's .value
```

No intermediate state, no data store, no async operations. It's synchronous DOM read → pure function → DOM write. This is the simplest possible data flow and there is no reason to complicate it.

### Tool Switching Flow

```
User clicks a tool link in the nav (e.g., "Base64")
    ↓
Event listener identifies the tool ID from the link
    ↓
Looks up tool in registry → gets metadata (labels, actions)
    ↓
UI Manager updates:
  - Active state on nav links
  - Panel labels (left/right captions)
  - Action button labels
  - Optionally clears textareas
    ↓
Sets currentTool reference to the new tool
```

### Utility Flow (Copy / Clear)

```
User clicks "Copy" button on a panel
    ↓
Event listener reads the adjacent textarea's .value
    ↓
Calls navigator.clipboard.writeText(value)
    ↓
(Optional) Shows brief feedback (e.g., button text changes to "Copied!")
```

```
User clicks "Clear" button on a panel
    ↓
Sets the adjacent textarea's .value to ''
```

### Key Data Flows

1. **Conversion:** textarea.value → pure function → textarea.value. One-shot, synchronous. No persistence.
2. **Tool switching:** click event → registry lookup → DOM updates (labels, active class). No data transformation.
3. **Clipboard:** textarea.value → Clipboard API. Async (returns Promise) but fire-and-forget for UX.

### State Management

This project has almost no state:

| State | Where It Lives | How It Changes |
|-------|---------------|----------------|
| Current tool | A `let currentTool` variable in `app.js` | Reassigned on tool switch |
| Text content | The two `<textarea>` elements (DOM is the source of truth) | User typing, conversion writes, clear button |
| Active nav link | CSS class on a `<a>` element | Toggled on tool switch |

**No state management library needed.** The DOM *is* the state store for text content. A single module-scoped variable tracks the active tool. That's it.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 3 tools (current) | Flat structure, all tools loaded eagerly. ~5 JS files total. No optimization needed |
| 5–10 tools | Still fine as-is. Might alphabetize the registry. Consider grouping tool nav links into categories |
| 10–20 tools | Consider dynamic `import()` for tool modules to avoid loading all at once. Add a tool search/filter in the UI |
| 20+ tools | This is a different product. Would need categories, routing, lazy loading. But this scope is explicitly out of bounds per PROJECT.md |

### Scaling Priorities

1. **First bottleneck: Adding a new tool is tedious.** If the process of adding a tool requires touching more than 2 files (the tool module + the registry), the architecture has drifted. Keep the "add a tool" path to: create `tools/newtool.js`, add entry to `registry.js`, done.
2. **Second bottleneck: CSS becomes unmanageable.** The CRT theme involves visual effects (scanlines, glow) that can get complex. Keep effects as CSS classes/custom properties, not inline styles. If the stylesheet exceeds ~300 lines, split into `theme.css` (CRT effects) and `layout.css` (structure).

## Anti-Patterns

### Anti-Pattern 1: Putting Conversion Logic in Event Handlers

**What people do:** Write the Base64 encoding directly inside the button click handler, mixing DOM reads, conversion logic, and DOM writes in one function.

**Why it's wrong:** Cannot test the conversion without a browser/DOM. Cannot reuse the conversion. When you add a new tool, you're copy-pasting handler boilerplate and embedding different logic each time.

**Do this instead:** Converters are pure functions in separate modules. The event handler is generic: it reads the input, calls `currentTool.action.fn(input)`, writes the output. One handler for all tools.

### Anti-Pattern 2: Global Variables for State

**What people do:** Use `window.currentTool`, `window.leftField`, etc. to share state between files loaded via separate `<script>` tags.

**Why it's wrong:** No encapsulation, load-order dependent, name collision risk, impossible to reason about what modifies what. Classic "vanilla JS spaghetti."

**Do this instead:** Use ES modules (`type="module"`). Module-scoped variables are private by default. Export only what's needed. Import explicitly. This gives you framework-like encapsulation with zero dependencies.

### Anti-Pattern 3: Over-Engineering the UI Layer

**What people do:** Build a virtual DOM, a component system, or a reactive state management layer because "what if we need it later."

**Why it's wrong:** This is 3 tools sharing one fixed layout. The DOM structure never changes — only text content and CSS classes do. A reactive framework solves a problem (complex dynamic UIs) that doesn't exist here. It adds hundreds of lines of infrastructure code for zero user-visible benefit.

**Do this instead:** Direct DOM manipulation via `querySelector` and property assignment. The total JS for UI management should be ~30–50 lines.

### Anti-Pattern 4: Using `<script>` Tags Without `type="module"`

**What people do:** Load multiple `.js` files via separate `<script>` tags in classic mode, relying on load order and global scope.

**Why it's wrong:** Creates implicit coupling through global variables, no dependency graph, race conditions if scripts load out of order, no strict mode by default.

**Do this instead:** Single `<script type="module" src="app.js">` entry point. Everything else is imported via ES `import` statements. All modern browsers support this natively (confirmed: all evergreen browsers since ~2018). Modules are deferred automatically and run in strict mode.

## Integration Points

### External Services

None. This is a fully client-side, stateless tool. No APIs, no backends, no CDNs for dependencies.

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `app.js` ↔ `registry.js` | ES module import. App imports registry at load time | Registry is read-only after initialization |
| `app.js` ↔ `ui.js` | ES module import. App calls UI functions on tool switch | UI functions take tool metadata as arguments, never import registry directly |
| `app.js` ↔ `tools/*.js` | Indirect — app calls tool functions via registry references | App never imports tool modules directly. Registry is the single point of contact |
| `app.js` ↔ `clipboard.js` | ES module import. App calls clipboard helper on "copy" click | Clipboard helper is independent — knows nothing about tools or UI |
| `registry.js` ↔ `tools/*.js` | ES module import. Registry imports each tool's exported functions | This is the only place tool modules are imported. Adding a tool = adding imports here |

### Dependency Direction (Critical)

```
app.js (entry)
  ├── imports registry.js
  │     └── imports tools/keyboard.js
  │     └── imports tools/percent.js
  │     └── imports tools/base64.js
  ├── imports ui.js
  └── imports clipboard.js
```

**Rule: Dependencies flow inward/downward.** Tool modules never import from `app.js`, `ui.js`, or `registry.js`. `ui.js` never imports from `app.js`. This prevents circular dependencies and keeps the converter modules portable.

## Build Order Implications

Based on the dependency graph above, the recommended build order for development phases is:

| Order | Component | Why First/Next |
|-------|-----------|----------------|
| 1 | HTML shell + CSS theme | Visual foundation. Everything else attaches to this. Can be reviewed standalone |
| 2 | One converter module (`tools/keyboard.js`) | Pure logic, no dependencies. Can be tested in browser console immediately |
| 3 | Registry with one tool registered | Defines the tool shape/contract before building the wiring |
| 4 | `app.js` wiring + `ui.js` helpers | Connects DOM to registry to converter. First working end-to-end flow |
| 5 | Clipboard + clear utility buttons | Polish features. Independent of which tool is active |
| 6 | Remaining converter modules (`percent.js`, `base64.js`) | Plug into existing registry. Should "just work" with no changes to app/UI |

**Key insight:** Building one tool end-to-end first (steps 1–4) validates the entire architecture before investing in the remaining tools. If the registry contract is wrong, you find out with 1 tool, not 3.

## Sources

- MDN: JavaScript Modules — https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules (confirmed: `<script type="module">` supported natively in all modern browsers, no build step required, deferred by default, strict mode automatic)
- MDN: Clipboard.writeText() — https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText (confirmed: Baseline widely available since March 2020, requires secure context)
- MDN: TextEncoder — https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder (confirmed: Baseline widely available since January 2020, needed for UTF-8 Base64 handling)
- MDN: encodeURIComponent() — https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent (confirmed: Baseline widely available, throws URIError on lone surrogates)

---
*Architecture research for: Client-side text conversion/encoding web tool (Multitool)*
*Researched: 2026-04-11*
