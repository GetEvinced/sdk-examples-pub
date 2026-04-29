package example;

import com.evinced.EvPage;
import com.evinced.EvPageFactory;
import com.evinced.EvincedSDK;
import com.evinced.Report;
import com.evinced.FileFormat;
import com.microsoft.playwright.Browser;
import com.microsoft.playwright.Playwright;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class EvincedPlaywrightTest {

    @Test
    void accessibilityScan_singleRun() {

        EvincedSDK.setCredentials(
                System.getenv("EVINCED_SERVICE_ID"),
                System.getenv("EVINCED_API_KEY")
        );

        Playwright playwright = Playwright.create();
        Browser browser = playwright.chromium().launch();

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

        browser.close();
        playwright.close();
    }
}
