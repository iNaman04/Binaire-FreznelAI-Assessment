# Implementation notes

## Requirement mapping

| Assessment requirement | Implementation |
|---|---|
| Model name/family search | `ModelFilter` + search input |
| Start/middle substring | `String.includes()` |
| Debounce | `debounce()` |
| Throttle | `throttle()` |
| Pipeline/family/architecture/weight tags | Filter controls + normalized model fields |
| Safetensor min/max | numeric range |
| Safetensor sorting | `ModelSorter` |
| Name A-Z/Z-A | `ModelSorter` |
| Firebase-only auth | Firebase Authentication |
| Animations | CSS screen/card/micro animations |
| Offline mode | IndexedDB cache + service worker + online badge |
| Background fetch | `BackgroundSync` |
| No async-await | all data operations use Promise chains |
| OOP | API/cache/filter/sort/sync are ES classes |

## Important API caveat

The supplied assessment document has `LINK` placeholders for the API and hosted API. Therefore this project deliberately keeps the API URL in `.env`. The default value is compatible with the public Hugging Face model API, but the exact Binaire endpoint should be placed in `VITE_MODELS_API_URL` when supplied.

If the assessment API returns a different schema, modify `ModelApi.normalizeModel()` rather than changing UI code.

## Large-file safety answer

For a large JSON download:
1. Keep the previous cache until the new response has fully downloaded.
2. Parse and validate the new JSON before replacing the old cache.
3. Write the new snapshot as one IndexedDB transaction.
4. Store a version/timestamp and count so a partial/invalid result is not accepted.
5. For very large production payloads, prefer paginated/streaming NDJSON from the server.
