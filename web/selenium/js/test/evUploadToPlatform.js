import assert from "assert";
import { Builder } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome.js";
import pkg from "@evinced/js-selenium-sdk";
const {
  EvincedSDK,
  setOfflineCredentials,
  setUploadToPlatformConfig,
  setCredentials,
} = pkg;

describe("Simple Upload Test", () => {
  let driver;
  const options = new chrome.Options();
  options.addArguments("--headless");

  before(async () => {
    // Set credentials for analysis
    await setCredentials({
      serviceId: process.env.EVINCED_SERVICE_ID,
      secret: process.env.EVINCED_API_KEY,
    });
  });

  beforeEach(async () => {
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
  });

  afterEach(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it("should upload issues to platform", async () => {
    // Enable upload capability — uploadToPlatform must still be opted in per-scan
    // (setUploadToPlatformDefault is intentionally omitted so upload is not always-on)
    setUploadToPlatformConfig({
      enableUploadToPlatform: true,
    });

    const evincedService = new EvincedSDK(driver);

    // Add test metadata
    evincedService.testRunInfo.addLabel({
      testName: "Simple Upload Test",
      gitBranch: "main",
      environment: "test",
    });

    await driver.get("https://demo.evinced.com/");

    // Upload is opted in explicitly on this scan via uploadToPlatform: true
    const issues = await evincedService.evAnalyze({
      uploadToPlatform: true,
    });

    // Verify issues were found
    assert.equal(issues.length, 6);

    // Should see "Upload successful! Status: 200" in console
  });
});
