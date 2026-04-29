# dotnet-selenium-sdk

Evinced Selenium .NET SDK examples (NUnit, .NET 7).
Developer Docs: https://developer.evinced.com/sdks-for-web-apps/selenium-csharp-sdk

## Test classes

| Class | Pattern | Description |
|---|---|---|
| `EvAnalyze` | evAnalyze | One-shot scan: navigate, call `EvAnalyze()`, assert zero issues |
| `EvStartStop` | evStartStop | Continuous scan: `EvStart()` before interactions, `EvStop()` after, save HTML + JSON reports |
| `EvHooks` | evHooks | `[SetUp]`/`[TearDown]` lifecycle — each test gets a fresh session; report saved in `[TearDown]` |
| `EvScreenshot` | screenshot | Combines a browser screenshot with an `EvAnalyze()` scan |

## Shared helpers

| File | Purpose |
|---|---|
| `EvincedConfig.cs` | Reads `EVINCED_SERVICE_ID` / `EVINCED_WEB_OFFLINE_TOKEN` env vars and calls `SetOfflineCredentials`. `UploadToPlatform` is commented out by default — uncomment to send results to the Evinced Platform. |
| `GlobalUsings.cs` | Project-wide `global using` statements |

## Running

```bash
dotnet test
```

Credentials must be set in the environment before running:

```bash
export EVINCED_SERVICE_ID=<your-service-id>
export EVINCED_WEB_OFFLINE_TOKEN=<your-offline-token>
dotnet test
```
