package com.evinced.example.playwright;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.options.LoadState;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

// Evinced
import com.evinced.EvPage;
import com.evinced.EvPageFactory;
import com.evinced.EvincedSDK;
import com.evinced.FileFormat;
import com.evinced.Report;

public class EvincedContinuousTest {
    private static Browser browser;
    private EvPage page;

    private interface Selectors {
        String HOUSE_DROPDOWN =
                "#gatsby-focus-wrapper > main > div.wrapper-banner > div.filter-container > div:nth-child(1) > div > div.dropdown.line";
        String TENT_OPTION =
                "#gatsby-focus-wrapper > main > div.wrapper-banner > div.filter-container > div:nth-child(1) > div > ul > li:nth-child(4)";
        String LOCATION_DROPDOWN =
                "#gatsby-focus-wrapper > main > div.wrapper-banner > div.filter-container > div:nth-child(2) > div > div.dropdown.line";
        String CANADA_OPTION =
                "#gatsby-focus-wrapper > main > div.wrapper-banner > div.filter-container > div:nth-child(2) > div > ul > li:nth-child(1)";
    }

    @BeforeAll
    static void launchBrowser() {
        browser = PlaywrightTestSetup.browser;
    };

    @BeforeEach
    void setUp() {
        page = EvPageFactory.create(browser.newPage());
        page.evStart();
    }

    @AfterEach
    void tearDown() {
        Report report = page.evStop();
        System.out.println("Found issues: " + report.getIssues().size());
        page.close();

    };

    @AfterAll
    static void closeBrowser() {
        EvincedSDK.evSaveFile("./tmp/ev-aggregated-report", FileFormat.HTML);
        // Browser lifecycle is managed by PlaywrightTestSetup (JVM shutdown hook).
    };

    @Test
    void shouldNavigateToEvincedDemoInteractive() {
        page.navigate("https://demo.evinced.com");
        page.waitForLoadState(LoadState.NETWORKIDLE);
        page.click(Selectors.HOUSE_DROPDOWN);
        page.click(Selectors.TENT_OPTION);
        page.click(Selectors.LOCATION_DROPDOWN);
        page.click(Selectors.CANADA_OPTION);
        // The demo site SPA auto-navigates to the results page once both filters are set.
    }

    @Test
    void shouldNavigateToEvincedDemo() {
        page.navigate("https://demo.evinced.com");
        page.waitForLoadState(LoadState.NETWORKIDLE);
        System.out.println(page.title());
    }
}
