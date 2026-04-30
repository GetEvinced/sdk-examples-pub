# Evinced Selenium Java SDK Examples

Accessibility testing examples using the [Evinced Selenium Java SDK](https://developer.evinced.com/sdks-for-web-apps/selenium-java-sdk) (JUnit 4, WebDriverManager).

## Prerequisites

- Java 11+
- Chrome installed
- Evinced service account credentials:
  - `EVINCED_SERVICE_ID` — your service account ID
  - `EVINCED_WEB_OFFLINE_TOKEN` — your offline token

## Setup

### Credentials

Set environment variables before running:

```bash
export EVINCED_SERVICE_ID=your_service_id
export EVINCED_WEB_OFFLINE_TOKEN=your_offline_token
```

The SDK is fetched from the Evinced JFrog Artifactory repository configured in `pom.xml`. Set your Artifactory credentials in `~/.m2/settings.xml` if prompted.

## Running the tests

```bash
mvn clean test
```

Run a single class:

```bash
mvn test -Dtest=EvAnalyze
```

## Test files

| Class | Pattern | Description |
|-------|---------|-------------|
| `EvAnalyze` | Single scan | Calls `driver.evAnalyze()` to scan the page and saves an HTML report |
| `EvStartStop` | Continuous scan | Uses `driver.evStart()` / `driver.evStop()` to capture DOM changes across interactions; saves HTML report |
| `EvHooks` | JUnit lifecycle | `@Before`/`@After` wrap each test with a fresh scan session; report saved in `@After` |
| `EvincedSetupExample` | Setup / logging | Full setup example including `EvincedConfiguration` and debug logging configuration |
| `EvincedSauceLabsExample` | Remote driver | Remote WebDriver example running on Sauce Labs |

## SDK API summary

| Method | Description |
|--------|-------------|
| `EvincedSDK.setOfflineCredentials(serviceId, token)` | Authenticate with offline token |
| `new EvincedWebDriver(driver, config)` | Wrap a Selenium WebDriver with the Evinced driver |
| `driver.evAnalyze()` | Single-page scan; returns `Report` |
| `driver.evStart()` | Start continuous DOM monitoring |
| `driver.evStop()` | Stop monitoring; returns `Report` |
| `EvincedReporter.evSaveFile(name, report, format)` | Save report to disk (`HTML_v2_1`, `JSON`, `SARIF`, `CSV`) |
| `EvincedSDK.enableUploadToPlatform(true)` | Enable upload to the Evinced Platform |

### Debug logging

```java
EvincedConfiguration config = new EvincedConfiguration();
config.setLoggingConfiguration(LoggingConfiguration.builder()
    .loggingEnabled(true)
    .loggingLevel("error")
    .logsFolder("target/logs/evinced/")
    .systemInformationLoggingEnabled(true)
    .maxLogLength(1000)
    .build());
EvincedWebDriver driver = new EvincedWebDriver(baseDriver, config);
```

## Docs

[Evinced Selenium Java SDK documentation](https://developer.evinced.com/sdks-for-web-apps/selenium-java-sdk)
