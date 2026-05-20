import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import { EvincedSDK, setUploadToPlatformConfig } from "@evinced/js-playwright-sdk";
import type { Issue } from "evinced-web-sdk-types";

// Set enableUploadToPlatform to true to upload results to the Evinced Platform.
// Requires EVINCED_SERVICE_ID and EVINCED_API_KEY environment variables.
setUploadToPlatformConfig({ enableUploadToPlatform: false });

let evincedService: EvincedSDK;

test.describe("Evinced Demo Page — hooks pattern", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    evincedService = new EvincedSDK(page);

    // Labels attach metadata to your results on the Evinced Platform
    evincedService.testRunInfo.addLabel({
      testName: testInfo.title,
      testFile: testInfo.file,
      environment: "CI/CD",
      gitBranch: "main",
    });

    // customLabel accepts any key/value pairs.
    // unitId is a reserved key that groups tests together on the platform.
    evincedService.testRunInfo.customLabel({
      unitId: "your-unit-id",
      Repo: "your-repo-name",
      Team: "your-team-name",
      Framework: "Playwright",
    });

    await evincedService.evStart();
    await page.goto("https://demo.evinced.com/");
  });

  test.afterEach(async ({}, testInfo) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const testName = testInfo.title.replace(/\s+/g, "_");
    const evReport = `./test-results/${testName}_${timestamp}.html`;

    const issues: Issue[] = await evincedService.evStop();
    await evincedService.evSaveFile(issues, "html", evReport);
    expect(existsSync(evReport)).toBeTruthy();
  });

  const BASE_FORM_SELECTOR =
    "#gatsby-focus-wrapper > main > div.wrapper-banner > div.filter-container";
  const SELECT_HOME_DROPDOWN = `${BASE_FORM_SELECTOR} > div:nth-child(1) > div > div.dropdown.line`;
  const SELECT_WHERE_DROPDOWN = `${BASE_FORM_SELECTOR} > div:nth-child(2) > div > div.dropdown.line`;
  const TINY_HOME_OPTION = `${BASE_FORM_SELECTOR} > div:nth-child(1) > div > ul > li:nth-child(2)`;
  const EAST_COAST_OPTION = `${BASE_FORM_SELECTOR} > div:nth-child(2) > div > ul > li:nth-child(3)`;

  test("Navigates to booking page", async ({ page }) => {
    await page.locator(SELECT_HOME_DROPDOWN).click();
    await page.locator(TINY_HOME_OPTION).click();
    await page.locator(SELECT_WHERE_DROPDOWN).click();
    await page.locator(EAST_COAST_OPTION).click();
  });

  test("Navigates to booking page 2", async ({ page }) => {
    await page.locator(SELECT_HOME_DROPDOWN).click();
    await page.locator(TINY_HOME_OPTION).click();
    await page.locator(SELECT_WHERE_DROPDOWN).click();
    await page.locator(EAST_COAST_OPTION).click();
  });
});
