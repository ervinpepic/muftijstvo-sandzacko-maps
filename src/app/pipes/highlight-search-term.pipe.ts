import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightSearchTerm',
  standalone: true
})
export class HighlightSearchTermPipe implements PipeTransform {

  transform(value: string, searchTerm: string): string {
    if (!searchTerm || !value) {
      return value;
    }

    const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedTerm, 'gi');
    return value.replace(regex, (match) => `<strong>${match}</strong>`);
  }

}
