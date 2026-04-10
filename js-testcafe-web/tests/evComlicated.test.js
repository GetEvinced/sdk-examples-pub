import { EvincedSDK } from "@evinced/js-testcafe-sdk";
import { Selector, test, fixture } from 'testcafe';


let evinced;
fixture`Upload to platfrom`
    .page`https://demo.evinced.com/`
    .beforeEach(async (t) => {
        evinced = new EvincedSDK(t);
        evinced.addLabel(
            { 
                testName: t.test.name,
                environment: "Development",
                SDK: "TestCafe",
            });
        await evinced.evStart();
    })


    .afterEach(async (t) => {
        await evinced.evStop({ uploadToPlatform: true });
    });

test("Complicated Example", async (t) => {
    // To utilize skip validations in a test, pass in skipSelector variable to skipValidations to exclude selectors you don't want crowding your report
    // example: const issues = await evinced.evAnalyze({ skipValidations: [skipSelector] });    
    const skipSelector = {
        selector: '*',
        // String - Desired CSS selector to skip. Supported: CSS class, CSS Universal Selector
        urlRegex: '.*evinced.com',
        // URL to skip specified selectors. Regex Flavor: ECMAScript 
        validationTypes: ['NOT_FOCUSABLE'],
        // examples: ["WRONG_SEMANTIC_ROLE", "NOT_FOCUSABLE", "NO_DESCRIPTIVE_TEXT"]
    };

    // Use evAnalyze to generate a unique local report 
    const issues = await evinced.evAnalyze({ skipValidations: [skipSelector] });
    await evinced.evSaveFile(issues, 'html', `tests/results/evinced/${t.test.name}/${Date()}.html`); 
      
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

});