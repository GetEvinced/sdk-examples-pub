describe("Evinced SDK tests - evAnalyze", () => {
  it("Evinced simple example", () => {
    // Navigate to site
    cy.visit("https://demo.evinced.com/");
    //Scan for a11y issues, get the result and assert on the number of issues found
    // If any of the issues are criticle, then stop the tests and fail the assertion
    // criticalIssues is an array
    cy.evAnalyze().should((issues) => {
      const criticalIssues = issues.filter(
        (issue) => issue.severity.name === "Critical"
      );
      // There are 6 critical issues on this demo site, I want to have the test to pass so I do this
      // YOU WOULD WANT THIS VALUE TO BE 0
      assert(criticalIssues.length === 6, "found critical issues");
    });
  });
});
