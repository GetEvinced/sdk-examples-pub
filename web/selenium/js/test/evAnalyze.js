import { Builder } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome.js";
import chromedriver from "chromedriver";
import assert from "assert";
import pkg from "@evinced/js-selenium-sdk";
const { EvincedSDK, setCredentials } = pkg;

await setCredentials({
  serviceId: process.env.EVINCED_SERVICE_ID,
  secret: process.env.EVINCED_API_KEY,
});

describe("Demo page", () => {
  it("Demo page. evAnalyze", async () => {
    const options = new chrome.Options();
    options.addArguments("--headless");

    const service = new chrome.ServiceBuilder(chromedriver.path);

    const driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .setChromeService(service)
      .build();

    const evincedService = new EvincedSDK(driver);
    await driver.get("https://demo.evinced.com/");
    const issues = await evincedService.evAnalyze({
      initOptions: {
        enableScreenshots: true,
      },
    });
    evincedService.evSaveFile(
      issues,
      "html",
      "test-results/evAnalyze-report.html"
    );
    assert.equal(issues.length, 6);
    await driver.quit();
  });
});
