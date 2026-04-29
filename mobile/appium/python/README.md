# Evinced Appium Python SDK Example

A working example of the Evinced Appium Python SDK integrated with pytest for Android accessibility testing.

## Prerequisites

- Python 3.7+
- Android Studio with an emulator configured
- Evinced service account credentials (service ID and API key)
- A valid Android APK

## Setup

### 1. Install Python evinced-appium-sdk

```bash
pip3 install evinced-appium-sdk --extra-index-url https://evinced.jfrog.io/artifactory/api/pypi/public-python/simple/
```

### 2. Configure environment variables

Add the following to your shell profile (`~/.zshrc` or `~/.bashrc`):

```bash
export EVINCED_SERVICE_ID=your_service_id
export EVINCED_API_KEY=your_api_key
export APP_PATH=/path/to/your/app.apk
```
## The Fixture

Using `conftest.py` fixture that defines a shared `driver`.

The fixture handles:
- Authenticating with Evinced credentials
- Creating the Appium driver session before all tests `scope="module"`
- Passes driver with `yield`
- Quitting the session after tests complete

## Running the tests

```bash
pytest tests/
```

## Test files

| File | Pattern | Description |
|------|---------|-------------|
| `tests/test_analyze_example.py` | One-shot scan with filter | Creates an `EvincedAppiumDefaultRunner`, calls `analyze()` then `report()` with a `ReportFilter` that excludes Minor-severity issues. |
| `tests/test_multi_screen_example.py` | Multi-screen / continuous | Reuses one runner context manager across two navigation steps; calls `analyze()` per screen, then `report()` to collect all results. |
| `tests/test_configured_example.py` | Config + filters | Demonstrates `EvincedConfig` with `exclude_filters` at the config level rather than at report time. |

## SDK API summary

| Symbol | Description |
|--------|-------------|
| `LicenseManager().setup_credentials(service_id, api_key)` | Authenticate (called in `conftest.py`) |
| `EvincedAppiumDefaultRunner(driver, init_options=...)` | Context manager — wraps driver for the duration of the `with` block |
| `runner.analyze()` | Capture the current screen state |
| `runner.report()` | Generate and return a report from all captured screens |
| `EvincedConfig(exclude_filters=[], include_filters=[])` | Scan configuration |
| `ReportFilter([Severity.minor])` | Issue filter by severity |
| `InitOptions(evinced_config=...)` | Bundles config into runner init |

> **Note:** There is no `evStart`/`evStop` or `evAnalyze` in the mobile SDK.
> The context manager pattern with multiple `analyze()` calls is the
> continuous-mode equivalent. There is no separate labels API — use
> `InitOptions.report_name` or CI environment variables to tag runs.