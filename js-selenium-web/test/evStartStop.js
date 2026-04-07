import { Builder } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome.js";
import assert from "assert";
import pkg from "@evinced/js-selenium-sdk";
const { EvincedSDK, setCredentials } = pkg;

await setCredentials({
  serviceId: process.env.EVINCED_SERVICE_ID,
  secret: process.env.EVINCED_API_KEY,
});

describe("Demo page", () => {
  it("Demo page. evStart/evStop", async () => {
    const options = new chrome.Options();
    options.addArguments("--headless");

    const driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    const evincedService = new EvincedSDK(driver);
    await evincedService.evStart();
    await driver.get("https://demo.evinced.com/");
    const issues = await evincedService.evStop();
    evincedService.evSaveFile(
      issues,
      "html",
      "test-results/evStartStop-report.html"
    );
    assert.equal(issues.length, 6);
    await driver.quit();
  });
});
