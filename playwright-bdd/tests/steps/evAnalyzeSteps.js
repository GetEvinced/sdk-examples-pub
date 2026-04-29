/**
 * evAnalyze — one-shot accessibility scan.
 *
 * evAnalyze() scans the current DOM state once and returns issues immediately.
 * No evStart/evStop needed. Both HTML and JSON reports are saved.
 */

import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { EvincedSDK, setUploadToPlatformConfig } from "@evinced/js-playwright-sdk";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const { Given, Then } = createBdd();

// uploadToPlatform is opt-in — set enableUploadToPlatform: true to send results to the Evinced Platform
setUploadToPlatformConfig({ enableUploadToPlatform: false });

Given("I navigate to the Evinced demo home page", async ({ page }) => {
  await page.goto("https://demo.evinced.com/");
});

Then(
  "I run an Evinced evAnalyze scan and save reports",
  async ({ page }) => {
    const evincedService = new EvincedSDK(page);

    // evAnalyze performs a one-shot scan of the current page state.
    // No evStart/evStop is required.
    const issues = await evincedService.evAnalyze();
    console.log("Evinced issues found:", issues.length);

    const reportDir = "./evinced-reports";
    if (!existsSync(reportDir)) {
      mkdirSync(reportDir, { recursive: true });
    }

    const htmlReport = path.join(reportDir, "evAnalyze.html");
    const jsonReport = path.join(reportDir, "evAnalyze.json");

    await evincedService.evSaveFile(issues, "html", htmlReport);
    await evincedService.evSaveFile(issues, "json", jsonReport);

    console.log(`HTML report saved: ${htmlReport}`);
    console.log(`JSON report saved: ${jsonReport}`);

    // Verify the HTML report was created
    expect(existsSync(htmlReport)).toBeTruthy();
  }
);
