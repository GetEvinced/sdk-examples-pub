package example;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.Playwright;
import com.evinced.EvincedSDK;

/**
 * Shared Playwright singleton for the test class running in this JVM.
 *
 * build.gradle sets forkEvery=1, so each test class runs in its own JVM.
 * This avoids SDK 1.6.1's JVM-global scan state bleeding between classes
 * (which caused evStop() to hang when classes shared a JVM).
 *
 * The credentialBrowser is kept alive so the SDK's global HTTP context
 * (set by the first setCredentials() call) remains valid for the whole run.
 * No shutdown hook is registered: browser.close() / playwright.close()
 * hang in SDK 1.6.1 after scans. The Playwright subprocess self-terminates
 * when the JVM exits (stdin EOF).
 */
class PlaywrightTestSetup {

    static final Playwright playwright;
    // Credential browser: kept alive to preserve the SDK's global HTTP context.
    private static final Browser credentialBrowser;

    static {
        playwright = Playwright.create();
        credentialBrowser = playwright.chromium().launch();

        EvincedSDK.setCredentials(
                System.getenv("EVINCED_SERVICE_ID"),
                System.getenv("EVINCED_API_KEY"));

        // No shutdown hook: browser.close() / playwright.close() hang in SDK 1.6.1
        // after any scan has run. With forkEvery=1 each class runs in its own JVM;
        // the Playwright subprocess receives stdin EOF on JVM exit and self-terminates.
    }
}
