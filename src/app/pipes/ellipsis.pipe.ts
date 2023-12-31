import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ellipsis',
  standalone: true
})
export class EllipsisPipe implements PipeTransform {

  // Transforms the input string to truncate it with ellipsis if it exceeds the specified maxLength
  transform(value: string, maxLength: number): string {
    if (value.length <= maxLength) {
      // Return the original string if it's shorter than or equal to maxLength
      return value;
    }
    // Return a truncated version of the string with ellipsis
    return value.substring(0, maxLength) + '...';
  }

}
