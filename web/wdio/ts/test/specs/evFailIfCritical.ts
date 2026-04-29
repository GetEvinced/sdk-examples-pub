import { browser } from "@wdio/globals";
import assert from "assert";

// The evFailIfCritical pattern runs a scan then filters by severity and
// asserts that no critical issues were found. Use this to gate CI pipelines
// on a specific severity threshold without blocking on minor issues.
describe("Evinced WDIO — fail if critical issues found", () => {
  it("Should have zero critical accessibility issues on the demo page", async () => {
    await browser.url("https://demo.evinced.com/");

    // Single scan of the current page state
    // @ts-expect-error
    const issues = await browser.evAnalyze();

    // Save the full report before asserting so results are always available
    // regardless of whether the assertion passes or fails
    // @ts-expect-error
    await browser.evSaveFile(
      issues,
      "html",
      "./test/evFailIfCritical-report.html"
    );
    // @ts-expect-error
    await browser.evSaveFile(
      issues,
      "json",
      "./test/evFailIfCritical-report.json"
    );

    // Filter to critical severity only — "Serious", "Moderate", "Minor" are
    // intentionally excluded so the gate only blocks on the highest severity
    const criticalIssues = issues.filter(
      (issue: { severity: { name: string } }) =>
        issue.severity.name === "Critical"
    );

    console.log(
      `Critical issues found: ${criticalIssues.length} / ${issues.length} total`
    );

    // Fail the test if any critical issues exist — remove or adjust this
    // threshold to match your team's acceptance criteria
    assert.strictEqual(
      criticalIssues.length,
      0,
      `Expected 0 critical issues but found ${criticalIssues.length}`
    );
  });
});
