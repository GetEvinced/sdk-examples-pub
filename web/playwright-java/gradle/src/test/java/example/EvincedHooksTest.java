package example;

import com.evinced.EvPage;
import com.evinced.EvPageFactory;
import com.evinced.EvincedSDK;
import com.evinced.FileFormat;
import com.evinced.Report;
import com.microsoft.playwright.Browser;
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

    private static Browser browser;
    // Single page reused across all tests. Creating a new page per test via
    // browser.newPage() accumulates abandoned pages whose pending network
    // requests (from SPA result-page navigation) can block evStop() in SDK 1.6.1.
    // Reusing one page and navigating back to home in @BeforeEach cancels those
    // requests before each scan starts.
    private static EvPage page;

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
        browser = PlaywrightTestSetup.playwright.chromium().launch();
        page = EvPageFactory.create(browser.newPage());
    }

    @BeforeEach
    void setUp() {
        // Navigate to a fresh home-page state each time. This cancels any
        // pending network requests left over from the previous test (e.g. the
        // never-resolving date API call triggered by the demo SPA results page),
        // which would otherwise block evStop() in SDK 1.6.1.
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

        // page.close() hangs in SDK 1.6.1 after scans; JVM exit cleans up.
    }

    @AfterAll
    static void closeBrowser() {
        // Save an aggregated report across all tests in this class
        EvincedSDK.evSaveFile("build/evinced-report-hooks-aggregated", FileFormat.HTML);
        // browser.close() hangs in SDK 1.6.1 after scans; JVM exit cleans up.
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
        // The demo site SPA auto-navigates to results once both filters are set.
        // Clicking the search button generates a date-relative URL whose API call
        // never reaches NETWORKIDLE, so we rely on the SPA transition instead.
    }
}
