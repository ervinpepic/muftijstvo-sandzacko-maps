// Function to replace Serbian Latin characters with Bosnian Latin characters
export function substituteUsToBs(input: string): string {
  return input
    .replace(/š/g, 's')  // Replace 'š' with 's'
    .replace(/đ/g, 'dj') // Replace 'đ' with 'dj'
    .replace(/č/g, 'c')  // Replace 'č' with 'c'
    .replace(/ć/g, 'c')  // Replace 'ć' with 'c'
    .replace(/ž/g, 'z');  // Replace 'ž' with 'z'
}
