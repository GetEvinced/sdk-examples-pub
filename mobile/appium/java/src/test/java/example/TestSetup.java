package example;

import java.net.URL;
import java.nio.file.Paths;

import org.openqa.selenium.remote.DesiredCapabilities;

import com.evinced.appium.sdk.core.EvincedAppiumAndroidDriver;
import com.evinced.appium.sdk.core.EvincedAppiumSdk;

import io.appium.java_client.remote.MobileCapabilityType;

/**
 * Shared Appium setup for all test classes.
 *
 * The APK lives in mobile/appium/python/ and is referenced via a relative
 * path from the Maven project root (mobile/appium/java/).
 */
class TestSetup {

    static EvincedAppiumAndroidDriver createDriver() throws Exception {
        String apkPath = Paths.get(System.getProperty("user.dir"),
                "..", "python", "com.evinced.demoapp-MK.apk")
                .toAbsolutePath().normalize().toString();

        DesiredCapabilities caps = new DesiredCapabilities();
        caps.setCapability(MobileCapabilityType.PLATFORM_NAME, "Android");
        caps.setCapability(MobileCapabilityType.AUTOMATION_NAME, "UIAutomator2");
        caps.setCapability(MobileCapabilityType.DEVICE_NAME, "Pixel_9_Pro_XL_API_35");
        caps.setCapability("app", apkPath);
        caps.setCapability("noReset", true);
        caps.setCapability("uiautomator2ServerLaunchTimeout", 60000);

        return new EvincedAppiumAndroidDriver(new URL("http://127.0.0.1:4723/"), caps);
    }

    static void setupCredentials(EvincedAppiumSdk sdk) {
        sdk.setupCredentials(
                System.getenv("EVINCED_SERVICE_ID"),
                System.getenv("EVINCED_API_KEY")
        );
    }
}
