/**
 * Base64 Encoder/Decoder
 *
 * Pure ES module — no DOM access, no side effects.
 * Uses TextEncoder/TextDecoder pipeline for UTF-8 safety.
 * Decode returns { error: string } on invalid input instead of throwing.
 */

/**
 * Encode text to Base64, handling Unicode (including Cyrillic) correctly.
 * Uses TextEncoder to convert to UTF-8 bytes before btoa.
 *
 * @param {string} text - Plain text to encode
 * @returns {string} Base64-encoded string
 */
export function base64Encode(text) {
  if (text === '') return '';
  const bytes = new TextEncoder().encode(text);
  const binary = Array.from(bytes, b => String.fromCodePoint(b)).join('');
  return btoa(binary);
}

/**
 * Decode Base64 back to text, handling Unicode (including Cyrillic) correctly.
 * Uses atob then TextDecoder for UTF-8 reconstruction.
 *
 * @param {string} text - Base64-encoded string to decode
 * @returns {string|{error: string}} Decoded text, or error object if input is invalid
 */
export function base64Decode(text) {
  if (text === '') return '';
  try {
    const binary = atob(text);
    const bytes = Uint8Array.from(binary, c => c.codePointAt(0));
    return new TextDecoder().decode(bytes);
  } catch (e) {
    return { error: 'Invalid Base64 input \u2014 check for typos or incomplete encoding' };
  }
}
