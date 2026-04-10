const filePathHtml = "./reports/results.html";

describe("Evinced SDK tests - evAnalyze", () => {
  it("Evinced simple example", () => {
    // Navigate to site
    cy.visit("https://demo.evinced.com/");

    // Scan for a11y issues, get the result and assert on the number of issues found
    cy.evAnalyze().then((issues) => {
      expect(issues).to.have.length.greaterThan(0);

      // Save the issues to a file
      cy.evSaveFile(issues, "html", filePathHtml);
    });
  });
});
