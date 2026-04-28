import { browser } from "@wdio/globals";
import assert from "assert";

describe("Using the Evinced WDIO SDK", () => {
  it("Should show issues on the Evinced demo page", async () => {
    await browser.url(`https://demo.evinced.com/`);

    // Calling the evAnalyze method here will start the SDK to scan the page for accessibility issues
    const issues = await browser.evAnalyze();

    // The variable issues is an array so we are able to filter on the issues that are being logged from it
    // This way we can see if there are things we should be concerned about
    const criticalIssues = issues.filter(
      (issue) => issue.severity.name === "Critical"
    );
    // In our case, we want it to equal 0 but the test will deliberately fail as there are issues present on the page
    await assert(criticalIssues.length !== 0, "found critical issues");
  });
});
