# Evinced Unit Tester with Lit (Web Components)

This example runs Unit Tester in a jsdom environment via [Vitest](https://vitest.dev/) against a Lit Web Component (`<my-button>`). It uses [shadow-dom-testing-library](https://github.com/KonnorRogers/shadow-dom-testing-library) to query elements inside shadow DOM.

## Usage

```sh
npm install
npm test
```

- `npm run test:ui` — Vitest UI
- `npm run coverage` — coverage report

## Authentication (optional)

Install the SDK (e.g. via `.npmrc`; contact Evinced if needed), then:

```sh
npx --package=@evinced/unit-tester login
```

## Test Files

| File | SDK Method | Notes |
|------|-----------|-------|
| `test/basic.test.ts` | `analyzeButton` | Scans shadow-DOM button inside `<my-button>`; also covers interaction (click) and property rendering |
| `test/configure.test.ts` | `analyzeButton` | Demonstrates explicit SDK configuration via `configure()` with service account credentials from env vars |

## SDK API

Import: `import EvincedUT from '@evinced/unit-tester'`

The `analyzeButton` method accepts a locator object (e.g. `{ role: 'button' }`) and returns an array of test result objects. Use the `toHaveNoFailures()` custom matcher (extended via `@testing-library/jest-dom`) to assert on results.
