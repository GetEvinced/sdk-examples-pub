const filePathHtml = "./reports/results.html";
const filePathJson = "./reports/results.json";

describe("Evinced SDK tests - evSaveFile", () => {
  it("Saves accessibility report in multiple formats", () => {
    // Navigate to site
    cy.visit("https://demo.evinced.com/");

    // Scan for a11y issues
    cy.evAnalyze().then((issues) => {
      expect(issues).to.have.length.greaterThan(0);

      // Save the report as an HTML file (human-readable)
      cy.evSaveFile(issues, "html", filePathHtml);

      // Save the report as a JSON file (machine-readable / CI integration)
      cy.evSaveFile(issues, "json", filePathJson);
    });
  });
});
