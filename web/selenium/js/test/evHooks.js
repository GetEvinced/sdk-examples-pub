import { Builder } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome.js";
import pkg from "@evinced/js-selenium-sdk";
const { EvincedSDK, setCredentials } = pkg;

// Credentials are set once for the entire suite in before()
await setCredentials({
  serviceId: process.env.EVINCED_SERVICE_ID,
  secret: process.env.EVINCED_API_KEY,
});

// evHooks — demonstrates Mocha lifecycle hooks with the Evinced Selenium SDK.
//
// Pattern:
//   beforeEach — create a fresh driver and start the Evinced engine (evStart)
//   afterEach  — stop the engine (evStop), save HTML + JSON reports, quit the driver
//
// This ensures every test gets an isolated browser session and a named report
// without any boilerplate inside the test body itself.

describe("Demo page — evHooks", () => {
  let driver;
  let evincedService;

  const options = new chrome.Options();
  options.addArguments("--headless");

  beforeEach(async () => {
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    evincedService = new EvincedSDK(driver);

    // Start continuous scanning before each test
    await evincedService.evStart();

    evincedService.testRunInfo.addLabel({
      testName: "evHooks",
      testFile: "evHooks.js",
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
    // Stop the engine and collect issues accumulated during the test
    const issues = await evincedService.evStop();

    // Save both HTML (human-readable) and JSON (machine-readable) reports
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const htmlReport = `./test-results/evHooks-${timestamp}.html`;
    const jsonReport = `./test-results/evHooks-${timestamp}.json`;
    await evincedService.evSaveFile(issues, "html", htmlReport);
    await evincedService.evSaveFile(issues, "json", jsonReport);

    await driver.quit();
  });

  it("scans the home page", async () => {
    // Navigation is handled in beforeEach; evStop() in afterEach collects results
  });

  it("scans the home page after interacting with filters", async () => {
    // Interact with the page to surface dynamic accessibility issues
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
