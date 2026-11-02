import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import { EvincedSDK } from "@evinced/js-playwright-sdk";

// The Search button on the demo site is an <a> without an href, which raises
// ANCHOR_WITHOUT_HREF and NOT_FOCUSABLE. Skip those validations for that element only.
const SEARCH_BUTTON_SELECTOR = ".search-btn";

const skipSearchButton = {
  selector: SEARCH_BUTTON_SELECTOR,
  urlRegex: ".*",
  validationTypes: ["ANCHOR_WITHOUT_HREF", "NOT_FOCUSABLE"],
};

test.describe("Evinced skipValidations", () => {
  test("Skip validations for a specific element", async ({ page }) => {
    const evReport = "./test-results/evSkipValidations.html";
    const jsonReport = "./test-results/evSkipValidations.json";
    const evincedService = new EvincedSDK(page);

    // skipValidations can also be passed to evAnalyze, the EvincedSDK constructor, or evConfig.
    // Legacy equivalent: evStart({ skipValidations: [skipSearchButton] })
    await evincedService.evStart({
      analysis: { SKIP_VALIDATIONS: [skipSearchButton] },
    });

    await page.goto("https://demo.evinced.com/");

    const issues = await evincedService.evStop();
    await evincedService.evSaveFile(issues, "html", evReport);
    await evincedService.evSaveFile(issues, "json", jsonReport);
    expect(existsSync(evReport)).toBeTruthy();

    const searchButtonIssues = issues.filter((issue) =>
      issue.elements.some((el) => el.selector === SEARCH_BUTTON_SELECTOR)
    );
    expect(searchButtonIssues).toHaveLength(0);
  });
});
