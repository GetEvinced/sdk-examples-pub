# Evinced Unit Tester with Vitest (browser mode)

This example runs Unit Tester in a **real browser** (Chromium) via [Vitest](https://vitest.dev/) with [@vitest/browser](https://vitest.dev/guide/browser) and demonstrates inline HTML in tests (no fixture files).

## Usage

```sh
npm install
npm test
```

- `npm run test:watch` — watch mode
- `npm run test:ui` — Vitest UI
- `DEBUG=true npm test` — run with browser visible (non-headless)

## Test Files

| File | SDK Method | Notes |
|------|-----------|-------|
| `test/button.test.js` | `analyzeButton` | Accessible button passes; button without name fails with `button name` result |
| `test/accordion.test.js` | `analyzeAccordion` | Accordion without toggle behavior fails with `toggle activation` result |
| `test/checkbox.test.js` | `analyzeCheckbox` | Labeled checkbox passes; unlabeled checkbox fails with `checkbox name` result |

All tests use inline HTML (no fixture files), `chai` + `evincedChaiPlugin` for assertions, and call `configure()` with optional service account credentials.

## Authentication (optional)

To use authenticated Evinced APIs, install the SDK (e.g. via `.npmrc`; contact Evinced if needed), then:

```sh
npx --package=@evinced/unit-tester login
```

You can also pass `AUTH_SERVICE_ID` and `AUTH_SECRET` via environment variables; they are exposed in the browser as `globalThis.__VITEST_ENV__`.
