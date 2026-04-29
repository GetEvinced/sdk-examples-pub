import { Builder, WebDriver } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { EvincedSDK, setCredentials } = require("@evinced/js-selenium-sdk");

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

  it("Demo page. evAnalyze", async () => {
    const options = new chrome.Options();
    options.addArguments("--headless");

    const driver: WebDriver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    const evincedService = new EvincedSDK(driver);
    try {
      await driver.get("https://demo.evinced.com/");
      const issues: Issue[] = await evincedService.evAnalyze({
        initOptions: {
          enableScreenshots: true,
        },
      });
      evincedService.evSaveFile(issues, "html", "test-results/evAnalyze-report.html");
      evincedService.evSaveFile(issues, "json", "test-results/evAnalyze-report.json");
    } finally {
      await driver.quit();
    }
  });
});
