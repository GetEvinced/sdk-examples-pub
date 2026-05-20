package com.evinced.examples;

import static org.junit.Assert.assertNotNull;

import androidx.test.ext.junit.runners.AndroidJUnit4;

import com.evinced.test.EvincedEngine;
import com.evinced.test.models.InitOptions;
import com.evinced.test.models.PlatformUpload;
import com.evinced.test.models.Report;

import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;

/**
 * Demonstrates uploading scan results to the Evinced Platform.
 *
 * Two approaches:
 *   1. ENABLED_BY_DEFAULT — every report() call uploads automatically.
 *   2. Per-call upload — pass PlatformUpload.ENABLED to a single report() call.
 */
@RunWith(AndroidJUnit4.class)
public class EvincedPlatformUploadTest {

    private static EvincedEngine evincedEngine;

    @BeforeClass
    public static void setup() throws InterruptedException {
        InitOptions initOptions = new InitOptions(
                new InitOptions.PlatformConfig(InitOptions.UploadOption.ENABLED_BY_DEFAULT)
        );
        evincedEngine = TestSetup.createEngine(initOptions);
        TestSetup.launchDemoApp();
    }

    @Test
    public void testUploadWithDefaultConfig() {
        // report() uploads automatically because of ENABLED_BY_DEFAULT
        Report report = evincedEngine.report();
        assertNotNull("Report should not be null", report);
        System.out.println("Issues found (auto-uploaded): " + report.getTotal());
    }

    @Test
    public void testUploadPerCall() {
        // Selectively upload this specific scan
        Report report = evincedEngine.report(PlatformUpload.ENABLED);
        assertNotNull("Report should not be null", report);
        System.out.println("Issues found (per-call upload): " + report.getTotal());
    }
}
