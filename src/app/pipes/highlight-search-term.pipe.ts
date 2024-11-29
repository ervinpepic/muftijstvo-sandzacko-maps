import { Pipe, PipeTransform } from '@angular/core';
import * as Utils from '../utils/input-validators';

/**
 * Angular pipe to highlight search terms within a string.
 * This pipe makes the search term stand out in the provided text by wrapping it in <strong> tags.
 * It is marked as standalone, meaning it can be used without declaring it in an Angular module.
 */
@Pipe({
  name: 'highlightSearchTerm',
  standalone: true,
})
export class HighlightSearchTermPipe implements PipeTransform {

  /**
   * Transforms the input value by highlighting the search term.
   * 
   * @param {string} value - The original text in which to highlight the search term.
   * @param {string} searchTerm - The term to highlight within the original text.
   * @returns {string} The transformed text with the search term highlighted.
   */
  transform(value: string, searchTerm: string): string {
    if (!searchTerm || !value) {
      return value;
    }

    // Escape any special regex characters in the search term to prevent regex errors.
    const searchTermEscaped = Utils.escapeRegExp(searchTerm.toLowerCase());
    // Substitute characters in the escaped search term based on predefined character mappings.
    // This step enhances the flexibility of search term matching.
    const normalizedInputValue = Utils.substituteChars(searchTermEscaped, Utils.searchCharMap);
    // Create a regex pattern to match the normalized search term, ignoring case sensitivity.
    const regex = new RegExp(`(${normalizedInputValue})`, 'gi');
    // Replace matches of the search term in the original value with the same term wrapped in <strong> tags,
    // effectively highlighting them.
    return value.replace(regex, '<strong>$1</strong>');
  }
}
