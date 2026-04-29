# Evinced Selenium SDK — TypeScript

TypeScript examples for the Evinced JS Selenium SDK (Mocha, Selenium Manager).

## Getting started

1. Clone the repository
2. Install dependencies
    ```bash
    npm install
    ```
3. Ensure you add your `.npmrc` file and credentials
4. Run tests
    ```bash
    npm test
    ```

## Test Files

| File | Description |
|------|-------------|
| `test/evAnalyze.ts` | Single-page scan using `evAnalyze`; saves HTML and JSON reports |
| `test/evStartStop.ts` | Continuous scan with `evStart`/`evStop`; saves HTML and JSON reports |
| `test/evHooks.ts` | Mocha `beforeEach`/`afterEach` hooks wrapping multiple tests; `evStart` in setup, `evStop` + file save in teardown |
| `test/evFailIfCritical.ts` | Filters issues by severity and asserts on count. Use this pattern to fail builds on critical issues. |
| `test/evUploadToPlatform.ts` | Demonstrates opt-in upload to Evinced Platform via `uploadToPlatform: true` on a single scan |

## Notes

- Selenium Manager (bundled with `selenium-webdriver` 4.11+) automatically downloads the correct ChromeDriver for your installed Chrome version — no `chromedriver` package needed.
- The SDK ships a CJS bundle; imports use the default export pattern with `esModuleInterop: true`.
- Credentials are set in a `before()` hook rather than at module top-level, since CommonJS TypeScript does not support top-level `await`.
