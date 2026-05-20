import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import { EvincedSDK } from "@evinced/js-playwright-sdk";
import { assert } from "node:console";

test.describe("Evinced Demo Page", () => {
    test("Using evStart and evStop", async ({ page }) => {
      const evReport = "./test-results/continuous.html";
      const evincedService = new EvincedSDK(page);
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

      const criticalIssues = issues.filter((issue) => issue.severity.name === 'Critical');
      console.log("Critical issues found:", criticalIssues.length);
      // There are 10 critical issues on this page, the test will not fail but this is how you would fail the test if there were critical issues
      // You would do criticalIssues.length === 0, so the assertion will fail the test if the result is not 0
      await assert(criticalIssues.length === 10, 'Found critical issues');

      await evincedService.evSaveFile(issues, "html", evReport);
      expect(existsSync(evReport)).toBeTruthy();
    });
  });