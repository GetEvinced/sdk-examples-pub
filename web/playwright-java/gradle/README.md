# Evinced Java Playwright SDK — Gradle

This project demonstrates the Evinced Java Playwright SDK with a Gradle build.

## Running Tests

```
./gradlew clean test
```

## Example Test Files

| File | Description |
|------|-------------|
| [EvincedPlaywrightTest.java](src/test/java/example/EvincedPlaywrightTest.java) | **evAnalyze pattern** — one-shot accessibility scan, saves HTML report |
| [EvincedPlaywrightScreenshotTest.java](src/test/java/example/EvincedPlaywrightScreenshotTest.java) | `evStart`/`evStop` with screenshots, saves HTML report |
| [EvincedStartStopTest.java](src/test/java/example/EvincedStartStopTest.java) | **evStart/evStop pattern** — continuous scan across UI interactions, saves HTML report |
| [EvincedHooksTest.java](src/test/java/example/EvincedHooksTest.java) | **evHooks pattern** — `@BeforeEach`/`@AfterEach` lifecycle wrapping, per-test reports + aggregated report |

## Setup

### Credentials

Set the following environment variables before running tests:

```
EVINCED_SERVICE_ID=your-service-id
EVINCED_API_KEY=your-api-key
EVINCED_ARTIFACTORY_USER=your-jfrog-user
EVINCED_ARTIFACTORY_TOKEN=your-jfrog-token
```

### Configuration

[Evinced Playwright Java SDK Documentation](https://developer.evinced.com/sdks-for-web-apps/playwright-java-sdk)