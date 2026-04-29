package example;

import java.net.URL;
import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import static org.testng.Assert.assertTrue;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import com.evinced.appium.sdk.core.EvincedAppiumAndroidDriver;
import com.evinced.appium.sdk.core.EvincedAppiumSdk;
import com.evinced.appium.sdk.core.models.EvincedConfig;
import com.evinced.appium.sdk.core.models.InitOptions;
import com.evinced.appium.sdk.core.models.IssueFilter;
import com.evinced.appium.sdk.core.models.Report;
import com.evinced.appium.sdk.core.models.Severity;

import io.appium.java_client.remote.MobileCapabilityType;
import org.openqa.selenium.remote.DesiredCapabilities;

/**
 * Demonstrates configuring the Evinced Appium SDK:
 *  - Excluding issues by severity via EvincedConfig + IssueFilter
 *  - Passing custom metadata key/value pairs to label the report
 *  - Setting a custom output directory via InitOptions
 *
 * NOTE: There is no dedicated "labels" API in the mobile Appium SDK.
 * Custom key/value metadata (addTestCaseMetadata) is the equivalent.
 */
public class EvincedConfiguredTest {

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

        // Build a filter that excludes Minor-severity issues
        IssueFilter excludeMinor = new IssueFilter(driver)
                .severity(Severity.Minor);

        EvincedConfig config = new EvincedConfig()
                .excludeFilters(excludeMinor);

        // InitOptions lets you set a config and a custom output directory
        InitOptions initOptions = new InitOptions()
                .setEvincedConfig(config)
                .setOutputDir("evinced-reports/configured-run");

        evincedSdk = new EvincedAppiumSdk(driver, initOptions);
        evincedSdk.setupCredentials(
                System.getenv("EVINCED_SERVICE_ID"),
                System.getenv("EVINCED_API_KEY")
        );
    }

    @Test
    public void testWithConfigAndMetadata() {

        // Attach custom metadata to the report (equivalent of labels in web SDK)
        evincedSdk.addTestCaseMetadata("team", "mobile-qa");
        evincedSdk.addTestCaseMetadata("sprint", "2026-Q2");

        // Navigate to the page under test
        driver.get("https://demo.evinced.com");
        new WebDriverWait(driver, Duration.ofSeconds(30))
                .until(ExpectedConditions.presenceOfElementLocated(By.tagName("body")));

        // Run scan — Minor issues are excluded by the EvincedConfig above
        Report report = evincedSdk.report();

        assertTrue(
                !report.hasIssues(),
                "Accessibility issues were found. See the generated Evinced report for details."
        );
    }

    @AfterClass
    public static void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
