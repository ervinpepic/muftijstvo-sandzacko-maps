import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ellipsis',
  standalone: true
})
export class EllipsisPipe implements PipeTransform {

  /**
 * Truncates the input string and appends an ellipsis ('...') if its length exceeds the specified maximum length.
 * If the string's length is less than or equal to the maximum length, it returns the original string unmodified.
 * 
 * @param {string} value - The input string to be potentially truncated.
 * @param {number} maxLength - The maximum allowed length of the string before truncation.
 * @returns {string} The original string if its length is within the limit, or a truncated string with ellipsis otherwise.
 */
  transform(value: string, maxLength: number): string {
    if (value.length <= maxLength) {
      return value;
    }
    return value.substring(0, maxLength) + '...';
  }

}
