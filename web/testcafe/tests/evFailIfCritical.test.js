import { EvincedSDK } from "@evinced/js-testcafe-sdk";
import { test, fixture } from 'testcafe';
import assert from 'assert';

fixture`Evinced - Asserting on issue severity`
    .page`https://demo.evinced.com/`

test("Filter critical issues and assert on count", async (t) => {
    const evinced = new EvincedSDK(t);
    await evinced.evStart();

    const BASE_FORM_SELECTOR =
        "#gatsby-focus-wrapper > main > div.wrapper-banner > div.filter-container";
    const SELECT_HOME_DROPDOWN = `${BASE_FORM_SELECTOR} > div:nth-child(1) > div > div.dropdown.line`;
    const SELECT_WHERE_DROPDOWN = `${BASE_FORM_SELECTOR} > div:nth-child(2) > div > div.dropdown.line`;
    const TINY_HOME_OPTION = `${BASE_FORM_SELECTOR} > div:nth-child(1) > div > ul > li:nth-child(2)`;
    const EAST_COAST_OPTION = `${BASE_FORM_SELECTOR} > div:nth-child(2) > div > ul > li:nth-child(3)`;

    await t.click(SELECT_HOME_DROPDOWN);
    await t.click(TINY_HOME_OPTION);
    await t.click(SELECT_WHERE_DROPDOWN);
    await t.click(EAST_COAST_OPTION);

    const issues = await evinced.evStop({ uploadToPlatform: false });

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

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    await evinced.evSaveFile(issues, "html", `tests/results/evinced/evFailIfCritical/${timestamp}.html`);
    await evinced.evSaveFile(issues, "json", `tests/results/evinced/evFailIfCritical/${timestamp}.json`);
});
