package com.evinced.example.playwright;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.options.LoadState;

import static org.junit.jupiter.api.Assertions.assertFalse;

import org.junit.jupiter.api.Test;

// Evinced
import com.evinced.EvPage;
import com.evinced.EvPageFactory;
import com.evinced.Report;

public class EvincedSingleRunTest {

    @Test
    void shouldNavigateToEvincedDemo() {
        Browser browser = PlaywrightTestSetup.browser;
        EvPage page = EvPageFactory.create(browser.newPage());
        page.navigate("https://demo.evinced.com");
        page.waitForLoadState(LoadState.NETWORKIDLE);
        System.out.println("Page title: " + page.title());
        System.out.println(page.url());
        Report report = page.evAnalyze();
        assertFalse(report.getIssues().isEmpty(), "Expected accessibility issues to be found");
        System.out.println("Issues found: " + report.getIssues().size());
        page.close();
    }
}
