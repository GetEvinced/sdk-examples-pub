import { EvincedSDK } from "@evinced/js-testcafe-sdk";
import { Selector, test, fixture } from 'testcafe';

// evHooks — demonstrates TestCafe fixture-level lifecycle hooks with the Evinced SDK.
//
// Pattern:
//   fixture.beforeEach — instantiate EvincedSDK, add labels, call evStart()
//   fixture.afterEach  — call evStop(), save HTML + JSON reports locally
//
// uploadToPlatform is false by default; set it to true only when you explicitly
// want results sent to the Evinced Platform (e.g. in CI on a tagged release).

let evinced;

fixture`Evinced Demo site — evHooks`
    .page`https://demo.evinced.com/`
    .beforeEach(async (t) => {
        evinced = new EvincedSDK(t);
        evinced.addLabel({
            testName: t.test.name,
            environment: "Development",
            SDK: "TestCafe",
        });
        await evinced.evStart();
    })
    .afterEach(async (t) => {
        // uploadToPlatform defaults to false — opt in explicitly when needed
        const issues = await evinced.evStop({ uploadToPlatform: false });

        // Save both HTML (human-readable) and JSON (machine-readable) reports
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        await evinced.evSaveFile(issues, 'html', `tests/results/evinced/${t.test.name}/${timestamp}.html`);
        await evinced.evSaveFile(issues, 'json', `tests/results/evinced/${t.test.name}/${timestamp}.json`);
    });

test("Hooks example — filter interactions", async (t) => {
    // The Evinced engine is already running (started in beforeEach).
    // Interact with the page; evStop() in afterEach collects accumulated issues.

    const BASE_FORM_SELECTOR =
        "#gatsby-focus-wrapper > main > div.wrapper-banner > div.filter-container";
    const SELECT_HOME_DROPDOWN = Selector(`${BASE_FORM_SELECTOR} > div:nth-child(1) > div > div.dropdown.line`);
    const SELECT_WHERE_DROPDOWN = Selector(`${BASE_FORM_SELECTOR} > div:nth-child(2) > div > div.dropdown.line`);
    const TINY_HOME_OPTION = Selector(`${BASE_FORM_SELECTOR} > div:nth-child(1) > div > ul > li:nth-child(2)`);
    const EAST_COAST_OPTION = Selector(`${BASE_FORM_SELECTOR} > div:nth-child(2) > div > ul > li:nth-child(3)`);

    await t.click(SELECT_HOME_DROPDOWN);
    await t.click(TINY_HOME_OPTION);
    await t.click(SELECT_WHERE_DROPDOWN);
    await t.click(EAST_COAST_OPTION);
});
