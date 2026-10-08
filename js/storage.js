/**
 * storage.js - Defensive LocalStorage Persistence Layer
 * 
 * Complies with Constitution Principle IV (Resilient State & Defensive Persistence).
 * Provides robust error handling, schema validation, and in-memory fallback.
 */

const STORAGE_KEY = "qotd_favorites_v1";

// In-memory fallback store in case localStorage is disabled or restricted
const inMemoryFallback = {
  favorites: new Set(),
  isActive: false
};

/**
 * Checks if localStorage is available and writable.
 * 
 * @returns {boolean} True if localStorage can be used
 */
function isLocalStorageAvailable() {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return false;
    }
    const testKey = "__qotd_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Validates and sanitizes a raw favorites array.
 * 
 * @param {*} data - Raw parsed JSON data
 * @returns {string[]} Sanitized array of unique string IDs
 */
function sanitizeFavoritesData(data) {
  if (!Array.isArray(data)) {
    return [];
  }
  const validIds = data
    .filter(item => typeof item === "string" && item.trim().length > 0)
    .map(item => item.trim());
  return Array.from(new Set(validIds));
}

/**
 * Retrieves the list of favorited quote IDs.
 * 
 * @param {Object} [mockStorage] - Optional storage object for testing
 * @returns {string[]} Array of favorited quote IDs
 */
function getFavorites(mockStorage = null) {
  const storage = mockStorage || (isLocalStorageAvailable() ? window.localStorage : null);

  if (!storage) {
    inMemoryFallback.isActive = true;
    return Array.from(inMemoryFallback.favorites);
  }

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return sanitizeFavoritesData(parsed);
  } catch (err) {
    console.warn("[StorageService] Failed to parse favorites from storage. Resetting to empty array.", err);
    // Reset corrupted storage to valid empty state
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch (_) {}
    return [];
  }
}

/**
 * Persists an array of favorited quote IDs.
 * 
 * @param {string[]} ids - Array of quote IDs
 * @param {Object} [mockStorage] - Optional storage object for testing
 * @returns {boolean} True if successfully saved
 */
function saveFavorites(ids, mockStorage = null) {
  const sanitized = sanitizeFavoritesData(ids);
  const storage = mockStorage || (isLocalStorageAvailable() ? window.localStorage : null);

  if (!storage) {
    inMemoryFallback.isActive = true;
    inMemoryFallback.favorites = new Set(sanitized);
    return true;
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    return true;
  } catch (err) {
    console.warn("[StorageService] Storage write failed. Falling back to in-memory store.", err);
    inMemoryFallback.isActive = true;
    inMemoryFallback.favorites = new Set(sanitized);
    return false;
  }
}

/**
 * Checks if a specific quote ID is favorited.
 * 
 * @param {string} id - Quote ID
 * @param {Object} [mockStorage] - Optional storage object for testing
 * @returns {boolean} True if favorited
 */
function isFavorite(id, mockStorage = null) {
  if (!id) return false;
  const favorites = getFavorites(mockStorage);
  return favorites.includes(id);
}

/**
 * Toggles the favorite status of a quote ID.
 * 
 * @param {string} id - Quote ID
 * @param {Object} [mockStorage] - Optional storage object for testing
 * @returns {{ isFavorite: boolean, favorites: string[] }} Updated status and list
 */
function toggleFavorite(id, mockStorage = null) {
  if (!id) {
    return { isFavorite: false, favorites: getFavorites(mockStorage) };
  }

  const currentFavorites = getFavorites(mockStorage);
  const index = currentFavorites.indexOf(id);
  let updatedFavorites;
  let currentlyFavorited;

  if (index >= 0) {
    updatedFavorites = currentFavorites.filter(favId => favId !== id);
    currentlyFavorited = false;
  } else {
    updatedFavorites = [...currentFavorites, id];
    currentlyFavorited = true;
  }

  saveFavorites(updatedFavorites, mockStorage);
  return {
    isFavorite: currentlyFavorited,
    favorites: updatedFavorites
  };
}

/**
 * Clears all favorites from storage.
 * 
 * @param {Object} [mockStorage] - Optional storage object for testing
 */
function clearFavorites(mockStorage = null) {
  const storage = mockStorage || (isLocalStorageAvailable() ? window.localStorage : null);
  inMemoryFallback.favorites.clear();
  if (storage) {
    try {
      storage.removeItem(STORAGE_KEY);
    } catch (_) {}
  }
}

// UMD / CommonJS / Browser compatibility
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    STORAGE_KEY,
    getFavorites,
    saveFavorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    sanitizeFavoritesData,
    isLocalStorageAvailable
  };
} else if (typeof window !== "undefined") {
  window.StorageService = {
    STORAGE_KEY,
    getFavorites,
    saveFavorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    sanitizeFavoritesData,
    isLocalStorageAvailable
  };
}
