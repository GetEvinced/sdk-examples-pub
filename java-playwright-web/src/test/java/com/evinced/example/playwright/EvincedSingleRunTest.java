package com.evinced.example.playwright;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.LoadState;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;

import org.junit.jupiter.api.Test;

// Evinced
import com.evinced.EvPage;
import com.evinced.EvPageFactory;
import com.evinced.EvincedSDK;
import com.evinced.Report;
import com.evinced.dto.results.Issue;

public class EvincedSingleRunTest {

    @Test
    void shouldNavigateToEvincedDemo() {
        try (Playwright playwright = Playwright.create()) {
            EvincedSDK.setCredentials(System.getenv("EVINCED_SERVICE_ID"),
                    System.getenv("EVINCED_API_KEY"));
            Browser browser = playwright.chromium().launch();
            EvPage page = EvPageFactory.create(browser.newPage());
            page.navigate("https://demo.evinced.com");
            page.waitForLoadState(LoadState.NETWORKIDLE);
            System.out.println("Page title: " + page.title());
            System.out.println(page.url());
            Report report = page.evAnalyze();
            List<Issue> issues = report.getIssues();
            assertEquals(6, issues.size());
            browser.close();
        }
    }
}
