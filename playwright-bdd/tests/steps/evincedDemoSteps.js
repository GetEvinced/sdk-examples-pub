import { expect, testInfo as info } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { EvincedSDK } from "@evinced/js-playwright-sdk";
import path from "node:path";
import fs from "node:fs";

const { Given, When, Then, Before, After } = createBdd();

let evinced;

Before(async ({ page }) => {
  evinced = new EvincedSDK(page);
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

    let filename = `evinced-report.html`;
    try {
      const testName = info()
        .title.replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
      filename = `evinced-report-${testName}.html`;
    } catch {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      filename = `evinced-report-${timestamp}.html`;
    }

    const filePath = path.join(reportDir, filename);

    await evinced.evSaveFile(issues, "html", filePath);

    console.log(
      `Evinced report saved. Issues: ${issues.length}. Path: ${filePath}`
    );
  }
});
