package example;

import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import org.openqa.selenium.remote.DesiredCapabilities;

import com.evinced.appium.sdk.core.EvincedAppiumAndroidDriver;
import com.evinced.appium.sdk.core.EvincedAppiumSdk;

import io.appium.java_client.remote.MobileCapabilityType;

/**
 * Shared Appium setup for all test classes.
 *
 * Connects to Sauce Labs. The APK must be uploaded to Sauce Labs storage
 * (storage:filename=com.evinced.demoapp-MK.apk) before running — the
 * mobile-jvm.yml CI workflow handles this automatically.
 *
 * For local runs: upload the APK once via the Sauce Labs Storage API or UI,
 * then set SAUCE_USER and SAUCE_ACCESS_KEY and run mvn test.
 */
class TestSetup {

    static EvincedAppiumAndroidDriver createDriver() throws Exception {
        DesiredCapabilities caps = new DesiredCapabilities();
        caps.setCapability(MobileCapabilityType.PLATFORM_NAME, "Android");
        caps.setCapability(MobileCapabilityType.AUTOMATION_NAME, "UIAutomator2");
        caps.setCapability(MobileCapabilityType.DEVICE_NAME, "Android GoogleAPI Emulator");
        caps.setCapability(MobileCapabilityType.PLATFORM_VERSION, "15.0");
        caps.setCapability("app", "storage:filename=com.evinced.demoapp-MK.apk");
        caps.setCapability("noReset", false);
        caps.setCapability("appium:uiautomator2ServerLaunchTimeout", 60000);

        Map<String, Object> sauceOptions = new HashMap<>();
        sauceOptions.put("username", System.getenv("SAUCE_USER"));
        sauceOptions.put("accessKey", System.getenv("SAUCE_ACCESS_KEY"));
        sauceOptions.put("appiumVersion", "2.11.0");
        sauceOptions.put("build", "Examples Repository");
        sauceOptions.put("name", "Java Appium Evinced Tests");
        caps.setCapability("sauce:options", sauceOptions);

        return new EvincedAppiumAndroidDriver(
                new URL("https://ondemand.us-west-1.saucelabs.com/wd/hub"), caps);
    }

    static EvincedAppiumAndroidDriver createLocalDriver() throws Exception {
        DesiredCapabilities caps = new DesiredCapabilities();
        caps.setCapability(MobileCapabilityType.PLATFORM_NAME, "Android");
        caps.setCapability(MobileCapabilityType.AUTOMATION_NAME, "UIAutomator2");
        caps.setCapability(MobileCapabilityType.DEVICE_NAME, "Android Emulator");
        caps.setCapability("app", System.getProperty("user.dir") + "/../../../wdio/com.evinced.demoapp-MK.apk");
        caps.setCapability("appium:hideKeyboard", true);
        caps.setCapability("autoGrantPermissions", true);

        return new EvincedAppiumAndroidDriver(
                new URL("http://127.0.0.1:4723"), caps);
    }

    static void setupCredentials(EvincedAppiumSdk sdk) {
        sdk.setupCredentials(
                System.getenv("EVINCED_SERVICE_ID"),
                System.getenv("EVINCED_API_KEY")
        );
    }
}
