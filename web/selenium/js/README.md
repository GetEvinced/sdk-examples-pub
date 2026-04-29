# Evinced Selenium SDK

## 100% Test Coverage Using All Methods

This repository ensures 100% test coverage using all available testing methods.

## Usage

To run the tests, ensure you are in the "js-selenium-web" directory and use the following command:

## Getting started

1. Clone the repository
2. Install dependencies 
    ```bash
    npm install
    ```
3. Ensure you add your `.npmrc` file and credentials
4. If everything installed, you are ready to run `npm test`

## Test Files

| File | Description |
|------|-------------|
| `test/evAnalyze.js` | Single-page scan using `evAnalyze`; saves HTML and JSON reports |
| `test/evStartStop.js` | Continuous scan with `evStart`/`evStop`; saves HTML and JSON reports |
| `test/evHooks.js` | Mocha `beforeEach`/`afterEach` hooks wrapping multiple tests; `evStart` in setup, `evStop` + file save in teardown |
| `test/evUploadToPlatform.js` | Demonstrates opt-in upload to Evinced Platform via `uploadToPlatform: true` on a single scan |
| `test/evFailIfCritical.js` | Filters issues by severity and asserts on count. Use this pattern to fail builds on critical issues. |

## Testing Framework

This repository utilizes [Selenium](https://www.selenium.dev/documentation/) to test React-based components that follow best practices with Evinced.
