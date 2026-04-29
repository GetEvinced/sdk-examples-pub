# Evinced JS TestCafe SDK 
This repository demonstrates the use of the Evinced SDK with examples in JavaScript. These examples showcase best practices for integrating the SDK and running accessibility tests efficiently.

## Getting started
1. Clone the repository
2. Install dependencies
```npm install```
3. Ensure you add your .npmrc file and credentials
If everything installed, you are ready to ```run testcafe chrome tests```
To note:
The SDK makes use of all features that are available through the Evinced SDK, we have screenshots, test reports, hooks, use of each available method, and parallel testing.
See our public docs for additional reference:
https://developer.evinced.com/sdks-for-web-apps/testcafe-js-sdk#getstarted

## Test Files

| File | Description |
|------|-------------|
| `tests/evAnalyze.test.js` | Single-page scan using `evAnalyze`; saves HTML and JSON reports with labels |
| `tests/evStartevStop.test.js` | Continuous scan with `evStart`/`evStop` across user interactions; saves HTML report |
| `tests/evHooks.test.js` | Fixture-level `beforeEach`/`afterEach` hooks; `evStart` in setup, `evStop` + HTML/JSON save in teardown (`uploadToPlatform` opt-in, off by default) |
| `tests/skipValidations.test.js` | Demonstrates filtering issues by selector, URL regex, and validation type via `skipValidations` |