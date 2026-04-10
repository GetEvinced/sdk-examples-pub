# java-selenium-sdk

Evinced setup example with additional configuration for Debug logging available in Evinced Web SDK v4.9.3
Developer Docs: https://developer.evinced.com/sdks-for-web-apps/selenium-java-sdk#getstarted

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



