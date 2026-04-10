// Generated from: tests/features/sample.feature
import { test } from "playwright-bdd";

test.describe('Playwright site', () => {

  test('Check get started link', async ({ Given, page, When, Then }) => { 
    await Given('I am on home page', null, { page }); 
    await When('I click link "Get started"', null, { page }); 
    await Then('I see in title "Installation"', null, { page }); 
  });

});

// == technical section ==

test.beforeEach('BeforeEach Hooks', ({ $beforeEach }) => {});
test.afterEach('AfterEach Hooks', ({ $afterEach }) => {});

test.use({
  $test: ({}, use) => use(test),
  $uri: ({}, use) => use('tests/features/sample.feature'),
  $bddFileData: ({}, use) => use(bddFileData),
  $beforeEachFixtures: ({ page }, use) => use({ page }),
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I am on home page","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Action","textWithKeyword":"When I click link \"Get started\"","stepMatchArguments":[{"group":{"start":13,"value":"\"Get started\"","children":[{"start":14,"value":"Get started","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Outcome","textWithKeyword":"Then I see in title \"Installation\"","stepMatchArguments":[{"group":{"start":15,"value":"\"Installation\"","children":[{"start":16,"value":"Installation","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end