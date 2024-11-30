const DEFAULT_CACHE_VALIDITY = 1000 * 60 * 60 * 24 * 30; // 30 days

export const StorageUtil = {
  /**
   * Saves data to localStorage with a timestamp.
   * @param {string} key The key under which to store the data.
   * @param {T} data The data to be stored. Can be any serializable type.
   * @param {number} [validityPeriod] Optional validity period in milliseconds.
   */
  saveToLocalStorage<T>(key: string, data: T, validityPeriod?: number): void {
    const payload = {
      timestamp: Date.now(),
      data,
      validityPeriod,
    };
    localStorage.setItem(key, JSON.stringify(payload));
  },

  /**
   * Retrieves and parses data from localStorage, validating its cache status.
   * @param {string} key The key associated with the stored data.
   * @param {number} [validityPeriod=DEFAULT_CACHE_VALIDITY] The validity period in milliseconds.
   * @returns {T | null} The parsed data if valid, or null if invalid or expired.
   */
  getFromLocalStorage<T>(
    key: string,
    validityPeriod: number = DEFAULT_CACHE_VALIDITY
  ): T | null {
    const item = localStorage.getItem(key);
    if (!item) return null;

    try {
      const parsed = JSON.parse(item);
      const { timestamp, data } = parsed;

      if (!timestamp || !data || !this.isCacheValid(timestamp, validityPeriod)) {
        this.removeFromLocalStorage(key); // Remove expired data
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error parsing localStorage data:', error);
      this.removeFromLocalStorage(key); // Clean up corrupted data
      return null;
    }
  },

  /**
   * Removes an item from localStorage.
   * @param {string} key The key associated with the item to remove.
   */
  removeFromLocalStorage(key: string): void {
    localStorage.removeItem(key);
  },

  /**
   * Clears all localStorage data.
   */
  clearAll(): void {
    localStorage.clear();
  },

  /**
   * Determines if cached data is still valid based on its timestamp and a validity period.
   * @param {number} timestamp The timestamp of the cached data.
   * @param {number} validityPeriod The period in milliseconds for which the cache is considered valid.
   * @returns {boolean} True if the cache is still valid, otherwise false.
   */
  isCacheValid(
    timestamp: number,
    validityPeriod: number = DEFAULT_CACHE_VALIDITY
  ): boolean {
    const now = Date.now();
    return now - timestamp < validityPeriod;
  },
};
