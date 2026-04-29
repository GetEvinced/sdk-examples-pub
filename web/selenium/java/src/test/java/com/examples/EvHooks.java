package com.examples;

import static org.junit.Assert.assertFalse;

import com.evinced.EvincedReporter;
import com.evinced.EvincedSDK;
import com.evinced.EvincedWebDriver;
import com.evinced.dto.configuration.EvincedConfiguration;
import com.evinced.dto.results.Report;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

/**
 * evHooks pattern — per-test lifecycle wrapping with @Before / @After.
 *
 * Each test gets a fresh driver and scan session. The @Before hook starts the
 * continuous scan and @After stops it, saves the report, then tears down the
 * driver — even when the test throws.
 *
 * The Java Selenium SDK does not currently expose a labels API.
 * When a labels API becomes available, add label calls inside @Before to tag
 * each report with the test name, e.g.: evincedDriver.addLabel("test", testName)
 *
 * To upload results to the Evinced Platform, set uploadToPlatform = true in
 * EvincedConfiguration inside setUp().
 */
public class EvHooks {

    private ChromeDriver baseDriver;
    private EvincedWebDriver evincedDriver;

    @Before
    public void setUp() {
        WebDriverManager.chromedriver().setup();
        baseDriver = new ChromeDriver();

        try {
            // Set offline credentials from environment variables
            EvincedSDK.setOfflineCredentials(
                System.getenv("EVINCED_SERVICE_ID"),
                System.getenv("EVINCED_WEB_OFFLINE_TOKEN")
            );

            EvincedConfiguration config = new EvincedConfiguration();
            config.setEnableScreenshots(true);
            // To upload scan results to the Evinced Platform, uncomment the line below:
            // config.setUploadToPlatform(true);

            evincedDriver = new EvincedWebDriver(baseDriver, config);

            // Begin continuous scan for this test
            evincedDriver.evStart();
        } catch (Exception e) {
            baseDriver.quit();
            throw e;
        }
    }

    @After
    public void tearDown() {
        try {
            if (evincedDriver != null) {
                // Stop the scan and retrieve the aggregated report
                Report report = evincedDriver.evStop();

                // Save report using the test method name as the filename prefix
                String timestamp = java.time.LocalDateTime.now()
                    .format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));
                String baseName = "ev-hooks-report-" + timestamp;

                EvincedReporter.evSaveFile(baseName, report, EvincedReporter.FileFormat.HTML_v2_1);
            }
        } finally {
            if (evincedDriver != null) {
                evincedDriver.quit();
            }
            if (baseDriver != null) {
                baseDriver.quit();
            }
        }
    }

    @Test
    public void landingPageAccessibility() {
        WebDriverWait wait = new WebDriverWait(baseDriver, Duration.ofSeconds(10));

        evincedDriver.get("https://demo.evinced.com/");
        wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("main")));

        // The @After hook will capture and save the report automatically
    }

    @Test
    public void searchFlowAccessibility() {
        WebDriverWait wait = new WebDriverWait(baseDriver, Duration.ofSeconds(10));

        evincedDriver.get("https://demo.evinced.com/");
        wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("main")));

        // Interact with the search form
        evincedDriver.findElement(
            By.xpath("//*[@id='gatsby-focus-wrapper']/main/div[1]/div[3]/div[1]/div/div[1]/p")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//*[@id='gatsby-focus-wrapper']/main/div[1]/div[3]/div[1]/div/ul/li[3]"))).click();

        evincedDriver.findElement(
            By.xpath("//*[@id='gatsby-focus-wrapper']/main/div[1]/div[3]/div[2]/div/div[1]/p")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//*[@id='gatsby-focus-wrapper']/main/div[1]/div[3]/div[2]/div/ul/li[3]"))).click();

        evincedDriver.findElement(
            By.xpath("//*[@id='gatsby-focus-wrapper']/main/div[1]/div[3]/a")).click();
        wait.until(ExpectedConditions.presenceOfElementLocated(
            By.xpath("//*[@id='gatsby-focus-wrapper']/main/h1/span")));

        // The @After hook will capture and save the report automatically
    }
}
