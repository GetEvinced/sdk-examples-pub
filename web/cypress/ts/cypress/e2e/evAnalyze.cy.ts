describe("Evinced SDK tests - evAnalyze", () => {
  it("Evinced simple example", () => {
    // Navigate to site
    cy.visit("https://demo.evinced.com/");
    //Scan for a11y issues, get the result and assert on the number of issues found
    cy.evAnalyze().should((issues) => {
      expect(issues).to.have.length.greaterThan(0);
    });
  });
});
