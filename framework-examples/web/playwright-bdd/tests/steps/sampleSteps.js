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

Given("I am on home page", async ({ page }) => {
  await page.goto("https://playwright.dev");
});

When("I click link {string}", async ({ page }, name) => {
  await page.getByRole("link", { name }).click();
});

Then("I see in title {string}", async ({ page }, keyword) => {
  await expect(page).toHaveTitle(new RegExp(keyword));
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
      `Evinced report saved. Issues found: ${issues.length}. Report path: ${filePath}`
    );
  }
});
