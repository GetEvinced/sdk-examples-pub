package com.examples;

import static org.junit.Assert.assertFalse;

import com.evinced.EvincedReporter;
import com.evinced.EvincedSDK;
import com.evinced.EvincedWebDriver;
import com.evinced.dto.configuration.EvincedConfiguration;
import com.evinced.dto.results.Report;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

/**
 * evStartStop pattern — continuous accessibility scan across multiple interactions.
 *
 * Calls evStart() before interactions, performs user flows, then calls evStop()
 * to retrieve the aggregated report. Saves an HTML report to disk.
 *
 * To upload results to the Evinced Platform, set uploadToPlatform = true in
 * EvincedConfiguration before creating the EvincedWebDriver instance.
 */
public class EvStartStop {

    @Test
    public void evStartStopExample() {
        WebDriverManager.chromedriver().setup();
        ChromeDriver baseDriver = new ChromeDriver();

        // Set offline credentials from environment variables
        EvincedSDK.setOfflineCredentials(
            System.getenv("EVINCED_SERVICE_ID"),
            System.getenv("EVINCED_AUTH_TOKEN")
        );

        EvincedConfiguration config = new EvincedConfiguration();
        config.setEnableScreenshots(true);
        // To upload scan results to the Evinced Platform, uncomment the line below:
        // config.setUploadToPlatform(true);

        EvincedWebDriver driver = new EvincedWebDriver(baseDriver, config);

        try {
            WebDriverWait wait = new WebDriverWait(baseDriver, Duration.ofSeconds(10));

            // Navigate to the site under test
            driver.get("https://demo.evinced.com/");
            wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("main")));

            // Begin continuous scan — captures accessibility state on every DOM change
            driver.evStart();

            // Perform user interactions under scan
            driver.findElement(By.xpath("//*[@id='gatsby-focus-wrapper']/main/div[1]/div[3]/div[1]/div/div[1]/p")).click();
            wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//*[@id='gatsby-focus-wrapper']/main/div[1]/div[3]/div[1]/div/ul/li[3]"))).click();

            driver.findElement(By.xpath("//*[@id='gatsby-focus-wrapper']/main/div[1]/div[3]/div[2]/div/div[1]/p")).click();
            wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//*[@id='gatsby-focus-wrapper']/main/div[1]/div[3]/div[2]/div/ul/li[3]"))).click();

            driver.findElement(By.xpath("//*[@id='gatsby-focus-wrapper']/main/div[1]/div[3]/a")).click();
            wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//*[@id='gatsby-focus-wrapper']/main/h1/span")));

            // Stop continuous scan and retrieve the aggregated report
            Report report = driver.evStop();

            // Assert that accessibility issues were found
            assertFalse("Expected accessibility issues to be found", report.getIssues().isEmpty());

            // Save reports to disk
            String timestamp = java.time.LocalDateTime.now()
                .format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));
            String baseName = "ev-start-stop-report-" + timestamp;

            EvincedReporter.evSaveFile(baseName, report, EvincedReporter.FileFormat.HTML_v2_1);
        } finally {
            driver.quit();
        }
    }
}
