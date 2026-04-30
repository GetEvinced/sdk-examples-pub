# Evinced WebdriverIO JS SDK Examples

Accessibility testing examples using the [Evinced WebdriverIO SDK](https://developer.evinced.com/sdks-for-web-apps/webdriverio-sdk) with JavaScript.

## Prerequisites

- Node.js 18+
- WebdriverIO 8+
- Chrome installed
- Evinced service account credentials (`EVINCED_SERVICE_ID` and `EVINCED_API_KEY`)
- `.npmrc` configured with Evinced registry credentials to install `@evinced/webdriverio-sdk`

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

Credentials are set in the WDIO config file via `setCredentials()`.

## Running the tests

```bash
npm test
```

Run a single spec:

```bash
npx wdio run wdio.conf.js --spec test/specs/evAnalyze.js
```

## Test files

| File | Pattern | Description |
|------|---------|-------------|
| `test/specs/evAnalyze.js` | Single scan | Calls `browser.evAnalyze()` to scan the page; saves HTML and JSON reports |
| `test/specs/evStartStop.js` | Continuous scan | Uses `browser.evStart()` / `browser.evStop()` to capture DOM changes across interactions |
| `test/specs/evHooks.js` | Framework hooks | `beforeEach`/`afterEach` automatically wrap every test with a continuous scan and save a per-test HTML report |
| `test/specs/evFailIfCritical.js` | Severity filter | Filters results to critical issues and asserts zero are present; suitable for CI gating |

## SDK API summary

| Method | Description |
|--------|-------------|
| `setCredentials({ serviceId, secret })` | Authenticate once in WDIO config |
| `browser.evAnalyze(options?)` | Single-page scan; returns `Issue[]` |
| `browser.evStart(options?)` | Start continuous DOM monitoring |
| `browser.evStop(options?)` | Stop monitoring; returns all collected `Issue[]` |
| `browser.evSaveFile(issues, format, path)` | Save report to disk (`html`, `json`, `sarif`, `csv`) |

## Docs

[Evinced WebdriverIO SDK documentation](https://developer.evinced.com/sdks-for-web-apps/webdriverio-sdk)
