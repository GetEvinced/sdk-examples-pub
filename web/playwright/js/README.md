# Evinced Playwright JS SDK Examples

Accessibility testing examples using the [Evinced Playwright JS SDK](https://developer.evinced.com/sdks-for-web-apps/playwright-js-sdk) with JavaScript.

## Prerequisites

- Node.js 18+
- Playwright 1.25+
- Evinced service account credentials (`EVINCED_SERVICE_ID` and `EVINCED_API_KEY`)
- `.npmrc` configured with Evinced registry credentials to install `@evinced/js-playwright-sdk`

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

Credentials are set once in the global setup file via `setCredentials()`.

## Running the tests

```bash
npx playwright test
```

Run a single spec:

```bash
npx playwright test tests/evAnalyze.spec.js
```

## Test files

| File | Pattern | Description |
|------|---------|-------------|
| `tests/evAnalyze.spec.js` | Single scan | Creates an `EvincedSDK` instance and calls `evAnalyze()` to scan the page; saves HTML and JSON reports |
| `tests/evStartStop.spec.js` | Continuous scan | Uses `evStart()` / `evStop()` to capture DOM changes across interactions; shows opt-in platform upload |
| `tests/evHooks.spec.js` | Framework hooks | `beforeEach`/`afterEach` wrap multiple tests with continuous scanning and labels |
| `tests/evFailIfCritical.spec.js` | Severity filter | Filters issues by severity and asserts that no critical issues exist; suitable for CI gating |
| `tests/evFixture.spec.js` | Playwright fixture | Wraps every test with continuous scanning via a shared `evincedContMode` fixture |

## SDK API summary

| Method | Description |
|--------|-------------|
| `setCredentials({ serviceId, secret })` | Authenticate once in global setup |
| `new EvincedSDK(page)` | Create a per-test SDK instance |
| `evincedService.evAnalyze(options?)` | Single-page scan; returns `Issue[]` |
| `evincedService.evStart(options?)` | Start continuous DOM monitoring |
| `evincedService.evStop(options?)` | Stop monitoring; returns all collected `Issue[]` |
| `evincedService.evSaveFile(issues, format, path)` | Save report to disk (`html`, `json`, `sarif`, `csv`) |
| `evincedService.testRunInfo.addLabel({ testName, ... })` | Attach built-in labels to the report |
| `evincedService.testRunInfo.customLabel({ key: value })` | Attach custom key-value labels |
| `setUploadToPlatformConfig({ enableUploadToPlatform })` | Enable platform upload globally |

## Docs

[Evinced Playwright JS SDK documentation](https://developer.evinced.com/sdks-for-web-apps/playwright-js-sdk)
