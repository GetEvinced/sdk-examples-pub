import { EvincedSDK } from "@evinced/js-testcafe-sdk";
import { Selector, test, fixture } from 'testcafe';


let evinced;
fixture`Evinced Demo site tests`
    .page`https://demo.evinced.com/`

test('Testing evStart and evStop', async t => {
    // Start the Evinced engine
    const evinced = new EvincedSDK(t);
    await evinced.evStart();

    // Storing evReports in a unique directory by test name and date
    const evReport = `./evinced/reports/${t.test.name}/${Date()}/evincedReport.html`;

    const BASE_FORM_SELECTOR =
    "#gatsby-focus-wrapper > main > div.wrapper-banner > div.filter-container";
    const SELECT_HOME_DROPDOWN = Selector(`${BASE_FORM_SELECTOR} > div:nth-child(1) > div > div.dropdown.line`);
    const SELECT_WHERE_DROPDOWN = Selector(`${BASE_FORM_SELECTOR} > div:nth-child(2) > div > div.dropdown.line`);
    const TINY_HOME_OPTION = Selector(`${BASE_FORM_SELECTOR} > div:nth-child(1) > div > ul > li:nth-child(2)`);
    const EAST_COST_OPTION = Selector(`${BASE_FORM_SELECTOR} > div:nth-child(2) > div > ul > li:nth-child(3)`);

    await t.click(SELECT_HOME_DROPDOWN);
    await t.click(TINY_HOME_OPTION);
    await t.click(SELECT_WHERE_DROPDOWN);
    await t.click(EAST_COST_OPTION);

    // Conclude the scan and store the issues found
    const issues = await evinced.evStop();
    // Using evSaveFile to store file locally
    await evinced.evSaveFile(issues, "html", evReport);

});