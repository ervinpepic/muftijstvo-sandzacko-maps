import unorm from 'unorm';

/**
 * Normalizes a string for consistent comparison and search by applying Unicode normalization and converting to 
 * lowercase. This function specifically targets normalization for accented characters and other diacritics to ensure 
 * that strings can be matched irrespective of their original form. Additionally, it handles specific character 
 * substitutions, such as replacing 'dj' with 'đ', to accommodate certain linguistic preferences or search requirements.
 *
 * The normalization process uses the NFD (Normalization Form Decomposition) to split characters into their base 
 * characters and diacritical marks. After normalization, it removes all combining diacritical marks to leave only 
 * the base characters. This approach ensures that searches and comparisons can be performed without the influence 
 * of case sensitivity or diacritical variations.
 *
 * @param {string} inputValue - The string to be normalized.
 * @returns {string} The normalized string, with specific character substitutions applied, diacritical marks removed, 
 *                   and converted to lowercase.
 */
export function normalizeString(inputValue: string): string {
  let normalizedStr = unorm.nfd(inputValue);
  normalizedStr = normalizedStr.replace(/dj/g, 'đ');
  const normalizedLowerCaseStr = normalizedStr
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  return normalizedLowerCaseStr;
}

/**
 * Checks if the input string is numeric.
 * @param {string} input - The input string to check.
 * @returns {boolean} True if the input is numeric, false otherwise.
 */
export function isNumericInput(input: string): boolean {
  return /^\d+\/\d+$/.test(input) || /^\d+$/.test(input);
}

/**
 * Checks if the input value satisfy given criteria.
 * @param {string} inputField - The input string to check.
 * @returns {boolean} True if the input is numeric, false otherwise.
 */
export function validateInputField(inputField: string): boolean {
  const regex = /^(?=[A-Za-z0-9])([A-Za-z0-9\s.]*)(?<=[A-Za-z0-9])$/
  return regex.test(inputField)
}