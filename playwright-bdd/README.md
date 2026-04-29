# Playwright BDD + Evinced SDK

This project demonstrates integrating the [Evinced JS Playwright SDK](https://www.evinced.com/docs/sdk/playwright-js) with [playwright-bdd](https://github.com/vitalets/playwright-bdd), which lets you write browser tests using Gherkin `.feature` files with Cucumber-style step definitions.

Each `.feature` file illustrates one Evinced SDK usage pattern. Step definitions live alongside the features in `tests/steps/`.

---

## Setup

```bash
npm install
npx playwright install --with-deps chromium
```

Set your Evinced credentials as environment variables (required for authentication via `global.settings.js`):

```bash
export EVINCED_SERVICE_ID=your-service-id
export EVINCED_API_KEY=your-api-key
```

To run all tests:

```bash
npm test
# equivalent: npx bddgen && npx playwright test
```

---

## Feature Files

### 1. `ev-analyze.feature` — One-Shot Scan

**Step definitions:** `tests/steps/evAnalyzeSteps.js`

Demonstrates `evAnalyze()`: a single snapshot scan of the current page state. No `evStart`/`evStop` is needed. Both an HTML and JSON report are saved after the scan.

```gherkin
Scenario: Scan the demo home page with evAnalyze
  Given I navigate to the Evinced demo home page
  Then I run an Evinced evAnalyze scan and save reports
```

Reports saved to `evinced-reports/evAnalyze.html` and `evinced-reports/evAnalyze.json`.

---

### 2. `ev-start-stop.feature` — Continuous Scan with Labels

**Step definitions:** `tests/steps/evStartStopSteps.js`

Demonstrates `evStart()`/`evStop()` for continuous monitoring across user interactions. Labels (`addLabel`, `customLabel`) attach metadata that appears on the Evinced Platform. Includes an `enableUploadToPlatform` opt-in comment.

```gherkin
Scenario: Scan the demo site while interacting with filters
  Given I start an Evinced continuous scan with labels
  And I open the Evinced demo site
  When I select the "backyard" property type filter
  And I select the "middle America" location filter
  Then I stop the Evinced scan and save the report
```

Report saved to `evinced-reports/evStartStop.html`.

---

### 3. `evinced-demo.feature` — Hooks Pattern (Before/After)

**Step definitions:** `tests/steps/evincedDemoSteps.js`

Demonstrates the `@Before`/`@After` Cucumber hook pattern. The `Before` hook initialises the SDK and attaches labels before each scenario. The `After` hook stops the scan and saves both HTML and JSON reports named after the scenario title.

This is the recommended approach when you want Evinced scanning applied automatically across many scenarios without repeating setup logic in every step.

```gherkin
Scenario: Search for Remote Arizona
  Given I am on the demo Evinced site
  When I select "backyard" from the "type" dropdown
  And I select "middle America" from the "where" dropdown
  And I click the "Search" button
  Then I see the option "Remote Arizona"
```

Reports saved to `evinced-reports/evinced-report-<scenario-title>.html/.json`.

---

### 4. `sample.feature` — Basic Hooks Pattern (Playwright.dev)

**Step definitions:** `tests/steps/sampleSteps.js`

A secondary example of the `Before`/`After` hook pattern applied to the Playwright documentation site. Useful for verifying the SDK works with any URL.

```gherkin
Scenario: Check get started link
  Given I am on home page
  When I click link "Get started"
  Then I see in title "Installation"
```

---

## Project Structure

```
playwright-bdd/
├── global.settings.js          # Evinced credentials (setCredentials)
├── playwright.config.js        # Playwright + BDD config
├── tests/
│   ├── features/
│   │   ├── ev-analyze.feature       # evAnalyze one-shot pattern
│   │   ├── ev-start-stop.feature    # evStart/evStop + labels pattern
│   │   ├── evinced-demo.feature     # Before/After hooks pattern
│   │   └── sample.feature           # Before/After hooks (alt site)
│   └── steps/
│       ├── evAnalyzeSteps.js        # Steps for ev-analyze.feature
│       ├── evStartStopSteps.js      # Steps for ev-start-stop.feature
│       ├── evincedDemoSteps.js      # Steps for evinced-demo.feature
│       └── sampleSteps.js           # Steps for sample.feature
└── evinced-reports/            # Generated reports (gitignored)
```

---

## How playwright-bdd Works

`playwright-bdd` reads `.feature` files, matches each Gherkin step to a definition in a `steps/` file, and generates native Playwright spec files under `.features-gen/`. Running `npx playwright test` then executes those generated specs exactly like any other Playwright test.

The Cucumber `Before`/`After` hooks from `createBdd()` map to Playwright's `beforeEach`/`afterEach`, so they run around every scenario automatically.

---

## Upload to Platform

To send results to the [Evinced Platform](https://www.evinced.com/platform):

1. Set `enableUploadToPlatform: true` in `setUploadToPlatformConfig()` (top of the relevant steps file).
2. Pass `{ uploadToPlatform: true }` to `evStop()` where applicable.
3. Ensure `EVINCED_SERVICE_ID` and `EVINCED_API_KEY` are set in your environment.
