/**
 * evHooks — Before/After Cucumber hook pattern with labels and evSaveFile.
 *
 * The Before hook initialises the Evinced SDK and attaches labels (metadata)
 * before each scenario. The After hook stops the scan and saves both an HTML
 * and a JSON report named after the scenario title.
 *
 * Labels appear on the Evinced Platform when uploadToPlatform is enabled.
 */

import { expect, testInfo as info } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import {
  EvincedSDK,
  setUploadToPlatformConfig,
} from "@evinced/js-playwright-sdk";
import path from "node:path";
import fs from "node:fs";

const { Given, When, Then, Before, After } = createBdd();

// Set enableUploadToPlatform to true to upload results to the Evinced Platform.
// Requires EVINCED_SERVICE_ID and EVINCED_API_KEY environment variables.
setUploadToPlatformConfig({ enableUploadToPlatform: false });

let evinced;

Before(async ({ page }) => {
  evinced = new EvincedSDK(page);

  // addLabel attaches well-known metadata fields to results on the Platform.
  evinced.testRunInfo.addLabel({
    environment: "CI/CD",
    gitBranch: "main",
  });

  // customLabel accepts any key/value pairs.
  // unitId is a reserved key that groups tests together on the Platform.
  evinced.testRunInfo.customLabel({
    unitId: "bdd-examples",
    repo: "support-golden-examples",
    framework: "playwright-bdd",
  });

  await evinced.evStart();
});

Given("I am on the demo Evinced site", async ({ page }) => {
  await page.goto("https://demo.evinced.com/");
});

When(
  "I select {string} from the {string} dropdown",
  async ({ page }, value, label) => {
    // Find the dropdown container that has the label (e.g., "Type" or "Where")
    const container = page
      .locator("div.dropholder", { hasText: label })
      .first();

    // Click the dropdown trigger
    const dropdownTrigger = container.locator("div.dropdown").first();
    await dropdownTrigger.click();

    // Click the appropriate <li> inside the <ul class="dropdownMenu">
    const option = container.locator(`ul.dropdownMenu >> text=${value}`);
    await option.waitFor({ state: "visible", timeout: 3000 });
    await option.click();
  }
);

When("I click the {string} button", async ({ page }, label) => {
  const button = page.locator(`a.search-btn:has-text("${label}")`);
  await button.waitFor({ state: "visible", timeout: 3000 });
  await button.click();
});

Then("I see the option {string}", async ({ page }, text) => {
  await expect(page.getByText(text)).toBeVisible();
});

After(async () => {
  if (evinced) {
    const issues = await evinced.evStop();

    const reportDir = "./evinced-reports";
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    // Derive a safe filename from the scenario title, falling back to a timestamp.
    let basename = `evinced-report`;
    try {
      const testName = info()
        .title.replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
      if (testName) basename = `evinced-report-${testName}`;
    } catch {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      basename = `evinced-report-${timestamp}`;
    }

    const htmlPath = path.join(reportDir, `${basename}.html`);
    const jsonPath = path.join(reportDir, `${basename}.json`);

    await evinced.evSaveFile(issues, "html", htmlPath);
    await evinced.evSaveFile(issues, "json", jsonPath);

    console.log(
      `Evinced reports saved. Issues: ${issues.length}. HTML: ${htmlPath} | JSON: ${jsonPath}`
    );
  }
});
