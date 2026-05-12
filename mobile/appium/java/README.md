# Evinced Appium Java SDK Examples (Maven)

## Prerequisites

- Java 11+
- Maven
- Android Studio with an emulator configured (`Pixel_9_Pro_XL_API_35` AVD by default)
- Appium server installed (`npm install -g appium`)
- Appium UIAutomator2 driver (`appium driver install uiautomator2`)
- Evinced service account credentials (`EVINCED_SERVICE_ID` and `EVINCED_API_KEY`)

## Setup

```bash
export EVINCED_SERVICE_ID=your_service_id
export EVINCED_API_KEY=your_api_key
```

## Running the tests

1. Start Appium: `appium`
2. Start your emulator: `~/Library/Android/sdk/emulator/emulator -avd Pixel_9_Pro_XL_API_35`
3. Run all tests: `mvn clean test`
4. Run a single test class: `mvn test -Dtest=EvincedExampleTest`

## Test files

| File | Pattern | Description |
|------|---------|-------------|
| `EvincedExampleTest.java` | One-shot scan | Calls `evincedSdk.report()` to scan a single screen. |
| `EvincedContinuousTest.java` | Continuous / multi-screen | Calls `startAnalyze()`, navigates across multiple screens with `analyze()` per screen, then `stopAnalyze()` to collect one `Report` per screen. |
| `EvincedConfiguredTest.java` | Config + metadata | Uses `EvincedConfig` + `IssueFilter` to exclude Minor-severity issues, and `addTestCaseMetadata()` to attach custom key/value labels to the report. |
| `EvincedPlatformUploadTest.java` | Platform upload | Shows two upload approaches: `ENABLED_BY_DEFAULT` (all scans upload automatically) and per-call upload via `report(PlatformUpload.ENABLED)`. |
| `EvincedAppScannerTest.java` | App Scanner (local only) | Uses `EvincedAppScanner` to autonomously explore the app, clicking through screens and scanning each one without manual navigation. Requires a local Appium server — excluded from CI. |

### Running EvincedAppScannerTest locally

This test connects to a local Appium server instead of Sauce Labs. Before running:

1. Start Appium: `appium`
2. Start your emulator: `~/Library/Android/sdk/emulator/emulator -avd Pixel_9_Pro_XL_API_35`
3. Run the test:

```bash
mvn test -Dtest=EvincedAppScannerTest -DfailIfNoTests=false
```

## SDK API summary

| Method | Description |
|--------|-------------|
| `new EvincedAppiumSdk(driver)` | Create SDK instance |
| `new EvincedAppiumSdk(driver, initOptions)` | Create SDK instance with config |
| `evincedSdk.setupCredentials(serviceId, apiKey)` | Authenticate |
| `evincedSdk.report()` | One-shot scan; returns `Report` |
| `evincedSdk.report(PlatformUpload.ENABLED)` | One-shot scan, uploaded to the Evinced Platform |
| `evincedSdk.analyze()` | Capture the current screen without generating a report file |
| `evincedSdk.startAnalyze()` | Begin a continuous scan session |
| `evincedSdk.stopAnalyze()` | End session; returns `List<Report>` (one per `analyze()` call) |
| `evincedSdk.stopAnalyze(PlatformUpload.ENABLED)` | End session and upload all reports to the Platform |
| `evincedSdk.reportStored()` | Generate report from all stored `analyze()` scans |
| `evincedSdk.reportStored(PlatformUpload.ENABLED)` | Same, with platform upload |
| `evincedSdk.addTestCaseMetadata(key, value)` | Attach custom metadata labels |

## Platform upload

To upload results to the Evinced Platform, configure `InitOptions` with a `PlatformConfig`:

```java
// Upload every report() call automatically
InitOptions.PlatformConfig platformConfig =
        new InitOptions.PlatformConfig(InitOptions.UploadOption.ENABLED_BY_DEFAULT);
InitOptions initOptions = new InitOptions(platformConfig);
EvincedAppiumSdk evincedSdk = new EvincedAppiumSdk(driver, initOptions);

// Or upload only specific calls
Report report = evincedSdk.report(PlatformUpload.ENABLED);
```

> **Note:** There is no `evStart`/`evStop` or `evAnalyze` in the mobile SDK.
> Use `startAnalyze()`/`stopAnalyze()` for continuous mode and `report()` for one-shot scans.

## Docs

[Evinced Appium Java SDK documentation](https://developer.evinced.com/sdks-for-mobile-apps/appium-sdk-java-doc)