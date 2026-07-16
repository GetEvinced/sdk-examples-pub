package com.evinced.example;

import com.evinced.EvincedSDK;
import com.evinced.EvincedWebDriver;
import io.github.cdimascio.dotenv.Dotenv;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.RemoteWebDriver;

import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

public abstract class BaseTest {

    protected EvincedWebDriver driver;
    protected String testUrl;
    protected static final String REPORTS_DIR = "reports";

    private static String require(Dotenv dotenv, String key) {
        String value = dotenv.get(key);
        if (value == null || value.isBlank()) {
            throw new IllegalStateException(
                "Required environment variable '" + key + "' is not set. " +
                "Copy .env.example to .env and fill in your credentials."
            );
        }
        return value;
    }

    @BeforeEach
    void setUpBase() throws MalformedURLException {
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

        String ltUsername = require(dotenv, "LT_USERNAME");
        String ltAccessKey = require(dotenv, "LT_ACCESS_KEY");
        String evincedServiceId = require(dotenv, "EVINCED_SERVICE_ID");
        String evincedApiKey = require(dotenv, "EVINCED_API_KEY");
        testUrl = dotenv.get("TEST_URL", "https://demo.evinced.com/");

        EvincedSDK.setCredentials(evincedServiceId, evincedApiKey);

        new File(REPORTS_DIR).mkdirs();

        ChromeOptions options = new ChromeOptions();
        options.setPlatformName("Windows 10");
        options.setBrowserVersion("latest");

        Map<String, Object> ltOptions = new HashMap<>();
        ltOptions.put("build", "Evinced SDK Demo");
        ltOptions.put("name", getClass().getSimpleName());
        ltOptions.put("w3c", true);
        options.setCapability("LT:Options", ltOptions);

        String gridUrl = "https://" + ltUsername + ":" + ltAccessKey + "@hub.lambdatest.com/wd/hub";
        RemoteWebDriver remoteDriver = new RemoteWebDriver(new URL(gridUrl), options);
        driver = new EvincedWebDriver(remoteDriver);
    }

    @AfterEach
    void tearDownBase() {
        if (driver != null) {
            driver.quit();
        }
    }
}
