# Binaire Freznel Assessment

A React + JavaScript model-search utility implementing the assessment requirements.

## Features

- Firebase email/password authentication
- Search by model name/family
- Search substring from the beginning or middle
- Debounced search + request throttling
- Pipeline, family, architecture, weight and safetensor filters
- Safetensor min/max range filtering
- Safetensor count and model-name sorting
- Responsive Adobe Spectrum-inspired UI
- Screen transitions and micro animations
- Online/offline indicator
- Offline cache using IndexedDB
- Service worker app-shell caching
- Background API synchronization
- API calls intentionally use Promise chains instead of async/await
- OOP service classes for API, cache, filtering, sorting and background sync

## Run

1. `npm install`
2. Copy `.env.example` to `.env`
3. Add Firebase Web App credentials.
4. Replace `VITE_MODELS_API_URL` with the assessment's hosted API URL if provided.
5. Enable Email/Password in Firebase Authentication.
6. `npm run dev`

## Production

`npm run build`

Deploy the generated `dist` folder to Firebase Hosting, Vercel, Netlify, etc.

## Firebase setup

Firebase Console → Authentication → Sign-in method → Email/Password → Enable.

Create a Web App under Project settings and put its configuration in `.env`.

## API adapter

The assessment PDF contains a placeholder for the API link, so the API URL is configurable rather than hard-coded to an unknown endpoint.

The default adapter understands Hugging Face-style model objects. If the supplied Binaire API has a different response shape, edit only `src/services/ModelApi.js`, especially `normalizeModel()`.

## Why no async/await?

The data layer uses Promise chaining:

```js
return fetch(url)
  .then(response => response.json())
  .then(data => cache.save(data))
  .then(() => data);
```

This keeps the asynchronous flow explicit while satisfying the assessment question.

## Large JSON safety

The app never overwrites the active cache directly. API data is downloaded into memory, validated, normalized, and written to a versioned IndexedDB cache transaction. A checksum-like metadata record and item count are stored with the cache. If parsing/validation fails, the previous known-good cache remains available.

For truly huge payloads, the next production step would be streaming NDJSON or paginated API responses rather than one giant JSON document.

## Architecture

- `ModelApi`: API/network layer
- `ModelCache`: IndexedDB persistence
- `ModelFilter`: filter/search logic
- `ModelSorter`: sorting logic
- `BackgroundSync`: periodic background refresh
- React pages/components: presentation only

This keeps the UI independent from the data implementation.
