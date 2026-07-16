import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import { EvincedSDK } from "@evinced/js-playwright-sdk";

test.describe("Evinced evAnalyze", () => {
  test("Single test run using evAnalyze", async ({ page }) => {
    const evReport = "./test-results/evMcpDemo.html";
    const jsonReport = "./test-results/evMcpDemo.json";
    const evincedService = new EvincedSDK(page);
    await page.goto("https://demo-fe-orpin.vercel.app/");
    const issues = await evincedService.evAnalyze();
    console.log("Issues =", issues);
    await evincedService.evSaveFile(issues, "html", evReport);
    await evincedService.evSaveFile(issues, "json", jsonReport);
    expect(existsSync(evReport)).toBeTruthy();
  });
});
