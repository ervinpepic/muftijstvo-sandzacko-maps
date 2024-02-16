/**
 * Utility object for interacting with localStorage.
 */
export const StorageUtil = {
  /**
   * Saves data to localStorage with a timestamp.
   * @param {string} key The key under which to store the data.
   * @param {any} data The data to be stored. Can be any type that is serializable to JSON.
   */
  saveToLocalStorage(key: string, data: any): void {
    const payload = {
      timestamp: Date.now(),
      data,
    };
    localStorage.setItem(key, JSON.stringify(payload));
  },

  /**
   * Retrieves and parses data from localStorage.
   * @param {string} key The key associated with the stored data.
   * @returns {any | null} The parsed data if found, or null if no item exists for the given key.
   */
  getFromLocalStorage(key: string): any {
    const item = localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item);
  },

  /**
   * Removes an item from localStorage.
   * @param {string} key The key associated with the item to remove.
   */
  removeFromLocalStorage(key: string): void {
    localStorage.removeItem(key);
  },

  /**
   * Determines if cached data is still valid based on its timestamp and a validity period.
   * @param {number} timestamp The timestamp of the cached data.
   * @param {number} validityPeriod The period in milliseconds for which the cache is considered valid. Defaults to 30 days.
   * @returns {boolean} True if the cache is still valid, otherwise false.
   */
  isCacheValid(
    timestamp: number,
    validityPeriod: number = 1000 * 60 * 60 * 24 * 30
  ): boolean {
    const now = Date.now();
    return now - timestamp < validityPeriod;
  },
};
