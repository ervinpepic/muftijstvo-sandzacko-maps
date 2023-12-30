import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightSearchTerm',
  standalone: true,
})
export class HighlightSearchTermPipe implements PipeTransform {
  transform(value: string, searchTerm: string): string {
    if (!searchTerm || !value) {
      return value;
    }

    function substituteChars(input: string): string {
      return input
        .replace(/s/g, '[sš]')
        .replace(/dj/g, '[đdj]')
        .replace(/c/g, '[cćč]')
        .replace(/z/g, '[zž]');
    }
    const normalizedInputValue = substituteChars(searchTerm.toLowerCase());
    const regex = new RegExp(`(${normalizedInputValue})`, 'gi');

    return value.replace(regex, '<strong>$1</strong>');
  }
}
