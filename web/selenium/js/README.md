# Evinced Selenium JS SDK Examples

Accessibility testing examples using the [Evinced Selenium JS SDK](https://developer.evinced.com/sdks-for-web-apps/selenium-js-sdk) with JavaScript (Mocha).

## Prerequisites

- Node.js 18+
- Selenium 4+
- Chrome installed (Selenium Manager auto-downloads the matching ChromeDriver)
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

Credentials are set at module level via `setCredentials()`.

## Running the tests

```bash
npm test
```

Run a single file:

```bash
npx mocha test/evAnalyze.js
```

## Test files

| File | Pattern | Description |
|------|---------|-------------|
| `test/evAnalyze.js` | Single scan | Creates an `EvincedSDK` instance and calls `evAnalyze()` to scan the page; saves HTML and JSON reports |
| `test/evStartStop.js` | Continuous scan | Uses `evStart()` / `evStop()` to capture DOM changes across interactions; saves HTML and JSON reports |
| `test/evHooks.js` | Mocha hooks | `beforeEach`/`afterEach` wrap multiple tests; `evStart` in setup, `evStop` + file save in teardown |
| `test/evUploadToPlatform.js` | Platform upload | Demonstrates opt-in upload to Evinced Platform via `uploadToPlatform: true` on a single scan |
| `test/evFailIfCritical.js` | Severity filter | Filters issues by severity and asserts that no critical issues exist; suitable for CI gating |

## SDK API summary

| Method | Description |
|--------|-------------|
| `setCredentials({ serviceId, secret })` | Authenticate with online credentials |
| `new EvincedSDK(driver)` | Create a per-test instance, passing the Selenium WebDriver |
| `evincedService.evAnalyze(options?)` | Single-page scan; returns `Issue[]` |
| `evincedService.evStart(options?)` | Start continuous DOM monitoring |
| `evincedService.evStop(options?)` | Stop monitoring; returns all collected `Issue[]` |
| `evincedService.evSaveFile(issues, format, path)` | Save report to disk (`html`, `json`, `sarif`, `csv`) |

## Docs

[Evinced Selenium JS SDK documentation](https://developer.evinced.com/sdks-for-web-apps/selenium-js-sdk)
