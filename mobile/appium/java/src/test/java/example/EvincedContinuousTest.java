package example;

import static org.testng.Assert.assertFalse;
import static org.testng.Assert.assertNotNull;

import java.util.List;

import org.openqa.selenium.By;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import com.evinced.appium.sdk.core.EvincedAppiumAndroidDriver;
import com.evinced.appium.sdk.core.EvincedAppiumSdk;
import com.evinced.appium.sdk.core.models.Report;

/**
 * Demonstrates continuous scan mode: call startAnalyze() before interacting
 * with the app, call analyze() per screen, then stopAnalyze() to get one
 * Report per captured screen.
 *
 * This is the mobile equivalent of the web evStart/evStop pattern.
 */
public class EvincedContinuousTest {

    private static EvincedAppiumAndroidDriver driver;
    private static EvincedAppiumSdk evincedSdk;

    @BeforeClass
    public static void setup() throws Exception {
        driver = TestSetup.createDriver();
        evincedSdk = new EvincedAppiumSdk(driver);
        TestSetup.setupCredentials(evincedSdk);
    }

    @Test
    public void testMultipleScreens() throws Exception {
        evincedSdk.startAnalyze();
        List<Report> reports;
        try {
            // Screen 1: app launch state
            Thread.sleep(3000);
            evincedSdk.analyze();

            // Screen 2: navigate deeper if possible
            try {
                driver.findElement(By.xpath("//*[@content-desc='Next']")).click();
                Thread.sleep(2000);
            } catch (Exception ignored) {}
            evincedSdk.analyze();

            reports = evincedSdk.stopAnalyze();
        } catch (Exception e) {
            try { evincedSdk.stopAnalyze(); } catch (Exception ignored) {}
            throw e;
        }

        assertNotNull(reports, "stopAnalyze() should not return null");
        assertFalse(reports.isEmpty(), "stopAnalyze() returned no reports");
        for (int i = 0; i < reports.size(); i++) {
            System.out.println("Screen " + (i + 1) + " issues found: " + reports.get(i).getTotal());
        }
    }

    @AfterClass
    public static void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
