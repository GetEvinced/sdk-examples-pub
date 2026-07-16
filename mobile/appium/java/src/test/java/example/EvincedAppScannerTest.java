package example;

import java.util.List;

import static org.testng.Assert.assertFalse;
import static org.testng.Assert.assertNotNull;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import com.evinced.appium.appscanner.AppScannerConfig;
import com.evinced.appium.appscanner.AppScannerResult;
import com.evinced.appium.appscanner.ContentLoadingConfig;
import com.evinced.appium.appscanner.EvincedAppScanner;
import com.evinced.appium.appscanner.filtering.ElementFilter;
import com.evinced.appium.appscanner.filtering.ExcludeBy;
import com.evinced.appium.sdk.core.EvincedAppiumAndroidDriver;
import com.evinced.appium.sdk.core.EvincedAppiumSdk;
import com.evinced.appium.sdk.core.models.Report;

/**
 * Demonstrates App Scanner: autonomous app exploration that clicks through
 * screens and runs an accessibility scan on each one, producing a list of
 * Reports without requiring manual navigation in the test.
 */
public class EvincedAppScannerTest {

    private static final String APP_PACKAGE = "com.evinced.demoapp";

    private static EvincedAppiumAndroidDriver driver;
    private static EvincedAppiumSdk evincedSdk;
    private static EvincedAppScanner scanner;

    @BeforeClass
    public static void setup() throws Exception {
        driver = TestSetup.createLocalDriver();
        evincedSdk = new EvincedAppiumSdk(driver);
        TestSetup.setupCredentials(evincedSdk);

        AppScannerConfig config = new AppScannerConfig()
                .setContentLoadingConfig(new ContentLoadingConfig()
                        .setMaxRetries(3)
                        .setMaxDuration(30000)
                        .setDelay(1000))
                .setMaxDuration(300000)
                .setMaxCollectionItems(3)
                .setMaxReportScans(20)
                .setFullPageEnabled(true)
                .setMaxScrollsPerPage(5)
                .addElementFilter(new ElementFilter()
                        .exclude(ExcludeBy.VIEW_ID, "logout_button"));

        scanner = new EvincedAppScanner(evincedSdk, APP_PACKAGE, config);
    }

    @Test
    public void testAppScanner() throws Exception {
        // Wait for the app to fully load before starting autonomous exploration
        Thread.sleep(3000);

        AppScannerResult result = scanner.start();

        assertNotNull(result, "AppScannerResult should not be null");

        List<Report> reports = result.getReports();
        assertNotNull(reports, "Reports list should not be null");
        assertFalse(reports.isEmpty(), "App Scanner should produce at least one report");

        System.out.println("App Scanner completed in " + result.getTotalDuration() + " ms");
        System.out.println("Screens scanned: " + reports.size());
        for (int i = 0; i < reports.size(); i++) {
            System.out.println("Screen " + (i + 1) + " issues: " + reports.get(i).getTotal());
        }
    }

    @AfterClass
    public static void tearDown() {
        if (scanner != null) {
            scanner.destroy();
        }
        if (driver != null) {
            driver.quit();
        }
    }
}
