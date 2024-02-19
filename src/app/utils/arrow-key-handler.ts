import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

const LIST_ITEM_HEIGHT = 41; // Height of each suggestion item in the list

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
      scrollToIndex(viewport, newIndex + 0.03, 'down');
      break;
    case 'ArrowUp':
      if (currentIndex <= 0) { // Adjusted to handle when currentIndex is -1 or 0.
        newIndex = currentIndex === - 1 ? currentListLength - 1 : currentListLength - 1;
      } else {
        newIndex = currentIndex - 1;
      }
      scrollToIndex(viewport, newIndex - 0.09, 'up');
      break;
    case 'Enter':
      if (newIndex >= 0 && newIndex < currentListLength) {
        onEnter(newIndex);
      }
      return -1; // No change in index after Enter
    default:
      return -1; // No change in index for other keys
  }
  setSearchQueryIfNeeded(newIndex, suggestionsList, setSearchQuery);

  return newIndex;
}

/**
 * Scrolls the viewport to ensure the item at the specified index is visible.
 * Adjusts the scroll position to center the selected item in the viewport if possible.
 * 
 * @param viewport The virtual scroll viewport instance.
 * @param index The index of the item to scroll into view.
 * @param direction the way of the scrolling
 */
function scrollToIndex(
  viewport: CdkVirtualScrollViewport,
  index: number,
  direction: 'up' | 'down'
): void {
  if (!viewport || index < 0) return;

  const itemHeight = LIST_ITEM_HEIGHT; // Ensure this matches your actual item height
  const viewportSize = viewport.getViewportSize();
  const totalItemsHeight = viewport.getDataLength() * itemHeight;
  const viewportScrollPosition = viewport.measureScrollOffset()

  // When navigating down and we wrap to the first item or navigating up to the last item
  if ((direction === 'down' && index === 0) || (direction === 'up' && index === viewport.getDataLength() - 1)) {
    const targetScrollPosition = direction === 'down' ? 0 : totalItemsHeight - viewportSize;
    viewport.scrollToOffset(targetScrollPosition, 'smooth');
    return;
  }

  const itemTopPosition = index * itemHeight;
  const itemBottomPosition = itemTopPosition + itemHeight;

  // Adjust viewport only if the item is out of view
  if (itemBottomPosition > viewportScrollPosition + viewportSize) {
    viewport.scrollToOffset(itemTopPosition - viewportSize + itemHeight, 'smooth');
  } else if (itemTopPosition < viewportScrollPosition) {
    viewport.scrollToOffset(itemTopPosition, 'smooth');
  }
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