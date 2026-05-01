/**
 * evStartStop — continuous accessibility scan with labels and upload opt-in.
 *
 * evStart begins monitoring all DOM mutations and interactions.
 * evStop ends the scan and returns all issues found during the session.
 *
 * Labels attach metadata to results on the Evinced Platform.
 * Set enableUploadToPlatform: true to upload results (requires env vars).
 */

import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import {
  EvincedSDK,
  setUploadToPlatformConfig,
} from "@evinced/js-playwright-sdk";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const { Given, When, Then } = createBdd();

// Set enableUploadToPlatform to true to upload results to the Evinced Platform.
// Requires EVINCED_SERVICE_ID and EVINCED_API_KEY environment variables.
setUploadToPlatformConfig({ enableUploadToPlatform: false });

const BASE_FORM_SELECTOR =
  "#gatsby-focus-wrapper > main > div.wrapper-banner > div.filter-container";

// Module-scoped to share state between Given/Then steps.
// Assumes scenarios run sequentially (--workers=1 or fullyParallel: false).
let evincedService;

Given(
  "I start an Evinced continuous scan with labels",
  async ({ page }) => {
    evincedService = new EvincedSDK(page);

    // addLabel attaches well-known metadata fields to results on the Platform.
    evincedService.testRunInfo.addLabel({
      testName: "Evinced evStart/evStop BDD example",
      environment: "CI/CD",
      gitBranch: "main",
    });

    // customLabel accepts any key/value pairs.
    // unitId is a reserved key that groups tests together on the Platform.
    evincedService.testRunInfo.customLabel({
      unitId: "bdd-examples",
      repo: "support-golden-examples",
      team: "support",
      framework: "playwright-bdd",
    });

    await evincedService.evStart();
  }
);

Given("I open the Evinced demo site", async ({ page }) => {
  await page.goto("https://demo.evinced.com/");
});

When("I select the {string} property type filter", async ({ page }, value) => {
  const TYPE_DROPDOWN = `${BASE_FORM_SELECTOR} > div:nth-child(1) > div > div.dropdown.line`;

  await page.locator(TYPE_DROPDOWN).click();

  const option = page
    .locator(`${BASE_FORM_SELECTOR} > div:nth-child(1) > div > ul > li`)
    .filter({ hasText: value });
  await option.waitFor({ state: "visible", timeout: 3000 });
  await option.click();
});

When(
  "I select the {string} location filter",
  async ({ page }, value) => {
    const WHERE_DROPDOWN = `${BASE_FORM_SELECTOR} > div:nth-child(2) > div > div.dropdown.line`;

    await page.locator(WHERE_DROPDOWN).click();

    const option = page
      .locator(`${BASE_FORM_SELECTOR} > div:nth-child(2) > div > ul > li`)
      .filter({ hasText: value });
    await option.waitFor({ state: "visible", timeout: 3000 });
    await option.click();
  }
);

Then("I stop the Evinced scan and save the report", async () => {
  if (!evincedService) throw new Error("evincedService was not initialised — did the Given step run?");
  const reportDir = "./evinced-reports";
  if (!existsSync(reportDir)) {
    mkdirSync(reportDir, { recursive: true });
  }

  const htmlReport = path.join(reportDir, "evStartStop.html");

  // Passing uploadToPlatform: true here uploads results to the Platform
  // (requires setUploadToPlatformConfig({ enableUploadToPlatform: true }) above).
  const issues = await evincedService.evStop({ uploadToPlatform: false });
  await evincedService.evSaveFile(issues, "html", htmlReport);

  console.log(
    `Evinced report saved. Issues: ${issues.length}. Path: ${htmlReport}`
  );

  expect(existsSync(htmlReport)).toBeTruthy();
});
