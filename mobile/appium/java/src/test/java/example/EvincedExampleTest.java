package example;

import static org.testng.Assert.assertNotNull;

import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import com.evinced.appium.sdk.core.EvincedAppiumAndroidDriver;
import com.evinced.appium.sdk.core.EvincedAppiumSdk;
import com.evinced.appium.sdk.core.models.Report;

/**
 * Simplest scan pattern: launch the app and call report() to capture the
 * current screen state and generate an HTML/JSON report.
 */
public class EvincedExampleTest {

    private static EvincedAppiumAndroidDriver driver;
    private static EvincedAppiumSdk evincedSdk;

    @BeforeClass
    public static void setup() throws Exception {
        driver = TestSetup.createDriver();
        evincedSdk = new EvincedAppiumSdk(driver);
        TestSetup.setupCredentials(evincedSdk);
    }

    @Test
    public void testAnalyze() throws Exception {
        Thread.sleep(3000);

        Report report = evincedSdk.report();

        assertNotNull(report, "Evinced report should not be null");
        System.out.println("Issues found: " + report.getTotal());
    }

    @AfterClass
    public static void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
