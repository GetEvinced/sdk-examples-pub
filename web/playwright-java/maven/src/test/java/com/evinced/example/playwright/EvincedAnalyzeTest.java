package com.evinced.example.playwright;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.Playwright;
import com.microsoft.playwright.options.LoadState;

import org.junit.jupiter.api.Test;

// Evinced
import com.evinced.EvPage;
import com.evinced.EvPageFactory;
import com.evinced.EvincedSDK;
import com.evinced.FileFormat;
import com.evinced.Report;

import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * evAnalyze pattern — one-shot accessibility scan.
 *
 * Navigates to a page, runs a single scan with evAnalyze(), and saves
 * an HTML report. The Report object also provides programmatic access
 * to all issues via report.getIssues().
 */
public class EvincedAnalyzeTest {

    @Test
    void evAnalyze_savesReport() {
        try (Playwright playwright = Playwright.create()) {
            EvincedSDK.setCredentials(
                    System.getenv("EVINCED_SERVICE_ID"),
                    System.getenv("EVINCED_API_KEY"));

            Browser browser = playwright.chromium().launch();
            try {
                EvPage page = EvPageFactory.create(browser.newPage());

                page.navigate("https://demo.evinced.com/");
                page.waitForLoadState(LoadState.NETWORKIDLE);

                Report report = page.evAnalyze();
                assertNotNull(report, "Evinced report should not be null");

                // Save HTML report
                EvincedSDK.evSaveFile("./tmp/ev-analyze-report", report, FileFormat.HTML);

                System.out.println("Issues found: " + report.getIssues().size());
            } finally {
                browser.close();
            }
        }
    }
}
