import { expect, browser, $ } from "@wdio/globals";
import { EvincedWdioMobileSdk } from "@evinced/wdio-mobile-sdk";

describe("My Login application", () => {
  let evincedWdioSDK;

  before(() => {
    evincedWdioSDK = new EvincedWdioMobileSdk();

    const isLicenseValid = evincedWdioSDK.setupCredentials(
      process.env.EVINCED_SERVICE_ID,
      process.env.EVINCED_API_KEY
    );

    if (!isLicenseValid) return console.log("Credentials are invalid.");
  });

  it("should login with valid credentials", async () => {
    await browser.url(`https://the-internet.herokuapp.com/login`);

    await $("#username").setValue("tomsmith");
    await $("#password").setValue("SuperSecretPassword!");
    await $('button[type="submit"]').click();

    await expect($("#flash")).toBeExisting();
    await expect($("#flash")).toHaveText(
      expect.stringContaining("You logged into a secure area!")
    );

    await evincedWdioSDK.report();
  });
});
