package com.evinced.example.playwright;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.LoadState;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import java.util.List;
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
    private static Playwright playwright;
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
        String SEARCH_BUTTON =
                "#gatsby-focus-wrapper > main > div.wrapper-banner > div.filter-container > a";
        String SEARCH_RESULTS = "#gatsby-focus-wrapper > main > h1";
    }

    @BeforeAll
    static void launchBrowser() {
        playwright = Playwright.create();
        browser = playwright.chromium().launch();
        EvincedSDK.setCredentials(System.getenv("EVINCED_SERVICE_ID"),
                System.getenv("EVINCED_API_KEY"));

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
        browser.close();
        playwright.close();
        EvincedSDK.evSaveFile("./tmp/ev-aggregated-report.html", FileFormat.HTML);
    };

    @Test
    void shouldNavigateToEvincedDemoInteractive() {
        page.navigate("https://demo.evinced.com");
        page.click(Selectors.HOUSE_DROPDOWN);
        page.click(Selectors.TENT_OPTION);
        page.click(Selectors.LOCATION_DROPDOWN);
        page.click(Selectors.CANADA_OPTION);
        page.click(Selectors.SEARCH_BUTTON);
        page.waitForLoadState(LoadState.NETWORKIDLE);
        assertTrue(page.isVisible(Selectors.SEARCH_RESULTS));
    }

    @Test
    void shouldNavigateToEvincedDemo() {
        page.navigate("https://demo.evinced.com");
        page.waitForLoadState(LoadState.NETWORKIDLE);
        System.out.println(page.title());
    }
}
