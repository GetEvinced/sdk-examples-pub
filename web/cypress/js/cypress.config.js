const { defineConfig } = require("cypress");
const Evinced = require("@evinced/cypress-sdk").default;

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        evTask: Evinced.cyEvTask,
      });
      on("before:browser:launch", (browser = {}, launchOptions) => {
        launchOptions.args.push(
          "--no-sandbox",
          "--disable-dev-shm-usage"
        );
        return launchOptions;
      });
    },
    pageLoadTimeout: 60000,
  },
  env: {
    serviceId: process.env.EVINCED_SERVICE_ID,
    secret: process.env.EVINCED_API_KEY,
    evincedConfig: {
      switchOn: true,
    },
  },
});
