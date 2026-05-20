// Generated from: tests/features/evinced-demo.feature
import { test } from "playwright-bdd";

test.describe('Evinced Demo Search', () => {

  test('Search for Remote Arizona', async ({ Given, page, When, And, Then }) => { 
    await Given('I am on the demo Evinced site', null, { page }); 
    await When('I select "backyard" from the "type" dropdown', null, { page }); 
    await And('I select "middle America" from the "where" dropdown', null, { page }); 
    await And('I click the "Search" button', null, { page }); 
    await Then('I see the option "Remote Arizona"', null, { page }); 
  });

});

// == technical section ==

test.beforeEach('BeforeEach Hooks', ({ $beforeEach }) => {});
test.afterEach('AfterEach Hooks', ({ $afterEach }) => {});

test.use({
  $test: ({}, use) => use(test),
  $uri: ({}, use) => use('tests/features/evinced-demo.feature'),
  $bddFileData: ({}, use) => use(bddFileData),
  $beforeEachFixtures: ({ page }, use) => use({ page }),
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am on the demo Evinced site","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Action","textWithKeyword":"When I select \"backyard\" from the \"type\" dropdown","stepMatchArguments":[{"group":{"start":9,"value":"\"backyard\"","children":[{"start":10,"value":"backyard","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":29,"value":"\"type\"","children":[{"start":30,"value":"type","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"And I select \"middle America\" from the \"where\" dropdown","stepMatchArguments":[{"group":{"start":9,"value":"\"middle America\"","children":[{"start":10,"value":"middle America","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":35,"value":"\"where\"","children":[{"start":36,"value":"where","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And I click the \"Search\" button","stepMatchArguments":[{"group":{"start":12,"value":"\"Search\"","children":[{"start":13,"value":"Search","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then I see the option \"Remote Arizona\"","stepMatchArguments":[{"group":{"start":17,"value":"\"Remote Arizona\"","children":[{"start":18,"value":"Remote Arizona","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end