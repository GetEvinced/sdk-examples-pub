package com.examples;

import org.junit.After;
import static org.junit.Assert.assertFalse;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import com.codeborne.selenide.Configuration;
import static com.codeborne.selenide.Selenide.open;
import com.codeborne.selenide.WebDriverRunner;
import com.evinced.EvincedReporter;
import com.evinced.EvincedSDK;
import com.evinced.EvincedWebDriver;
import com.evinced.dto.configuration.EvincedConfiguration;
import com.evinced.dto.results.Report;

import io.github.bonigarcia.wdm.WebDriverManager;

/**
 * evAnalyze pattern with Selenide.
 *
 * Builds a ChromeDriver, wraps it with EvincedWebDriver, and hands the wrapped
 * driver to Selenide via WebDriverRunner.setWebDriver() so Selenide's fluent
 * API operates through the Evinced wrapper. The wrapped driver is reused for
 * the scan call itself.
 */
public class EvAnalyze {

    private EvincedWebDriver driver;

    @Before
    public void setUp() {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--no-sandbox", "--disable-dev-shm-usage");
        if (!Boolean.getBoolean("headed")) {
            options.addArguments("--headless=new");
        }
        ChromeDriver baseDriver = new ChromeDriver(options);

        EvincedSDK.setOfflineCredentials(
            System.getenv("EVINCED_SERVICE_ID"),
            System.getenv("EVINCED_WEB_OFFLINE_TOKEN")
        );

        EvincedConfiguration config = new EvincedConfiguration();
        config.setEnableScreenshots(true);

        driver = new EvincedWebDriver(baseDriver, config);

        // Tell Selenide to use our wrapped driver instead of spawning its own.
        WebDriverRunner.setWebDriver(driver);
        Configuration.timeout = 10_000;
    }

    @Test
    public void evAnalyzeExample() {
        // Selenide's open() drives the EvincedWebDriver we registered above.
        open("https://demo.evinced.com/");

        // One-shot accessibility scan.
        Report report = driver.evAnalyze();

        assertFalse("Expected accessibility issues to be found", report.getIssues().isEmpty());

        EvincedReporter.evSaveFile("evAnalyze-report-HTML", report, EvincedReporter.FileFormat.HTML_v2_1);
        EvincedReporter.evSaveFile("evAnalyze-report-JSON", report, EvincedReporter.FileFormat.JSON);
    }

    @After
    public void tearDown() {
        WebDriverRunner.closeWebDriver();
    }
}
