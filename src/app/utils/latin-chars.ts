// Function to replace Serbian Latin characters
export function replaceSerbianLatinChars(input: string): string {
  return input
    .replace(/š/g, 's')
    .replace(/đ/g, 'dj')
    .replace(/č/g, 'c')
    .replace(/ć/g, 'c')
    .replace(/ž/g, 'z');
}

replaceSerbianLatinChars;
