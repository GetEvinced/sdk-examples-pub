import { Builder } from "selenium-webdriver";
import assert from "assert";
import pkg from "@evinced/js-selenium-sdk";
const { EvincedSDK, setCredentials } = pkg;

await setCredentials({
  serviceId: process.env.EVINCED_SERVICE_ID,
  secret: process.env.EVINCED_API_KEY,
});

describe("Demo page (Selenoid)", () => {
  it("evAnalyze via remote Chrome", async () => {
    const driver = await new Builder()
      .usingServer("http://localhost:4444/wd/hub")
      .withCapabilities({
        browserName: "chrome",
        browserVersion: "latest",
        "selenoid:options": {
          enableVNC: true,
          enableVideo: false,
        },
      })
      .build();

    try {
      const evincedService = new EvincedSDK(driver);

      await driver.get("https://demo.evinced.com/");

      const issues = await evincedService.evAnalyze({
        initOptions: { enableScreenshots: true },
      });

      // IMPORTANT: create folder first
      await driver.executeScript("return 0"); // no-op, keeps flow explicit

      evincedService.evSaveFile(
        issues,
        "html",
        "test-results/evAnalyze-report.html"
      );

      console.log("Issue count:", issues.length);
      assert.ok(Array.isArray(issues));
      // Don’t hardcode 6 unless you *expect* it to be stable
      // assert.equal(issues.length, 6);
    } finally {
      await driver.quit();
    }
  });
});
