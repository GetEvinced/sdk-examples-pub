import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import { EvincedSDK } from "@evinced/js-playwright-sdk";
import { setUploadToPlatformConfig } from "@evinced/js-playwright-sdk";


test.describe("Evinced Demo Page", () => {
  test("Using evStart and evStop", async ({ page }, testInfo) => {
    const evReport = "./test-results/continuous.html";
    const evincedService = new EvincedSDK(page);

    setUploadToPlatformConfig({ enableUploadToPlatform: true });
    evincedService.testRunInfo.addLabel({
      testName: testInfo.title,
      testFile: testInfo.file,
      environment: 'Development',
      gitBranch: 'main'
    });

    // A space for setting any and all extra data labels
    evincedService.testRunInfo.customLabel({
      // unitId is a reserved key and will be used to group tests in the Evinced Platform, the rest of the keys are custom and can be used as needed
      unitId: "Digital", // Options are [Digital, Main, Kids, Learning, Parents, Food, Shop]
      "Repo": "Your-Repository-Name",
      "Team": "Your-Team-Name",
      "framework": "Playwright"
    })

    await evincedService.evStart();

    await page.goto("https://demo.evinced.com/");

    const BASE_FORM_SELECTOR =
      "#gatsby-focus-wrapper > main > div.wrapper-banner > div.filter-container";
    const SELECT_HOME_DROPDOWN = `${BASE_FORM_SELECTOR} > div:nth-child(1) > div > div.dropdown.line`;
    const SELECT_WHERE_DROPDOWN = `${BASE_FORM_SELECTOR} > div:nth-child(2) > div > div.dropdown.line`;
    const TINY_HOME_OPTION = `${BASE_FORM_SELECTOR} > div:nth-child(1) > div > ul > li:nth-child(2)`;
    const EAST_COST_OPTION = `${BASE_FORM_SELECTOR} > div:nth-child(2) > div > ul > li:nth-child(3)`;

    await page.locator(SELECT_HOME_DROPDOWN).click();
    await page.locator(TINY_HOME_OPTION).click();
    await page.locator(SELECT_WHERE_DROPDOWN).click();
    await page.locator(EAST_COST_OPTION).click();

    const issues = await evincedService.evStop();
    await evincedService.evSaveFile(issues, "html", evReport);
    expect(existsSync(evReport)).toBeTruthy();
  });
});
