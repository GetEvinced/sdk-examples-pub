package com.examples;

import static org.junit.Assert.assertNotEquals;

import com.evinced.EvincedReporter;
import com.evinced.EvincedSDK;
import com.evinced.EvincedWebDriver;
import com.evinced.dto.configuration.EvincedConfiguration;
import com.evinced.dto.results.Report;
import org.junit.After;
import org.junit.Test;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.RemoteWebDriver;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

public class EvincedSauceLabsExample {
    private RemoteWebDriver driver;
    private EvincedWebDriver evincedDriver;

    @Test
    public void testAccessibilityWithSauceLabs() throws MalformedURLException {
        // Configure browser options
        ChromeOptions browserOptions = new ChromeOptions();
        browserOptions.setCapability("platformName", "Windows 11");
        browserOptions.setCapability("browserVersion", "latest");

        // Configure SauceLabs options
        Map<String, Object> sauceOptions = new HashMap<>();
        sauceOptions.put("username", System.getenv("SAUCE_USERNAME"));
        sauceOptions.put("accessKey", System.getenv("SAUCE_ACCESS_KEY"));
        sauceOptions.put("name", "Simple Evinced Chrome Test:Start/Stop");
        browserOptions.setCapability("sauce:options", sauceOptions);

        // Initialize RemoteWebDriver
        URL url = new URL("https://ondemand.us-west-1.saucelabs.com:443/wd/hub");
        driver = new RemoteWebDriver(url, browserOptions);

        // Configure Evinced
        EvincedConfiguration configuration = new EvincedConfiguration();
        configuration.setEnableScreenshots(true);
        configuration.addExperimentalFlag("USE_AXE_NEEDS_REVIEW", true);
        configuration.addExperimentalFlag("USE_AXE_BEST_PRACTICES", true);

        // Initialize Evinced driver with authentication
        System.out.println("Starting Evinced authenticated session");
        EvincedSDK.setOfflineCredentials(
            System.getenv("EVINCED_SERVICE_ID"),
            System.getenv("EVINCED_AUTH_TOKEN")
        );
        evincedDriver = new EvincedWebDriver(driver, configuration);

        // Run accessibility scan
        evincedDriver.evStart();
        evincedDriver.get("https://demo.evinced.com");
        Report report = evincedDriver.evStop();

        // Verify accessibility issues were found
        assertNotEquals("Expected to find accessibility issues", 0, report.getIssues().size());

        // Generate and save report
        saveHtmlReport("sauce_report", evincedDriver);

        // Mark test as passed in SauceLabs
        evincedDriver.executeScript("sauce:job-result=" + true);
    }

    @After
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    private static void saveHtmlReport(String reportName, EvincedWebDriver evincedDriver) {
        Report report = evincedDriver.evAnalyze();
        EvincedReporter.evSaveFile(reportName, report, EvincedReporter.FileFormat.HTML_v2_1);
    }
}
