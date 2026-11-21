# Docket web client

React 19 + TypeScript + Vite + Tailwind CSS 4.

```bash
npm install
npm run dev        # http://localhost:5173
npm run lint
npm run typecheck
npm test
npm run build
```

The API is expected at `http://localhost:5003` (override with `VITE_API_BASE_URL`). Design
context lives in the repository root: `PRODUCT.md` for product truth and `DESIGN.md` for the
visual system. `npm run detect` runs the Impeccable anti-slop detector.
