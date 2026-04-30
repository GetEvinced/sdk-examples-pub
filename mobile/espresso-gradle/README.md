# Evinced Espresso / UIAutomator SDK Examples

## Why Gradle, not Maven

Espresso and UIAutomator tests are **Android instrumentation tests** — they run
directly on the device inside the Android build system. Android projects require
Gradle. The Maven snippet in the Evinced docs is only for declaring the
dependency in Maven-based CI pipelines; it cannot build or run Android tests.

## Prerequisites

- Android Studio (installs the Gradle wrapper and Android SDK automatically)
- Android emulator configured (`Pixel_9_Pro_XL_API_35` AVD by default)
- Demo APK installed on the emulator:
  ```bash
  adb install mobile/appium/python/com.evinced.demoapp-MK.apk
  ```
- Evinced service account credentials (`EVINCED_SERVICE_ID` and `EVINCED_API_KEY`)

## Setup

1. Open the `mobile/espresso/` folder in Android Studio — it will sync Gradle and download dependencies automatically.
2. Connect your emulator (`adb devices` should list it).
3. Install the demo APK if not already installed (see Prerequisites).

## Running the tests

Credentials are passed as instrumentation arguments so they never appear in source code:

```bash
./gradlew connectedDebugAndroidTest \
  -Pandroid.testInstrumentationRunnerArguments.EVINCED_SERVICE_ID=$EVINCED_SERVICE_ID \
  -Pandroid.testInstrumentationRunnerArguments.EVINCED_API_KEY=$EVINCED_API_KEY
```

Run a single test class:

```bash
./gradlew connectedDebugAndroidTest \
  -Pandroid.testInstrumentationRunnerArguments.class=com.evinced.examples.EvincedExampleTest \
  -Pandroid.testInstrumentationRunnerArguments.EVINCED_SERVICE_ID=$EVINCED_SERVICE_ID \
  -Pandroid.testInstrumentationRunnerArguments.EVINCED_API_KEY=$EVINCED_API_KEY
```

Reports are saved to the device. Search logcat for `evinced_report_path` to find the path, then pull:

```bash
adb pull <path_from_logcat> ./evinced-reports
```

## Test files

| File | Pattern | Description |
|------|---------|-------------|
| `EvincedExampleTest.java` | One-shot scan | Calls `evincedEngine.report()` to scan the current screen immediately. |
| `EvincedMultiScreenTest.java` | Multi-screen | Calls `analyze()` at each screen checkpoint then `reportStored()` to collect one `Report` per state. |
| `EvincedContinuousTest.java` | Continuous | Calls `startAnalyze()` to begin automatic scanning, interacts with the app, then `stopAnalyze()` to collect all reports. |
| `EvincedConfiguredTest.java` | Config + metadata | Uses `IssueFilter` + `EvincedConfig` to exclude NeedsReview-severity issues, and `addTestCaseMetadata()` to attach custom labels. |
| `EvincedPlatformUploadTest.java` | Platform upload | Shows `ENABLED_BY_DEFAULT` (all scans upload automatically) and per-call upload via `report(PlatformUpload.ENABLED)`. |

## How it works

These tests use **UIAutomator** (not Espresso) so they work against the pre-built
demo APK without needing its source code. UIAutomator interacts with any installed
app cross-process. The `EvincedEngine` wraps both Espresso and UIAutomator — the
API is identical regardless of which you use.

## SDK API summary

| Method | Description |
|--------|-------------|
| `EvincedEngine.setupCredentials(serviceId, apiKey)` | Authenticate (static, call before `getInstance`) |
| `EvincedEngine.getInstance(instrumentation)` | Create engine instance |
| `EvincedEngine.getInstance(instrumentation, initOptions)` | Create engine with config |
| `evincedEngine.report()` | One-shot scan; returns `Report` |
| `evincedEngine.report(PlatformUpload.ENABLED)` | One-shot scan, uploaded to the Evinced Platform |
| `evincedEngine.analyze()` | Capture current screen without generating a report |
| `evincedEngine.reportStored()` | Generate reports from all stored `analyze()` calls; returns `List<Report>` |
| `evincedEngine.startAnalyze()` | Begin continuous automatic scanning |
| `evincedEngine.stopAnalyze()` | End continuous session; returns `List<Report>` |
| `evincedEngine.addTestCaseMetadata(key, value)` | Attach custom metadata labels |

## Platform upload

```java
InitOptions initOptions = new InitOptions(
    new InitOptions.PlatformConfig(InitOptions.UploadOption.ENABLED_BY_DEFAULT)
);
EvincedEngine evincedEngine = EvincedEngine.getInstance(instrumentation, initOptions);

// All report() calls now upload automatically, or upload selectively:
evincedEngine.report(PlatformUpload.ENABLED);
```

## Filtering issues

```java
IssueFilter filter = new IssueFilter()
    .severity(Severity.NeedsReview);
EvincedConfig config = new EvincedConfig()
    .excludeFilters(filter);
InitOptions initOptions = new InitOptions()
    .setEvincedConfig(config);
```
