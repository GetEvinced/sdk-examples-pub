package example;

import java.net.URL;
import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.remote.DesiredCapabilities;
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

public class EvincedExampleTest {

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
    public void testDemoEvincedSite() {

        // 1. Open demo.evinced.com
        driver.get("https://demo.evinced.com");

        // 2. Wait for page content to load
        new WebDriverWait(driver, Duration.ofSeconds(30))
                .until(ExpectedConditions.presenceOfElementLocated(
                        By.tagName("body")
                ));

        // 3. Run accessibility scan
        Report report = evincedSdk.report();

        // 4. Assert no issues (or print count if you expect some)
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
