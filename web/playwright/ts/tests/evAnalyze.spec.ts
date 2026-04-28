import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import { EvincedSDK } from "@evinced/js-playwright-sdk";
import type { Issue } from "evinced-web-sdk-types";

test.describe("Evinced evAnalyze", () => {
  test("Single test run using evAnalyze", async ({ page }) => {
    const evReport = "./test-results/evAnalyze.html";
    const evincedService = new EvincedSDK(page);
    await page.goto("https://demo.evinced.com/");
    const issues: Issue[] = await evincedService.evAnalyze();
    await evincedService.evSaveFile(issues, "html", evReport);
    expect(existsSync(evReport)).toBeTruthy();
  });
});
