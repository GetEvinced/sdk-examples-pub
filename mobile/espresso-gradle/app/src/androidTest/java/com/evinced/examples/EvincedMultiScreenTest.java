package com.evinced.examples;

import static org.junit.Assert.assertFalse;
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
 * Multi-screen pattern: call analyze() at each screen checkpoint, then
 * reportStored() to collect one Report per captured state.
 */
@RunWith(AndroidJUnit4.class)
public class EvincedMultiScreenTest {

    private static EvincedEngine evincedEngine;
    private static UiDevice device;

    @BeforeClass
    public static void setup() throws InterruptedException {
        evincedEngine = TestSetup.createEngine();
        device = UiDevice.getInstance(InstrumentationRegistry.getInstrumentation());
        TestSetup.launchDemoApp();
    }

    @Test
    public void testMultipleScreens() throws InterruptedException {
        // Screen 1: launch state
        evincedEngine.analyze();

        // Screen 2: navigate deeper if available
        try {
            UiObject nextBtn = device.findObject(new UiSelector().description("Next"));
            if (nextBtn.exists()) {
                nextBtn.click();
                Thread.sleep(2000);
            }
        } catch (Exception ignored) {}
        evincedEngine.analyze();

        List<Report> reports = evincedEngine.reportStored();
        assertNotNull("reportStored should not return null", reports);
        assertFalse("reportStored should return at least one report", reports.isEmpty());
        for (int i = 0; i < reports.size(); i++) {
            System.out.println("Screen " + (i + 1) + " issues: " + reports.get(i).getTotal());
        }
    }
}
