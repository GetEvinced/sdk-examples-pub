import { Builder, WebDriver } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { EvincedSDK, setCredentials } = require("@evinced/js-selenium-sdk");

interface Issue {
  severity: { name: string };
}

describe("Demo page — evHooks", () => {
  let driver: WebDriver;
  let evincedService: any;

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

    evincedService = new EvincedSDK(driver);

    await evincedService.evStart();

    evincedService.testRunInfo.addLabel({
      testName: "evHooks",
      testFile: "evHooks.ts",
      environment: "CI/CD",
      gitBranch: "main",
    });
    evincedService.testRunInfo.customLabel({
      unitId: "your-unit-id",
      Repo: "your-repo-name",
      Team: "your-team-name",
      Framework: "Selenium",
    });

    await driver.get("https://demo.evinced.com/");
  });

  afterEach(async () => {
    const issues: Issue[] = await evincedService.evStop();

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    await evincedService.evSaveFile(issues, "html", `./test-results/evHooks-${timestamp}.html`);
    await evincedService.evSaveFile(issues, "json", `./test-results/evHooks-${timestamp}.json`);

    await driver.quit();
  });

  it("scans the home page", async () => {
    // Navigation is handled in beforeEach; evStop() in afterEach collects results
  });

  it("scans the home page after interacting with filters", async () => {
    const homeDropdown = await driver.findElement({
      css: "#gatsby-focus-wrapper > main > div.wrapper-banner > div.filter-container > div:nth-child(1) > div > div.dropdown.line",
    });
    await homeDropdown.click();

    const tinyHomeOption = await driver.findElement({
      css: "#gatsby-focus-wrapper > main > div.wrapper-banner > div.filter-container > div:nth-child(1) > div > ul > li:nth-child(2)",
    });
    await tinyHomeOption.click();
  });
});
