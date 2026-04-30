package com.evinced.examples;

import static org.junit.Assert.assertNotNull;

import androidx.test.ext.junit.runners.AndroidJUnit4;

import com.evinced.test.EvincedEngine;
import com.evinced.test.models.EvincedConfig;
import com.evinced.test.models.InitOptions;
import com.evinced.test.models.IssueFilter;
import com.evinced.test.models.Report;
import com.evinced.test.models.Severity;

import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;

/**
 * Demonstrates configuring the scan: exclude NeedsReview-severity issues via
 * EvincedConfig + IssueFilter, and attach custom metadata to the report.
 */
@RunWith(AndroidJUnit4.class)
public class EvincedConfiguredTest {

    private static EvincedEngine evincedEngine;

    @BeforeClass
    public static void setup() throws InterruptedException {
        IssueFilter excludeFilter = new IssueFilter()
                .severity(Severity.NeedsReview);
        EvincedConfig config = new EvincedConfig()
                .excludeFilters(excludeFilter);
        InitOptions initOptions = new InitOptions()
                .setEvincedConfig(config);

        evincedEngine = TestSetup.createEngine(initOptions);
        TestSetup.launchDemoApp();
    }

    @Test
    public void testConfigured() {
        evincedEngine.addTestCaseMetadata("team", "mobile-qa");
        evincedEngine.addTestCaseMetadata("sprint", "2026-Q2");

        Report report = evincedEngine.report();
        assertNotNull("Report should not be null", report);
        System.out.println("Issues found (excluding NeedsReview): " + report.getTotal());
    }
}
