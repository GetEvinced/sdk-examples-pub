package com.evinced.examples;

import static org.junit.Assert.assertNotNull;

import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.uiautomator.UiDevice;
import androidx.test.uiautomator.UiObject;
import androidx.test.uiautomator.UiSelector;

import com.evinced.test.EvincedEngine;
import com.evinced.test.models.Report;

import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.util.List;

/**
 * Continuous scan mode: startAnalyze() begins automatic scanning throughout
 * the test. Every screen transition is captured automatically. stopAnalyze()
 * ends the session and returns one Report per captured state.
 */
@RunWith(AndroidJUnit4.class)
public class EvincedContinuousTest {

    private static EvincedEngine evincedEngine;
    private static UiDevice device;

    @BeforeClass
    public static void setup() throws InterruptedException {
        evincedEngine = TestSetup.createEngine();
        device = UiDevice.getInstance(InstrumentationRegistry.getInstrumentation());
        TestSetup.launchDemoApp();
    }

    @Test
    public void testContinuousScan() throws InterruptedException {
        evincedEngine.startAnalyze();

        try {
            UiObject nextBtn = device.findObject(new UiSelector().description("Next"));
            if (nextBtn.exists()) {
                nextBtn.click();
            }
        } catch (Exception ignored) {}
        Thread.sleep(2000);

        List<Report> reports = evincedEngine.stopAnalyze();
        assertNotNull("stopAnalyze should not return null", reports);
        for (int i = 0; i < reports.size(); i++) {
            System.out.println("Report " + (i + 1) + " issues: " + reports.get(i).getTotal());
        }
    }
}
