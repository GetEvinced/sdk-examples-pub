import { defineConfig } from "cypress";
import Evinced from "@evinced/cypress-sdk";

export default defineConfig({
  e2e: {
    setupNodeEvents(on) {
      // This is how you should upload to platform with Cypress
      on("task", {
        uploadToPlatform: Evinced.cyTaskUploadToPlatform,
        evTask: Evinced.cyEvTask,
      });
      on("before:browser:launch", (browser: any = {}, launchOptions) => {
        launchOptions.args.push(
          "--no-sandbox",
          "--disable-dev-shm-usage"
        );
        return launchOptions;
      });
    },
    pageLoadTimeout: 90000,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    // Block third-party analytics/font domains that don't affect test behaviour
    // but can prevent the page load event from firing in CI environments
    blockHosts: [
      "*google-analytics.com",
      "*googletagmanager.com",
      "*hotjar.com",
      "*segment.io",
      "*segment.com",
      "*fonts.googleapis.com",
      "*fonts.gstatic.com",
    ],
  },
  env: {
    serviceId: process.env.EVINCED_SERVICE_ID,
    secret: process.env.EVINCED_API_KEY,
  },
});
