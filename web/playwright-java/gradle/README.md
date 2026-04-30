# Evinced Playwright Java SDK Examples — Gradle

Accessibility testing examples using the [Evinced Playwright Java SDK](https://developer.evinced.com/sdks-for-web-apps/playwright-java-sdk) with Gradle and JUnit 5.

## Prerequisites

- Java 17+
- Evinced service account credentials and Artifactory access:
  - `EVINCED_SERVICE_ID` — your service account ID
  - `EVINCED_API_KEY` — your API key
  - `EVINCED_ARTIFACTORY_USER` — JFrog username (to fetch the SDK)
  - `EVINCED_ARTIFACTORY_TOKEN` — JFrog token (to fetch the SDK)

## Setup

Set environment variables before running:

```bash
export EVINCED_SERVICE_ID=your_service_id
export EVINCED_API_KEY=your_api_key
export EVINCED_ARTIFACTORY_USER=your_jfrog_username
export EVINCED_ARTIFACTORY_TOKEN=your_jfrog_token
```

The `build.gradle` resolves `com.evinced:java-playwright-sdk` from `https://evinced.jfrog.io/artifactory/restricted-maven` using these credentials.

## Running the tests

```bash
./gradlew clean test
```

Run a single class:

```bash
./gradlew test --tests "example.EvincedPlaywrightTest"
```

## Test files

| File | Pattern | Description |
|------|---------|-------------|
| `EvincedPlaywrightTest.java` | Single scan | Calls `evPage.evAnalyze()` to scan the page; saves HTML report |
| `EvincedStartStopTest.java` | Continuous scan | Uses `evPage.evStart()` / `evPage.evStop()` to capture DOM changes across interactions; saves HTML report |
| `EvincedPlaywrightScreenshotTest.java` | Screenshots | Continuous scan with per-step screenshots; saves HTML report |
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
