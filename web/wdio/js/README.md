# Evinced WDIO SDK

## 100% Test Coverage Using All Methods

This repository ensures 100% test coverage using all available testing methods.

## Usage

To run the tests, ensure you are in the "js-wdio-web" directory and use the following command:

## Getting started

1. Clone the repository
2. Install dependencies 
    ```bash
    npm install
    ```
3. Ensure you add your `.npmrc` file and credentials
4. If everything installed, you are ready to run `npm test`

## Testing Framework

This repository utilizes [WebdriverIO](https://webdriver.io/) to test React-based components that follow best practices with Evinced.

## Test Files

| File | Description |
|------|-------------|
| `test/specs/evAnalyze.js` | Single point-in-time scan with `evAnalyze`; saves HTML and JSON reports |
| `test/specs/evStartStop.js` | Continuous scan using inline `evStart`/`evStop` to capture DOM changes across user interactions |
| `test/specs/evHooks.js` | `beforeEach`/`afterEach` hooks pattern — automatically wraps every test with a continuous scan and saves a per-test HTML report |
| `test/specs/evFailIfCritical.js` | Scans the page, filters results to Critical severity, and asserts zero critical issues — suitable for CI gating |