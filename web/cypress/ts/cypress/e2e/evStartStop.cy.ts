context("Evinced Demo Site tests", () => {
  it("Search Test", () => {
    cy.visit("https://demo.evinced.com/");

    // Add standard labels — testName and environment are built-in Evinced fields
    cy.addLabel({
      testName: Cypress.currentTest.title,
      environment: "QA",
      gitBranch: "main"
    });

    // Add custom labels — unitId is a reserved key used for grouping in the Evinced Platform;
    // all other keys are arbitrary and can hold any values meaningful to your team
    cy.customLabel({
      unitId: "Digital",
      "Repo": "Examples",
      "Team": "Support"
    });

    // Start the Evinced engine
    cy.evStart();

    const BASE_FORM_SELECTOR =
      "#gatsby-focus-wrapper > main > div.wrapper-banner > div.filter-container";
    const SELECT_HOME_DROPDOWN = `${BASE_FORM_SELECTOR} > div:nth-child(1) > div > div.dropdown.line`;
    const SELECT_WHERE_DROPDOWN = `${BASE_FORM_SELECTOR} > div:nth-child(2) > div > div.dropdown.line`;
    const TINY_HOME_OPTION = `${BASE_FORM_SELECTOR} > div:nth-child(1) > div > ul > li:nth-child(2)`;
    const EAST_COST_OPTION = `${BASE_FORM_SELECTOR} > div:nth-child(2) > div > ul > li:nth-child(3)`;

    cy.get(SELECT_HOME_DROPDOWN).click();
    cy.get(TINY_HOME_OPTION).should("be.visible").click();
    cy.get(SELECT_WHERE_DROPDOWN).click();
    cy.get(EAST_COST_OPTION).should("be.visible").click();

    // Conclude the scan and print results to the browser console.
    // uploadToPlatform is opt-in — uncomment to send results to the Evinced Platform.
    cy.evStop({
      logIssues: true,
      // uploadToPlatform: true,
    }).should((issues) => {
      console.log(JSON.stringify(issues, null, 2));
    });
  });
});
