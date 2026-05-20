package com.evinced.example.playwright;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.Playwright;
import com.evinced.EvincedSDK;

/**
 * Shared Playwright/browser singleton for the entire test run.
 *
 * The Evinced SDK stores the Playwright request context from the first
 * setCredentials() call as a global HTTP client. If that browser is closed
 * before the test run ends, every subsequent setCredentials() call throws
 * "Target page, context or browser has been closed", breaking all later
 * test classes.
 *
 * Keeping one Playwright + browser alive for the full JVM lifetime avoids
 * this. A shutdown hook cleans up when Maven Surefire's forked JVM exits.
 */
class PlaywrightTestSetup {

    static final Playwright playwright;
    static final Browser browser;

    static {
        playwright = Playwright.create();
        browser = playwright.chromium().launch();

        EvincedSDK.setCredentials(
                System.getenv("EVINCED_SERVICE_ID"),
                System.getenv("EVINCED_API_KEY"));

        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            browser.close();
            playwright.close();
        }));
    }
}
