import { Builder, WebDriver } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import assert from "assert";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { EvincedSDK, setCredentials, setUploadToPlatformConfig } = require("@evinced/js-selenium-sdk");

interface Issue {
  severity: { name: string };
}

describe("Simple Upload Test", () => {
  let driver: WebDriver;
  const options = new chrome.Options();
  options.addArguments("--headless");

  before(async () => {
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
    setUploadToPlatformConfig({ enableUploadToPlatform: true });

    const evincedService = new EvincedSDK(driver);

    evincedService.testRunInfo.addLabel({
      testName: "Simple Upload Test",
      gitBranch: "main",
      environment: "test",
    });

    await driver.get("https://demo.evinced.com/");

    // Upload is opted in explicitly on this scan via uploadToPlatform: true
    const issues: Issue[] = await evincedService.evAnalyze({
      uploadToPlatform: true,
    });

    assert.equal(issues.length, 6);

    // Should see "Upload successful! Status: 200" in console
  });
});
