import { Pipe, PipeTransform } from '@angular/core';
import * as Utils from '../utils/input-validators';

/**
 * Angular pipe to highlight search terms within a string.
 * Wraps matching terms in <strong> tags for emphasis.
 * This pipe is standalone and can be used independently of Angular modules.
 */
@Pipe({
  name: 'highlightSearchTerm',
  standalone: true,
})
export class HighlightSearchTermPipe implements PipeTransform {

  /**
   * Highlights the search term within the provided text.
   * 
   * @param {string} value - The original text to search within.
   * @param {string} searchTerm - The term to highlight.
   * @returns {string} The text with the search term highlighted, or the original text if no match is found.
   */
  transform(value: string, searchTerm: string): string {
    if (!value || !searchTerm) {
      return value; // Return original value if input or search term is empty/null
    }

    // Escape special regex characters in the search term
    const escapedSearchTerm = Utils.escapeRegExp(searchTerm);
    // Normalize the search term for flexible matching
    const normalizedSearchTerm = Utils.substituteChars(escapedSearchTerm, Utils.searchCharMap);
    // Create a regex to match the normalized search term, ignoring case
    const regex = new RegExp(`(${normalizedSearchTerm})`, 'gi');

    // Escape the original value to prevent HTML injection
    const escapeHtml = (str: string): string =>
      str.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const escapedValue = escapeHtml(value);

    // Replace matched terms with <strong>-wrapped highlights
    return escapedValue.replace(regex, '<strong>$1</strong>');
  }
}
