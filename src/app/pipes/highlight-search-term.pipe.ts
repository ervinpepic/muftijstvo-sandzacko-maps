import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'highlightSearchTerm',
  standalone: true,
})
export class HighlightSearchTermPipe implements PipeTransform {
  /**
 * Highlights occurrences of the specified searchTerm within the input string by wrapping them in `<strong>` tags.
 * If the searchTerm is empty or the value is not provided, the original value is returned unmodified. This function
 * also employs character substitution logic for certain characters to handle variations in character representation,
 * making the search more flexible and inclusive of character variations.
 *
 * @param {string} value - The input string in which to highlight occurrences of the searchTerm.
 * @param {string} searchTerm - The term to search for within the input string. Case-insensitive.
 * @returns {string} The transformed string with occurrences of the searchTerm highlighted. If the searchTerm
 *                   or value is not provided, returns the original value unmodified.
 * 
 * Note: Special characters in the searchTerm are escaped to prevent issues in the regex pattern.
 */
  transform(value: string, searchTerm: string): string {
    if (!searchTerm || !value) {
      return value;
    }

    // Substitute characters first
    const normalizedSearchTerm = this.substituteChars(searchTerm.toLowerCase());

    // Then, build the regex pattern directly from the substituted string
    // Note: This assumes that the substitutions have been designed to be safe for direct regex use
    const regex = new RegExp(`(${normalizedSearchTerm})`, 'gi');

    // Highlight the terms
    const highlighted = value.replace(regex, '<strong>$1</strong>');

    // Assuming you're using this in an Angular template with [innerHTML] to bypass default escaping
    return highlighted;
  }

  private substituteChars(input: string): string {
    const charMap: { [key: string]: string } = {
      s: '[sš]',
      dj: '[đdj]',
      c: '[cćč]',
      z: '[zž]',
      w: 'v',
      q: 'k',
      x: '[ks]'
      // Add more substitutions as needed
    };

    return Object.keys(charMap).reduce(
      (acc, cur) => acc.replace(new RegExp(cur, 'gi'), charMap[cur]),
      input
    );
  }

}
