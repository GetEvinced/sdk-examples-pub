package example;

import com.evinced.EvPage;
import com.evinced.EvPageFactory;
import com.evinced.EvincedSDK;
import com.evinced.FileFormat;
import com.evinced.Report;
import com.microsoft.playwright.Browser;
import com.microsoft.playwright.Playwright;
import com.microsoft.playwright.options.LoadState;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * evStart / evStop pattern — continuous scan across user interactions.
 *
 * Starts scanning before navigation, performs UI interactions, stops
 * the scan, then saves an HTML report.
 *
 * Upload to platform:
 *   The Java Playwright SDK does not currently expose an uploadToPlatform
 *   configuration flag directly. To upload results to the Evinced Platform,
 *   set your EVINCED_SERVICE_ID and EVINCED_API_KEY environment variables
 *   and refer to the SDK documentation for platform integration options.
 */
public class EvincedStartStopTest {

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

    @Test
    void evStartStop_capturesInteractions() {
        EvincedSDK.setCredentials(
                System.getenv("EVINCED_SERVICE_ID"),
                System.getenv("EVINCED_API_KEY"));

        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch();
            try {
                EvPage page = EvPageFactory.create(browser.newPage());

                // Begin continuous accessibility scan
                page.evStart();

                page.navigate("https://demo.evinced.com/");
                page.waitForLoadState(LoadState.NETWORKIDLE);

                // Interact with the page — the scan captures issues across all states
                page.click(Selectors.HOUSE_DROPDOWN);
                page.click(Selectors.TENT_OPTION);
                page.click(Selectors.LOCATION_DROPDOWN);
                page.click(Selectors.CANADA_OPTION);
                page.click(Selectors.SEARCH_BUTTON);
                page.waitForLoadState(LoadState.NETWORKIDLE);

                // Stop the scan and retrieve results
                Report report = page.evStop();
                assertNotNull(report, "Evinced report should not be null");

                System.out.println("Issues found: " + report.getIssues().size());

                // Save the HTML report
                EvincedSDK.evSaveFile(
                        "build/evinced-report-startstop",
                        report,
                        FileFormat.HTML
                );
            } finally {
                browser.close();
            }
        }
    }
}
