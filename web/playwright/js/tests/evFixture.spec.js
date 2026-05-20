import { test, expect } from "../fixtures/evincedFixture.js";

test('has title', async ({ page, evincedContMode }) => {
  await page.goto('https://demo.evinced.com');
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Home | Evinced, Demo Site/);
  const BASE_FORM_SELECTOR =
    "#gatsby-focus-wrapper > main > div.wrapper-banner > div.filter-container";
  const SELECT_HOME_DROPDOWN = `${BASE_FORM_SELECTOR} > div:nth-child(1) > div > div.dropdown.line`;
  const SELECT_WHERE_DROPDOWN = `${BASE_FORM_SELECTOR} > div:nth-child(2) > div > div.dropdown.line`;
  const TINY_HOME_OPTION = `${BASE_FORM_SELECTOR} > div:nth-child(1) > div > ul > li:nth-child(2)`;
  const EAST_COST_OPTION = `${BASE_FORM_SELECTOR} > div:nth-child(2) > div > ul > li:nth-child(3)`;

  await page.locator(SELECT_HOME_DROPDOWN).click();
  await page.locator(TINY_HOME_OPTION).click();
  await page.locator(SELECT_WHERE_DROPDOWN).click();
  await page.locator(EAST_COST_OPTION).click();
});

test('Main page loads', async ({ page, evincedContMode }) => {
  await page.goto('https://demo.evinced.com/');
});

test('Blog', async ({ page, evincedContMode }) => {
  await page.goto('https://demo.evinced.com/');
});