import { Builder } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome.js";
import chromedriver from "chromedriver";
import assert from "assert";
import pkg from "@evinced/js-selenium-sdk";
const { EvincedSDK, setCredentials, setUploadToPlatformConfig } = pkg;

await setCredentials({
  serviceId: process.env.EVINCED_SERVICE_ID,
  secret: process.env.EVINCED_API_KEY,
});

describe("Demo page", () => {
  it("Demo page. evStart/evStop", async () => {
    const options = new chrome.Options();
    options.addArguments("--headless");

    const service = new chrome.ServiceBuilder(chromedriver.path);

    const driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .setChromeService(service)
      .build();

    // Keep upload off by default — set true to send results to the Evinced Platform
    setUploadToPlatformConfig({ enableUploadToPlatform: false });

    const evincedService = new EvincedSDK(driver);
    try {
      await evincedService.evStart();
      await driver.get("https://demo.evinced.com/");
      const issues = await evincedService.evStop();
      evincedService.evSaveFile(
        issues,
        "html",
        "test-results/evStartStop-report.html"
      );
      evincedService.evSaveFile(
        issues,
        "json",
        "test-results/evStartStop-report.json"
      );
      assert.equal(issues.length, 6);
    } finally {
      await driver.quit();
    }
  });
});
