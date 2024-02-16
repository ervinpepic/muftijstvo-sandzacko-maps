import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

const LIST_ITEM_HEIGHT = 50; // Height of each suggestion item in the list

/**
 * Handles keyboard navigation (ArrowUp, ArrowDown, Enter) within a suggestions list.
 * Updates the search query to reflect the currently highlighted suggestion and ensures
 * that the suggestion is visible within the virtual scroll viewport.
 * 
 * @param keyboardEventKey The key associated with the keyboard event.
 * @param currentIndex The current index of the selected suggestion.
 * @param suggestionsList An array of suggestion strings.
 * @param setSearchQuery Function to update the search query based on the selected suggestion.
 * @param onEnter Function to execute when the Enter key is pressed.
 * @param viewport The virtual scroll viewport instance for managing scroll position.
 * @returns The new index after keyboard navigation adjustments.
 */
export function handleSearchNavigationKeys(
  keyboardEventKey: string,
  currentIndex: number,
  suggestionsList: string[],
  setSearchQuery: (query: string) => void,
  onEnter: (currentIndex: number) => void,
  viewport: CdkVirtualScrollViewport
): number {
  if (!suggestionsList.length) return -1; // Return early if list is empty

  let newIndex = currentIndex;
  const currentListLength = suggestionsList.length;

  switch (keyboardEventKey) {
    case 'ArrowDown':
      newIndex = (currentIndex + 1) % currentListLength;
      break;
    case 'ArrowUp':
      if (currentIndex === -1) { // Special case to handle when currentIndex is -1.
        newIndex = currentListLength - 1; // Directly jump to the last element in the list.
      } else {
        newIndex = currentIndex === 0 ? currentListLength - 1 : currentIndex - 1;
      }
      break;
    case 'Enter':
      if (newIndex >= 0 && newIndex < currentListLength) {
        onEnter(newIndex);
      }
      return -1; // No change in index after Enter
    default:
      return -1; // No change in index for other keys
  }

  scrollToIndex(viewport, newIndex);
  setSearchQueryIfNeeded(newIndex, suggestionsList, setSearchQuery);

  return newIndex;
}

/**
 * Scrolls the viewport to ensure the item at the specified index is visible.
 * Adjusts the scroll position to center the selected item in the viewport if possible.
 * 
 * @param viewport The virtual scroll viewport instance.
 * @param index The index of the item to scroll into view.
 */
function scrollToIndex(
  viewport: CdkVirtualScrollViewport,
  index: number
): void {
  if (!viewport || index < 0) return;

  const scrollOffset = (index + 0.5) * LIST_ITEM_HEIGHT - viewport.getViewportSize() / 2;
  viewport.scrollToOffset(scrollOffset);
}

/**
 * Updates the search query based on the selected suggestion if the index is valid.
 * 
 * @param index The current index of the selected suggestion.
 * @param suggestionsList An array of suggestion strings.
 * @param setSearchQuery Function to update the search query.
 */
function setSearchQueryIfNeeded(
  index: number,
  suggestionsList: string[],
  setSearchQuery: (query: string) => void
): void {
  if (index >= 0 && index < suggestionsList.length) {
    setSearchQuery(suggestionsList[index]);
  }
}