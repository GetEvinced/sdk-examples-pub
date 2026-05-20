package example;

import com.evinced.EvPage;
import com.evinced.EvPageFactory;
import com.evinced.EvincedSDK;
import com.evinced.Report;
import com.evinced.FileFormat;
import com.evinced.impl.Global;
import com.microsoft.playwright.Browser;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNotNull;

public class EvincedPlaywrightScreenshotTest {

    private static Browser browser;

    @BeforeAll
    static void setup() {
        browser = PlaywrightTestSetup.playwright.chromium().launch();
        Global.config.setEnableScreenshots(true);
    }

    @AfterAll
    static void teardown() {
        // browser.close() hangs in SDK 1.6.1 after scans; JVM exit cleans up.
    }

    @Test
    void accessibilityScan_withScreenshots() {
        EvPage page = EvPageFactory.create(browser.newPage());

        page.evStart();

        page.navigate("https://demo.evinced.com/");
        page.waitForLoadState();
        page.waitForTimeout(2000);

        Report report = page.evStop();

        EvincedSDK.evSaveFile(
                "build/evinced-report-screenshots",
                report,
                FileFormat.HTML
        );

        assertNotNull(report);
        // page.close() hangs in SDK 1.6.1 after scans; JVM exit cleans up.
    }
}
