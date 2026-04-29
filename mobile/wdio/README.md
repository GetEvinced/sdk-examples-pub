# Evinced WDIO Mobile SDK

## Overview

This example demonstrates the Evinced WDIO Mobile SDK running on Sauce Labs. It uses `evincedWdioSDK.report()` (the mobile API) to generate an accessibility report at the end of each test.

## Test Files

- `test/specs/mobileTest.js` — launches the Evinced demo Android app on a Sauce Labs device and calls `evincedWdioSDK.report()`
- `test/specs/webTest.js` — runs a web login test via the Appium driver and calls `evincedWdioSDK.report()` (excluded from the default run via `wdio.conf.js`)

## Getting started

1. Clone the repository
2. Ensure you are in the `mobile/wdio` directory
3. Install dependencies:
    ```bash
    npm install
    ```
4. Add your `.npmrc` file with Evinced registry credentials
5. Set the required environment variables:
    ```bash
    export SAUCE_USER=<your Sauce Labs username>
    export SAUCE_ACCESS_KEY=<your Sauce Labs access key>
    export EVINCED_SERVICE_ID=<your Evinced service ID>
    export EVINCED_API_KEY=<your Evinced API key>
    ```
6. Run the tests:
    ```bash
    npm run wdio
    ```

## Sauce Labs Configuration

Tests run on Sauce Labs using the `@wdio/sauce-service`. The configuration in `wdio.conf.js` uses:

- `services: [["sauce"]]` — Sauce Labs service
- `region: "us"` — Sauce Labs US region
- `user` / `key` — read from `SAUCE_USER` / `SAUCE_ACCESS_KEY` environment variables
- `"appium:app": "storage:filename=com.evinced.demoapp-MK.apk"` — app uploaded to Sauce Labs app storage

## Testing Framework

This example uses [WebdriverIO](https://webdriver.io/) with the Mocha framework and Appium targeting an Android emulator on Sauce Labs.
