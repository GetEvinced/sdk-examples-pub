package com.examples;

import static org.junit.Assert.assertFalse;

import com.evinced.EvincedReporter;
import com.evinced.EvincedSDK;
import com.evinced.EvincedWebDriver;
import com.evinced.dto.configuration.EvincedConfiguration;
import com.evinced.dto.results.Report;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.Test;
import org.openqa.selenium.chrome.ChromeDriver;

/**
 * evAnalyze pattern — one-shot accessibility scan.
 *
 * Navigates to a page, calls evAnalyze() once, asserts issues were found,
 * and saves an HTML report to disk.
 */
public class EvAnalyze {

    @Test
    public void evAnalyzeExample() {
        WebDriverManager.chromedriver().setup();
        ChromeDriver baseDriver = new ChromeDriver();

        // Set offline credentials from environment variables
        EvincedSDK.setOfflineCredentials(
            System.getenv("EVINCED_SERVICE_ID"),
            System.getenv("EVINCED_AUTH_TOKEN")
        );

        EvincedConfiguration config = new EvincedConfiguration();
        config.setEnableScreenshots(true);

        EvincedWebDriver driver = new EvincedWebDriver(baseDriver, config);

        try {
            // Navigate to the page under test
            driver.get("https://demo.evinced.com/");

            // Run a one-shot accessibility scan
            Report report = driver.evAnalyze();

            // Assert that accessibility issues were found
            assertFalse("Expected accessibility issues to be found", report.getIssues().isEmpty());

            // Save HTML report to disk
            EvincedReporter.evSaveFile("ev-analyze-report", report, EvincedReporter.FileFormat.HTML_v2_1);
        } finally {
            driver.quit();
        }
    }
}
