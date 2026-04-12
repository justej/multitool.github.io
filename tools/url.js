/**
 * URL Percent Encoder/Decoder
 *
 * Pure ES module — no DOM access, no side effects.
 * Uses native encodeURIComponent/decodeURIComponent.
 * Decode returns { error: string } on malformed input instead of throwing.
 */

/**
 * Percent-encode text for use in URLs.
 * Handles all Unicode including Cyrillic and special characters.
 *
 * @param {string} text - Plain text to encode
 * @returns {string} Percent-encoded string
 */
export function urlEncode(text) {
  if (text === '') return '';
  return encodeURIComponent(text);
}

/**
 * Decode percent-encoded text back to readable form.
 *
 * @param {string} text - Percent-encoded string to decode
 * @returns {string|{error: string}} Decoded text, or error object if input is malformed
 */
export function urlDecode(text) {
  if (text === '') return '';
  try {
    return decodeURIComponent(text);
  } catch (e) {
    return { error: 'Invalid percent-encoded input \u2014 check for bare % signs or incomplete sequences' };
  }
}
