import unorm from 'unorm';

// Object mapping specific character sequences to their normalized forms.
const charReplacements: { [key: string]: string } = {
  dj: 'đ',
  q: 'k',
  x: 'ks',
  w: 'v',
};

/**
 * Object mapping characters to their search-friendly variants
 * to improve search functionality.
 **/
export const searchCharMap: { [key: string]: string } = {
  s: '[sš]',
  dj: '[đdj]',
  c: '[cćč]',
  z: '[zž]',
  w: 'v',
  q: 'k',
  x: '[ks]',
};

/**
 * Replaces characters in the input string based on the provided character map.
 * @param {string} input - The input string to be processed.
 * @param {Object} charMap - The character mapping to use for replacements.
 * @returns {string} - The processed string with characters replaced.
 */
export function substituteChars(
  input: string,
  charMap: { [key: string]: string }
): string {
  if (!input) return ''; // Handle empty or null input gracefully
  const regex = new RegExp(Object.keys(charMap).join('|'), 'g');
  return input.replace(regex, (match) => charMap[match]);
}

/**
 * Escapes special characters in a string for use in a regular expression.
 * @param {string} string - The string to be escaped.
 * @returns {string} - The escaped string, safe for use in a regex pattern.
 */
export function escapeRegExp(string: string): string {
  if (!string) return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Checks if the input string is strictly numeric or a numeric fraction.
 * @param {string} input - The input string to be tested.
 * @returns {boolean} - True if the input is numeric or a fraction, false otherwise.
 */
export function isNumericInput(input: string): boolean {
  if (!input.trim()) return false;
  return /^\d+\/\d+$/.test(input) || /^\d+$/.test(input);
}

/**
 * Validates whether the input field contains only allowed characters: alphanumeric, spaces, and periods,
 * and does not start with a space.
 * @param {string} inputField - The input string to be validated.
 * @returns {boolean} - True if the input is valid, false otherwise.
 */
export function validateInputField(inputField: string): boolean {
  const regex = /^(?=[A-Za-z0-9])[A-Za-z0-9\s.]*$/;
  return regex.test(inputField.trim());
}

/**
 * Normalizes the input string by replacing specified characters, removing diacritical marks, and converting to lowercase.
 * @param {string} inputValue - The input string to be normalized.
 * @returns {string} - The normalized string.
 */
export function normalizeString(inputValue: string): string {
  if (!inputValue) return ''; // Handle null or undefined gracefully
  const pattern = new RegExp(Object.keys(charReplacements).join('|'), 'g');
  let normalizedStr = unorm.nfd(inputValue);
  normalizedStr = normalizedStr.replace(
    pattern,
    (match) => charReplacements[match]
  );
  return normalizedStr.replace(/[\u0300-\u036f]/g, '').toLowerCase();
}
