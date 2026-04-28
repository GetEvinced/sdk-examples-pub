# Evinced Java Playwright SDK

This repository demonstrates the use of the Evinced Java Playwright SDK with examples in Java. These examples showcase best practices for integrating the SDK and running accessibility tests efficiently, including support for CI/CD pipelines.

## Example Test Files

| File | Description |
|------|-------------|
| [FirstTest.java](src/test/java/com/evinced/example/playwright/FirstTest.java) | Sample test without Evinced SDK |
| [SingleRunTest.java](src/test/java/com/evinced/example/playwright/SingleRunTest.java) | Sample test using Evinced in Single Run Mode |
| [EvincedContinuousTest.java](src/test/java/com/evinced/example/playwright/EvincedContinuousTest.java) | Sample test using Evinced in Continuous Mode |

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