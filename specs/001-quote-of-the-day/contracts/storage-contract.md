# Storage & Logic Interface Contract: Quote-of-the-Day

## 1. Storage API Contract (`storage.js`)

The `StorageService` module encapsulates all communication with persistent browser storage.

### `getFavorites(): string[]`
- **Description**: Retrieves the list of favorited quote IDs from persistence.
- **Pre-conditions**: None.
- **Post-conditions**:
  - Returns an array of strings representing valid quote IDs.
  - Returns `[]` if storage is empty, inaccessible, or corrupted.
  - Never throws unhandled errors.

### `saveFavorites(ids: string[]): boolean`
- **Description**: Persists the list of quote IDs to `localStorage`.
- **Arguments**: `ids` - Array of string quote IDs.
- **Post-conditions**:
  - Updates `localStorage[qotd_favorites_v1]` with JSON array string.
  - Returns `true` if saved successfully, `false` if storage quota exceeded or unavailable.
  - Falls back to in-memory store on failure.

### `toggleFavorite(id: string): { isFavorite: boolean, favorites: string[] }`
- **Description**: Toggles favorite status for a given quote ID.
- **Arguments**: `id` - Quote identifier string.
- **Post-conditions**:
  - If `id` was present, it is removed.
  - If `id` was absent, it is added.
  - Persists new array and returns updated status and list.

### `isFavorite(id: string): boolean`
- **Description**: Checks if a given quote ID is currently favorited.
- **Returns**: `true` if favorited, `false` otherwise.

---

## 2. Quotes Selection Contract (`quotes.js`)

### `getRandomQuote(excludeId?: string): Quote`
- **Description**: Selects a quote uniformly at random from the collection.
- **Arguments**:
  - `excludeId` (optional): The ID of the currently active quote to avoid immediate repetition.
- **Post-conditions**:
  - If collection length > 1 and `excludeId` is provided, returned quote ID MUST NOT equal `excludeId`.
  - Always returns a valid `Quote` object with `id`, `text`, `author`, `category`.

### `getQuoteById(id: string): Quote | null`
- **Description**: Retrieves a quote by its unique ID.
- **Returns**: Matching `Quote` or `null` if not found.

### `getAllQuotes(): Quote[]`
- **Description**: Returns a copy of the built-in quote collection.
