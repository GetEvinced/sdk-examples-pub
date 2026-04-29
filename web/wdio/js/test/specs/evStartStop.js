import { expect, browser, $ } from "@wdio/globals";
import { setUploadToPlatformConfig } from "@evinced/webdriverio-sdk";

// To enable upload, set enableUploadToPlatform: true
setUploadToPlatformConfig({ enableUploadToPlatform: false });

describe("Evinced WDIO — evStart / evStop (continuous scan)", () => {
  it("Scans across DOM changes while navigating the booking flow", async () => {
    await browser.url("https://demo.evinced.com/");

    // evStart begins a continuous scan — it records DOM changes as the test
    // interacts with the page, capturing issues across all states visited
    await browser.evStart();

    const BASE_FORM_SELECTOR =
      "#gatsby-focus-wrapper > main > div.wrapper-banner > div.filter-container";
    const SELECT_HOME_DROPDOWN = `${BASE_FORM_SELECTOR} > div:nth-child(1) > div > div.dropdown.line > p`;
    const SELECT_WHERE_DROPDOWN = `${BASE_FORM_SELECTOR} > div:nth-child(2) > div > div.dropdown.line > p`;
    const TINY_HOME_OPTION = `#gatsby-focus-wrapper > main > div.wrapper-banner > div.filter-container > div:nth-child(1) > div > ul > li:nth-child(2)`;
    const EAST_COAST_OPTION = `#gatsby-focus-wrapper > main > div.wrapper-banner > div.filter-container > div:nth-child(2) > div > ul > li:nth-child(1)`;
    const SUBMIT_BUTTON = `#gatsby-focus-wrapper > main > div.wrapper-banner > div.filter-container > a`;

    await $(SELECT_HOME_DROPDOWN).click();
    await $(TINY_HOME_OPTION).click();
    await $(SELECT_WHERE_DROPDOWN).click();
    await $(EAST_COAST_OPTION).click();
    await $(SUBMIT_BUTTON).click();
    await expect(browser).toHaveUrl(expect.stringContaining("/results"));

    // evStop ends the scan and returns all issues found across the session
    const issues = await browser.evStop();
    console.log(`There were ${issues.length} issues found`);

    // Save issues to a report file — uploadToPlatform is opt-in and defaults to
    // false; results stay local unless you configure the platform credentials
    await browser.evSaveFile(issues, "html", "./test-results/evStartStop-report.html");
    await browser.evSaveFile(issues, "json", "./test-results/evStartStop-report.json");
  });
});
