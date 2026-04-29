package example;

import com.evinced.EvPage;
import com.evinced.EvPageFactory;
import com.evinced.EvincedSDK;
import com.evinced.FileFormat;
import com.evinced.Report;
import com.microsoft.playwright.Browser;
import com.microsoft.playwright.Playwright;
import com.microsoft.playwright.options.LoadState;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInfo;

import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * evHooks pattern — beforeEach/afterEach lifecycle wrapping.
 *
 * Each test starts a fresh continuous scan in @BeforeEach, performs
 * interactions, then stops and saves a per-test HTML report in @AfterEach.
 * An aggregated report covering all tests is saved in @AfterAll.
 *
 * Labels:
 *   The Java Playwright SDK does not currently expose a labels / testRunInfo
 *   API equivalent to the JS SDK's addLabel() / customLabel(). To associate
 *   metadata with results, use EVINCED_SERVICE_ID and EVINCED_API_KEY and
 *   refer to the Evinced Platform documentation.
 */
public class EvincedHooksTest {

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
    }

    @BeforeAll
    static void launchBrowser() {
        playwright = Playwright.create();
        browser = playwright.chromium().launch();
        EvincedSDK.setCredentials(
                System.getenv("EVINCED_SERVICE_ID"),
                System.getenv("EVINCED_API_KEY"));
    }

    @BeforeEach
    void setUp() {
        page = EvPageFactory.create(browser.newPage());
        page.navigate("https://demo.evinced.com/");
        page.waitForLoadState(LoadState.NETWORKIDLE);
        // Start continuous scan before each test
        page.evStart();
    }

    @AfterEach
    void tearDown(TestInfo testInfo) {
        // Stop the scan and save a per-test HTML report
        Report report = page.evStop();
        assertNotNull(report, "Evinced report should not be null");
        System.out.println("[" + testInfo.getDisplayName() + "] Issues found: " + report.getIssues().size());

        String safeName = testInfo.getDisplayName().replaceAll("[^a-zA-Z0-9_-]", "_");
        EvincedSDK.evSaveFile(
                "build/evinced-report-hooks-" + safeName,
                report,
                FileFormat.HTML
        );

        page.close();
    }

    @AfterAll
    static void closeBrowser() {
        // Save an aggregated report across all tests in this class
        EvincedSDK.evSaveFile("build/evinced-report-hooks-aggregated", FileFormat.HTML);
        try {
            browser.close();
        } finally {
            playwright.close();
        }
    }

    @Test
    void navigatesToHomePage() {
        // Scan runs automatically — just verify the page loaded
        assertNotNull(page.title(), "Page title should not be null");
    }

    @Test
    void filtersWithDropdowns() {
        page.click(Selectors.HOUSE_DROPDOWN);
        page.click(Selectors.TENT_OPTION);
        page.click(Selectors.LOCATION_DROPDOWN);
        page.click(Selectors.CANADA_OPTION);
    }

    @Test
    void completesSearchFlow() {
        page.click(Selectors.HOUSE_DROPDOWN);
        page.click(Selectors.TENT_OPTION);
        page.click(Selectors.LOCATION_DROPDOWN);
        page.click(Selectors.CANADA_OPTION);
        page.click(Selectors.SEARCH_BUTTON);
        page.waitForLoadState(LoadState.NETWORKIDLE);
    }
}
