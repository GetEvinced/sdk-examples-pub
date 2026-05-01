package com.evinced.examples;

import static org.junit.Assert.assertNotNull;

import androidx.test.ext.junit.runners.AndroidJUnit4;

import com.evinced.test.EvincedEngine;
import com.evinced.test.models.Report;

import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;

/**
 * Simplest scan pattern: launch the app and call report() to scan the current
 * screen state immediately.
 */
@RunWith(AndroidJUnit4.class)
public class EvincedExampleTest {

    private static EvincedEngine evincedEngine;

    @BeforeClass
    public static void setup() throws InterruptedException {
        evincedEngine = TestSetup.createEngine();
        TestSetup.launchDemoApp();
    }

    @Test
    public void testAnalyze() {
        Report report = evincedEngine.report();
        assertNotNull("Report should not be null", report);
        System.out.println("Issues found: " + report.getTotal());
    }
}
