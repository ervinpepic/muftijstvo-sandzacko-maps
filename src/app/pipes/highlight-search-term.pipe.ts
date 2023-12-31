import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightSearchTerm',
  standalone: true,
})
export class HighlightSearchTermPipe implements PipeTransform {
  // Transforms the input string by highlighting occurrences of the searchTerm
  transform(value: string, searchTerm: string): string {
    // Check if either searchTerm or value is falsy, and return the original value
    if (!searchTerm || !value) {
      return value;
    }

    // Function to substitute characters in the input string
    function substituteChars(input: string): string {
      return input
        .replace(/s/g, '[sš]')
        .replace(/dj/g, '[đdj]')
        .replace(/c/g, '[cćč]')
        .replace(/z/g, '[zž]')
        .replace(/\(/g, '[(]')
        .replace(/\)/g, '[)]');
    }

    // Normalize the searchTerm by substituting characters
    const normalizedInputValue = substituteChars(searchTerm.toLowerCase());

    // Create a regular expression with the normalized searchTerm
    const regex = new RegExp(`(${normalizedInputValue})`, 'gi');

    // Replace occurrences of the searchTerm with highlighted HTML tags in the input value
    return value.replace(regex, '<strong>$1</strong>');
  }
}
