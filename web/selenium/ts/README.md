# Evinced Selenium TypeScript SDK Examples

Accessibility testing examples using the [Evinced Selenium JS SDK](https://developer.evinced.com/sdks-for-web-apps/selenium-js-sdk) with TypeScript (Mocha).

## Prerequisites

- Node.js 18+
- Selenium 4.11+ (Selenium Manager bundled — no separate ChromeDriver install needed)
- Chrome installed
- Evinced service account credentials (`EVINCED_SERVICE_ID` and `EVINCED_API_KEY`)
- `.npmrc` configured with Evinced registry credentials to install `@evinced/js-selenium-sdk`

## Setup

### 1. Configure the npm registry

Add to `.npmrc` in this directory:

```
@evinced:registry=https://evinced.jfrog.io/artifactory/api/npm/restricted-npm/
//evinced.jfrog.io/artifactory/api/npm/restricted-npm/:_authToken=<your-token>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set credentials

```bash
export EVINCED_SERVICE_ID=your_service_id
export EVINCED_API_KEY=your_api_key
```

Credentials are set in a `before()` hook via `setCredentials()`.

## Running the tests

```bash
npm test
```

Run a single file:

```bash
npx mocha test/evAnalyze.ts
```

## Test files

| File | Pattern | Description |
|------|---------|-------------|
| `test/evAnalyze.ts` | Single scan | Creates an `EvincedSDK` instance and calls `evAnalyze()` to scan the page; saves HTML and JSON reports |
| `test/evStartStop.ts` | Continuous scan | Uses `evStart()` / `evStop()` to capture DOM changes across interactions; saves HTML and JSON reports |
| `test/evHooks.ts` | Mocha hooks | `beforeEach`/`afterEach` wrap multiple tests; `evStart` in setup, `evStop` + file save in teardown |
| `test/evFailIfCritical.ts` | Severity filter | Filters issues by severity and asserts that no critical issues exist; suitable for CI gating |
| `test/evUploadToPlatform.ts` | Platform upload | Demonstrates opt-in upload to Evinced Platform via `uploadToPlatform: true` on a single scan |

## SDK API summary

| Method | Description |
|--------|-------------|
| `setCredentials({ serviceId, secret })` | Authenticate with online credentials |
| `new EvincedSDK(driver)` | Create a per-test instance, passing the Selenium WebDriver |
| `evincedService.evAnalyze(options?)` | Single-page scan; returns `Issue[]` |
| `evincedService.evStart(options?)` | Start continuous DOM monitoring |
| `evincedService.evStop(options?)` | Stop monitoring; returns all collected `Issue[]` |
| `evincedService.evSaveFile(issues, format, path)` | Save report to disk (`html`, `json`, `sarif`, `csv`) |

## Notes

- Selenium Manager (bundled with `selenium-webdriver` 4.11+) automatically downloads the correct ChromeDriver — no separate install needed.
- Credentials are set in a `before()` hook rather than at module top-level, since CommonJS TypeScript does not support top-level `await`.

## Docs

[Evinced Selenium JS SDK documentation](https://developer.evinced.com/sdks-for-web-apps/selenium-js-sdk)
