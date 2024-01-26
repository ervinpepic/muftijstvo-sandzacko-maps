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
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();

    const suggestions = document.querySelectorAll(
      '.search-suggestions .hover-effect'
    );
    if (suggestions.length === 0) {
      // No suggestions, do nothing
      return;
    }

    if (event.key === 'ArrowDown') {
      currentIndex =
        currentIndex < suggestions.length - 1 ? currentIndex + 1 : 0;
    } else if (event.key === 'ArrowUp') {
      currentIndex =
        currentIndex > 0 ? currentIndex - 1 : suggestions.length - 1;
    }

    suggestions.forEach((suggestion, index) => {
      suggestion.setAttribute('tabindex', index === currentIndex ? '0' : '-1');
    });

    const selectedSuggestion = suggestions[currentIndex] as HTMLLIElement;
    selectedSuggestion.focus();
    setSearchQuery(suggestionsList[currentIndex]);
  } else if (event.key === 'Enter') {
    // Handle Enter key press to select the current suggestion
    event.preventDefault(); // Prevent the default Enter key behavior
    selectSearchSuggestion(suggestionsList[currentIndex]);
  }
}
