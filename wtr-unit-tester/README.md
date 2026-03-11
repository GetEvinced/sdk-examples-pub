# Evinced Unit Tester with Web Test Runner (browser mode)

This example runs Unit Tester in a **real browser** (Chromium) via [Web Test Runner](https://modern-web.dev/docs/test-runner/overview/) and demonstrates inline HTML in tests (no fixture files).

## Usage

```sh
npm install
npm test
```

- `npm run test:watch` — watch mode
- `npm run test:debug` — run with browser visible (non-headless)

## Authentication (optional)

To use authenticated Evinced APIs, install the SDK (e.g. via `.npmrc`; contact Evinced if needed), then:

```sh
npx --package=@evinced/unit-tester login
```

You can also pass `AUTH_SERVICE_ID` and `AUTH_SECRET` via environment variables; they are exposed in the browser as `window.__WTR_ENV__`.
