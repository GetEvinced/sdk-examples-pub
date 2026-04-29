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

describe("Evinced - Asserting on issue severity", () => {
  it("Filter critical issues and assert on count", async () => {
    const options = new chrome.Options();
    options.addArguments("--headless");

    const service = new chrome.ServiceBuilder(chromedriver.path);

    const driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .setChromeService(service)
      .build();

    const evincedService = new EvincedSDK(driver);
    try {
      await evincedService.evStart();
      await driver.get("https://demo.evinced.com/");

      const issues = await evincedService.evStop();

      // Filter to only critical severity issues
      const criticalIssues = issues.filter(
        (issue) => issue.severity.name === "Critical"
      );
      console.log("Critical issues found:", criticalIssues.length);

      // Use this pattern to fail the test if critical issues are found:
      // assert.strictEqual(criticalIssues.length, 0, `Found ${criticalIssues.length} critical issues`);
      assert.ok(
        criticalIssues.length > 0,
        "Expected critical issues to be present on the demo page"
      );

      evincedService.evSaveFile(issues, "html", "test-results/evFailIfCritical-report.html");
      evincedService.evSaveFile(issues, "json", "test-results/evFailIfCritical-report.json");
    } finally {
      await driver.quit();
    }
  });
});
