import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ellipsis',
  standalone: true
})
export class EllipsisPipe implements PipeTransform {

  /**
   * Truncates the input string and appends an ellipsis or a custom suffix if its length exceeds the specified maximum length.
   * Optionally, avoids truncating in the middle of words.
   * 
   * @param {string} value - The input string to be potentially truncated.
   * @param {number} maxLength - The maximum allowed length of the string before truncation.
   * @param {string} [suffix='...'] - The suffix to append to the truncated string.
   * @param {boolean} [preserveWords=false] - Whether to avoid cutting off words mid-word.
   * @returns {string} The original string if its length is within the limit, or a truncated string with the suffix otherwise.
   */
  transform(
    value: string,
    maxLength: number,
    suffix: string = '...',
    preserveWords: boolean = false
  ): string {
    if (!value || typeof value !== 'string' || maxLength <= 0) {
      return '';
    }

    if (value.length <= maxLength) {
      return value;
    }

    if (preserveWords) {
      const truncated = value.substring(0, maxLength);
      const lastSpaceIndex = truncated.lastIndexOf(' ');
      if (lastSpaceIndex > 0) {
        return truncated.substring(0, lastSpaceIndex) + suffix;
      }
    }

    return value.substring(0, maxLength) + suffix;
  }
}
