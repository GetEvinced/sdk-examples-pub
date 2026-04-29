import { Builder, WebDriver } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import assert from "assert";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { EvincedSDK, setCredentials, setUploadToPlatformConfig } = require("@evinced/js-selenium-sdk");

interface Issue {
  severity: { name: string };
}

describe("Demo page", () => {
  before(async () => {
    await setCredentials({
      serviceId: process.env.EVINCED_SERVICE_ID,
      secret: process.env.EVINCED_API_KEY,
    });
  });

  it("Demo page. evStart/evStop", async () => {
    const options = new chrome.Options();
    options.addArguments("--headless");

    const driver: WebDriver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    // Keep upload off by default — set true to send results to the Evinced Platform
    setUploadToPlatformConfig({ enableUploadToPlatform: false });

    const evincedService = new EvincedSDK(driver);
    try {
      await evincedService.evStart();
      await driver.get("https://demo.evinced.com/");
      const issues: Issue[] = await evincedService.evStop();
      evincedService.evSaveFile(issues, "html", "test-results/evStartStop-report.html");
      evincedService.evSaveFile(issues, "json", "test-results/evStartStop-report.json");
      assert.equal(issues.length, 6);
    } finally {
      await driver.quit();
    }
  });
});
