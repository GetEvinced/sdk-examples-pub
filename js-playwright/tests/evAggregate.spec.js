import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import { EvincedSDK } from "@evinced/js-playwright-sdk";
import { setUploadToPlatformConfig } from "@evinced/js-playwright-sdk";

setUploadToPlatformConfig({ enableUploadToPlatform: true });

let evincedService;

test.describe("Tests the Evinced demo page", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    evincedService = new EvincedSDK(page);

    evincedService.testRunInfo.addLabel({
      testName: testInfo.title,
      testFile: testInfo.file,
      environment: "CI/CD Pipeline",
    });

    // Use continuous mode for each test
    await evincedService.evStart();

    // Go to the starting url before each test
    await page.goto("https://demo.evinced.com/");
  });

  test.afterEach(async ({}, testInfo) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const testName = testInfo.title.replace(/\s+/g, "_");
    const evReport = `./test-results/${testName}_${timestamp}.html`;

    // If using upload to platform
    const issues = await evincedService.evStop({ uploadToPlatform: true });
    await evincedService.evSaveFile(issues, "html", evReport);
    expect(existsSync(evReport)).toBeTruthy();
  });

  // Define shared selectors at the top level for reuse
  const BASE_FORM_SELECTOR =
    "#gatsby-focus-wrapper > main > div.wrapper-banner > div.filter-container";
  const SELECT_HOME_DROPDOWN = `${BASE_FORM_SELECTOR} > div:nth-child(1) > div > div.dropdown.line`;
  const SELECT_WHERE_DROPDOWN = `${BASE_FORM_SELECTOR} > div:nth-child(2) > div > div.dropdown.line`;
  const TINY_HOME_OPTION = `${BASE_FORM_SELECTOR} > div:nth-child(1) > div > ul > li:nth-child(2)`;
  const EAST_COAST_OPTION = `${BASE_FORM_SELECTOR} > div:nth-child(2) > div > ul > li:nth-child(3)`;

  // Helper function to perform the booking navigation steps
  async function performBookingNavigation(page) {
    await page.locator(SELECT_HOME_DROPDOWN).click();
    await page.locator(TINY_HOME_OPTION).click();
    await page.locator(SELECT_WHERE_DROPDOWN).click();
    await page.locator(EAST_COAST_OPTION).click();
  }

  test("Navigates to booking page", async ({ page }) => {
    await performBookingNavigation(page);
  });

  test("Navigates to booking page 2", async ({ page }) => {
    await performBookingNavigation(page);
  });

  test("Navigates to booking page 3", async ({ page }) => {
    await performBookingNavigation(page);
  });
});
