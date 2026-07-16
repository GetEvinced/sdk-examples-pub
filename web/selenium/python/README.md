# Evinced Selenium Python SDK Examples

Accessibility testing examples using the [Evinced Selenium Python SDK](https://github.com/GetEvinced/py-selenium-sdk) with pytest and Selenium 4.

## Prerequisites

- Python 3.10+
- Chrome installed (ChromeDriver is resolved automatically by Selenium Manager)
- Evinced service account credentials:
  - `EVINCED_SERVICE_ID` — your service account ID
  - `EVINCED_WEB_OFFLINE_TOKEN` — your offline token

## Setup

### 1. Set credentials

```bash
export EVINCED_SERVICE_ID=your_service_id
export EVINCED_WEB_OFFLINE_TOKEN=your_offline_token
```

### 2. Create a virtual environment and install dependencies

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

`evinced-selenium-sdk` is hosted on the Evinced private PyPI. Configure `pip`
with your Evinced Artifactory credentials before installing:

```bash
export PIP_EXTRA_INDEX_URL=https://<EVINCED_ARTIFACTORY_USER>:<EVINCED_ARTIFACTORY_TOKEN>@evinced.jfrog.io/artifactory/api/pypi/private-python-local/simple
pip install -r requirements.txt
```

While the package is not yet published, install it from a local checkout instead:

```bash
pip install -e /path/to/py-selenium-sdk
```

## Running the tests

```bash
python3 -m pytest tests/ -s
```

The `-s` flag shows the issue counts printed by each test. Run headed to watch
the browser:

```bash
HEADED=true python3 -m pytest tests/ -s
```

Run a single example:

```bash
python3 -m pytest tests/test_analyze_example.py -s
```

## Test files

| File | Pattern | Description |
|------|---------|-------------|
| `tests/test_analyze_example.py` | Single scan | Calls `ev_analyze()` once to scan the page and saves an HTML report. |
| `tests/test_start_stop_example.py` | Continuous scan | Uses `ev_start()` / `ev_stop()` to capture DOM changes across a search flow; saves an HTML report. |
| `tests/test_hooks_example.py` | pytest lifecycle | A fixture wraps each test with a fresh scan session (`ev_start` before, `ev_stop` + save after) — the pytest equivalent of JUnit `@Before`/`@After`. |
| `tests/test_setup_example.py` | Setup / config | Full setup: `EvincedConfig` (screenshots, `root_selector`), debug logging, labels, and optional platform upload. |

Reports are written to `reports/` (git-ignored).

## SDK API summary

| Symbol | Description |
|--------|-------------|
| `set_offline_credentials(service_id, token)` | Authenticate with an offline token |
| `EvincedWebDriver(driver, config=None)` | Wrap a Selenium WebDriver with the Evinced driver |
| `driver.ev_analyze(config=None)` | Single-page scan; returns a `Report` |
| `driver.ev_start(config=None)` | Start continuous DOM monitoring |
| `driver.ev_stop()` | Stop monitoring; returns the aggregated `Report` |
| `driver.ev_save_file(report, path, SaveFileFormat.HTML)` | Save a report (`JSON`, `HTML`, `SARIF`, `CSV`) |
| `driver.set_test_info(test_name, test_file)` | Tag the report with test metadata (labels) |
| `EvincedConfig(...)` | Typed analysis configuration (e.g. `root_selector`, `enable_screenshots`) |
| `set_upload_to_platform_config(enableUploadToPlatform=True)` | Enable upload to the Evinced Platform |

### Debug logging

The SDK logs under the `evinced` logger. Control verbosity at runtime with an
environment variable:

```bash
export EV_SDK_LOG_LEVEL=DEBUG   # DEBUG | INFO | WARNING | ERROR
```

## Docs

[Evinced Selenium Python SDK](https://github.com/GetEvinced/py-selenium-sdk)
