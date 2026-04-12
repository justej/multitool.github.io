/**
 * Tool Registry
 *
 * Central registry mapping tool IDs to their metadata and conversion functions.
 * Adding a new tool: import its functions, add an entry to the tools array.
 *
 * Dependency direction: registry.js → tools/*.js (never reversed)
 */

import { qwertyToYcuken, ycukenToQwerty } from './tools/keyboard.js';
import { base64Encode, base64Decode } from './tools/base64.js';
import { urlEncode, urlDecode } from './tools/url.js';

export const tools = [
  {
    id: 'keyboard',
    label: 'Keyboard Layout Converter',
    description: 'Convert text between QWERTY and ЙЦУКЕН keyboard layouts',
    leftPlaceholder: 'Type or paste QWERTY text here...',
    rightPlaceholder: 'Type or paste ЙЦУКЕН text here...',
    leftAriaLabel: 'QWERTY input',
    rightAriaLabel: 'ЙЦУКЕН input',
    hasVariantToggle: true,
    actions: [
      { label: 'QWERTY → ЙЦУКЕН', fn: qwertyToYcuken, direction: 'left-to-right' },
      { label: 'ЙЦУКЕН → QWERTY', fn: ycukenToQwerty, direction: 'right-to-left' },
    ],
  },
  {
    id: 'base64',
    label: 'Base64 Encoder/Decoder',
    description: 'Encode text to Base64 or decode Base64 back to text',
    leftPlaceholder: 'Type or paste plain text here...',
    rightPlaceholder: 'Type or paste Base64 here...',
    leftAriaLabel: 'Plain text input',
    rightAriaLabel: 'Base64 input',
    hasVariantToggle: false,
    actions: [
      { label: 'Encode \u2192', fn: base64Encode, direction: 'left-to-right' },
      { label: '\u2190 Decode', fn: base64Decode, direction: 'right-to-left' },
    ],
  },
  {
    id: 'url',
    label: 'URL Percent Encoder/Decoder',
    description: 'Percent-encode text for URLs or decode percent-encoded text',
    leftPlaceholder: 'Type or paste plain text here...',
    rightPlaceholder: 'Type or paste encoded URL text here...',
    leftAriaLabel: 'Plain text input',
    rightAriaLabel: 'URL-encoded input',
    hasVariantToggle: false,
    actions: [
      { label: 'Encode \u2192', fn: urlEncode, direction: 'left-to-right' },
      { label: '\u2190 Decode', fn: urlDecode, direction: 'right-to-left' },
    ],
  },
];

/**
 * Look up a tool by its ID.
 * @param {string} id - Tool identifier (matches data-tool attribute in HTML)
 * @returns {object|undefined} Tool definition or undefined if not found
 */
export function getToolById(id) {
  return tools.find(t => t.id === id);
}
