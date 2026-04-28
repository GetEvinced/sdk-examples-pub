context("Evinced Demo Site tests", () => {
  beforeEach(() => {
    // Start the Evinced engine
    cy.evStart();
  });

  afterEach(() => {
    // Conclude the scan, print issues to cy.log with logIssues and print the report JSON object to browser's console
    cy.evStop({ logIssues: true }).should((report) => {
      console.log(JSON.stringify(report, null, 2));
    });

    // The way to assert that tests should have issues or not
    // cy.evStop().should((issues) => {
    //     expect(issues).to.be.empty();
    // });
  });

  it("Search Test", () => {
    cy.visit("https://demo.evinced.com/");
    const BASE_FORM_SELECTOR =
      "#gatsby-focus-wrapper > main > div.wrapper-banner > div.filter-container";
    const SELECT_HOME_DROPDOWN = `${BASE_FORM_SELECTOR} > div:nth-child(1) > div > div.dropdown.line`;
    const SELECT_WHERE_DROPDOWN = `${BASE_FORM_SELECTOR} > div:nth-child(2) > div > div.dropdown.line`;
    const TINY_HOME_OPTION = `${BASE_FORM_SELECTOR} > div:nth-child(1) > div > ul > li:nth-child(2)`;
    const EAST_COST_OPTION = `#gatsby-focus-wrapper > main > div.wrapper-banner > div.filter-container > div:nth-child(2) > div > ul > li:nth-child(3)`;
    const SEARCH_BUTTON = `#gatsby-focus-wrapper > main > div.wrapper-banner > div.filter-container > a`;
    const CALI_OPTION = `#results-container > div:nth-child(6) > h2`;

    cy.get(SELECT_HOME_DROPDOWN).click();
    // cy.get(TINY_HOME_OPTION).scrollIntoView().should("be.visible").click();

    // cy.get(SELECT_WHERE_DROPDOWN).click();
    // cy.get(EAST_COST_OPTION).should("be.visible").click(); 

    // cy.get(SEARCH_BUTTON).should("be.visible").click();
    // cy.get(CALI_OPTION).should("be.visible").should("have.text", "California Vanning");
  });
});
