# java-selenium-sdk

Evinced Selenium Java SDK examples.
Developer Docs: https://developer.evinced.com/sdks-for-web-apps/selenium-java-sdk#getstarted

## Test classes

| Class | Pattern | Description |
|---|---|---|
| `EvAnalyze` | evAnalyze | One-shot scan: navigate, call `evAnalyze()`, save HTML report |
| `EvStartStop` | evStartStop | Continuous scan: `evStart()` before interactions, `evStop()` after, save HTML report |
| `EvHooks` | evHooks | `@Before`/`@After` lifecycle — each test gets a fresh session; report saved in `@After` |
| `EvincedSetupExample` | setup/misc | Full setup example with debug logging configuration |
| `EvincedSauceLabsExample` | SauceLabs | Remote driver example running on SauceLabs |

### SDK Debug Logging Configuration Example
```
EvincedConfiguration evincedConfiguration = new EvincedConfiguration();
EvincedWebDriver evincedDriver = new EvincedWebDriver(driver, evincedConfiguration);
evincedConfiguration.setLoggingConfiguration(LoggingConfiguration.builder()
        .loggingEnabled(false) // enables/disables logging. Overrides the environment variable, if set.
        .loggingLevel("error") // sets the general logging level.
        .logsFolder("target/logs/evinced/debug_logs_") // updates the logging folder
        .systemInformationLoggingEnabled(true) // enables logging of system information: SDK versions, OS name, version, Java version, Java VM version
        .maxLogLength(1000) // Updates the max length of written log messages.
        .build()); 
EvincedWebDriver driver = new EvincedWebDriver(new ChromeDriver(), evincedConfiguration);
```
### Default values
* Logging enabled - false
* Log level - ERROR
* Log folder - target/logs/evinced
* System information logging - true 
* Max log length - 1000 chars



