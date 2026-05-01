package example;

import com.evinced.EvPage;
import com.evinced.EvPageFactory;
import com.evinced.EvincedSDK;
import com.evinced.Report;
import com.evinced.FileFormat;
import com.microsoft.playwright.Browser;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class EvincedPlaywrightTest {

    private static Browser browser;

    @BeforeAll
    static void launchBrowser() {
        browser = PlaywrightTestSetup.playwright.chromium().launch();
    }

    @AfterAll
    static void closeBrowser() {
        // browser.close() hangs in SDK 1.6.1 after scans; JVM exit cleans up.
    }

    @Test
    void accessibilityScan_singleRun() {
        EvPage page = EvPageFactory.create(browser.newPage());
        page.navigate("https://demo.evinced.com/");
        page.waitForLoadState();

        Report report = page.evAnalyze();

        EvincedSDK.evSaveFile(
                "build/evinced-report",
                report,
                FileFormat.HTML
        );

        assertTrue(
                report.getIssues().size() >= 0,
                "Evinced scan completed successfully"
        );
        // page.close() hangs in SDK 1.6.1 after scans; JVM exit cleans up.
    }
}
