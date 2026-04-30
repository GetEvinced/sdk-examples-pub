# Evinced TestCafe JS SDK Examples

Accessibility testing examples using the [Evinced TestCafe SDK](https://developer.evinced.com/sdks-for-web-apps/testcafe-js-sdk) with JavaScript.

## Prerequisites

- Node.js 18+
- TestCafe 3.6+
- Chrome installed
- Evinced service account credentials (`EVINCED_SERVICE_ID` and `EVINCED_API_KEY`)
- `.npmrc` configured with Evinced registry credentials to install `@evinced/js-testcafe-sdk`

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

Credentials are set at the start of each test via `setCredentials()`.

## Running the tests

```bash
testcafe chrome tests/
```

Run a single spec:

```bash
testcafe chrome tests/evAnalyze.test.js
```

## Test files

| File | Pattern | Description |
|------|---------|-------------|
| `tests/evAnalyze.test.js` | Single scan | Creates an `EvincedSDK` instance and calls `evAnalyze()` to scan the page; saves HTML and JSON reports with labels |
| `tests/evStartStop.test.js` | Continuous scan | Uses `evStart()` / `evStop()` to capture DOM changes across user interactions; saves HTML report |
| `tests/evHooks.test.js` | Fixture hooks | `beforeEach`/`afterEach` on a TestCafe fixture wrap every test with continuous scanning; opt-in platform upload |
| `tests/evFailIfCritical.test.js` | Severity filter | Filters issues by severity and asserts that no critical issues exist; suitable for CI gating |
| `tests/skipValidations.test.js` | Skip validations | Demonstrates filtering issues by selector, URL regex, and validation type via `skipValidations` |

## SDK API summary

| Method | Description |
|--------|-------------|
| `setCredentials({ serviceId, secret })` | Authenticate with online credentials |
| `new EvincedSDK(t)` | Create a per-test instance, passing the TestCafe test controller `t` |
| `evinced.evAnalyze(options?)` | Single-page scan; returns `Issue[]` |
| `evinced.evStart(options?)` | Start continuous DOM monitoring |
| `evinced.evStop(options?)` | Stop monitoring; returns all collected `Issue[]` |
| `evinced.evSaveFile(issues, format, path)` | Save report to disk (`html`, `json`, `sarif`, `csv`) |
| `evinced.addLabel({ testName, environment, ... })` | Attach built-in labels to the report |

## Docs

[Evinced TestCafe SDK documentation](https://developer.evinced.com/sdks-for-web-apps/testcafe-js-sdk)
