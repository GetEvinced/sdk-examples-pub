package example;

import static org.testng.Assert.assertNotNull;

import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import com.evinced.appium.sdk.core.EvincedAppiumAndroidDriver;
import com.evinced.appium.sdk.core.EvincedAppiumSdk;
import com.evinced.appium.sdk.core.models.InitOptions;
import com.evinced.appium.sdk.core.models.PlatformUpload;
import com.evinced.appium.sdk.core.models.Report;

/**
 * Demonstrates uploading scan results to the Evinced Platform.
 *
 * Two approaches are shown:
 *   1. ENABLED_BY_DEFAULT — every report() call uploads automatically.
 *   2. Per-call upload — pass PlatformUpload.ENABLED to a single report() call.
 *
 * Credentials must be set via EVINCED_SERVICE_ID and EVINCED_API_KEY env vars.
 */
public class EvincedPlatformUploadTest {

    private static EvincedAppiumAndroidDriver driver;
    private static EvincedAppiumSdk evincedSdk;

    @BeforeClass
    public static void setup() throws Exception {
        driver = TestSetup.createDriver();

        // Configure platform upload so every report() call uploads automatically
        InitOptions.PlatformConfig platformConfig =
                new InitOptions.PlatformConfig(InitOptions.UploadOption.ENABLED_BY_DEFAULT);
        InitOptions initOptions = new InitOptions(platformConfig);

        evincedSdk = new EvincedAppiumSdk(driver, initOptions);
        TestSetup.setupCredentials(evincedSdk);
    }

    @Test
    public void testUploadWithDefaultConfig() throws Exception {
        Thread.sleep(3000);

        // report() uploads automatically because of ENABLED_BY_DEFAULT
        Report report = evincedSdk.report();

        assertNotNull(report, "Evinced report should not be null");
        System.out.println("Issues found (auto-uploaded): " + report.getTotal());
    }

    @Test
    public void testUploadPerCall() throws Exception {
        Thread.sleep(3000);

        // Selectively upload this specific scan by passing PlatformUpload.ENABLED
        Report report = evincedSdk.report(PlatformUpload.ENABLED);

        assertNotNull(report, "Evinced report should not be null");
        System.out.println("Issues found (per-call upload): " + report.getTotal());
    }

    @AfterClass
    public static void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
