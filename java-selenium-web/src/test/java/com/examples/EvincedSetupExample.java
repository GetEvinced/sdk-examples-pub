package com.examples;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import com.evinced.common.impl.configuration.LoggingConfiguration;
import org.openqa.selenium.chrome.ChromeDriver;

import com.evinced.dto.configuration.EvincedConfiguration;
import com.evinced.dto.results.Report;
import io.github.bonigarcia.wdm.WebDriverManager;
import com.evinced.EvincedWebDriver;
import com.evinced.EvincedReporter;
import com.evinced.EvincedSDK;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.net.MalformedURLException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;


public class EvincedSetupExample
{
    ChromeDriver driver;
    EvincedWebDriver evincedDriver;
    EvincedConfiguration evincedConfiguration;

    @Before
    public void setup() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        // Add time for unique log folder per run
        LocalDate date = LocalDate.now();
        // Creating log folder
        String targetLogsFolder = "target/logs/evinced/debug_logs_" + date.format(DateTimeFormatter.ISO_DATE);
        

        // Evinced configuration
        evincedConfiguration = new EvincedConfiguration();
        evincedConfiguration.setEnableScreenshots(true);

        // Set offline credentials from environment variables
        EvincedSDK.setOfflineCredentials(System.getenv("EVINCED_SERVICE_ID"), System.getenv("EVINCED_AUTH_TOKEN"));

        // Evinced logging configuration
        evincedConfiguration.setLoggingConfiguration(LoggingConfiguration.builder()
            .loggingEnabled(false)
            .loggingLevel("debug") // set to trace for most verbose output
            .logsFolder(targetLogsFolder)
            .systemInformationLoggingEnabled(true)
            .build());
        
        // Passing in the Evinced Configuration
        evincedDriver = new EvincedWebDriver(driver, evincedConfiguration);
    }

    @After
    public void teardown() {
        if (driver != null) {
            driver.quit();
        }
        if (evincedDriver != null) {
            evincedDriver.quit();
        }
    }

    // test for https://developer.evinced.com/sdks-for-web-apps/selenium-java-sdk#addevincedaccessibilitychecks(singlerunmode)
    @Test
    public void shouldStartChrome() throws MalformedURLException {
        // go to Evinced demo page
        evincedDriver.get("https://demo.evinced.com");
        
        // Analyze the page for accessibility issues and return a report
        Report report = evincedDriver.evAnalyze();
        
        // Assert that there are accessibility issues
        assertTrue(report.getIssues().size() != 0);
    }

    @Test
    public void saveReports() throws MalformedURLException {
        try {
            // go to Evinced demo page
            evincedDriver.get("https://demo.evinced.com");
            
            Report landingPageReport = evincedDriver.evAnalyze();
            
            //Saves issues in a file with the specified format and location. 
            //Supported formats - json, html, sarif, and csv.
            EvincedReporter.evSaveFile(landingPageReport, EvincedReporter.FileFormat.HTML_v2_1);
            assertFalse(landingPageReport.getIssues().isEmpty());

            evincedDriver.get("https://demo.evinced.com/results/?what=Tiny%20House&where=Canada&date=Tue%20Jul%2009%202024%2011:21:39%20GMT-0400%20(Eastern%20Daylight%20Time");
            takeSnapshot("results_page", evincedDriver);

        } catch (Exception ignore) {
            // ignore exception
            System.out.println(ignore);
        }
    }

    public static void takeSnapshot(String reportName, EvincedWebDriver evincedDriver) {
        /* use your local driver class instead and configure it 
         here if you need to call evAnalyze sporadically */
        if (Boolean.getBoolean("RUN_EVINCED") != true) {
            return;
        }
        Report report = evincedDriver.evAnalyze();
        EvincedReporter.evSaveFile(reportName, report, EvincedReporter.FileFormat.HTML_v2_1);
    }

}
