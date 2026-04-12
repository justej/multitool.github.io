/**
 * QWERTY ↔ ЙЦУКЕН Keyboard Layout Converter
 *
 * Pure ES module — no DOM access, no side effects.
 * Exports conversion functions and layout maps for Windows and macOS variants.
 *
 * Map source: Microsoft Windows standard ЙЦУКЕН layout (since Windows 3.1, 1994)
 * and macOS Russian layout. Both unshifted and shifted states for every key position.
 */

// ============================================================
// Windows QWERTY → ЙЦУКЕН map (Microsoft standard layout)
// ============================================================
// Maps each QWERTY key (unshifted and shifted) to the ЙЦУКЕН equivalent
// at the same physical key position.

export const WINDOWS_MAP = {
  // Row 1: Number row (unshifted — digits are the same on both layouts)
  '`': 'ё',
  '~': 'Ё',
  // Digits 0-9 are identical on both layouts — no mapping needed (pass through)
  // Shifted number row:
  '!': '!',
  '@': '"',
  '#': '№',
  '$': ';',
  '%': '%',
  '^': ':',
  '&': '?',
  '*': '*',
  '(': '(',
  ')': ')',
  '-': '-',
  '_': '_',
  '=': '=',
  '+': '+',

  // Row 2: QWERTY row (letters)
  'q': 'й', 'w': 'ц', 'e': 'у', 'r': 'к', 't': 'е',
  'y': 'н', 'u': 'г', 'i': 'ш', 'o': 'щ', 'p': 'з',
  '[': 'х', ']': 'ъ', '\\': '\\',
  // Shifted:
  'Q': 'Й', 'W': 'Ц', 'E': 'У', 'R': 'К', 'T': 'Е',
  'Y': 'Н', 'U': 'Г', 'I': 'Ш', 'O': 'Щ', 'P': 'З',
  '{': 'Х', '}': 'Ъ', '|': '/',

  // Row 3: ASDF row (letters)
  'a': 'ф', 's': 'ы', 'd': 'в', 'f': 'а', 'g': 'п',
  'h': 'р', 'j': 'о', 'k': 'л', 'l': 'д',
  ';': 'ж', "'": 'э',
  // Shifted:
  'A': 'Ф', 'S': 'Ы', 'D': 'В', 'F': 'А', 'G': 'П',
  'H': 'Р', 'J': 'О', 'K': 'Л', 'L': 'Д',
  ':': 'Ж', '"': 'Э',

  // Row 4: ZXCV row (letters)
  'z': 'я', 'x': 'ч', 'c': 'с', 'v': 'м', 'b': 'и',
  'n': 'т', 'm': 'ь',
  ',': 'б', '.': 'ю', '/': '.',
  // Shifted:
  'Z': 'Я', 'X': 'Ч', 'C': 'С', 'V': 'М', 'B': 'И',
  'N': 'Т', 'M': 'Ь',
  '<': 'Б', '>': 'Ю', '?': ','
};

// ============================================================
// macOS QWERTY → ЙЦУКЕН map (Apple Russian layout)
// ============================================================
// Letter positions are identical to Windows. Differences are in
// punctuation/symbol positions, particularly the number row shifted
// characters and some bracket/backslash positions.

export const MACOS_MAP = {
  // Row 1: Number row
  // macOS: backtick and tilde are different — ] and [ on Russian macOS
  '`': ']',
  '~': '[',
  // Shifted number row (macOS differs from Windows here):
  '!': '!',
  '@': '"',
  '#': '№',
  '$': '%',
  '%': ':',
  '^': ',',
  '&': '.',
  '*': ';',
  '(': '(',
  ')': ')',
  '-': '-',
  '_': '_',
  '=': '=',
  '+': '+',

  // Row 2: QWERTY row (letters — same as Windows)
  'q': 'й', 'w': 'ц', 'e': 'у', 'r': 'к', 't': 'е',
  'y': 'н', 'u': 'г', 'i': 'ш', 'o': 'щ', 'p': 'з',
  '[': 'х', ']': 'ъ', '\\': 'ё',
  // Shifted:
  'Q': 'Й', 'W': 'Ц', 'E': 'У', 'R': 'К', 'T': 'Е',
  'Y': 'Н', 'U': 'Г', 'I': 'Ш', 'O': 'Щ', 'P': 'З',
  '{': 'Х', '}': 'Ъ', '|': 'Ё',

  // Row 3: ASDF row (letters — same as Windows)
  'a': 'ф', 's': 'ы', 'd': 'в', 'f': 'а', 'g': 'п',
  'h': 'р', 'j': 'о', 'k': 'л', 'l': 'д',
  ';': 'ж', "'": 'э',
  // Shifted:
  'A': 'Ф', 'S': 'Ы', 'D': 'В', 'F': 'А', 'G': 'П',
  'H': 'Р', 'J': 'О', 'K': 'Л', 'L': 'Д',
  ':': 'Ж', '"': 'Э',

  // Row 4: ZXCV row (letters — same as Windows)
  'z': 'я', 'x': 'ч', 'c': 'с', 'v': 'м', 'b': 'и',
  'n': 'т', 'm': 'ь',
  ',': 'б', '.': 'ю', '/': '.',
  // Shifted:
  'Z': 'Я', 'X': 'Ч', 'C': 'С', 'V': 'М', 'B': 'И',
  'N': 'Т', 'M': 'Ь',
  '<': 'Б', '>': 'Ю', '?': ','
};

// ============================================================
// Reverse maps (ЙЦУКЕН → QWERTY) — auto-generated
// ============================================================

function buildReverseMap(forwardMap) {
  const reverse = {};
  for (const [from, to] of Object.entries(forwardMap)) {
    reverse[to] = from;
  }
  return reverse;
}

const REVERSE_WINDOWS = buildReverseMap(WINDOWS_MAP);
const REVERSE_MACOS = buildReverseMap(MACOS_MAP);

// ============================================================
// Conversion functions
// ============================================================

/**
 * Convert QWERTY-typed text to ЙЦУКЕН equivalent.
 * Characters without a mapping pass through unchanged.
 *
 * @param {string} text - Input text typed on QWERTY layout
 * @param {string} [variant='windows'] - Layout variant: 'windows' or 'macos'
 * @returns {string} Converted text as it would appear on ЙЦУКЕН layout
 */
export function qwertyToYcuken(text, variant = 'windows') {
  const map = variant === 'macos' ? MACOS_MAP : WINDOWS_MAP;
  return Array.from(text).map(ch => map[ch] ?? ch).join('');
}

/**
 * Convert ЙЦУКЕН-typed text to QWERTY equivalent.
 * Characters without a mapping pass through unchanged.
 *
 * @param {string} text - Input text typed on ЙЦУКЕН layout
 * @param {string} [variant='windows'] - Layout variant: 'windows' or 'macos'
 * @returns {string} Converted text as it would appear on QWERTY layout
 */
export function ycukenToQwerty(text, variant = 'windows') {
  const map = variant === 'macos' ? REVERSE_MACOS : REVERSE_WINDOWS;
  return Array.from(text).map(ch => map[ch] ?? ch).join('');
}
