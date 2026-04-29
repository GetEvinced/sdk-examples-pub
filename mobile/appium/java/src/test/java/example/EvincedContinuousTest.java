package example;

import java.net.URL;
import java.time.Duration;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import static org.testng.Assert.assertTrue;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import com.evinced.appium.sdk.core.EvincedAppiumAndroidDriver;
import com.evinced.appium.sdk.core.EvincedAppiumSdk;
import com.evinced.appium.sdk.core.models.Report;

import io.appium.java_client.remote.MobileCapabilityType;
import org.openqa.selenium.remote.DesiredCapabilities;

/**
 * Demonstrates continuous scan mode: call startAnalyze() before navigating
 * through multiple screens, then stopAnalyze() to receive one Report per
 * screen that was captured during the session.
 *
 * This is the mobile equivalent of the web evStart/evStop pattern.
 */
public class EvincedContinuousTest {

    private static EvincedAppiumAndroidDriver driver;
    private static EvincedAppiumSdk evincedSdk;

    @BeforeClass
    public static void setup() throws Exception {
        DesiredCapabilities caps = new DesiredCapabilities();
        caps.setCapability(MobileCapabilityType.PLATFORM_NAME, "Android");
        caps.setCapability(MobileCapabilityType.AUTOMATION_NAME, "UIAutomator2");
        caps.setCapability(MobileCapabilityType.DEVICE_NAME, "Pixel_9_Pro_XL_API_35");
        caps.setCapability("avd", "Pixel_9_Pro_XL_API_35");
        caps.setCapability("noReset", true);
        caps.setCapability(MobileCapabilityType.BROWSER_NAME, "Chrome");

        URL url = new URL("http://127.0.0.1:4723/");

        driver = new EvincedAppiumAndroidDriver(url, caps);

        evincedSdk = new EvincedAppiumSdk(driver);
        evincedSdk.setupCredentials(
                System.getenv("EVINCED_SERVICE_ID"),
                System.getenv("EVINCED_API_KEY")
        );
    }

    @Test
    public void testMultipleScreensContinuous() {

        // 1. Start continuous scan — Evinced will capture the current screen
        //    each time analyze() is called within this session.
        evincedSdk.startAnalyze();
        List<Report> reports;
        try {
            // 2. Navigate to first page and scan it
            driver.get("https://demo.evinced.com");
            new WebDriverWait(driver, Duration.ofSeconds(30))
                    .until(ExpectedConditions.presenceOfElementLocated(By.tagName("body")));
            evincedSdk.analyze();

            // 3. Navigate to a second page and scan it
            driver.get("https://demo.evinced.com/booking");
            new WebDriverWait(driver, Duration.ofSeconds(30))
                    .until(ExpectedConditions.presenceOfElementLocated(By.tagName("body")));
            evincedSdk.analyze();

            // 4. Stop continuous scan — returns one Report per analyze() call above
            reports = evincedSdk.stopAnalyze();
        } catch (Exception e) {
            try { evincedSdk.stopAnalyze(); } catch (Exception ignored) {}
            throw e;
        }

        // 5. Assert stopAnalyze() returned at least one report
        assertTrue(!reports.isEmpty(), "stopAnalyze() returned no reports — scan may not have run.");

        // 6. Assert no issues across all captured screens
        for (Report report : reports) {
            assertTrue(
                    !report.hasIssues(),
                    "Accessibility issues found in screen: " + report.getId()
                            + ". See the generated Evinced report for details."
            );
        }
    }

    @AfterClass
    public static void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
