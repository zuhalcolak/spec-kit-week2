# Data Model & Entity Specifications: Quote-of-the-Day

## 1. Entities

### Quote Entity
Represents an individual inspirational quote in the curated collection.

| Field | Type | Required | Description | Example |
|:---|:---|:---:|:---|:---|
| `id` | `string` | Yes | Unique immutable identifier | `"q-1"` |
| `text` | `string` | Yes | The textual content of the quote | `"Simplicity is prerequisite for reliability."` |
| `author` | `string` | Yes | Name of the author or attribution | `"Edsger W. Dijkstra"` |
| `category` | `string` | Yes | Broad theme or topic tag | `"Software Engineering"` |

**JSON Schema Representation**:
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id": { "type": "string", "pattern": "^q-[0-9]+$" },
    "text": { "type": "string", "minLength": 5 },
    "author": { "type": "string", "minLength": 2 },
    "category": { "type": "string", "minLength": 2 }
  },
  "required": ["id", "text", "author", "category"],
  "additionalProperties": false
}
```

---

### Favorite State Entity
Represents the collection of quotes saved by the user in browser persistence.

| Field | Storage Target | Format | Description |
|:---|:---|:---|:---|
| `qotd_favorites_v1` | `localStorage` | JSON String | Array of quote ID strings: `["q-1", "q-5"]` |

**Validation Rules**:
1. Deserialized value MUST be an Array.
2. Every array element MUST be a string matching an existing quote ID.
3. Unrecognized IDs (e.g. from deprecated datasets) are filtered out on read.
4. If reading fails or value is corrupted, reset to empty array `[]`.

---

## 2. Application State Model (Runtime)

```typescript
interface AppState {
  currentQuote: Quote;
  favorites: Set<string>; // Set of quote IDs
  isFavoritesDrawerOpen: boolean;
}
```

## 3. State Transitions

1. **INITIALIZE**:
   - Load favorites from `storage.js` into state.
   - Pick initial random quote from `quotes.js`.
   - Render quote and synchronize favorite button state.
2. **NEXT_QUOTE**:
   - Call `getRandomQuote(currentQuote.id)` to guarantee a different quote.
   - Update `state.currentQuote`.
   - Update DOM and favorite button active state.
3. **TOGGLE_FAVORITE(quoteId)**:
   - If `state.favorites.has(quoteId)`: remove ID, persist change via `storage.js`.
   - Else: add ID, persist change via `storage.js`.
   - Update favorite button icon, ARIA attributes, and badge count.
   - Re-render favorites drawer list if open.
4. **SELECT_FAVORITE(quoteId)**:
   - Find quote by ID.
   - Set as `state.currentQuote`.
   - Close favorites drawer.
   - Update main quote card.
