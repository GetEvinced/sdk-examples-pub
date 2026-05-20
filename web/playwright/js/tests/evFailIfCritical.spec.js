import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import assert from "node:assert";
import { EvincedSDK } from "@evinced/js-playwright-sdk";

test.describe("Evinced - Asserting on issue severity", () => {
  test("Filter critical issues and assert on count", async ({ page }) => {
    const evReport = "./test-results/evFailIfCritical.html";
    const evincedService = new EvincedSDK(page);

    await evincedService.evStart();
    await page.goto("https://demo.evinced.com/");

    const BASE_FORM_SELECTOR =
      "#gatsby-focus-wrapper > main > div.wrapper-banner > div.filter-container";
    const SELECT_HOME_DROPDOWN = `${BASE_FORM_SELECTOR} > div:nth-child(1) > div > div.dropdown.line`;
    const SELECT_WHERE_DROPDOWN = `${BASE_FORM_SELECTOR} > div:nth-child(2) > div > div.dropdown.line`;
    const TINY_HOME_OPTION = `${BASE_FORM_SELECTOR} > div:nth-child(1) > div > ul > li:nth-child(2)`;
    const EAST_COAST_OPTION = `${BASE_FORM_SELECTOR} > div:nth-child(2) > div > ul > li:nth-child(3)`;

    await page.locator(SELECT_HOME_DROPDOWN).click();
    await page.locator(TINY_HOME_OPTION).click();
    await page.locator(SELECT_WHERE_DROPDOWN).click();
    await page.locator(EAST_COAST_OPTION).click();

    const issues = await evincedService.evStop();

    // Filter to only critical severity issues
    const criticalIssues = issues.filter(
      (issue) => issue.severity.name === "Critical"
    );
    console.log("Critical issues found:", criticalIssues.length);

    // Use this pattern to fail the test if critical issues are found:
    // assert.strictEqual(criticalIssues.length, 0, `Found ${criticalIssues.length} critical issues`);
    assert.ok(
      criticalIssues.length > 0,
      "Expected critical issues to be present on the demo page"
    );

    await evincedService.evSaveFile(issues, "html", evReport);
    expect(existsSync(evReport)).toBeTruthy();
  });
});
