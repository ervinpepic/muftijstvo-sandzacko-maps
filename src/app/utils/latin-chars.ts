import unorm from 'unorm';

export function normalizeString(inputValue: string): string {
  // Normalize the string using Unicode normalization (NFD)
  let normalizedStr = unorm.nfd(inputValue);

  // Remove combining diacritical marks and convert to lowercase
  normalizedStr = normalizedStr.replace(/dj/g, 'đ');

  // Remove combining diacritical marks and convert to lowercase
  const normalizedLowerCaseStr = normalizedStr
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  return normalizedLowerCaseStr;
}
