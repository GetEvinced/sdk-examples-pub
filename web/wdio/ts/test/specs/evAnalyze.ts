import { browser } from "@wdio/globals";
import assert from "assert";

describe("Evinced WDIO — evAnalyze (single scan)", () => {
  it("Should show issues on the Evinced demo page", async () => {
    await browser.url("https://demo.evinced.com/");

    // evAnalyze performs a single point-in-time scan of the current page state
    // @ts-expect-error
    const issues = await browser.evAnalyze();

    // Save results to HTML and JSON for review/archiving
    // @ts-expect-error
    await browser.evSaveFile(issues, "html", "./test/evAnalyze-report.html");
    // @ts-expect-error
    await browser.evSaveFile(issues, "json", "./test/evAnalyze-report.json");

    // Filter to critical issues and assert — the demo page has known issues so
    // this assertion deliberately expects failures to demonstrate the workflow
    const criticalIssues = issues.filter(
      (issue: { severity: { name: string } }) =>
        issue.severity.name === "Critical"
    );
    assert(criticalIssues.length !== 0, "found critical issues");
  });
});
