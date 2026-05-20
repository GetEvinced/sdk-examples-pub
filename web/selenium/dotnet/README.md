# Evinced Selenium C# SDK Examples

Accessibility testing examples using the [Evinced Selenium C# SDK](https://developer.evinced.com/sdks-for-web-apps/cs-selenium-sdk) (NUnit, .NET 7).

## Prerequisites

- .NET 7+
- Chrome installed
- Evinced service account credentials:
  - `EVINCED_SERVICE_ID` — your service account ID
  - `EVINCED_WEB_OFFLINE_TOKEN` — your offline token

## Setup

Set environment variables before running:

```bash
export EVINCED_SERVICE_ID=your_service_id
export EVINCED_WEB_OFFLINE_TOKEN=your_offline_token
```

`EvincedConfig.Initialize()` (called at the start of every test) reads these and calls `EvincedSDK.SetOfflineCredentials()`. To upload results to the Evinced Platform, uncomment `EvincedSDK.UploadToPlatform = true` in `EvincedConfig.cs`.

## Running the tests

```bash
dotnet test
```

## Test files

| Class | Pattern | Description |
|-------|---------|-------------|
| `EvAnalyze` | Single scan | Calls `driver.EvAnalyze()` to scan the page and asserts issues were found |
| `EvStartStop` | Continuous scan | Uses `driver.EvStart()` / `driver.EvStop()` to capture DOM changes across interactions; saves HTML and JSON reports |
| `EvHooks` | NUnit lifecycle | `[SetUp]`/`[TearDown]` wrap each test with a fresh scan session; report saved in teardown |
| `EvScreenshot` | Screenshot | Combines a browser screenshot with an `EvAnalyze()` scan |

## Shared helpers

| File | Purpose |
|------|---------|
| `EvincedConfig.cs` | Reads credentials from environment variables, calls `SetOfflineCredentials`, and creates a headless `ChromeDriver` |
| `GlobalUsings.cs` | Project-wide `global using` statements |

## SDK API summary

| Method | Description |
|--------|-------------|
| `EvincedSDK.SetOfflineCredentials(serviceId, token)` | Authenticate with offline token (static) |
| `EvincedDriverFactory.Create(driver)` | Wrap a Selenium driver with the Evinced driver |
| `driver.EvAnalyze(options?)` | Single-page scan; returns `IReport` |
| `driver.EvStart(options?)` | Start continuous DOM monitoring |
| `driver.EvStop(options?)` | Stop monitoring; returns `IReport` |
| `EvincedSDK.EvSaveFile(path, report, FileFormat.HTML, driver)` | Save HTML report (driver required for screenshots) |
| `EvincedSDK.EvSaveFile(path, report, FileFormat.JSON)` | Save JSON report |
| `EvincedSDK.UploadToPlatform` | Set to `true` to enable platform upload |

## Docs

[Evinced Selenium C# SDK documentation](https://developer.evinced.com/sdks-for-web-apps/cs-selenium-sdk)
