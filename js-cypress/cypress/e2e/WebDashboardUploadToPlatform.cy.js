/**
 * WebDashboardUploadToPlatform — Cypress + Evinced SDK example
 *
 * Demonstrates how to upload accessibility scan results to the Evinced Web
 * Dashboard (hub.evinced.com) and tag them with labels so they can be filtered,
 * grouped, and monitored over time.
 *
 * Prerequisites
 * ─────────────
 * Upload must be enabled in cypress/support/e2e.js (already configured):
 *
 *   Evinced.setUploadToPlatformConfig({
 *     enableUploadToPlatform: true,   // required — off by default
 *     setUploadToPlatformDefault: true // auto-upload on every evStop/evAnalyze
 *   });
 *
 * Environment variables required:
 *   EVINCED_SERVICE_ID  — your Evinced service account ID
 *   EVINCED_API_KEY     — your Evinced service account secret
 *
 * Docs: https://developer.evinced.com/sdks-for-web-apps/cypress-sdk
 */
context("Evinced Web Dashboard - Upload To Platform", () => {
  it("Navigates demo site and uploads accessibility results to Evinced Platform", () => {
    cy.visit("https://demo.evinced.com/");

    /**
     * addLabel — built-in metadata fields recognised by the Evinced Platform.
     *
     * Supported keys: testName, testFile, environment, flow,
     *                 gitBranch, gitUserName, gitVersion
     *
     * These appear as first-class filter dimensions in hub.evinced.com,
     * making it easy to compare results across branches or environments.
     */
    cy.addLabel({
      testName: Cypress.currentTest.title,
      environment: "CI/CD",
      gitBranch: "main",
    });

    /**
     * customLabel — arbitrary key/value pairs (strings or arrays).
     *
     * unitId is a reserved key: the platform uses it to group related tests
     * into a logical "unit" (e.g. a team, product area, or release).
     *
     * All other keys are freeform. The "teamPR" key below uses the
     * TeamName__repo-identifier convention to correlate a scan run with a
     * specific team and pull request, enabling per-PR accessibility tracking
     * on the Web Dashboard.
     *
     * Example: "TeamSquidward__repo-homepage-1234"
     *           └─ team name ──┘  └─ repo + PR/build id ─┘
     */
    cy.customLabel({
      unitId: "Digital",
      repo: "examples",
      team: "Squidward",
      framework: "cypress",
      teamPR: "TeamSquidward__repo-homepage-1234",
    });

    /**
     * evStart — begins continuous accessibility monitoring.
     * The engine watches for DOM mutations and page navigation, recording
     * issues until evStop() is called. Labels must be set before evStart.
     */
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

    /**
     * evStop — concludes the scan and returns the list of issues found.
     *
     * uploadToPlatform: true  — sends this run's results to hub.evinced.com.
     *   Only needed when setUploadToPlatformDefault is false (selective upload).
     *   When setUploadToPlatformDefault is true the upload happens automatically.
     *
     * logIssues: true — prints each issue to the Cypress log for local debugging.
     *
     * After upload, use these commands to retrieve platform links:
     *   cy.evGetUploadTestId()  → unique test ID on the platform
     *   cy.evGetUploadTestUrl() → direct URL to the results in hub.evinced.com
     */
    cy.evStop({ logIssues: true, uploadToPlatform: true }).should((issues) => {
      console.log(JSON.stringify(issues, null, 2));
    });
  });
});
