# Evinced Cypress SDK

## 100% Test Coverage Using All Methods

This repository ensures 100% test coverage using all available testing methods.

## Usage

To run the tests, ensure you are in the "js-cypress" directory and use the following command:

## Getting started

1. Clone the repository
2. Install dependencies 
    ```bash
    npm install
    ```
3. Ensure you add your `.npmrc` file and credentials
4. If everything installed, you are ready to run `npx cypress run`

To run individual tests run `npx cypress run --spec "cypress/e2e/your-test-file.cy.js"`

## Test Files

| File | Description |
|------|-------------|
| `evAnalyze.cy.js` | Single-scan pattern using `cy.evAnalyze()` — visits a page, scans, and asserts on issue count |
| `evStartStop.cy.js` | Continuous scan using `cy.evStart()` / `cy.evStop()` with labels; platform upload shown as opt-in |
| `evHooks.cy.js` | Framework hooks pattern — `beforeEach`/`afterEach` wrap multiple tests with labels and continuous scanning |
| `evSaveFile.cy.js` | Saves scan results to disk in both HTML and JSON formats using `cy.evSaveFile()` |
| `evFailIfCritical.cy.js` | Filters issues by severity and asserts that no critical issues are present |
| `evTestLink.cy.js` | Demonstrates retrieving the Evinced Platform test link after a scan |

## Testing Framework

This repository utilizes [Cypress](https://docs.cypress.io/app/end-to-end-testing/writing-your-first-end-to-end-test) to test React-based components that follow best practices with Evinced.
