package com.evinced.examples;

import static org.junit.Assert.assertTrue;

import androidx.test.ext.junit.runners.AndroidJUnit4;

import org.junit.Test;
import org.junit.runner.RunWith;

/**
 * Zero-dependency smoke test to verify the instrumentation runner can discover tests at all.
 * If this returns tests=0 on Sauce Labs, the issue is infrastructure (not the Evinced SDK).
 * If this runs but Evinced tests don't, the SDK classes are failing to load on the device.
 */
@RunWith(AndroidJUnit4.class)
public class SmokeTest {

    @Test
    public void alwaysTrue() {
        assertTrue(true);
    }
}
