package example;

import com.evinced.EvPage;
import com.evinced.EvPageFactory;
import com.evinced.EvincedSDK;
import com.evinced.Report;
import com.evinced.FileFormat;
import com.evinced.impl.Global;
import com.evinced.impl.config.EvConfig;
import com.microsoft.playwright.Browser;
import com.microsoft.playwright.Playwright;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNotNull;

public class EvincedPlaywrightScreenshotTest {

    @BeforeAll
    static void setup() {
        Global.config.setEnableScreenshots(true);
    }

    @Test
    void accessibilityScan_withScreenshots() {

        EvincedSDK.setCredentials(
                System.getenv("EVINCED_SERVICE_ID"),
                System.getenv("EVINCED_API_KEY")
        );

        Playwright playwright = Playwright.create();
        Browser browser = playwright.chromium().launch();

        EvPage page = EvPageFactory.create(browser.newPage());

        // EvConfig config = new EvConfig();
        // config.setEnableScreenshots(true);

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

        browser.close();
        playwright.close();
    }
}
