const { defineConfig } = require("cypress");
const Evinced = require("@evinced/cypress-sdk").default;
const os = require("os");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        evTask: Evinced.cyEvTask,
      });
      on("before:browser:launch", (browser = {}, launchOptions) => {
        launchOptions.args.push(
          "--no-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--disable-software-rasterizer"
        );
        return launchOptions;
      });
    },
    pageLoadTimeout: 200000,
  },
  env: {
    serviceId: process.env.EVINCED_SERVICE_ID,
    secret: process.env.EVINCED_API_KEY,
    evincedConfig: {
      switchOn: true,
      reporterOptions: {
        reportFormat: "html",
        filePath: "./reports/aggregatedReport.html",
        tmpDir: os.tmpdir(),
        reportTimeStamp: new Date().toISOString(),
      },
    },
    evincedConfig: {
      sdkLogging: {
        enable: true,
        level: "info",
        directory: "EvincedLogs/",
        browserLoggingEnabled: true,
        systemInformationLoggingEnabled: true,
        maxLogLength: 1500,
      },
    },
  },
});
