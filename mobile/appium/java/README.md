# Evinced Appium Java SDK Examples (Maven)

## Prerequisites

- Java 11+
- Maven
- Android Studio with an emulator configured (`Pixel_9_Pro_XL_API_35` AVD by default)
- Appium server installed (`npm install -g appium`)
- Evinced service account credentials (`EVINCED_SERVICE_ID` and `EVINCED_API_KEY`)

## Setup

```bash
export EVINCED_SERVICE_ID=your_service_id
export EVINCED_API_KEY=your_api_key
```

## Running the tests

1. Start Appium: `appium --allow-insecure chromedriver_autodownload`
2. Start your emulator: `~/Library/Android/sdk/emulator/emulator -avd Pixel_9_Pro_XL_API_35`
3. Run all tests: `mvn clean test`

## Test files

| File | Pattern | Description |
|------|---------|-------------|
| `EvincedExampleTest.java` | One-shot scan | Calls `evincedSdk.report()` to scan a single screen and assert no issues. |
| `EvincedContinuousTest.java` | Continuous / multi-screen | Calls `startAnalyze()`, navigates across multiple screens with `analyze()` per screen, then `stopAnalyze()` to collect one `Report` per screen. |
| `EvincedConfiguredTest.java` | Config + metadata | Uses `EvincedConfig` + `IssueFilter` to exclude Minor-severity issues, and `addTestCaseMetadata()` to attach custom key/value labels to the report. |

## SDK API summary

| Method | Description |
|--------|-------------|
| `new EvincedAppiumSdk(driver)` | Create SDK instance |
| `new EvincedAppiumSdk(driver, initOptions)` | Create SDK instance with config |
| `evincedSdk.setupCredentials(serviceId, apiKey)` | Authenticate |
| `evincedSdk.report()` | Run a one-shot scan and save the report |
| `evincedSdk.analyze()` | Store a scan without generating a report file |
| `evincedSdk.startAnalyze()` | Begin a continuous scan session |
| `evincedSdk.stopAnalyze()` | End session; returns `List<Report>` (one per `analyze()` call) |
| `evincedSdk.reportStored()` | Generate report from all stored scans |
| `evincedSdk.addTestCaseMetadata(key, value)` | Attach custom metadata labels |

> **Note:** There is no `evStart`/`evStop` or `evAnalyze` in the mobile SDK.
> Use `startAnalyze()`/`stopAnalyze()` for continuous mode and `report()` for one-shot scans.