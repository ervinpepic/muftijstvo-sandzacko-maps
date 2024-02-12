import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
/**
 * Handles arrow key navigation within search suggestions.
 * - Prevents default browser behavior for arrow keys
 * - Retrieves suggestions and their count
 * - Updates the current index based on the arrow key pressed
 * - Sets focus on the selected suggestion and updates the search query
 * - Handles Enter key press to select the current suggestion
 *
 * @param event - The keyboard event triggering the navigation
 * @param currentIndex - The current index of the selected suggestion
 * @param suggestionsList - The list of search suggestions
 * @param setSearchQuery - A function to update the search query
 * @param selectSearchSuggestion - A function to handle the selection of a search suggestion
 */
export function arrowKeyNavigation(
  currentIndex: number,
  suggestionsList: string[],
  setSearchQuery: (query: string) => void,
  viewport: CdkVirtualScrollViewport
): void {
  const currentListLength = suggestionsList.length;

  // Scroll to the selected suggestion
  scrollToIndex(viewport, currentIndex);

  // Set the search query based on the selected suggestion
  if (currentIndex >= 0 && currentIndex < currentListLength) {
    setSearchQuery(suggestionsList[currentIndex]);
  }
}

function scrollToIndex(
  viewport: CdkVirtualScrollViewport,
  index: number
): void {
  if (index >= 0) {
    const listItemHeight = 50; // Adjust this value based on your item height
    const scrollOffset =
      (index + 0.5) * listItemHeight - viewport.getViewportSize() / 2;
    viewport.scrollToOffset(scrollOffset);
  }
}
