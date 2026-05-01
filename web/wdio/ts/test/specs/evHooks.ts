import { browser, $ } from "@wdio/globals";

// The evHooks pattern wraps multiple tests with evStart/evStop in
// beforeEach/afterEach so every test automatically gets a continuous scan
// without any boilerplate inside the test body itself.
describe("Evinced WDIO — hooks pattern (evStart/evStop per test)", () => {
  beforeEach(async () => {
    // Start a fresh continuous scan before each test
    // @ts-expect-error
    await browser.evStart();
    await browser.url("https://demo.evinced.com/");
  });

  afterEach(async () => {
    // Stop the scan and save a per-test HTML report
    // @ts-expect-error
    const issues = await browser.evStop();
    // @ts-expect-error
    await browser.evSaveFile(
      issues,
      "html",
      `./test-results/evHooks-report-${Date.now()}.html`
    );
  });

  it("Navigates to booking page via dropdowns", async () => {
    const BASE_FORM_SELECTOR =
      "#gatsby-focus-wrapper > main > div.wrapper-banner > div.filter-container";
    const SELECT_HOME_DROPDOWN = `${BASE_FORM_SELECTOR} > div:nth-child(1) > div > div.dropdown.line > p`;
    const TINY_HOME_OPTION = `${BASE_FORM_SELECTOR} > div:nth-child(1) > div > ul > li:nth-child(2)`;
    const SELECT_WHERE_DROPDOWN = `${BASE_FORM_SELECTOR} > div:nth-child(2) > div > div.dropdown.line > p`;
    const EAST_COAST_OPTION = `${BASE_FORM_SELECTOR} > div:nth-child(2) > div > ul > li:nth-child(1)`;

    await $(SELECT_HOME_DROPDOWN).click();
    await $(TINY_HOME_OPTION).click();
    await $(SELECT_WHERE_DROPDOWN).click();
    await $(EAST_COAST_OPTION).click();
  });

  it("Loads the home page", async () => {
    // beforeEach already navigated to the demo page; additional interactions
    // can be added here and will be captured by the running scan
    await browser.url("https://demo.evinced.com/");
  });
});
