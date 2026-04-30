# Evinced Playwright Java SDK Examples — Maven

Accessibility testing examples using the [Evinced Playwright Java SDK](https://developer.evinced.com/sdks-for-web-apps/playwright-java-sdk) with Maven and JUnit 5.

## Prerequisites

- Java 11+
- Maven
- Evinced service account credentials:
  - `EVINCED_SERVICE_ID` — your service account ID
  - `EVINCED_API_KEY` — your API key

The SDK is fetched from the Evinced JFrog Artifactory Maven repository. Configure `~/.m2/settings.xml` with your Artifactory credentials — see `settings.xml.m2-example` in this directory for the required format.

## Setup

Set environment variables before running:

```bash
export EVINCED_SERVICE_ID=your_service_id
export EVINCED_API_KEY=your_api_key
```

Create the temporary directory required by the continuous test:

```bash
mkdir tmp
```

## Running the tests

```bash
mvn clean test
```

Run a single class:

```bash
mvn test -Dtest=EvincedAnalyzeTest
```

## Test files

| File | Pattern | Description |
|------|---------|-------------|
| `EvincedSingleRunTest.java` | Single scan | Minimal `evAnalyze` usage — one-shot scan with issue count assertion |
| `EvincedAnalyzeTest.java` | Single scan | Calls `evPage.evAnalyze()` to scan the page; saves HTML report |
| `EvincedStartStopTest.java` | Continuous scan | Uses `evPage.evStart()` / `evPage.evStop()` to capture DOM changes across interactions; saves HTML report |
| `EvincedContinuousTest.java` | Multi-test continuous | Continuous scan across multiple tests with an aggregated report |
| `EvincedHooksTest.java` | JUnit 5 lifecycle | `@BeforeEach`/`@AfterEach` wrap each test; per-test reports plus an aggregated report |

## SDK API summary

| Method | Description |
|--------|-------------|
| `EvincedSDK.setCredentials(serviceId, apiKey)` | Authenticate with online credentials |
| `new EvPage(page)` | Wrap a Playwright `Page` with the Evinced page |
| `evPage.evAnalyze(options?)` | Single-page scan; returns `List<Issue>` |
| `evPage.evStart(options?)` | Start continuous DOM monitoring |
| `evPage.evStop(options?)` | Stop monitoring; returns `List<Issue>` |
| `EvincedSDK.evSaveFile(path, issues, format)` | Save report to disk (`HTML`, `JSON`, `SARIF`, `CSV`) |
| `EvincedSDK.enableUploadToPlatform(true)` | Enable upload to the Evinced Platform |

## Docs

[Evinced Playwright Java SDK documentation](https://developer.evinced.com/sdks-for-web-apps/playwright-java-sdk)
