package example;

import static org.testng.Assert.assertNotNull;

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

/**
 * Demonstrates configuring the scan: exclude Minor-severity issues via
 * EvincedConfig + IssueFilter, and attach custom metadata to the report.
 */
public class EvincedConfiguredTest {

    private static EvincedAppiumAndroidDriver driver;
    private static EvincedAppiumSdk evincedSdk;

    @BeforeClass
    public static void setup() throws Exception {
        driver = TestSetup.createDriver();

        IssueFilter excludeMinor = new IssueFilter(driver).severity(Severity.Minor);
        EvincedConfig config = new EvincedConfig().excludeFilters(excludeMinor);
        InitOptions initOptions = new InitOptions().setEvincedConfig(config);

        evincedSdk = new EvincedAppiumSdk(driver, initOptions);
        TestSetup.setupCredentials(evincedSdk);
    }

    @Test
    public void testConfigured() throws Exception {
        evincedSdk.addTestCaseMetadata("team", "mobile-qa");
        evincedSdk.addTestCaseMetadata("sprint", "2026-Q2");

        Thread.sleep(3000);

        Report report = evincedSdk.report();

        assertNotNull(report, "Evinced report should not be null");
        System.out.println("Issues found (excluding Minor): " + report.getTotal());
    }

    @AfterClass
    public static void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
