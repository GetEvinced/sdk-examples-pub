import { Builder, WebDriver } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import assert from "assert";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { EvincedSDK, setCredentials } = require("@evinced/js-selenium-sdk");

interface Issue {
  severity: { name: string };
}

describe("Evinced - Asserting on issue severity", () => {
  before(async () => {
    await setCredentials({
      serviceId: process.env.EVINCED_SERVICE_ID,
      secret: process.env.EVINCED_API_KEY,
    });
  });

  it("Filter critical issues and assert on count", async () => {
    const options = new chrome.Options();
    options.addArguments("--headless");

    const driver: WebDriver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    const evincedService = new EvincedSDK(driver);
    try {
      await evincedService.evStart();
      await driver.get("https://demo.evinced.com/");

      const issues: Issue[] = await evincedService.evStop();

      const criticalIssues = issues.filter(
        (issue: Issue) => issue.severity.name === "Critical"
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
