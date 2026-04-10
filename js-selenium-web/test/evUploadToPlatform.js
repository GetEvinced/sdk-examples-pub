import assert from "assert";
import { By, Builder } from "selenium-webdriver";
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

  before(() => {
    // Set credentials for analysis
    setCredentials({
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
    // Enable upload globally
    setUploadToPlatformConfig({
      enableUploadToPlatform: true,
      setUploadToPlatformDefault: true,
    });

    const evincedService = new EvincedSDK(driver);

    // Add test metadata
    evincedService.testRunInfo.addLabel({
      testName: "Simple Upload Test",
      gitBranch: "main",
      environment: "test",
    });

    await driver.get("https://demo.evinced.com/");

    // Run analysis with upload enabled
    const issues = await evincedService.evAnalyze({
      uploadToPlatform: true,
    });

    // Verify issues were found
    assert.equal(issues.length, 6);

    // Should see "Upload successful! Status: 200" in console
  });
});
