/**
 * test-storage.js - Automated Unit Tests for Storage Service
 * 
 * Complies with Constitution Principle II (Automated Verification) and IV (Defensive Persistence).
 * Tests serialization, deserialization, toggle behavior, and corrupt data recovery.
 */

const assert = require("node:assert");
const {
  STORAGE_KEY,
  getFavorites,
  saveFavorites,
  isFavorite,
  toggleFavorite,
  clearFavorites,
  sanitizeFavoritesData
} = require("../js/storage.js");

console.log("▶ Running tests for StorageService...");

// In-memory mock storage implementing Web Storage API interface
function createMockStorage(initialData = {}) {
  const store = new Map(Object.entries(initialData));
  return {
    getItem: (key) => store.has(key) ? store.get(key) : null,
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
    _store: store
  };
}

// Test 1: Empty storage initial state
const mockStorage1 = createMockStorage();
const initialFavorites = getFavorites(mockStorage1);
assert.deepStrictEqual(initialFavorites, [], "Empty storage should return empty array");
console.log("  ✓ Test 1: Empty storage initial state returns []");

// Test 2: Saving and retrieving favorites
const mockStorage2 = createMockStorage();
saveFavorites(["q-1", "q-3"], mockStorage2);
assert.strictEqual(mockStorage2.getItem(STORAGE_KEY), JSON.stringify(["q-1", "q-3"]));
const retrieved = getFavorites(mockStorage2);
assert.deepStrictEqual(retrieved, ["q-1", "q-3"]);
assert.strictEqual(isFavorite("q-1", mockStorage2), true);
assert.strictEqual(isFavorite("q-2", mockStorage2), false);
console.log("  ✓ Test 2: Save, retrieve, and isFavorite check passed");

// Test 3: Toggle favorite functionality
const mockStorage3 = createMockStorage();
// Toggle on
const res1 = toggleFavorite("q-5", mockStorage3);
assert.strictEqual(res1.isFavorite, true);
assert.deepStrictEqual(res1.favorites, ["q-5"]);
assert.strictEqual(isFavorite("q-5", mockStorage3), true);

// Toggle off
const res2 = toggleFavorite("q-5", mockStorage3);
assert.strictEqual(res2.isFavorite, false);
assert.deepStrictEqual(res2.favorites, []);
assert.strictEqual(isFavorite("q-5", mockStorage3), false);
console.log("  ✓ Test 3: Toggle favorite on and off passed");

// Test 4: Corrupted data handling (Defensive Persistence)
const mockStorage4 = createMockStorage({
  [STORAGE_KEY]: "{not valid json;;;"
});
const recovered = getFavorites(mockStorage4);
assert.deepStrictEqual(recovered, [], "Corrupted JSON should reset gracefully to empty array");
console.log("  ✓ Test 4: Corrupted JSON gracefully handled without crashing");

// Test 5: Non-array data handling
const mockStorage5 = createMockStorage({
  [STORAGE_KEY]: JSON.stringify({ malicious: "payload" })
});
const nonArrayRecovered = getFavorites(mockStorage5);
assert.deepStrictEqual(nonArrayRecovered, [], "Non-array JSON should return empty array");
console.log("  ✓ Test 5: Non-array payload safely normalized");

// Test 6: Sanitization strips invalid elements and duplicates
const dirtyData = ["q-1", "", "   ", 123, null, "q-1", "q-2"];
const cleaned = sanitizeFavoritesData(dirtyData);
assert.deepStrictEqual(cleaned, ["q-1", "q-2"], "Sanitization must deduplicate and keep only non-empty strings");
console.log("  ✓ Test 6: Data sanitization deduplicates and filters types");

console.log("✅ All StorageService unit tests passed successfully!\n");
