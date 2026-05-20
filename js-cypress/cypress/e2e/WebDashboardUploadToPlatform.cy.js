context("Evinced Web Dashboard - Upload To Platform", () => {
  it("Navigates demo site and uploads accessibility results to Evinced Platform", () => {
    cy.visit("https://demo.evinced.com/");

    // Labels attach metadata to results on the Evinced Platform
    cy.addLabel({
      testName: Cypress.currentTest.title,
      environment: "CI/CD",
      gitBranch: "main",
    });

    // customLabel accepts any key/value pairs.
    // unitId is a reserved key that groups tests together on the platform.
    // "teamPR" demonstrates the "TeamName__repo-identifier" convention for
    // correlating test runs with specific team PRs/deployments on the platform.
    cy.customLabel({
      unitId: "Digital",
      repo: "examples",
      team: "Squidward",
      framework: "cypress",
      teamPR: "TeamSquidward__repo-homepage-1234",
    });

    cy.evStart();

    const BASE_FORM_SELECTOR =
      "#gatsby-focus-wrapper > main > div.wrapper-banner > div.filter-container";
    const SELECT_HOME_DROPDOWN = `${BASE_FORM_SELECTOR} > div:nth-child(1) > div > div.dropdown.line`;
    const SELECT_WHERE_DROPDOWN = `${BASE_FORM_SELECTOR} > div:nth-child(2) > div > div.dropdown.line`;
    const TINY_HOME_OPTION = `${BASE_FORM_SELECTOR} > div:nth-child(1) > div > ul > li:nth-child(2)`;
    const EAST_COAST_OPTION = `${BASE_FORM_SELECTOR} > div:nth-child(2) > div > ul > li:nth-child(3)`;

    cy.get(SELECT_HOME_DROPDOWN).click();
    cy.get(TINY_HOME_OPTION).click();
    cy.get(SELECT_WHERE_DROPDOWN).click();
    cy.get(EAST_COAST_OPTION).click();

    // uploadToPlatform: true sends results to the Evinced Platform dashboard.
    // Requires EVINCED_SERVICE_ID and EVINCED_API_KEY environment variables.
    cy.evStop({ logIssues: true, uploadToPlatform: true }).should((issues) => {
      console.log(JSON.stringify(issues, null, 2));
    });
  });
});
