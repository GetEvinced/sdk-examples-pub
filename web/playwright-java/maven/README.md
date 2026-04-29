# Evinced Java Playwright SDK

This repository demonstrates the use of the Evinced Java Playwright SDK with examples in Java. These examples showcase best practices for integrating the SDK and running accessibility tests efficiently, including support for CI/CD pipelines.

## Example Test Files

| File | Description |
|------|-------------|
| [FirstTest.java](src/test/java/com/evinced/example/playwright/FirstTest.java) | Plain Playwright test — no Evinced SDK |
| [EvincedSingleRunTest.java](src/test/java/com/evinced/example/playwright/EvincedSingleRunTest.java) | Basic `evAnalyze` usage — one-shot scan with issue count assertion |
| [EvincedAnalyzeTest.java](src/test/java/com/evinced/example/playwright/EvincedAnalyzeTest.java) | **evAnalyze pattern** — one-shot scan, saves HTML report |
| [EvincedStartStopTest.java](src/test/java/com/evinced/example/playwright/EvincedStartStopTest.java) | **evStart/evStop pattern** — continuous scan across UI interactions, saves HTML report |
| [EvincedContinuousTest.java](src/test/java/com/evinced/example/playwright/EvincedContinuousTest.java) | Continuous scan with multiple tests and aggregated report |
| [EvincedHooksTest.java](src/test/java/com/evinced/example/playwright/EvincedHooksTest.java) | **evHooks pattern** — `@BeforeEach`/`@AfterEach` lifecycle wrapping, per-test reports + aggregated report |

## Setup

### Get Evinced

See [settings.xml.m2-example](settings.xml.m2-example) for configuration details on setting up a remote Maven repository to fetch the Evinced Java Playwright SDK.

### Configuration

[Evinced Playwright Java SDK Documentation](https://developer.evinced.com/sdks-for-web-apps/playwright-java-sdk)

### Evinced Report Directory

Create a temporary directory at the root of this project, as it's required by the sample continuous test.

```
mkdir tmp
```