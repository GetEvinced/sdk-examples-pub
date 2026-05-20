# Evinced Selenium Java SDK + Selenide Examples

Accessibility testing examples that combine the [Evinced Selenium Java SDK](https://developer.evinced.com/sdks-for-web-apps/selenium-java-sdk) with [Selenide](https://selenide.org/) (JUnit 4, WebDriverManager).

## Prerequisites

- Java 17+ (Selenide 7.x requirement)
- Chrome installed
- Evinced service account credentials:
  - `EVINCED_SERVICE_ID` — your service account ID
  - `EVINCED_WEB_OFFLINE_TOKEN` — your offline token

## How Selenide and the Evinced SDK fit together

The Evinced SDK works by wrapping a Selenium `WebDriver` in `EvincedWebDriver`. Selenide normally manages its own driver via `WebDriverRunner`. To make both cooperate:

1. Create a vanilla `ChromeDriver`.
2. Wrap it: `EvincedWebDriver driver = new EvincedWebDriver(chromeDriver, config)`.
3. Hand it to Selenide: `WebDriverRunner.setWebDriver(driver)`.
4. From that point on, every Selenide call (`open`, `$x`, `click`, `shouldBe`, …) goes through the Evinced wrapper, so interactions are tracked during a continuous scan.
5. Keep a reference to the wrapped driver for the scan calls themselves: `driver.evAnalyze()`, `driver.evStart()`, `driver.evStop()`.

If you let Selenide auto-create the driver, the Evinced wrapper is never in the chain and no interactions are captured.

## Setup

### Install the Evinced SDK jar

The Evinced selenium-sdk jar is bundled in this directory (`selenium-sdk-4.28.1.jar`). Install it into your local Maven repo once before running the tests:

```bash
mvn install:install-file \
  -Dfile=selenium-sdk-4.28.1.jar \
  -DgroupId=com.evinced \
  -DartifactId=selenium-sdk \
  -Dversion=4.28.1 \
  -Dpackaging=jar
```

After that the `<dependency>` in `pom.xml` resolves from `~/.m2/repository/com/evinced/selenium-sdk/4.28.1/`. No Artifactory credentials needed.

### Credentials

Set environment variables before running:

```bash
export EVINCED_SERVICE_ID=your_service_id
export EVINCED_WEB_OFFLINE_TOKEN=your_offline_token
```

## Running the tests

```bash
mvn clean test
```

Run a single class:

```bash
mvn test -Dtest=EvAnalyze
mvn test -Dtest=EvStartStop
```

### Watch the test in a visible browser

Pass `-Dheaded=true` to skip Chrome's `--headless=new` flag:

```bash
mvn test -Dtest=EvStartStop -Dheaded=true
```

`EvAnalyze` takes ~5 seconds to run; `EvStartStop` takes ~8 seconds because it walks through the dropdowns. If you want the window to linger after the test finishes, add a breakpoint in your IDE on the line that calls `evStop()`/`evAnalyze()`, or temporarily insert `Thread.sleep(...)` before the `@After` tear-down runs.

## Test files

| Class | Pattern | Description |
|-------|---------|-------------|
| `EvAnalyze` | Single scan | Opens the demo site with Selenide's `open()`, calls `driver.evAnalyze()`, saves an HTML report |
| `EvStartStop` | Continuous scan | Drives the demo site's dropdowns through Selenide's `$x` locators between `driver.evStart()` and `driver.evStop()`; saves an HTML report |

## SDK API summary

| Method | Description |
|--------|-------------|
| `EvincedSDK.setOfflineCredentials(serviceId, token)` | Authenticate with offline token |
| `new EvincedWebDriver(driver, config)` | Wrap a Selenium WebDriver with the Evinced driver |
| `WebDriverRunner.setWebDriver(driver)` | Register the wrapped driver with Selenide |
| `driver.evAnalyze()` | Single-page scan; returns `Report` |
| `driver.evStart()` | Start continuous DOM monitoring |
| `driver.evStop()` | Stop monitoring; returns `Report` |
| `EvincedReporter.evSaveFile(name, report, format)` | Save report to disk (`HTML_v2_1`, `JSON`, `SARIF`, `CSV`) |
| `EvincedSDK.enableUploadToPlatform(true)` | Enable upload to the Evinced Platform |

## Selenide version

These examples use Selenide `7.6.1` (requires Java 17+). Selenide 6.x cannot be used here: it registers `SelenideNettyClientFactory` via SPI, which extends Selenium's `NettyClient.Factory` — a class Selenium removed in 4.10+. Loading the SPI fails at `new ChromeDriver(...)`. Selenide 7.x switched to the JDK HTTP client and works cleanly with Selenium 4.19.0.

## Docs

- [Evinced Selenium Java SDK](https://developer.evinced.com/sdks-for-web-apps/selenium-java-sdk)
- [Selenide](https://selenide.org/)
