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
  event: KeyboardEvent,
  currentIndex: number,
  suggestionsList: string[],
  setSearchQuery: (query: string) => void,
  selectSearchSuggestion: (suggestion: string) => void
): void {
  const suggestionsContainer = document.querySelector('.search-suggestions');
  if (!suggestionsContainer) return; // Exit if suggestions container not found

  const suggestions = Array.from(
    suggestionsContainer.querySelectorAll('.hover-effect')
  );

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      currentIndex = getNextIndex(currentIndex, suggestions.length);
      break;
    case 'ArrowUp':
      event.preventDefault();
      currentIndex = getPreviousIndex(currentIndex, suggestions.length);
      break;
    case 'Enter':
      event.preventDefault();
      selectSearchSuggestion(suggestionsList[currentIndex]);
      return; // Exit early to prevent setting search query
    default:
      return; // Ignore other keys
  }

  if (currentIndex >= 0 && currentIndex < suggestions.length) {
    const selectedSuggestion = suggestions[currentIndex] as HTMLLIElement;
    selectedSuggestion.focus();
    setSearchQuery(suggestionsList[currentIndex]);
  }
}

function getNextIndex(currentIndex: number, maxIndex: number): number {
  return (currentIndex + 1) % maxIndex;
}

function getPreviousIndex(currentIndex: number, maxIndex: number): number {
  return (currentIndex - 1 + maxIndex) % maxIndex;
}
