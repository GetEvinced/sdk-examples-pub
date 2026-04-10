import { EvincedSDK } from "@evinced/js-testcafe-sdk";
import { test, fixture } from 'testcafe';

let evinced;
fixture`Evinced Demo site tests`
    .page`https://demo.evinced.com/`

test("Testing evAnalyze", async (t) => {
    //starting Evinced Engine
    evinced = new EvincedSDK(t)

    //adding labels
    evinced.addLabel({ 
        testName: t.test.name,
        environment: "Developmemt"
    });

    // Use evAnalyze to generate a unique local report 
    const issues = await evinced.evAnalyze();

    // Store results in the a directory with the test name/date to maintain unique reports 
    await evinced.evSaveFile(issues, 'html', `tests/results/evinced/${t.test.name}/${Date()}.html`);
});

