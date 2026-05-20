# Evinced Appium Python SDK Example

A working example of the Evinced Appium Python SDK integrated with pytest for Android accessibility testing.

## Prerequisites

- Python 3.7+
- Android Studio with an emulator configured and running
- Appium installed (`npm install -g appium` or `brew install appium`)
- Evinced service account credentials (service ID and API key)

## Setup

### 1. Set environment variables

```bash
export EVINCED_SERVICE_ID=your_service_id
export EVINCED_API_KEY=your_api_key
```

### 2. Create a virtual environment and install dependencies

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 3. Start Appium

```bash
appium
```

### 4. Run the tests

```bash
python3 -m pytest tests/ -s
```

The `-s` flag shows issue counts printed by each test.

## Test files

| File | Pattern | Description |
|------|---------|-------------|
| `tests/test_analyze_example.py` | Single scan | Creates an `EvincedAppiumDefaultRunner` and calls `report()` to scan the current screen. |
| `tests/test_configured_example.py` | Filtered scan | Uses `EvincedConfig` + `ReportFilter` to exclude Minor-severity issues from results. |
| `tests/test_continuous_example.py` | Continuous mode | Uses `EvincedAppiumContinuesRunner` with `start_analyze()` / `stop_analyze()` — the SDK scans automatically on each Appium command. |
| `tests/test_multi_screen_example.py` | Multi-screen | Calls `analyze()` after each navigation step, then `report_stored()` to get one report per screen. |

## SDK API summary

| Symbol | Description |
|--------|-------------|
| `LicenseManager().setup_credentials(service_id, api_key)` | Authenticate (called in `conftest.py`) |
| `EvincedAppiumDefaultRunner(driver, init_options)` | Context manager for single-scan and multi-screen patterns |
| `runner.report()` | Scan the current screen; returns a list of `Report` objects |
| `runner.analyze()` | Capture the current screen state into memory |
| `runner.report_stored()` | Return stored snapshots as a list of `Report` objects (one per `analyze()` call) |
| `EvincedAppiumContinuesRunner(driver, init_options)` | Context manager for continuous mode |
| `runner.start_analyze()` | Begin continuous scanning (auto-scans on Appium commands) |
| `runner.stop_analyze()` | Stop scanning and return results as a list of `Report` objects |
| `EvincedConfig(exclude_filters=[], include_filters=[])` | Scan configuration |
| `ReportFilter([Severity.minor])` | Filter issues by severity |
| `InitOptions(evinced_config=...)` | Bundles config for the runner |

## Private registry

The `evinced-appium-sdk` package is hosted on the Evinced private PyPI. Your `pip` must be configured with Evinced Artifactory credentials to install it:

```bash
export PIP_EXTRA_INDEX_URL=https://<EVINCED_ARTIFACTORY_USER>:<EVINCED_ARTIFACTORY_TOKEN>@evinced.jfrog.io/artifactory/api/pypi/private-python-local/simple
pip install -r requirements.txt
```

## Docs

[Evinced Appium Python SDK documentation](https://developer.evinced.com/sdks-for-mobile-apps/appium-sdk-python-doc)
