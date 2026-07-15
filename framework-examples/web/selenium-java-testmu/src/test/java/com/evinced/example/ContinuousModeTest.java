package com.evinced.example;

import com.evinced.EvincedReporter;
import com.evinced.report.Report;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.List;

public class ContinuousModeTest extends BaseTest {

    @BeforeEach
    void startContinuousMonitoring() {
        driver.get(testUrl);
        driver.evStart();
    }

    @Test
    void continuousModeCapturesDynamicIssues() {
        // Click the first link on the page to trigger a DOM change,
        // then navigate back — Evinced monitors both states.
        List<WebElement> links = driver.findElements(By.tagName("a"));
        if (!links.isEmpty()) {
            links.get(0).click();
        }
        driver.navigate().back();
    }

    @AfterEach
    void stopMonitoringAndSaveReport() {
        Report report = driver.evStop();
        EvincedReporter.evSaveFile(
            REPORTS_DIR + "/continuous-mode",
            report,
            EvincedReporter.FileFormat.HTML
        );
    }
}
