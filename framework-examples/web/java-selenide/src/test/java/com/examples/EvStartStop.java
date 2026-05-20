package com.examples;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.junit.After;
import static org.junit.Assert.assertFalse;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import static com.codeborne.selenide.Condition.visible;
import com.codeborne.selenide.Configuration;
import static com.codeborne.selenide.Selenide.$x;
import static com.codeborne.selenide.Selenide.open;
import com.codeborne.selenide.WebDriverRunner;
import com.evinced.EvincedReporter;
import com.evinced.EvincedSDK;
import com.evinced.EvincedWebDriver;
import com.evinced.dto.configuration.EvincedConfiguration;
import com.evinced.dto.results.Report;

import io.github.bonigarcia.wdm.WebDriverManager;

/**
 * evStart / evStop pattern with Selenide.
 *
 * Builds a ChromeDriver, wraps it with EvincedWebDriver, and hands the wrapped
 * driver to Selenide. Interactions issued through Selenide ($x, click, etc.)
 * are tracked by the continuous scan because they flow through the wrapper.
 *
 * To upload results to the Evinced Platform, set uploadToPlatform = true in
 * EvincedConfiguration before constructing the EvincedWebDriver.
 */
public class EvStartStop {

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

        EvincedSDK.setCredentials(
                System.getenv("EVINCED_SERVICE_ID"),
                System.getenv("EVINCED_API_KEY")
        );

        EvincedConfiguration config = new EvincedConfiguration();
        config.setEnableScreenshots(true);
        // config.setUploadToPlatform(true);

        driver = new EvincedWebDriver(baseDriver, config);

        WebDriverRunner.setWebDriver(driver);
        Configuration.timeout = 10_000;
    }

    @Test
    public void evStartStopExample() {
        open("https://demo.evinced.com/");
        $x("//main").shouldBe(visible);

        // Begin continuous scan — captures accessibility state on every DOM change.
        driver.evStart();

        // Mirror the Selenium EvStartStop flow, expressed through Selenide.
        $x("//*[@id='gatsby-focus-wrapper']/main/div[1]/div[3]/div[1]/div/div[1]/p").click();
        $x("//*[@id='gatsby-focus-wrapper']/main/div[1]/div[3]/div[1]/div/ul/li[3]").shouldBe(visible).click();

        $x("//*[@id='gatsby-focus-wrapper']/main/div[1]/div[3]/div[2]/div/div[1]/p").click();
        $x("//*[@id='gatsby-focus-wrapper']/main/div[1]/div[3]/div[2]/div/ul/li[3]").shouldBe(visible).click();

        $x("//*[@id='gatsby-focus-wrapper']/main/div[1]/div[3]/a").click();
        $x("//*[@id='gatsby-focus-wrapper']/main/h1/span").shouldBe(visible);

        // Stop the scan and pull the aggregated report.
        Report report = driver.evStop();

        assertFalse("Expected accessibility issues to be found", report.getIssues().isEmpty());

        String timestamp = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));
        String baseName = "ev-start-stop-report-" + timestamp;

        EvincedReporter.evSaveFile("evStart+evStop-report-HTML", report, EvincedReporter.FileFormat.HTML_v2_1);
        EvincedReporter.evSaveFile("evStart+evStop-report-JSON", report, EvincedReporter.FileFormat.JSON);
    }

    @After
    public void tearDown() {
        WebDriverRunner.closeWebDriver();
    }
}
