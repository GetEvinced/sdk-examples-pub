import { browser } from "@wdio/globals";
import assert from "assert";

// The evFailIfCritical pattern runs a scan then filters by severity and
// asserts that no critical issues were found. Use this to gate CI pipelines
// on a specific severity threshold without blocking on minor issues.
describe("Evinced WDIO — fail if critical issues found", () => {
  it("Filter critical issues and assert on count", async () => {
    await browser.url("https://demo.evinced.com/");

    // Single scan of the current page state
    const issues = await browser.evAnalyze();

    // Save the full report before asserting so results are always available
    // regardless of whether the assertion passes or fails
    await browser.evSaveFile(
      issues,
      "html",
      "./test-results/evFailIfCritical-report.html"
    );
    await browser.evSaveFile(
      issues,
      "json",
      "./test-results/evFailIfCritical-report.json"
    );

    // Filter to critical severity only — "Serious", "Moderate", "Minor" are
    // intentionally excluded so the gate only blocks on the highest severity
    const criticalIssues = issues.filter(
      (issue) => issue.severity.name === "Critical"
    );

    console.log(
      `Critical issues found: ${criticalIssues.length} / ${issues.length} total`
    );

    // Use this pattern to fail the test if critical issues are found:
    // assert.strictEqual(criticalIssues.length, 0, `Found ${criticalIssues.length} critical issues`);
    assert.ok(
      criticalIssues.length > 0,
      "Expected critical issues to be present on the demo page"
    );
  });
});
