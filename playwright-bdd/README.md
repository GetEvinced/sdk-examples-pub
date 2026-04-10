# Playwright BDD Test Setup

This repository uses [Playwright](https://playwright.dev) with [playwright-bdd](https://github.com/vitalets/playwright-bdd), a tool that enables writing browser automation tests using Gherkin-style `.feature` files and step definitions.

The tests are defined in the `.features-gen` directory using `.feature` files such as `sample.feature`. These files follow a Given/When/Then syntax to describe behavior in a readable, business-oriented way.

A corresponding `steps.js` file contains the actual JavaScript implementations of each Gherkin step. The `playwright-bdd` system automatically reads the `.feature` file, matches the steps to the definitions in `steps.js`, and generates a test spec behind the scenes that Playwright can execute.

For example, if `sample.feature` contains:

```gherkin
Feature: Navigation

  Scenario: Open Playwright homepage
    Given I am on home page
    When I click link "Docs"
    Then I see in title "Playwright"
```

Then `steps.js` should contain:
import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { EvincedSDK } from "@evinced/js-playwright-sdk";
import { existsSync } from "node:fs";

const { Given, When, Then, Before, After } = createBdd();

let evinced;

Before(async ({ page }) => {
evinced = new EvincedSDK(page);
await evinced.evStart();
});

Given("I am on home page", async ({ page }) => {
await page.goto("https://playwright.dev");
});

When("I click link {string}", async ({ page }, name) => {
await page.getByRole("link", { name }).click();
});

Then("I see in title {string}", async ({ page }, keyword) => {
await expect(page).toHaveTitle(new RegExp(keyword));
});

After(async () => {
if (evinced) {
const issues = await evinced.evStop();
await evinced.evSaveFile(issues, "html", "./evinced-report.html");

    console.log(
      `Evinced report saved. Issues found: ${issues.length}. Report path: ./evinced-report.html`
    );

}
});

Once both the .feature file and step definitions are in place, running npx playwright test will automatically execute the test as a native Playwright test.

This approach provides a clean separation between the test scenarios (written in plain English) and the underlying automation logic (written in JavaScript), making tests easier to write, understand, and maintain.

