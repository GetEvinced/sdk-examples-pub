# Evinced Cypress TypeScript SDK Examples

Accessibility testing examples using the [Evinced Cypress SDK](https://developer.evinced.com/sdks-for-web-apps/cypress-sdk) with TypeScript.

## Prerequisites

- Node.js 18+
- Cypress 10+
- Evinced service account credentials (`EVINCED_SERVICE_ID` and `EVINCED_API_KEY`)
- `.npmrc` configured with Evinced registry credentials to install `@evinced/cypress-sdk`

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
export CYPRESS_EVINCED_SERVICE_ID=your_service_id
export CYPRESS_EVINCED_API_KEY=your_api_key
```

Credentials are picked up in `cypress/support/e2e.ts` via `Evinced.setCredentials()`.

## Running the tests

```bash
npx cypress run
```

Run a single spec:

```bash
npx cypress run --spec "cypress/e2e/evAnalyze.cy.ts"
```

## Test files

| File | Pattern | Description |
|------|---------|-------------|
| `evAnalyze.cy.ts` | Single scan | Calls `cy.evAnalyze()` to scan the page and asserts on issue count |
| `evStartStop.cy.ts` | Continuous scan | Uses `cy.evStart()` / `cy.evStop()` to capture DOM changes across interactions; shows opt-in platform upload |
| `evHooks.cy.ts` | Framework hooks | `beforeEach`/`afterEach` wrap multiple tests with continuous scanning and labels |
| `evSaveFile.cy.ts` | Save reports | Saves scan results to HTML and JSON using `cy.evSaveFile()` |
| `evFailIfCritical.cy.ts` | Severity filter | Filters issues by severity and asserts that no critical issues exist |

## SDK API summary

| Method | Description |
|--------|-------------|
| `Evinced.init(options?)` | Initialize once in `cypress/support/e2e.ts` |
| `Evinced.setCredentials({ serviceId, secret })` | Authenticate with online credentials |
| `cy.evAnalyze(options?)` | Single-page scan; returns `Issue[]` |
| `cy.evStart(options?)` | Start continuous DOM monitoring |
| `cy.evStop(options?)` | Stop monitoring; returns all collected `Issue[]` |
| `cy.evSaveFile(issues, format, path)` | Save report to disk (`html`, `json`, `sarif`, `csv`) |
| `cy.evGetUploadTestUrl()` | Get the Evinced Platform URL for the uploaded report |
| `cy.addLabel({ testName, environment, ... })` | Attach built-in labels to the report |
| `cy.customLabel({ key: value })` | Attach custom key-value labels |

## Docs

[Evinced Cypress SDK documentation](https://developer.evinced.com/sdks-for-web-apps/cypress-sdk)
